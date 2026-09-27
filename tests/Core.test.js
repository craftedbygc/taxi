import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Core as BaseCore } from '../src/taxi.js'
import { createDOM, buildPageHTML, mockFetchSuccess, mockFetchError } from './setup.js'

// Track every instance so its document-level listeners can be removed after each test,
// otherwise instances from earlier tests keep handling clicks
const instances = []

class Core extends BaseCore {
	constructor(options) {
		super(options)
		instances.push(this)
	}
}

afterEach(() => {
	instances.splice(0).forEach((taxi) => taxi.destroy())
})

// Helper: create a Core instance with the DOM already set up
function createCore(options = {}) {
	createDOM()
	return new Core(options)
}

describe('Core — constructor', () => {
	it('initialises with correct defaults', () => {
		const taxi = createCore()
		expect(taxi.isTransitioning).toBe(false)
		expect(taxi.isPopping).toBe(false)
		expect(taxi.bypassCache).toBe(false)
		expect(taxi.enablePrefetch).toBe('hover')
		expect(taxi.removeOldContent).toBe(true)
		expect(taxi.maxCacheSize).toBe(0)
	})

	it('merges fetchOptions into every fetch call', async () => {
		createDOM()
		const fetchMock = mockFetchSuccess(buildPageHTML())
		vi.stubGlobal('fetch', fetchMock)
		const taxi = new Core({
			fetchOptions: { credentials: 'include', headers: { 'X-Custom': 'yes' } }
		})

		await taxi.preload('/target')

		const [, init] = fetchMock.mock.calls[0]
		expect(init.credentials).toBe('include')
		expect(init.headers['X-Custom']).toBe('yes')
		// built-in Taxi header should still be present
		expect(init.headers['X-Requested-With']).toBe('Taxi')
	})

	it('primes the current page into the cache on init', () => {
		const taxi = createCore()
		expect(taxi.cache.size).toBe(1)
	})

	it('sets currentCacheEntry on init', () => {
		const taxi = createCore()
		expect(taxi.currentCacheEntry).not.toBeNull()
		expect(taxi.currentCacheEntry.title).toBeDefined()
	})

	it('accepts custom renderers and transitions', async () => {
		createDOM()
		const { Renderer, Transition } = await import('../src/taxi.js')
		class MyRenderer extends Renderer {}
		class MyTransition extends Transition {}
		const taxi = new Core({ renderers: { default: MyRenderer }, transitions: { default: MyTransition } })
		expect(taxi.defaultRenderer).toBe(MyRenderer)
		expect(taxi.defaultTransition).toBe(MyTransition)
	})

	// Bug fix #1 — reloadCssFilter now defaults to data-taxi-reload, not () => true
	it('defaults reloadCssFilter to check data-taxi-reload attribute', () => {
		const taxi = createCore()
		const withAttr = document.createElement('link')
		withAttr.rel = 'stylesheet'
		withAttr.setAttribute('data-taxi-reload', '')

		const withoutAttr = document.createElement('link')
		withoutAttr.rel = 'stylesheet'

		expect(taxi.reloadCssFilter(withAttr)).toBe(true)
		expect(taxi.reloadCssFilter(withoutAttr)).toBe(false)
	})

	it('throws if [data-taxi-view] is missing from the page', () => {
		document.body.innerHTML = '<main data-taxi></main>' // no data-taxi-view
		expect(() => new Core()).toThrow('[data-taxi-view]')
	})
})

describe('Core — cache management', () => {
	it('updateCache() refreshes the entry for the current URL', () => {
		const taxi = createCore()
		const original = taxi.cache.get(taxi.currentLocation.href)
		taxi.updateCache()
		expect(taxi.cache.get(taxi.currentLocation.href)).not.toBe(original)
	})

	it('clearCache() removes a specific URL from the cache', () => {
		const taxi = createCore()
		const url = taxi.currentLocation.href
		taxi.clearCache(url)
		expect(taxi.cache.has(url)).toBe(false)
	})

	// Improvement #11 — maxCacheSize evicts oldest entry
	it('evicts the oldest non-current entry when maxCacheSize is reached', async () => {
		createDOM()
		const taxi = new Core({ maxCacheSize: 2 })

		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML(), 'http://localhost/page-a'))
		await taxi.preload('/page-a')

		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('', '<p>B</p>', 'Page B'), 'http://localhost/page-b'))
		await taxi.preload('/page-b')

		// Cache: [/ (current), /page-a, /page-b] — /page-a should be evicted as it's oldest non-current
		expect(taxi.cache.size).toBe(2)
		expect(taxi.cache.has('http://localhost/page-b')).toBe(true)
		expect(taxi.cache.has('http://localhost/page-a')).toBe(false)
	})

	it('never evicts the current page when cache is full', async () => {
		createDOM()
		const taxi = new Core({ maxCacheSize: 1 })

		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML(), 'http://localhost/page-a'))
		await taxi.preload('/page-a')

		// Current page (/) should still be in cache even though limit is 1
		expect(taxi.cache.has('http://localhost/')).toBe(true)
	})
})

describe('Core — setDefault methods', () => {
	it('setDefaultRenderer() updates the default renderer', async () => {
		createDOM()
		const { Renderer } = await import('../src/taxi.js')
		class MyRenderer extends Renderer {}
		const taxi = new Core({ renderers: { custom: MyRenderer } })
		taxi.setDefaultRenderer('custom')
		expect(taxi.defaultRenderer).toBe(MyRenderer)
	})

	it('setDefaultTransition() updates the default transition', async () => {
		createDOM()
		const { Transition } = await import('../src/taxi.js')
		class MyTransition extends Transition {}
		const taxi = new Core({ transitions: { custom: MyTransition } })
		taxi.setDefaultTransition('custom')
		expect(taxi.defaultTransition).toBe(MyTransition)
	})
})

describe('Core — addRoute()', () => {
	it('creates a RouteStore on first call', () => {
		const taxi = createCore()
		expect(taxi.router).toBeUndefined()
		taxi.addRoute('/about', '/contact', 'myTransition')
		expect(taxi.router).toBeDefined()
	})

	it('accumulates routes', () => {
		const taxi = createCore()
		taxi.addRoute('/a', '/b', 't1')
		taxi.addRoute('/c', '/d', 't2')
		expect(taxi.router.data.size).toBe(2)
	})
})

describe('Core — preload()', () => {
	it('fetches and caches a URL', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML(), 'http://localhost/target'))
		const taxi = new Core()

		const entry = await taxi.preload('/target')
		expect(taxi.cache.has('http://localhost/target')).toBe(true)
		expect(entry).toBeDefined()
		expect(entry.title).toBeDefined()
	})

	it('rejects on a non-2xx response so callers can handle missing pages', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchError())
		const taxi = new Core()

		await expect(taxi.preload('/missing')).rejects.toThrow()
		// Nothing should be cached for a failed preload
		expect(taxi.cache.has('http://localhost/missing')).toBe(false)
	})

	it('rejects when the fetched page has no [data-taxi-view]', async () => {
		createDOM()
		const badPage = `<!DOCTYPE html><html><body><main data-taxi></main></body></html>`
		vi.stubGlobal('fetch', mockFetchSuccess(badPage, 'http://localhost/no-view'))
		const taxi = new Core()

		await expect(taxi.preload('/no-view')).rejects.toThrow('[data-taxi-view]')
	})

	// Improvement #16 — preload returns the CacheEntry when already cached
	it('returns the existing CacheEntry without re-fetching if already cached', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML(), 'http://localhost/target'))
		const taxi = new Core()

		const first = await taxi.preload('/target')
		const fetchMock = vi.fn()
		vi.stubGlobal('fetch', fetchMock) // should NOT be called again
		const second = await taxi.preload('/target')

		expect(second).toBe(first)
		expect(fetchMock).not.toHaveBeenCalled()
	})
})

describe('Core — navigateTo()', () => {
	it('rejects when a transition is already in progress', async () => {
		const taxi = createCore()
		taxi.isTransitioning = true

		await expect(taxi.navigateTo('/page')).rejects.toThrow('transition is currently in progress')
	})

	// Bug fix #2 — navigateTo now rejects and resets state on fetch failure
	it('rejects and resets isTransitioning when fetch fails', async () => {
		vi.stubGlobal('fetch', mockFetchError())
		const taxi = createCore()

		await expect(taxi.navigateTo('/missing')).rejects.toThrow()
		expect(taxi.isTransitioning).toBe(false)
	})
})

describe('Core — chooseTransition', () => {
	// Bug fix #4 — chooseTransition warns and falls back instead of returning undefined
	it('warns and falls back to defaultTransition for an unregistered transition name', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML()))
		const taxi = new Core()
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		// navigateTo with an unknown transition name triggers the warn + fallback internally
		await taxi.navigateTo('/target', 'nonExistent')

		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('nonExistent'))
	})
})

describe('Core — cache entry creation', () => {
	it('warns when a named renderer is not registered', async () => {
		createDOM()
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const pageHtml = buildPageHTML('ghost')
		vi.stubGlobal('fetch', mockFetchSuccess(pageHtml))
		const taxi = new Core()
		await taxi.preload('/page')
		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('"ghost"'))
	})
})

describe('Core — navigateBack() / navigateForward()', () => {
	// Feature #19 — navigateBack / navigateForward
	it('calls history.back() when not transitioning', () => {
		const taxi = createCore()
		const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})
		taxi.navigateBack()
		expect(backSpy).toHaveBeenCalledOnce()
	})

	it('calls history.forward() when not transitioning', () => {
		const taxi = createCore()
		const fwdSpy = vi.spyOn(window.history, 'forward').mockImplementation(() => {})
		taxi.navigateForward()
		expect(fwdSpy).toHaveBeenCalledOnce()
	})

	it('warns and does NOT call history.back() when transition is in progress', () => {
		const taxi = createCore()
		const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {})
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		taxi.isTransitioning = true
		taxi.navigateBack()
		expect(backSpy).not.toHaveBeenCalled()
		expect(warnSpy).toHaveBeenCalled()
	})
})

describe('Core — NAVIGATE_OUT event includes `to`', () => {
	// Improvement #10 — NAVIGATE_OUT now includes to: CacheEntry (or stub with nulls)
	it('emits NAVIGATE_OUT with a CacheEntry-shaped `to` when not preloaded', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML()))
		const taxi = new Core()

		let capturedTo = null
		taxi.on('NAVIGATE_OUT', ({ to }) => { capturedTo = to })

		await taxi.navigateTo('/target')

		expect(capturedTo).not.toBeNull()
		// Keys present, content-bearing fields are null (page not yet fetched)
		expect(capturedTo.finalUrl).toBe('http://localhost/target')
		expect(capturedTo.page).toBeNull()
		expect(capturedTo.content).toBeNull()
		expect(capturedTo.title).toBeNull()
	})

	it('emits NAVIGATE_OUT with a real CacheEntry when the page was preloaded', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('default', 'Hello', 'Preloaded Title')))
		const taxi = new Core()

		await taxi.preload('/target')

		let capturedTo = null
		taxi.on('NAVIGATE_OUT', ({ to }) => { capturedTo = to })

		await taxi.navigateTo('/target')

		expect(capturedTo).not.toBeNull()
		expect(capturedTo.title).toBe('Preloaded Title')
		expect(capturedTo.page).not.toBeNull()
	})
})

describe('Core — enablePrefetch strategies', () => {
	it('normalises enablePrefetch: true to "hover"', () => {
		const taxi = createCore({ enablePrefetch: true })
		expect(taxi.enablePrefetch).toBe('hover')
	})

	it('accepts enablePrefetch: false', () => {
		const taxi = createCore({ enablePrefetch: false })
		expect(taxi.enablePrefetch).toBe(false)
	})

	it('accepts enablePrefetch: "hover"', () => {
		const taxi = createCore({ enablePrefetch: 'hover' })
		expect(taxi.enablePrefetch).toBe('hover')
	})

	it('accepts enablePrefetch: "visible"', () => {
		const taxi = createCore({ enablePrefetch: 'visible' })
		expect(taxi.enablePrefetch).toBe('visible')
	})

	it('"visible" strategy observes matching links via IntersectionObserver', () => {
		createDOM()
		// Add a link to the page
		document.body.querySelector('[data-taxi]').insertAdjacentHTML('beforebegin', '<a href="/about">About</a>')

		const observeSpy = vi.fn()
		class MockIntersectionObserver {
			constructor() { this.observe = observeSpy; this.unobserve = vi.fn(); this.disconnect = vi.fn() }
		}
		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

		new Core({ enablePrefetch: 'visible' })

		expect(observeSpy).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/about' }))
	})

	it('"visible" strategy preloads a link when it intersects', async () => {
		createDOM()
		document.body.querySelector('[data-taxi]').insertAdjacentHTML('beforebegin', '<a href="/about">About</a>')

		let intersectionCallback
		class MockIntersectionObserver {
			constructor(cb) {
				intersectionCallback = cb
				this.observe = vi.fn()
				this.unobserve = vi.fn()
				this.disconnect = vi.fn()
			}
		}
		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

		const fetchMock = mockFetchSuccess(buildPageHTML())
		vi.stubGlobal('fetch', fetchMock)

		const taxi = new Core({ enablePrefetch: 'visible' })

		// Simulate the link entering the viewport
		const link = document.querySelector('a[href="/about"]')
		intersectionCallback([{ isIntersecting: true, target: link }])

		// Allow the preload microtask to settle
		await new Promise((r) => setTimeout(r, 0))

		expect(fetchMock).toHaveBeenCalledWith('http://localhost/about', expect.any(Object))
		expect(taxi.cache.has('http://localhost/about')).toBe(true)
	})
})

describe('Core — enableViewTransitions', () => {
	function mockVT(finished = Promise.resolve()) {
		document.startViewTransition = vi.fn((cb) => {
			cb()
			return { updateCallbackDone: Promise.resolve(), finished }
		})
	}

	it('defaults to false', () => {
		const taxi = createCore()
		expect(taxi.enableViewTransitions).toBe(false)
	})

	it('calls startViewTransition on navigation when enabled and supported', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML()))
		mockVT()
		const taxi = new Core({ enableViewTransitions: true })

		await taxi.navigateTo('/target')

		expect(document.startViewTransition).toHaveBeenCalledOnce()
	})

	it('does NOT call startViewTransition when enableViewTransitions is false', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML()))
		mockVT()
		const taxi = new Core({ enableViewTransitions: false })

		await taxi.navigateTo('/target')

		expect(document.startViewTransition).not.toHaveBeenCalled()
	})

	it('falls back to normal navigation when startViewTransition is not supported', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML()))
		delete document.startViewTransition

		const taxi = new Core({ enableViewTransitions: true })
		await taxi.navigateTo('/target')

		expect(taxi.currentCacheEntry.finalUrl).toBe('http://localhost/page')
	})

	it('new page is in DOM after navigation via view transition', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('', '<p>New content</p>')))
		mockVT()
		const taxi = new Core({ enableViewTransitions: true })

		await taxi.navigateTo('/target')

		expect(document.querySelector('[data-taxi-view]').innerHTML).toContain('New content')
	})

	it('onEnterCompleted and NAVIGATE_END wait for the view transition to finish', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML()))

		let resolveFinished
		const finished = new Promise((resolve) => { resolveFinished = resolve })
		mockVT(finished)

		const { Renderer } = await import('../src/taxi.js')
		const onEnterCompleted = vi.fn()
		class TrackingRenderer extends Renderer {
			onEnterCompleted() {
				onEnterCompleted()
				super.onEnterCompleted()
			}
		}

		const navigateEnd = vi.fn()
		const taxi = new Core({ enableViewTransitions: true, renderers: { default: TrackingRenderer } })
		taxi.on('NAVIGATE_END', navigateEnd)

		const navigation = taxi.navigateTo('/target')

		// Let the DOM-swap microtasks (updateCallbackDone etc.) settle, but `finished` is still pending
		await new Promise((r) => setTimeout(r, 0))
		await new Promise((r) => setTimeout(r, 0))

		expect(onEnterCompleted).not.toHaveBeenCalled()
		expect(navigateEnd).not.toHaveBeenCalled()
		expect(taxi.isTransitioning).toBe(true)

		resolveFinished()
		await navigation

		expect(onEnterCompleted).toHaveBeenCalledOnce()
		expect(navigateEnd).toHaveBeenCalledOnce()
		expect(taxi.isTransitioning).toBe(false)
	})

	it('still completes navigation when the view transition finished promise rejects (skipped transition)', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML()))

		const finished = Promise.reject(new Error('transition skipped'))
		finished.catch(() => {}) // avoid an unhandled-rejection warning in this test; Core.js attaches its own .catch()
		mockVT(finished)

		const navigateEnd = vi.fn()
		const taxi = new Core({ enableViewTransitions: true })
		taxi.on('NAVIGATE_END', navigateEnd)

		await expect(taxi.navigateTo('/target')).resolves.toBeUndefined()

		expect(navigateEnd).toHaveBeenCalledOnce()
		expect(taxi.isTransitioning).toBe(false)
	})
})

describe('Core — 2.0 hardening', () => {
	it('throws a clear error if [data-taxi] is missing', () => {
		document.body.innerHTML = '<article data-taxi-view></article>'
		expect(() => new Core()).toThrow('[data-taxi]')
	})

	it('updateCache() for the current page keeps the live renderer instance', () => {
		const taxi = createCore()
		const renderer = taxi.currentCacheEntry.renderer
		document.querySelector('[data-taxi-view]').innerHTML = '<p>Updated</p>'

		taxi.updateCache()

		expect(taxi.currentCacheEntry).toBe(taxi.cache.get(taxi.currentLocation.href))
		expect(taxi.currentCacheEntry.renderer).toBe(renderer)
		expect(renderer._contentString).toContain('Updated')
		taxi.destroy()
	})

	it('evicts the least recently used entry, not the oldest added', async () => {
		createDOM()
		const taxi = new Core({ maxCacheSize: 3 })

		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML(), 'http://localhost/a'))
		await taxi.preload('/a')
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML(), 'http://localhost/b'))
		await taxi.preload('/b')

		// touch /a so /b becomes least recently used
		await taxi.preload('/a')

		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML(), 'http://localhost/c'))
		await taxi.preload('/c')

		expect(taxi.cache.has('http://localhost/a')).toBe(true)
		expect(taxi.cache.has('http://localhost/b')).toBe(false)
		expect(taxi.cache.has('http://localhost/c')).toBe(true)
		taxi.destroy()
	})

	it('rejects and resets state when the fetched page has no [data-taxi-view]', async () => {
		vi.stubGlobal('fetch', mockFetchSuccess('<html><body><p>Login</p></body></html>', 'http://localhost/login'))
		const taxi = createCore()

		await expect(taxi.navigateTo('/account')).rejects.toThrow('[data-taxi-view]')
		expect(taxi.isTransitioning).toBe(false)
		taxi.destroy()
	})

	it('a failed hover prefetch does not cause an unhandled rejection', async () => {
		createDOM()
		document.body.insertAdjacentHTML('beforeend', '<a href="/missing">Missing</a>')
		vi.stubGlobal('fetch', mockFetchError())
		const taxi = new Core()

		document.querySelector('a[href="/missing"]').dispatchEvent(new Event('mouseenter'))
		await new Promise((r) => setTimeout(r, 0))

		expect(taxi.cache.has('http://localhost/missing')).toBe(false)
		taxi.destroy()
	})

	describe('link clicks', () => {
		function setup(linkAttrs = '') {
			createDOM()
			document.body.insertAdjacentHTML('beforeend', `<a href="/about" ${linkAttrs}>About</a>`)
			const taxi = new Core()
			const spy = vi.spyOn(taxi, 'navigateTo').mockResolvedValue()
			return { taxi, spy, link: document.querySelector('a[href="/about"]') }
		}

		function click(link, init = {}) {
			const e = new MouseEvent('click', { bubbles: true, cancelable: true, ...init })
			link.dispatchEvent(e)
			return e
		}

		it('intercepts a plain click', () => {
			const { taxi, spy, link } = setup()
			click(link)
			expect(spy).toHaveBeenCalledOnce()
			taxi.destroy()
		})

		it.each(['shiftKey', 'altKey', 'metaKey', 'ctrlKey'])('ignores clicks with %s', (key) => {
			const { taxi, spy, link } = setup()
			const e = click(link, { [key]: true })
			expect(spy).not.toHaveBeenCalled()
			expect(e.defaultPrevented).toBe(false)
			taxi.destroy()
		})

		it('ignores links with a download attribute', () => {
			const { taxi, spy, link } = setup('download')
			click(link)
			expect(spy).not.toHaveBeenCalled()
			taxi.destroy()
		})

		it('ignores clicks that were already prevented', () => {
			const { taxi, spy, link } = setup()
			link.addEventListener('click', (e) => e.preventDefault())
			click(link)
			expect(spy).not.toHaveBeenCalled()
			taxi.destroy()
		})

		it('stops intercepting clicks after destroy()', () => {
			const { taxi, spy, link } = setup()
			taxi.destroy()
			click(link, { cancelable: false })
			expect(spy).not.toHaveBeenCalled()
		})
	})

	describe('visible prefetch', () => {
		function mockObserver() {
			const observe = vi.fn()
			vi.stubGlobal('IntersectionObserver', class {
				constructor() { this.observe = observe; this.unobserve = vi.fn(); this.disconnect = vi.fn() }
			})
			return observe
		}

		it('does not observe links to other hosts', () => {
			createDOM()
			document.body.insertAdjacentHTML('beforeend', '<a href="https://example.com/">External</a><a href="/about">About</a>')
			const observe = mockObserver()

			const taxi = new Core({ enablePrefetch: 'visible' })

			expect(observe).toHaveBeenCalledOnce()
			expect(observe).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/about' }))
			taxi.destroy()
		})

		it('does nothing when the user has data saver enabled', () => {
			createDOM()
			document.body.insertAdjacentHTML('beforeend', '<a href="/about">About</a>')
			const observe = mockObserver()
			vi.stubGlobal('navigator', { ...navigator, connection: { saveData: true } })

			const taxi = new Core({ enablePrefetch: 'visible' })

			expect(observe).not.toHaveBeenCalled()
			taxi.destroy()
		})

		it('observes links added via AJAX after updateCache()', () => {
			createDOM()
			const observe = mockObserver()
			const taxi = new Core({ enablePrefetch: 'visible' })

			document.querySelector('[data-taxi-view]').insertAdjacentHTML('beforeend', '<a href="/more">More</a>')
			taxi.updateCache()

			expect(observe).toHaveBeenCalledWith(expect.objectContaining({ href: 'http://localhost/more' }))
			taxi.destroy()
		})
	})
})

describe('Core — interrupted navigations (allowInterruption: true)', () => {
	// A fetch mock whose responses are released manually, and which honours AbortSignal like the real fetch
	function deferredFetch() {
		const pending = []
		const fn = vi.fn((url, init) => new Promise((resolve, reject) => {
			pending.push({
				url,
				respond: (html) => resolve({ ok: true, url, text: () => Promise.resolve(html) }),
			})
			init.signal?.addEventListener('abort', () => reject(new DOMException('The operation was aborted.', 'AbortError')))
		}))
		fn.pending = pending
		return fn
	}

	const tick = () => new Promise((r) => setTimeout(r, 0))

	it('completes a navigation to a link whose hover preload is still in flight', async () => {
		createDOM()
		const fetchMock = deferredFetch()
		vi.stubGlobal('fetch', fetchMock)
		const taxi = new Core({ allowInterruption: true })

		// hover starts a preload, then the user clicks before it has finished
		taxi.preload('/b').catch(() => {})
		const navigation = taxi.navigateTo('/b')
		await tick()

		fetchMock.pending[0].respond(buildPageHTML('', '<p>B</p>', 'Page B'))
		await navigation

		expect(fetchMock).toHaveBeenCalledOnce()
		expect(document.title).toBe('Page B')
		expect(taxi.isTransitioning).toBe(false)
	})

	it('aborts the superseded navigation and completes the newer one', async () => {
		createDOM()
		const fetchMock = deferredFetch()
		vi.stubGlobal('fetch', fetchMock)
		const taxi = new Core({ allowInterruption: true })

		const first = taxi.navigateTo('/a')
		await tick()
		const second = taxi.navigateTo('/b')

		await expect(first).rejects.toMatchObject({ name: 'AbortError' })
		// the superseded navigation must not reset state the newer one owns
		expect(taxi.isTransitioning).toBe(true)

		fetchMock.pending.find((p) => p.url === 'http://localhost/b').respond(buildPageHTML('', '<p>B</p>', 'Page B'))
		await second

		const wrapper = document.querySelector('[data-taxi]')
		expect(wrapper.textContent).toContain('B')
		expect(wrapper.textContent).not.toContain('Initial page content')
		expect(window.location.pathname).toBe('/b')
		expect(taxi.isTransitioning).toBe(false)
	})

	it('does not warn about interrupted navigations started by link clicks', async () => {
		createDOM()
		document.body.insertAdjacentHTML('beforeend', '<a href="/a">A</a><a href="/b">B</a>')
		const fetchMock = deferredFetch()
		vi.stubGlobal('fetch', fetchMock)
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		new Core({ allowInterruption: true, enablePrefetch: false })

		document.querySelector('a[href="/a"]').click()
		await tick()
		document.querySelector('a[href="/b"]').click()
		await tick()

		expect(warn).not.toHaveBeenCalled()
	})
})

describe('Core — prefers-reduced-motion', () => {
	afterEach(() => {
		delete window.matchMedia
		delete document.startViewTransition
	})

	it('skips the View Transition and custom transitions when the user prefers reduced motion', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('', '<p>New</p>', 'New Page')))
		window.matchMedia = vi.fn((query) => ({ matches: query === '(prefers-reduced-motion: reduce)' }))
		document.startViewTransition = vi.fn()

		const { Transition } = await import('../src/taxi.js')
		const onLeave = vi.fn(({ done }) => done())
		class Animated extends Transition { onLeave(props) { onLeave(props) } }

		const taxi = new Core({ enableViewTransitions: true, transitions: { default: Animated } })
		await taxi.navigateTo('/new')

		expect(document.startViewTransition).not.toHaveBeenCalled()
		expect(onLeave).not.toHaveBeenCalled()
		expect(document.title).toBe('New Page')
	})
})

describe('Core — enableAccessibility', () => {
	it('is off by default and adds nothing to the page', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('', '<h1>Heading</h1>', 'New Page')))
		const taxi = new Core()

		await taxi.navigateTo('/new')

		expect(taxi.enableAccessibility).toBe(false)
		expect(document.querySelector('[data-taxi-announcer]')).toBeNull()
		expect(document.querySelector('h1').hasAttribute('tabindex')).toBe(false)
	})

	it('announces the new page title and focuses its h1', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('', '<h1>Heading</h1>', 'New Page')))
		const taxi = new Core({ enableAccessibility: true })

		const announcer = document.querySelector('[data-taxi-announcer]')
		expect(announcer.getAttribute('aria-live')).toBe('assertive')

		await taxi.navigateTo('/new')

		expect(announcer.textContent).toBe('New Page')
		expect(document.activeElement).toBe(document.querySelector('[data-taxi] h1'))
		expect(document.activeElement.getAttribute('tabindex')).toBe('-1')
	})

	it('focuses the view itself when the new page has no h1', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('', '<p>No heading</p>', 'New Page')))
		const taxi = new Core({ enableAccessibility: true })

		await taxi.navigateTo('/new')

		expect(document.activeElement).toBe(taxi.currentCacheEntry.renderer.content)
	})

	it('removes the announcer on destroy()', () => {
		createDOM()
		const taxi = new Core({ enableAccessibility: true })
		taxi.destroy()
		expect(document.querySelector('[data-taxi-announcer]')).toBeNull()
	})
})

describe('Core — failing transitions', () => {
	it('completes the navigation when a transition throws or rejects', async () => {
		createDOM()
		vi.stubGlobal('fetch', mockFetchSuccess(buildPageHTML('', '<p>New</p>', 'New Page')))
		const error = vi.spyOn(console, 'error').mockImplementation(() => {})

		const { Transition } = await import('../src/taxi.js')
		class Broken extends Transition {
			onLeave() { throw new Error('leave broke') }
			onEnter() { return Promise.reject(new Error('enter broke')) }
		}

		const taxi = new Core({ transitions: { default: Broken } })
		await taxi.navigateTo('/new')

		expect(document.title).toBe('New Page')
		expect(taxi.isTransitioning).toBe(false)
		expect(error).toHaveBeenCalledTimes(2)
	})
})
