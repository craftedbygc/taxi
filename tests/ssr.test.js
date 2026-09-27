// @vitest-environment node
import { it, expect } from 'vitest'

// Frameworks like Astro and Next evaluate imports on the server, where there is no DOM
it('can be imported without a DOM', async () => {
	expect(typeof window).toBe('undefined')

	const taxi = await import('../src/taxi.js')

	expect(Object.keys(taxi).sort()).toEqual(['Core', 'Renderer', 'Transition'])
})
