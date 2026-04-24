import { describe, it, expect, vi } from 'vitest'
import Transition from '../src/Transition.js'

function makeWrapper() {
	const el = document.createElement('main')
	document.body.appendChild(el)
	return el
}

describe('Transition base class', () => {
	it('constructs with a wrapper reference', () => {
		const wrapper = makeWrapper()
		const t = new Transition({ wrapper })
		expect(t.wrapper).toBe(wrapper)
	})

	describe('leave()', () => {
		it('resolves immediately using the done callback (default onLeave)', async () => {
			const t = new Transition({ wrapper: makeWrapper() })
			const from = document.createElement('article')
			await expect(t.leave({ from, trigger: false })).resolves.toBeUndefined()
		})

		it('resolves when a subclass calls done()', async () => {
			class MyTransition extends Transition {
				onLeave({ done }) {
					setTimeout(done, 10)
				}
			}
			const t = new MyTransition({ wrapper: makeWrapper() })
			await expect(t.leave({ from: document.createElement('div'), trigger: false })).resolves.toBeUndefined()
		})

		// Bug fix #17 — Promise return support
		it('resolves when a subclass returns a Promise instead of calling done()', async () => {
			class PromiseTransition extends Transition {
				onLeave() {
					return Promise.resolve()
				}
			}
			const t = new PromiseTransition({ wrapper: makeWrapper() })
			await expect(t.leave({ from: document.createElement('div'), trigger: false })).resolves.toBeUndefined()
		})

		it('passes from element and trigger to onLeave', async () => {
			const received = {}
			class SpyTransition extends Transition {
				onLeave({ from, trigger, done }) {
					received.from = from
					received.trigger = trigger
					done()
				}
			}
			const from = document.createElement('article')
			const t = new SpyTransition({ wrapper: makeWrapper() })
			await t.leave({ from, trigger: 'popstate' })
			expect(received.from).toBe(from)
			expect(received.trigger).toBe('popstate')
		})
	})

	describe('enter()', () => {
		it('resolves immediately using the done callback (default onEnter)', async () => {
			const t = new Transition({ wrapper: makeWrapper() })
			const to = document.createElement('article')
			await expect(t.enter({ to, trigger: false })).resolves.toBeUndefined()
		})

		// Bug fix #17 — Promise return support
		it('resolves when a subclass returns a Promise instead of calling done()', async () => {
			class PromiseTransition extends Transition {
				onEnter() {
					return new Promise(resolve => setTimeout(resolve, 10))
				}
			}
			const t = new PromiseTransition({ wrapper: makeWrapper() })
			await expect(t.enter({ to: document.createElement('div'), trigger: false })).resolves.toBeUndefined()
		})

		it('does not double-resolve when both done() and a Promise are used', async () => {
			const resolveSpy = vi.fn()
			class BothTransition extends Transition {
				onEnter({ done }) {
					done()
					return Promise.resolve()
				}
			}
			const t = new BothTransition({ wrapper: makeWrapper() })
			// Should still resolve cleanly (second settle is a no-op)
			await expect(t.enter({ to: document.createElement('div'), trigger: false })).resolves.toBeUndefined()
		})
	})
})
