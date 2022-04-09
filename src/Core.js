import E from '@unseenco/e'
import { appendScript, parseDom, processUrl, reloadScript } from './helpers'
import { Transition, Renderer } from './taxi'
import RouteStore from './RouteStore'

/**
 * @typedef CacheEntry
 * @type {object}
 * @property {Renderer} renderer
 * @property {Document|Node} page
 * @property {array} scripts
 * @property {string} title
 * @property {HTMLElement|Element} content
 */

export default class Core {
	isTransitioning = false

	/**
	 * @type {CacheEntry|null}
	 */
	currentCacheEntry = null

	/**
	 * @type {Map<string, CacheEntry>}
	 */
	cache = new Map()

	/**
	 * @param {string} [parameters.links] Selector to select elements attach highway link events to
	 * @param {boolean} [parameters.removeOldContent] Whether the previous page's content should be removed just before onLeaveCompleted
	 * @param {Object.<string, Renderer>} [parameters.renderers] All Renderers for the application
	 * @param {Object.<string, Transition>} [parameters.transitions] All Transitions for the application
	 * @param {function(node: HTMLElement)} [parameters.reloadJsFilter]
	 */
	constructor(parameters = {}) {
		const {
			links = 'a:not([target]):not([href^=\\#]):not([data-taxi-ignore])',
			removeOldContent = true,
			renderers = {
				default: Renderer
			},
			transitions = {
				default: Transition
			},
			reloadJsFilter = function (node) {
				return !(node?.id === '__bs_script__' || node?.src.includes('browser-sync-client.js'))
			}
		} = parameters

		this.renderers = renderers
		this.transitions = transitions
		this.defaultRenderer = this.renderers.default || Renderer
		this.defaultTransition = this.transitions.default || Transition
		this.wrapper = document.querySelector('[data-taxi]')
		this.reloadJsFilter = reloadJsFilter
		this.removeOldContent = removeOldContent
		this.cache = new Map()

		// Add delegated link events
		this.attachEvents(links)

		this.currentLocation = processUrl(window.location.href)

		// as this is the initial page load, prime this page into the cache
		this.cache.set(this.currentLocation.href, this.createCacheEntry(document.cloneNode(true)))

		// fire the current Renderer enter methods
		this.currentCacheEntry = this.cache.get(this.currentLocation.href)
		this.currentCacheEntry.renderer.initialLoad()
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
	 * Prime the cache for a given URL
	 *
	 * @param {string} url
	 * @return {Promise}
	 */
	preload(url) {
		// convert relative URLs to absolute
		url = processUrl(url).href

		if (!this.cache.has(url)) {
			return this.fetch(url)
				.then(async (newPage) => {
					this.cache.set(url, this.createCacheEntry(newPage))
				})
		}

		return Promise.resolve()
	}

	/**
	 * Updates the HTML cache for the current URL
	 * Useful when adding/removing content via AJAX such as a search page or infinite loader
	 */
	updateCache() {
		const key = processUrl(window.location.href).href

		if (this.cache.has(key)) {
			this.cache.delete(key)
			this.cache.set(key, this.createCacheEntry(document.cloneNode(true)))
		}
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
	 * @param {string} url
	 * @param {string|false} [transition]
	 * @param {string|false|HTMLElement} [trigger]
	 * @return {Promise<void|Error>}
	 */
	navigateTo(url, transition = false, trigger = false) {
		return new Promise((resolve, reject) => {
			// Don't allow multiple navigations to occur at once
			if (this.isTransitioning) {
				reject(new Error('A transition is currently in progress'))
				return
			}

			this.targetLocation = processUrl(url)

			const TransitionClass = new (this.chooseTransition(transition))({ wrapper: this.wrapper })

			this.beforeFetch(this.targetLocation, TransitionClass, trigger)
				.then(async () => {
					if (this.cache.has(this.targetLocation.href)) {
						return await this.afterFetch(this.targetLocation, TransitionClass, this.cache.get(this.targetLocation.href), trigger)
					} else {
						return this.fetch(this.targetLocation.raw).then(async (newPage) => {
							return await this.afterFetch(this.targetLocation, TransitionClass, this.createCacheEntry(newPage), trigger)
						})
					}
				})
				.then(() => {
					resolve()
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
	 * @private
	 * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
	 * @param {Transition} TransitionClass
	 * @param {string|HTMLElement|false} trigger
	 * @return {Promise<void>}
	 */
	beforeFetch(url, TransitionClass, trigger) {
		this.isTransitioning = true

		E.emit('NAVIGATE_OUT', {
			from: this.currentCacheEntry,
			trigger
		})

		return new Promise((resolve) => {
			this.currentCacheEntry.renderer.leave(TransitionClass, trigger, this.removeOldContent)
				.then(() => {
					if (trigger !== 'popstate') {
						window.history.pushState({}, '', url.raw)
					}

					resolve()
				})
		})
	}

	/**
	 * @private
	 * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
	 * @param {Transition} TransitionClass
	 * @param {CacheEntry} entry
	 * @param {string|HTMLElement|false} trigger
	 * @return {Promise<void>}
	 */
	afterFetch(url, TransitionClass, entry, trigger) {
		// add this page to cache
		if (!this.cache.has(url.href)) {
			this.cache.set(url.href, entry)
		}

		this.currentLocation = url

		E.emit('NAVIGATE_IN', {
			from: this.currentCacheEntry,
			to: entry,
			trigger
		})

		return new Promise((resolve) => {
			entry.renderer.update()

			this.loadScripts(entry.scripts)

			entry.renderer.enter(TransitionClass, trigger)
				.then(() => {
					E.emit('NAVIGATE_END', {
						from: this.currentCacheEntry,
						to: entry,
						trigger
					})

					this.currentCacheEntry = entry
					this.isTransitioning = false
					resolve()
				})
		})
	}

	/**
	 * Load up scripts from the target page if needed
	 *
	 * @param {HTMLElement[]} cachedScripts
	 */
	loadScripts(cachedScripts) {
		const newScripts = [...cachedScripts]
		const currentScripts = [...document.querySelectorAll('script:not([data-no-reload])')].filter(this.reloadJsFilter)

		// loop through all new scripts
		for (let i = 0; i < currentScripts.length; i++) {
			for (let n = 0; n < newScripts.length; n++) {
				if (currentScripts[i].outerHTML === newScripts[n].outerHTML) {
					reloadScript(currentScripts[i])
					newScripts.splice(n, 1)
					break
				}
			}
		}

		for (const script of newScripts) {
			appendScript(script)
		}
	}

	/**
	 * @private
	 * @param {string} links
	 */
	attachEvents(links) {
		E.delegate('click', links, this.onClick)
		E.on('popstate', window, this.onPopstate)
	}

	/**
	 * @private
	 * @param {MouseEvent} e
	 */
	onClick = (e) => {
		if (!(e.metaKey || e.ctrlKey)) {
			const target = processUrl(e.currentTarget.href)
			this.currentLocation = processUrl(window.location.href)

			// the target is a new URL, or is removing the hash from the current URL
			if (this.currentLocation.href !== target.href || (this.currentLocation.hasHash && !target.hasHash)) {
				e.preventDefault()
				// noinspection JSIgnoredPromiseFromCall
				this.navigateTo(target.raw, e.currentTarget.dataset.transition || false, e.currentTarget)
				return
			}

			// a click to the current URL was detected
			if (!this.currentLocation.hasHash && !target.hasHash) {
				e.preventDefault()
			}
		}
	}

	/**
	 * @private
	 * @return {boolean}
	 */
	onPopstate = () => {
		// don't trigger for on-page anchors
		if (window.location.pathname === this.currentLocation.pathname) {
			return false
		}

		if (this.isTransitioning) {
			// overwrite history state with current page if currently navigating
			window.history.pushState({}, '', this.currentLocation.href)
			return false
		}

		// noinspection JSIgnoredPromiseFromCall
		this.navigateTo(window.location.href, false, 'popstate')
	}

	/**
	 * @private
	 * @param {string} url
	 * @return {Promise<Document>}
	 */
	fetch(url) {
		return new Promise((resolve) => {
			fetch(url, {
				mode: 'same-origin',
				method: 'GET',
				headers: { 'X-Requested-With': 'Taxi' },
				credentials: 'same-origin'
			})
				.then((response) => {
					if (!response.ok) {
						console.warn('Taxi encountered a non 2xx HTTP status code')
						window.location.href = url
					}

					return response.text()
				})
				.then((htmlString) => {
					resolve(parseDom(htmlString))
				})
				.catch((err) => {
					console.warn(err)
					window.location.href = url
				})
		})
	}

	/**
	 * @private
	 * @param {string|false} transition
	 * @return {Transition|function}
	 */
	chooseTransition(transition) {
		if (transition) {
			return this.transitions[transition]
		}

		const routeTransition = this.router?.findMatch(this.currentLocation, this.targetLocation)

		if (routeTransition) {
			return this.transitions[routeTransition]
		}

		return this.defaultTransition
	}

	/**
	 * @private
	 * @param {Document|Node} page
	 * @return {CacheEntry}
	 */
	createCacheEntry(page) {
		const content = page.querySelector('[data-taxi-view]')
		const Renderer = content.dataset.taxiView.length ? this.renderers[content.dataset.taxiView] : this.defaultRenderer

		return {
			page,
			content,
			scripts: [...page.querySelectorAll('script:not([data-no-reload])')].filter(this.reloadJsFilter),
			title: page.title,
			renderer: new Renderer({
				wrapper: this.wrapper,
				title: page.title,
				content,
				page
			})
		}
	}
}
