import { vi, beforeEach, afterEach } from 'vitest'

// ─── DOM helpers ─────────────────────────────────────────────────────────────

/**
 * Creates a minimal Taxi DOM structure in document.body.
 * @param {string} [viewName] - value for data-taxi-view attribute
 * @param {string} [content]  - inner HTML for the view element
 */
export function createDOM(viewName = '', content = '<p>Initial page content</p>') {
	document.body.innerHTML = `
		<main data-taxi>
			<article data-taxi-view="${viewName}">
				${content}
			</article>
		</main>
	`
	document.title = 'Initial Page'
}

/**
 * Builds a full HTML string that looks like a fetched page.
 * @param {string} [viewName]
 * @param {string} [content]
 * @param {string} [title]
 * @returns {string}
 */
export function buildPageHTML(viewName = '', content = '<p>New page content</p>', title = 'New Page') {
	return `<!DOCTYPE html>
<html>
<head>
	<title>${title}</title>
	<meta name="description" content="A description for ${title}">
	<meta property="og:title" content="${title}">
</head>
<body>
	<main data-taxi>
		<article data-taxi-view="${viewName}">
			${content}
		</article>
	</main>
</body>
</html>`
}

// ─── Fetch mock helpers ───────────────────────────────────────────────────────

/**
 * Creates a fetch mock that resolves successfully with the given HTML.
 * @param {string} html
 * @param {string} [resolvedUrl]
 * @returns {import('vitest').MockInstance}
 */
export function mockFetchSuccess(html, resolvedUrl = 'http://localhost/page') {
	return vi.fn().mockResolvedValue({
		ok: true,
		url: resolvedUrl,
		text: () => Promise.resolve(html),
	})
}

/**
 * Creates a fetch mock that responds with a non-2xx status.
 * @returns {import('vitest').MockInstance}
 */
export function mockFetchError() {
	return vi.fn().mockResolvedValue({
		ok: false,
		status: 404,
		url: 'http://localhost/missing',
		text: () => Promise.resolve('Not found'),
	})
}

/**
 * Creates a fetch mock that rejects (network error).
 * @returns {import('vitest').MockInstance}
 */
export function mockFetchNetworkError() {
	return vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
}

// ─── Global reset ─────────────────────────────────────────────────────────────

beforeEach(() => {
	// tests running in the node environment (e.g. ssr.test.js) have no DOM to reset
	if (typeof document === 'undefined') {
		return
	}

	// Reset document body before each test
	document.body.innerHTML = ''
	document.head.innerHTML = ''
	document.title = ''

	// Reset location to a clean state
	window.history.replaceState({}, '', '/')
})

afterEach(() => {
	vi.restoreAllMocks()
	vi.unstubAllGlobals()
})
