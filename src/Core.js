import E from '@unseenco/e'
import { appendElement, parseDom, processUrl, reloadElement } from './helpers'
import Transition from './Transition'
import Renderer from './Renderer'
import RouteStore from './RouteStore'

const IN_PROGRESS = 'A transition is currently in progress'

/**
 * @typedef CacheEntry
 * @type {object}
 * @property {typeof Renderer|Renderer} renderer
 * @property {Document|Node} page
 * @property {array} scripts
 * @property {HTMLLinkElement[]} styles
 * @property {string} finalUrl
 * @property {boolean} skipCache
 * @property {string} title
 * @property {HTMLElement|Element} content
 */

export default class Core {
	isTransitioning = false

	/** @type {Map<string, CacheEntry>} */
	cache = new Map()

	/** @type {CacheEntry|null} */
	#currentCacheEntry = null

	/** @type {Map<string, Promise>} */
	#activePromises = new Map()

	/** @type {AbortController|null} */
	#fetchController = null

	/** @type {string|null} */
	#linksSelector = null

	/** @type {IntersectionObserver|null} */
	#prefetchObserver = null

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
	 * 		maxCacheSize?: number,
	 * 		fetchOptions?: RequestInit,
	 * 		renderers?: Object.<string, typeof Renderer>,
	 * 		transitions?: Object.<string, typeof Transition>,
	 * 		reloadJsFilter?: boolean|function(HTMLElement): boolean,
	 * 		reloadCssFilter?: boolean|function(HTMLLinkElement): boolean,
	 * }} parameters
	 */
	constructor(parameters = {}) {
		const {
			links = 'a[href]:not([target]):not([href^=\\#]):not([data-taxi-ignore])',
			removeOldContent = true,
			allowInterruption = false,
			bypassCache = false,
			enablePrefetch = 'hover',
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
		this.reloadJsFilter = reloadJsFilter
		this.reloadCssFilter = reloadCssFilter
		this.removeOldContent = removeOldContent
		this.allowInterruption = allowInterruption
		this.bypassCache = bypassCache
		// normalise legacy boolean
		this.enablePrefetch = enablePrefetch === true ? 'hover' : enablePrefetch
		this.maxCacheSize = maxCacheSize
		this.fetchOptions = fetchOptions
		this.cache = new Map()
		this.isPopping = false

		// Add delegated link events
		this.#attachEvents(links)

		this.currentLocation = processUrl(window.location.href)

		// as this is the initial page load, prime this page into the cache
		this.cache.set(this.currentLocation.href, this.#createCacheEntry(document.cloneNode(true), window.location.href))

		// fire the current Renderer enter methods
		this.#currentCacheEntry = this.cache.get(this.currentLocation.href)
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

		return Promise.resolve(this.cache.get(url))
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

		this.#setCacheEntry(key, this.#createCacheEntry(document.cloneNode(true), key))
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
	 * @return {Promise<void|Error>}
	 */
	navigateTo(url, transition = false, trigger = false) {
		return new Promise((resolve, reject) => {
			// Don't allow multiple navigations to occur at once
			if (!this.allowInterruption && this.isTransitioning) {
				reject(new Error(IN_PROGRESS))
				return
			}

			// Abort any in-flight fetch when interruption is allowed
			if (this.allowInterruption && this.#fetchController) {
				this.#fetchController.abort()
				this.#fetchController = null
			}

			this.isTransitioning = true
			this.isPopping = true
			this.targetLocation = processUrl(url)
			this.popTarget = window.location.href

			const TransitionClass = new (this.#chooseTransition(transition))({ wrapper: this.wrapper })

			let navigationPromise

			if (this.bypassCache || !this.cache.has(this.targetLocation.href) || this.cache.get(this.targetLocation.href).skipCache) {
				const fetched = this.#fetch(this.targetLocation.href)
					.then((response) => {
						this.#setCacheEntry(this.targetLocation.href, this.#createCacheEntry(response.html, response.url))
						this.cache.get(this.targetLocation.href).renderer.createDom()
					})

				navigationPromise = this.#beforeFetch(this.targetLocation, TransitionClass, trigger)
					.then(async () => {
						return fetched.then(async () => {
							return await this.#afterFetch(this.targetLocation, TransitionClass, this.cache.get(this.targetLocation.href), trigger)
						})
					})
			} else {
				this.cache.get(this.targetLocation.href).renderer.createDom()

				navigationPromise = this.#beforeFetch(this.targetLocation, TransitionClass, trigger)
					.then(async () => {
						return await this.#afterFetch(this.targetLocation, TransitionClass, this.cache.get(this.targetLocation.href), trigger)
					})
			}

			navigationPromise
				.then(() => resolve())
				.catch((err) => {
					// Reset transitioning state so navigation isn't permanently blocked
					this.isTransitioning = false
					this.isPopping = false
					reject(err)
				})
		})
	}

	/**
	 * Add an event listener.
	 * @param {string} event
	 * @param {any} callback
	 */
	on(event, callback) {
		E.on(event, callback)
	}

	/**
	 * Remove an event listener.
	 * @param {string} event
	 * @param {any} [callback]
	 */
	off(event, callback) {
		E.off(event, callback)
	}

	/**
	 * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
	 * @param {Transition} TransitionClass
	 * @param {string|HTMLElement|false} trigger
	 * @return {Promise<void>}
	 */
	#beforeFetch(url, TransitionClass, trigger) {
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

		return new Promise((resolve) => {
			this.#currentCacheEntry.renderer.leave(TransitionClass, trigger, this.removeOldContent)
				.then(() => {
					if (trigger !== 'popstate') {
						window.history.pushState({}, '', url.raw)
					}

					resolve()
				})
		})
	}

	/**
	 * @param {{ raw: string, href: string, host: string, hasHash: boolean, pathname: string }} url
	 * @param {Transition} TransitionClass
	 * @param {CacheEntry} entry
	 * @param {string|HTMLElement|false} trigger
	 * @return {Promise<void>}
	 */
	#afterFetch(url, TransitionClass, entry, trigger) {
		this.currentLocation = url
		this.popTarget = this.currentLocation.href

		return new Promise((resolve) => {
			entry.renderer.update()

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

			entry.renderer.enter(TransitionClass, trigger)
				.then(() => {
					E.emit('NAVIGATE_END', {
						from: this.#currentCacheEntry,
						to: entry,
						trigger
					})

					this.#currentCacheEntry = entry
					this.isTransitioning = false
					this.isPopping = false

					if (this.enablePrefetch === 'visible') {
						this.#observeLinks()
					}

					resolve()
				})
		})
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
		if (!('IntersectionObserver' in window)) return

		if (!this.#prefetchObserver) {
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
			if (!this.cache.has(processUrl(el.href).href)) {
				this.#prefetchObserver.observe(el)
			}
		})
	}

	/** @param {MouseEvent} e */
	#onClick = (e) => {
		if (!(e.metaKey || e.ctrlKey)) {
			const target = processUrl(e.currentTarget.href)
			this.currentLocation = processUrl(window.location.href)

			if (this.currentLocation.host !== target.host) {
				return
			}

			// the target is a new URL, or is removing the hash from the current URL
			if (this.currentLocation.href !== target.href || (this.currentLocation.hasHash && !target.hasHash)) {
				e.preventDefault()
				// noinspection JSIgnoredPromiseFromCall
				this.navigateTo(target.raw, e.currentTarget.dataset.transition || false, e.currentTarget).catch(err => console.warn(err))
				return
			}

			// a click to the current URL was detected
			if (!this.currentLocation.hasHash && !target.hasHash) {
				e.preventDefault()
			}
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

		// noinspection JSIgnoredPromiseFromCall
		this.navigateTo(window.location.href, false, 'popstate')
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

		this.preload(e.currentTarget.href, false)
	}

	/**
	 * @param {string} url
	 * @param {boolean} [runFallback]
	 * @return {Promise<{html: Document, url: string}>}
	 */
	#fetch(url, runFallback = true) {
		// If Taxi is currently performing a fetch for the given URL, return that instead of starting a new request
		if (this.#activePromises.has(url)) {
			return this.#activePromises.get(url)
		}

		this.#fetchController = new AbortController()
		const signal = this.#fetchController.signal

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
					if (err.name !== 'AbortError') {
						reject(err)

						if (runFallback) {
							window.location.href = url
						}
					}
				})
				.finally(() => {
					this.#activePromises.delete(url)
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
	 * Sets a cache entry, evicting the oldest non-current entry if maxCacheSize is reached.
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
