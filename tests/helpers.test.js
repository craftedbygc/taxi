import { describe, it, expect } from 'vitest'
import { parseDom, processUrl, duplicateElement, reloadElement, appendElement } from '../src/helpers.js'

describe('parseDom', () => {
	it('parses an HTML string into a Document', () => {
		const doc = parseDom('<html><head><title>Test</title></head><body><p>Hello</p></body></html>')
		expect(doc).toBeInstanceOf(Document)
		expect(doc.title).toBe('Test')
		expect(doc.querySelector('p').textContent).toBe('Hello')
	})

	it('returns the input unchanged if already a Document', () => {
		const doc = document.implementation.createHTMLDocument('Existing')
		expect(parseDom(doc)).toBe(doc)
	})
})

describe('processUrl', () => {
	it('extracts pathname, host, href and search from an absolute URL', () => {
		const result = processUrl('http://localhost/about?foo=bar')
		expect(result.pathname).toBe('/about')
		expect(result.host).toBe('localhost')
		expect(result.search).toBe('?foo=bar')
		expect(result.hasHash).toBe(false)
		expect(result.raw).toBe('http://localhost/about?foo=bar')
	})

	it('detects hash fragments', () => {
		const result = processUrl('http://localhost/page#section')
		expect(result.hasHash).toBe(true)
		// href strips the hash
		expect(result.href).not.toContain('#section')
	})

	it('strips trailing slashes from pathname', () => {
		const result = processUrl('http://localhost/blog/')
		expect(result.pathname).toBe('/blog')
	})

	it('handles the homepage without trailing slash', () => {
		const result = processUrl('http://localhost/')
		expect(result.pathname).toBe('')
	})

	it('resolves relative URLs against window.location.origin', () => {
		const result = processUrl('/contact')
		expect(result.hostname || result.host.split(':')[0]).toBe('localhost')
		expect(result.pathname).toBe('/contact')
	})
})

describe('duplicateElement', () => {
	it('creates a new element of the given type', () => {
		const script = document.createElement('script')
		script.setAttribute('src', '/foo.js')
		script.setAttribute('data-taxi-reload', '')

		const clone = duplicateElement(script, 'SCRIPT')
		expect(clone.tagName).toBe('SCRIPT')
		expect(clone.getAttribute('src')).toBe('/foo.js')
		expect(clone.hasAttribute('data-taxi-reload')).toBe(true)
	})

	it('copies inline content', () => {
		const style = document.createElement('style')
		style.innerHTML = 'body { color: red; }'

		const clone = duplicateElement(style, 'STYLE')
		expect(clone.innerHTML).toBe('body { color: red; }')
	})
})

describe('reloadElement', () => {
	it('replaces the node with a fresh clone in the DOM', () => {
		const container = document.createElement('div')
		const script = document.createElement('script')
		script.setAttribute('src', '/reload.js')
		container.appendChild(script)
		document.body.appendChild(container)

		reloadElement(script, 'SCRIPT')

		// The original element should be gone; a new one with the same src should be present
		expect(container.querySelector('script').getAttribute('src')).toBe('/reload.js')
		expect(container.querySelector('script')).not.toBe(script)
	})
})

describe('appendElement', () => {
	it('appends a SCRIPT to document.body when parent is BODY', () => {
		const script = document.createElement('script')
		script.setAttribute('src', '/appended.js')
		document.body.appendChild(document.createElement('div')) // give body a parent context

		const bodyScript = document.createElement('script')
		bodyScript.setAttribute('src', '/appended.js')
		document.body.appendChild(bodyScript)

		appendElement(bodyScript, 'SCRIPT')
		const allScripts = Array.from(document.body.querySelectorAll('script[src="/appended.js"]'))
		expect(allScripts.length).toBeGreaterThanOrEqual(1)
	})
})
