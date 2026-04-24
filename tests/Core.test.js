import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Core } from '../src/taxi.js'
import { createDOM, buildPageHTML, mockFetchSuccess, mockFetchError } from './setup.js'

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

describe('Core — _chooseTransition()', () => {
	// Bug fix #4 — chooseTransition warns and falls back instead of returning undefined
	it('warns and returns defaultTransition for an unregistered transition name', () => {
		const taxi = createCore()
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

		taxi.targetLocation = { pathname: '/foo' }
		const chosen = taxi._chooseTransition('nonExistent')

		expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('nonExistent'))
		expect(chosen).toBe(taxi.defaultTransition)
	})
})

describe('Core — createCacheEntry()', () => {
	// Bug fix #5 — throws descriptively when [data-taxi-view] is absent
	it('throws when the page has no [data-taxi-view]', () => {
		const taxi = createCore()
		const badPage = new DOMParser().parseFromString('<html><body><main data-taxi></main></body></html>', 'text/html')
		expect(() => taxi.createCacheEntry(badPage, 'http://localhost/bad')).toThrow('[data-taxi-view]')
	})

	it('warns when a named renderer is not registered', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const taxi = createCore()
		const page = new DOMParser().parseFromString(
			`<html><body><main data-taxi><article data-taxi-view="ghost"></article></main></body></html>`,
			'text/html'
		)
		taxi.createCacheEntry(page, 'http://localhost/page')
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
