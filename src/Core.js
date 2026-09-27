import E from '@unseenco/e'
import { appendElement, parseDom, processUrl, reloadElement } from './helpers.js'
import Transition from './Transition.js'
import Renderer from './Renderer.js'
import RouteStore from './RouteStore.js'

const IN_PROGRESS = 'A transition is currently in progress'

/**
 * Interrupted navigations are expected when allowInterruption is true, so they aren't worth a warning.
 * @param {Error} err
 */
const warnUnlessInterrupted = (err) => {
	if (err.name !== 'AbortError') {
		console.warn(err)
	}
}

/**
 * @typedef CacheEntry
 * @type {object}
 * @property {Renderer} renderer
 * @property {Document|Node} page
 * @property {HTMLScriptElement[]} scripts
 * @property {Array<HTMLLinkElement|HTMLStyleElement>} styles
 * @property {string} finalUrl
 * @property {boolean} skipCache
 * @property {string} title
 * @property {HTMLElement|Element} content
 */

/**
 * @typedef {'NAVIGATE_OUT'|'NAVIGATE_IN'|'NAVIGATE_END'} TaxiEvent
 */

/**
 * @typedef NavigationEventPayload
 * @type {object}
 * @property {CacheEntry} from
 * @property {CacheEntry} to For NAVIGATE_OUT, a stub with null values (except finalUrl) if the page isn't cached yet
 * @property {string|HTMLElement|false} trigger
 */

export default class Core {
	isTransitioning = false

	/** @type {Map<string, CacheEntry>} */
	cache = new Map()

	/** @type {CacheEntry|null} */
	#currentCacheEntry = null

	/** @type {Map<string, Promise>} */
	#activePromises = new Map()

	/**
	 * Controller for the current navigation's own fetch. Preloads are never aborted by it.
	 * @type {AbortController|null}
	 */
	#navigationController = null

	/**
	 * Incremented for every navigation so an interrupted navigation can tell it is no longer the current one.
	 * @type {number}
	 */
	#navigationId = 0

	/** @type {string|null} */
	#linksSelector = null

	/** @type {IntersectionObserver|null} */
	#prefetchObserver = null

	/** @type {HTMLElement|null} */
	#announcer = null

	get currentCacheEntry() {
		return this.#currentCacheEntry
	}

	/**
	 * @param {{
	 * 		links?: string,
	 * 		removeOldContent?: boolean,
	 * 		allowInterruption?: boolean,
	 * 		bypassCache?: boolean,
	 * 		enablePrefetch?: false|'hover'|'visible',
	 * 		enableViewTransitions?: boolean,
	 * 		enableAccessibility?: boolean,
	 * 		maxCacheSize?: number,
	 * 		fetchOptions?: RequestInit,
	 * 		renderers?: Object.<string, typeof Renderer>,
	 * 		transitions?: Object.<string, typeof Transition>,
	 * 		reloadJsFilter?: boolean|((element: HTMLElement) => boolean),
	 * 		reloadCssFilter?: boolean|((element: HTMLLinkElement|HTMLStyleElement) => boolean),
	 * }} parameters
	 */
	constructor(parameters = {}) {
		const {
			links = 'a[href]:not([target]):not([href^=\\#]):not([data-taxi-ignore])',
			removeOldContent = true,
			allowInterruption = false,
			bypassCache = false,
			enablePrefetch = 'hover',
			enableViewTransitions = false,
			enableAccessibility = false,
			maxCacheSize = 0,
			fetchOptions = {},
			renderers = {
				default: Renderer
			},
			transitions = {
				default: Transition
			},
			reloadJsFilter = (element) => element.dataset.taxiReload !== undefined,
			reloadCssFilter = (element) => element.dataset.taxiReload !== undefined
		} = parameters

		this.renderers = renderers
		this.transitions = transitions
		this.defaultRenderer = this.renderers.default || Renderer
		this.defaultTransition = this.transitions.default || Transition
		this.wrapper = document.querySelector('[data-taxi]')

		if (!this.wrapper) {
			throw new Error('Taxi: no [data-taxi] wrapper element was found in the document.')
		}

		this.reloadJsFilter = reloadJsFilter
		this.reloadCssFilter = reloadCssFilter
		this.removeOldContent = removeOldContent
		this.allowInterruption = allowInterruption
		this.bypassCache = bypassCache
		// normalise legacy boolean
		this.enablePrefetch = enablePrefetch === true ? 'hover' : enablePrefetch
		this.enableViewTransitions = enableViewTransitions
		this.enableAccessibility = enableAccessibility
		this.maxCacheSize = maxCacheSize
		this.fetchOptions = fetchOptions
		this.cache = new Map()
		this.isPopping = false

		this.currentLocation = processUrl(window.location.href)

		// as this is the initial page load, prime this page into the cache
		this.cache.set(this.currentLocation.href, this.#createCacheEntry(document.cloneNode(true), window.location.href))

		// fire the current Renderer enter methods
		this.#currentCacheEntry = this.cache.get(this.currentLocation.href)

		// Add delegated link events, only once the page is known to be valid so a failed init leaves nothing behind
		this.#attachEvents(links)

		if (this.enableAccessibility) {
			this.#createAnnouncer()
		}

		this.#currentCacheEntry.renderer.initialLoad()
	}

	/**
	 * @param {string} renderer
	 */
	setDefaultRenderer(renderer) {
		this.defaultRenderer = this.renderers[renderer]
	}

	/**
	 * @param {string} transition
	 */
	setDefaultTransition(transition) {
		this.defaultTransition = this.transitions[transition]
	}

	/**
	 * Registers a route into the RouteStore
	 *
	 * @param {string} fromPattern
	 * @param {string} toPattern
	 * @param {string} transition
	 */
	addRoute(fromPattern, toPattern, transition) {
		if (!this.router) {
			this.router = new RouteStore()
		}

		this.router.add(fromPattern, toPattern, transition)
	}

	/**
	 * Prime the cache for a given URL.
	 *
	 * Rejects if the server returns a non-2xx response (after redirects) or if the
	 * fetched page contains no [data-taxi-view] element, so callers can distinguish
	 * a successful preload from a missing/broken page.
	 *
	 * @param {string} url
	 * @param {boolean} [preloadAssets]
	 * @return {Promise<CacheEntry>}
	 */
	preload(url, preloadAssets = false) {
		// convert relative URLs to absolute
		url = processUrl(url).href

		if (!this.cache.has(url)) {
			return this.#fetch(url, false)
				.then(async (response) => {
					this.#setCacheEntry(url, this.#createCacheEntry(response.html, response.url))

					if (preloadAssets) {
						this.cache.get(url).renderer.createDom()
					}

					return this.cache.get(url)
				})
		}

		return Promise.resolve(this.#touchCacheEntry(url))
	}

	/**
	 * Updates the HTML cache for a given URL.
	 * If no URL is passed, then cache for the current page is updated.
	 * Useful when adding/removing content via AJAX such as a search page or infinite loader.
	 *
	 * @param {string} [url]
	 */
	updateCache(url) {
		const key = processUrl(url || window.location.href).href

		if (this.cache.has(key)) {
			this.cache.delete(key)
		}

		const entry = this.#createCacheEntry(document.cloneNode(true), key)

		// Keep the live Renderer instance for the current page so any state set up in
		// onEnter/initialLoad is still there when onLeave runs, just refresh its snapshot.
		if (key === this.currentLocation?.href && this.#currentCacheEntry) {
			const renderer = this.#currentCacheEntry.renderer
			renderer._contentString = entry.content.outerHTML
			renderer.page = entry.page
			renderer.title = entry.title
			entry.renderer = renderer
			this.#currentCacheEntry = entry
		}

		this.#setCacheEntry(key, entry)

		// pick up any links added via AJAX
		if (this.enablePrefetch === 'visible') {
			this.#observeLinks()
		}
	}

	/**
	 * Removes all event listeners and observers added by Taxi.
	 * The current page is left as-is.
	 */
	destroy() {
		E.off('click', this.#linksSelector, this.#onClick)
		E.off('popstate', window, this.#onPopstate)

		if (this.enablePrefetch === 'hover') {
			E.off('mouseenter focus', this.#linksSelector, this.#onPrefetch)
		}

		this.#prefetchObserver?.disconnect()
		this.#prefetchObserver = null
		this.#navigationController?.abort()
		this.#navigationController = null
		this.#announcer?.remove()
		this.#announcer = null
		this.cache.clear()
	}

	/**
	 * Clears the cache for a given URL.
	 * If no URL is passed, then cache for the current page is cleared.
	 *
	 * @param {string} [url]
	 */
	clearCache(url) {
		const key = processUrl(url || window.location.href).href

		if (this.cache.has(key)) {
			this.cache.delete(key)
		}
	}

	/**
	 * Navigate back in browser history, respecting the isTransitioning guard.
	 */
	navigateBack() {
		if (!this.allowInterruption && this.isTransitioning) {
			console.warn(IN_PROGRESS)
			return
		}

		window.history.back()
	}

	/**
	 * Navigate forward in browser history, respecting the isTransitioning guard.
	 */
	navigateForward() {
		if (!this.allowInterruption && this.isTransitioning) {
			console.warn(IN_PROGRESS)
			return
		}

		window.history.forward()
	}

	/**
	 * @param {string} url
	 * @param {string|false} [transition]
	 * @param {string|false|HTMLElement} [trigger]
	 * @return {Promise<void>}
	 */
	navigateTo(url, transition = false, trigger = false) {
		return new Promise((resolve, reject) => {
			// Don't allow multiple navigations to occur at once
			if (!this.allowInterruption && this.isTransitioning) {
				reject(new Error(IN_PROGRESS))
				return
			}

			// Supersede any navigation already in progress (only possible when allowInterruption is true).
			// Only that navigation's own request is aborted, in-flight preloads are left alone.
			this.#navigationController?.abort()

			const id = ++this.#navigationId
			const controller = new AbortController()
			this.#navigationController = controller

			this.isTransitioning = true
			this.isPopping = true
			this.targetLocation = processUrl(url)
			this.popTarget = window.location.href

			const target = this.targetLocation
			const viewTransitionsSupported = this.enableViewTransitions && 'startViewTransition' in document
			// Users who prefer reduced motion get an instant swap instead of the browser's animation
			const useVT = viewTransitionsSupported && !window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
			// When View Transitions are enabled, bypass JS transition animations — the browser handles the visual swap
			const transitionInstance = new (viewTransitionsSupported ? Transition : this.#chooseTransition(transition))({ wrapper: this.wrapper })

			// Rejects if a newer navigation has started since this one
			const assertCurrent = () => {
				if (id !== this.#navigationId) {
					throw new DOMException('Taxi: navigation was interrupted by a newer navigation', 'AbortError')
				}
			}

			let navigationPromise

			if (this.bypassCache || !this.cache.has(target.href) || this.cache.get(target.href).skipCache) {
				const fetched = this.#fetch(target.href, true, controller.signal)
					.then((response) => {
						let entry

						try {
							entry = this.#createCacheEntry(response.html, response.url)
						} catch (err) {
							// The page isn't Taxi-compatible (e.g. a login redirect), so let the browser load it
							window.location.href = target.raw
							throw err
						}

						this.#setCacheEntry(target.href, entry)
						entry.renderer.createDom()

						return entry
					})

				// the rejection is handled by navigationPromise below, this stops it being
				// reported as unhandled while the leave transition is still running
				fetched.catch(() => {})

				navigationPromise = this.#beforeFetch(target, transitionInstance, trigger, useVT, assertCurrent)
					.then(() => fetched)
					.then((entry) => {
						assertCurrent()
						return this.#afterFetch(target, transitionInstance, entry, trigger, useVT, id)
					})
			} else {
				const entry = this.#touchCacheEntry(target.href)
				entry.renderer.createDom()

				navigationPromise = this.#beforeFetch(target, transitionInstance, trigger, useVT, assertCurrent)
					.then(() => {
						assertCurrent()
						return this.#afterFetch(target, transitionInstance, entry, trigger, useVT, id)
					})
			}

			navigationPromise
				.then(() => resolve())
				.catch((err) => {
					// Reset transitioning state so navigation isn't permanently blocked,
					// unless a newer navigation now owns that state
					if (id === this.#navigationId) {
						this.isTransitioning = false
						this.isPopping = false
						this.#navigationController = null
					}

					reject(err)
				})
		})
	}

	/**
	 * Add an event listener.
	 * @param {TaxiEvent} event
	 * @param {(payload: NavigationEventPayload) => void} callback
	 */
	on(event, callback) {
		E.on(event, callback)
	}

	/**
	 * Remove an event listener.
	 * @param {TaxiEvent} event
	 * @param {(payload: NavigationEventPayload) => void} [callback]
	 */
	off(event, callback) {
		E.off(event, callback)
	}

	/**
	 * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
	 * @param {Transition} transition
	 * @param {string|HTMLElement|false} trigger
	 * @param {boolean} useVT
	 * @param {function(): void} assertCurrent
	 * @return {Promise<void>}
	 */
	#beforeFetch(url, transition, trigger, useVT, assertCurrent) {
		E.emit('NAVIGATE_OUT', {
			from: this.#currentCacheEntry,
			to: this.cache.get(url.href) || {
				page: null,
				content: null,
				finalUrl: url.href,
				skipCache: null,
				scripts: null,
				styles: null,
				title: null,
				renderer: null
			},
			trigger
		})

		// When View Transitions is active, defer old-content removal so the browser can
		// capture the full old page as the "before" screenshot inside startViewTransition.
		return this.#currentCacheEntry.renderer.leave(transition, trigger, useVT ? false : this.removeOldContent)
			.then(() => {
				// don't push history for a navigation that has since been interrupted
				assertCurrent()

				if (trigger !== 'popstate') {
					window.history.pushState({}, '', url.raw)
				}
			})
	}

	/**
	 * @param {{ raw: string, href: string, host: string, hasHash: boolean, pathname: string }} url
	 * @param {Transition} transition
	 * @param {CacheEntry} entry
	 * @param {string|HTMLElement|false} trigger
	 * @param {boolean} useVT
	 * @param {number} id
	 * @return {Promise<void>}
	 */
	async #afterFetch(url, transition, entry, trigger, useVT, id) {
		this.currentLocation = url
		this.popTarget = this.currentLocation.href

		/** @type {{updateCallbackDone: Promise<void>, finished: Promise<void>}|null} */
		let viewTransition = null

		if (useVT) {
			// Capture "before" (old content), swap to "after" (new content) inside the browser's transition.
			const fromRenderer = this.#currentCacheEntry.renderer
			viewTransition = document.startViewTransition(() => {
				if (this.removeOldContent) fromRenderer.remove()
				entry.renderer.update()
			})
			await viewTransition.updateCallbackDone
		} else {
			entry.renderer.update()
		}

		E.emit('NAVIGATE_IN', {
			from: this.#currentCacheEntry,
			to: entry,
			trigger
		})

		if (this.reloadJsFilter) {
			this.#loadScripts(entry.scripts)
		}

		if (this.reloadCssFilter) {
			this.#loadStyles(entry.styles)
		}

		// If the fetched url had a redirect chain, then replace the history to reflect the final resolved URL
		if (trigger !== 'popstate' && url.href !== processUrl(entry.finalUrl).href) {
			window.history.replaceState({}, '', entry.finalUrl)
		}

		if (this.enableAccessibility) {
			this.#announceNavigation(entry)
		}

		// When using View Transitions, onEnterCompleted/NAVIGATE_END should reflect the browser
		// animation actually finishing on screen, not just the DOM swap. `finished` can reject if
		// the transition was skipped (e.g. document hidden), so it's caught to avoid ever hanging
		// or rejecting the navigation itself.
		const enterExtraWait = viewTransition ? viewTransition.finished.catch(() => {}) : null

		await entry.renderer.enter(transition, trigger, enterExtraWait)

		E.emit('NAVIGATE_END', {
			from: this.#currentCacheEntry,
			to: entry,
			trigger
		})

		this.#currentCacheEntry = entry

		// if a newer navigation started while this one was entering, that navigation now owns this state
		if (id === this.#navigationId) {
			this.isTransitioning = false
			this.isPopping = false
			this.#navigationController = null
		}

		if (this.enablePrefetch === 'visible') {
			this.#observeLinks()
		}
	}

	/**
	 * Load up scripts from the target page if needed
	 *
	 * @param {HTMLElement[]} cachedScripts
	 */
	#loadScripts(cachedScripts) {
		const newScripts = [...cachedScripts]
		const currentScripts = Array.from(document.querySelectorAll('script')).filter(this.reloadJsFilter)

		// loop through all new scripts
		for (let i = 0; i < currentScripts.length; i++) {
			for (let n = 0; n < newScripts.length; n++) {
				if (currentScripts[i].outerHTML === newScripts[n].outerHTML) {
					reloadElement(currentScripts[i], 'SCRIPT')
					newScripts.splice(n, 1)
					break
				}
			}
		}

		for (const script of newScripts) {
			appendElement(script, 'SCRIPT')
		}
	}

	/**
	 * Load up styles from the target page if needed
	 *
	 * @param {Array<HTMLLinkElement|HTMLStyleElement>} cachedStyles
	 */
	#loadStyles(cachedStyles) {
		const currentStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).filter(this.reloadCssFilter)
		const currentInlineStyles = Array.from(document.querySelectorAll('style')).filter(this.reloadCssFilter)

		const newInlineStyles = cachedStyles.filter(el => {
			// no el.href, assume it's an inline style
			if (!el.href) {
				return true
			} else if (!currentStyles.find((link) => link.href === el.href)) {
				document.body.append(el)
				return false
			}
		})

		// loop through all new inline styles
		for (let i = 0; i < currentInlineStyles.length; i++) {
			for (let n = 0; n < newInlineStyles.length; n++) {
				if (currentInlineStyles[i].outerHTML === newInlineStyles[n].outerHTML) {
					reloadElement(currentInlineStyles[i], 'STYLE')
					newInlineStyles.splice(n, 1)
					break
				}
			}
		}

		for (const style of newInlineStyles) {
			appendElement(style, 'STYLE')
		}
	}

	/**
	 * @param {string} links
	 */
	#attachEvents(links) {
		this.#linksSelector = links
		E.delegate('click', links, this.#onClick)
		E.on('popstate', window, this.#onPopstate)

		if (this.enablePrefetch === 'hover') {
			E.delegate('mouseenter focus', links, this.#onPrefetch)
		} else if (this.enablePrefetch === 'visible') {
			this.#observeLinks()
		}
	}

	/**
	 * Observe all matching links with IntersectionObserver and preload them as they enter the viewport.
	 * Already-preloaded links are unobserved immediately to avoid redundant fetches.
	 */
	#observeLinks() {
		if (!('IntersectionObserver' in window) || navigator.connection?.saveData) return

		if (this.#prefetchObserver) {
			// drop links from the previous page
			this.#prefetchObserver.disconnect()
		} else {
			this.#prefetchObserver = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						this.#prefetchObserver.unobserve(entry.target)
						this.preload(entry.target.href).catch(() => {})
					}
				})
			})
		}

		document.querySelectorAll(this.#linksSelector).forEach((el) => {
			const target = processUrl(el.href)

			if (target.host === window.location.host && !this.cache.has(target.href)) {
				this.#prefetchObserver.observe(el)
			}
		})
	}

	/** @param {MouseEvent} e */
	#onClick = (e) => {
		// leave modified clicks (new tab/window, download), download links, and clicks
		// already handled elsewhere to the browser
		if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.currentTarget.hasAttribute('download')) {
			return
		}

		const target = processUrl(e.currentTarget.href)
		this.currentLocation = processUrl(window.location.href)

		if (this.currentLocation.host !== target.host) {
			return
		}

		// the target is a new URL, or is removing the hash from the current URL
		if (this.currentLocation.href !== target.href || (this.currentLocation.hasHash && !target.hasHash)) {
			e.preventDefault()
			// noinspection JSIgnoredPromiseFromCall
			this.navigateTo(target.raw, e.currentTarget.dataset.transition || false, e.currentTarget).catch(warnUnlessInterrupted)
			return
		}

		// a click to the current URL was detected
		if (!this.currentLocation.hasHash && !target.hasHash) {
			e.preventDefault()
		}
	}

	/** @return {void|boolean} */
	#onPopstate = () => {
		const target = processUrl(window.location.href)

		// don't trigger for on-page anchors
		if (
			target.pathname === this.currentLocation.pathname
			&& target.search === this.currentLocation.search
			&& !this.isPopping
		) {
			return false
		}

		if (!this.allowInterruption && (this.isTransitioning || this.isPopping)) {
			// overwrite history state with current page if currently navigating
			window.history.pushState({}, '', this.popTarget)
			console.warn(IN_PROGRESS)
			return false
		}

		if (!this.isPopping) {
			this.popTarget = window.location.href
		}

		this.isPopping = true

		this.navigateTo(window.location.href, false, 'popstate').catch(warnUnlessInterrupted)
	}

	/** @param {MouseEvent} e */
	#onPrefetch = (e) => {
		if (this.isTransitioning) {
			return
		}

		const target = processUrl(e.currentTarget.href)

		if (this.currentLocation.host !== target.host) {
			return
		}

		this.preload(e.currentTarget.href, false).catch(() => {})
	}

	/**
	 * @param {string} url
	 * @param {boolean} [runFallback]
	 * @param {AbortSignal} [signal]
	 * @return {Promise<{html: Document, url: string}>}
	 */
	#fetch(url, runFallback = true, signal = undefined) {
		// If Taxi is currently performing a fetch for the given URL, return that instead of starting a new request
		if (this.#activePromises.has(url)) {
			return this.#activePromises.get(url)
		}

		// forget an aborted request straight away so nothing else can pick it up before it settles
		signal?.addEventListener('abort', () => {
			if (this.#activePromises.get(url) === request) {
				this.#activePromises.delete(url)
			}
		})

		const request = new Promise((resolve, reject) => {
			let resolvedUrl

			fetch(url, {
				mode: 'same-origin',
				method: 'GET',
				credentials: 'same-origin',
				...this.fetchOptions,
				headers: {
					'X-Requested-With': 'Taxi',
					...this.fetchOptions.headers,
				},
				signal
			})
				.then((response) => {
					if (!response.ok) {
						reject(new Error('Taxi encountered a non 2xx HTTP status code'))

						if (runFallback) {
							window.location.href = url
						}

						return
					}

					resolvedUrl = response.url

					return response.text()
				})
				.then((htmlString) => {
					if (htmlString !== undefined) {
						resolve({ html: parseDom(htmlString), url: resolvedUrl })
					}
				})
				.catch((err) => {
					reject(err)

					if (runFallback && err.name !== 'AbortError') {
						window.location.href = url
					}
				})
				.finally(() => {
					if (this.#activePromises.get(url) === request) {
						this.#activePromises.delete(url)
					}
				})
		})

		this.#activePromises.set(url, request)

		return request
	}

	/**
	 * @param {string|false} transition
	 * @return {typeof Transition}
	 */
	#chooseTransition(transition) {
		if (transition) {
			if (!this.transitions[transition]) {
				console.warn(`Taxi: transition "${transition}" is not registered. Falling back to default.`)
				return this.defaultTransition
			}

			return this.transitions[transition]
		}

		const routeTransition = this.router?.findMatch(this.currentLocation, this.targetLocation)

		if (routeTransition) {
			if (!this.transitions[routeTransition]) {
				console.warn(`Taxi: route transition "${routeTransition}" is not registered. Falling back to default.`)
				return this.defaultTransition
			}

			return this.transitions[routeTransition]
		}

		return this.defaultTransition
	}

	/**
	 * Adds a visually hidden live region used to announce page changes to screen readers.
	 */
	#createAnnouncer() {
		this.#announcer = document.createElement('div')
		this.#announcer.setAttribute('data-taxi-announcer', '')
		this.#announcer.setAttribute('aria-live', 'assertive')
		this.#announcer.setAttribute('aria-atomic', 'true')
		this.#announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0'
		document.body.appendChild(this.#announcer)
	}

	/**
	 * Announces the new page title and moves focus to the new content, so keyboard and
	 * screen reader users aren't left on a link that no longer exists.
	 *
	 * @param {CacheEntry} entry
	 */
	#announceNavigation(entry) {
		if (this.#announcer) {
			this.#announcer.textContent = entry.title || document.title
		}

		const content = entry.renderer.content
		const target = content.querySelector('h1') || content

		if (!target.hasAttribute('tabindex')) {
			target.setAttribute('tabindex', '-1')
		}

		target.focus({ preventScroll: true })
	}

	/**
	 * Marks a cache entry as recently used by moving it to the end of the cache.
	 *
	 * @param {string} url
	 * @return {CacheEntry}
	 */
	#touchCacheEntry(url) {
		const entry = this.cache.get(url)

		this.cache.delete(url)
		this.cache.set(url, entry)

		return entry
	}

	/**
	 * Sets a cache entry, evicting the least recently used non-current entry if maxCacheSize is reached.
	 *
	 * @param {string} url
	 * @param {CacheEntry} entry
	 */
	#setCacheEntry(url, entry) {
		if (this.maxCacheSize > 0 && !this.cache.has(url) && this.cache.size >= this.maxCacheSize) {
			for (const key of this.cache.keys()) {
				// Never evict the current page
				if (key !== this.currentLocation?.href) {
					this.cache.delete(key)
					break
				}
			}
		}

		this.cache.set(url, entry)
	}

	/**
	 * @param {Document|Node} page
	 * @param {string} url
	 * @return {CacheEntry}
	 */
	#createCacheEntry(page, url) {
		const content = page.querySelector('[data-taxi-view]')

		if (!content) {
			throw new Error(`Taxi: the fetched page for "${url}" does not contain a [data-taxi-view] element.`)
		}

		const RendererClass = content.dataset.taxiView.length ? this.renderers[content.dataset.taxiView] : this.defaultRenderer

		if (!RendererClass) {
			console.warn(`Taxi: the renderer "${content.dataset.taxiView}" is set in [data-taxi-view] but was not registered.`)
		}

		return {
			page,
			content,
			finalUrl: url,
			skipCache: content.hasAttribute('data-taxi-nocache'),
			scripts: this.reloadJsFilter ? Array.from(page.querySelectorAll('script')).filter(this.reloadJsFilter) : [],
			styles: this.reloadCssFilter ? Array.from(page.querySelectorAll('link[rel="stylesheet"], style')).filter(this.reloadCssFilter) : [],
			title: page.title,
			renderer: new (RendererClass || this.defaultRenderer)({
				wrapper: this.wrapper,
				title: page.title,
				content,
				page
			})
		}
	}
}
