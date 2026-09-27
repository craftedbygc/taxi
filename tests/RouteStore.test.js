import { describe, it, expect } from 'vitest'
import RouteStore from '../src/RouteStore.js'

function makeUrl(pathname) {
	return { pathname, href: `http://localhost${pathname}`, raw: `http://localhost${pathname}`, host: 'localhost', hasHash: false, search: '' }
}

describe('RouteStore', () => {
	it('adds routes and caches their regex', () => {
		const store = new RouteStore()
		store.add('/about', '/contact', 'aboutToContact')
		expect(store.data.has('/about')).toBe(true)
		expect(store.regexCache.has('/about')).toBe(true)
	})

	it('returns the transition for a matching from→to pair', () => {
		const store = new RouteStore()
		store.add('/about', '/contact', 'aboutToContact')

		const result = store.findMatch(makeUrl('/about'), makeUrl('/contact'))
		expect(result).toBe('aboutToContact')
	})

	it('returns null when no from pattern matches', () => {
		const store = new RouteStore()
		store.add('/about', '/contact', 'aboutToContact')

		const result = store.findMatch(makeUrl('/blog'), makeUrl('/contact'))
		expect(result).toBeNull()
	})

	it('returns null when from matches but no to pattern matches', () => {
		const store = new RouteStore()
		store.add('/about', '/contact', 'aboutToContact')

		const result = store.findMatch(makeUrl('/about'), makeUrl('/blog'))
		expect(result).toBeNull()
	})

	it('tests routes in declaration order', () => {
		const store = new RouteStore()
		store.add('/pages/specific', '/home', 'specific')
		store.add('/pages/.*', '/home', 'catchAll')

		const specific = store.findMatch(makeUrl('/pages/specific'), makeUrl('/home'))
		expect(specific).toBe('specific')

		const catchAll = store.findMatch(makeUrl('/pages/other'), makeUrl('/home'))
		expect(catchAll).toBe('catchAll')
	})

	// Bug fix #7 — was broken before because of break statement
	it('falls through to a wildcard fromPattern when a specific from matches but its to does not', () => {
		const store = new RouteStore()
		// specific from with a to that WON'T match
		store.add('/pages/specific', '/elsewhere', 'specific')
		// wildcard catch-all that SHOULD be found after the specific one fails
		store.add('/pages/.*', '.*', 'catchAll')

		const result = store.findMatch(makeUrl('/pages/specific'), makeUrl('/home'))
		expect(result).toBe('catchAll')
	})

	// Mirrors the example in docs/pages/routing.md
	it('matches the fall-through example from the routing docs', () => {
		const store = new RouteStore()
		store.add('/pages/specific', '', 'something')
		store.add('/pages/.*', '.*', 'somethingElse')

		expect(store.findMatch(makeUrl('/pages/specific'), makeUrl(''))).toBe('something')
		expect(store.findMatch(makeUrl('/pages/specific'), makeUrl('/about'))).toBe('somethingElse')
	})

	it('supports regex patterns in both from and to', () => {
		const store = new RouteStore()
		store.add('/blog/.*', '', 'blogToHome')

		const result = store.findMatch(makeUrl('/blog/post-1'), makeUrl(''))
		expect(result).toBe('blogToHome')
	})

	it('supports multiple to-patterns for the same from-pattern', () => {
		const store = new RouteStore()
		store.add('/blog', '/about', 'blogToAbout')
		store.add('/blog', '/contact', 'blogToContact')

		expect(store.findMatch(makeUrl('/blog'), makeUrl('/about'))).toBe('blogToAbout')
		expect(store.findMatch(makeUrl('/blog'), makeUrl('/contact'))).toBe('blogToContact')
	})
})
