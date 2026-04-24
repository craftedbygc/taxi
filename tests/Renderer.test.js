import { describe, it, expect, vi } from 'vitest'
import Renderer from '../src/Renderer.js'
import Transition from '../src/Transition.js'
import { createDOM } from './setup.js'

function makeRenderer(viewName = '', content = '<p>Content</p>') {
	createDOM(viewName, content)
	const wrapper = document.querySelector('[data-taxi]')
	const contentEl = wrapper.querySelector('[data-taxi-view]')
	const page = document.cloneNode(true)
	return new Renderer({ wrapper, content: contentEl, title: 'Test Page', page })
}

describe('Renderer', () => {
	describe('constructor', () => {
		it('stores wrapper, title, page, and content refs', () => {
			const r = makeRenderer()
			expect(r.wrapper).toBeTruthy()
			expect(r.title).toBe('Test Page')
			expect(r.content).toBe(r.wrapper.lastElementChild)
			expect(r._DOM).toBeNull()
		})
	})

	describe('initialLoad()', () => {
		it('does not automatically call onEnter or onEnterCompleted', () => {
			const r = makeRenderer()
			const onEnter = vi.spyOn(r, 'onEnter')
			const onEnterCompleted = vi.spyOn(r, 'onEnterCompleted')
			r.initialLoad()
			expect(onEnter).not.toHaveBeenCalled()
			expect(onEnterCompleted).not.toHaveBeenCalled()
		})
	})

	describe('createDom()', () => {
		it('creates a _DOM element from the stored content string', () => {
			const r = makeRenderer()
			r.createDom()
			expect(r._DOM).toBeInstanceOf(HTMLElement)
			expect(r._DOM.innerHTML).toContain('data-taxi-view')
		})

		it('does not recreate _DOM on subsequent calls', () => {
			const r = makeRenderer()
			r.createDom()
			const first = r._DOM
			r.createDom()
			expect(r._DOM).toBe(first)
		})
	})

	describe('update()', () => {
		it('throws if called before createDom()', () => {
			const r = makeRenderer()
			expect(() => r.update()).toThrow('createDom()')
		})

		it('updates document.title and appends content to wrapper', () => {
			createDOM()
			const wrapper = document.querySelector('[data-taxi]')
			const contentEl = wrapper.querySelector('[data-taxi-view]')
			const page = document.cloneNode(true)
			const r = new Renderer({ wrapper, content: contentEl, title: 'New Title', page })

			r.createDom()
			r.update()

			expect(document.title).toBe('New Title')
			expect(r.content).toBe(wrapper.lastElementChild)
			expect(r._DOM).toBeNull()
		})
	})

	describe('remove()', () => {
		// Bug fix #3 — remove() now targets this.content instead of firstElementChild
		it('removes this.content from the wrapper', () => {
			createDOM()
			const wrapper = document.querySelector('[data-taxi]')
			const contentEl = wrapper.querySelector('[data-taxi-view]')
			const page = document.cloneNode(true)
			const r = new Renderer({ wrapper, content: contentEl, title: 'Page', page })

			expect(wrapper.contains(contentEl)).toBe(true)
			r.remove()
			expect(wrapper.contains(contentEl)).toBe(false)
		})
	})

	describe('lifecycle trigger property', () => {
		it('sets this.trigger before calling onEnter and onEnterCompleted', async () => {
			const r = makeRenderer()
			const triggers = []
			r.onEnter = () => triggers.push({ method: 'onEnter', trigger: r.trigger })
			r.onEnterCompleted = () => triggers.push({ method: 'onEnterCompleted', trigger: r.trigger })

			r.createDom()
			r.update()

			const t = new Transition({ wrapper: r.wrapper })
			await r.enter(t, 'popstate')

			expect(triggers).toContainEqual({ method: 'onEnter', trigger: 'popstate' })
			expect(triggers).toContainEqual({ method: 'onEnterCompleted', trigger: 'popstate' })
		})

		it('sets this.trigger before calling onLeave and onLeaveCompleted', async () => {
			createDOM()
			const wrapper = document.querySelector('[data-taxi]')
			const contentEl = wrapper.querySelector('[data-taxi-view]')
			const page = document.cloneNode(true)
			const r = new Renderer({ wrapper, content: contentEl, title: 'Page', page })

			const triggers = []
			r.onLeave = () => triggers.push({ method: 'onLeave', trigger: r.trigger })
			r.onLeaveCompleted = () => triggers.push({ method: 'onLeaveCompleted', trigger: r.trigger })

			const t = new Transition({ wrapper })
			await r.leave(t, false, false)

			expect(triggers).toContainEqual({ method: 'onLeave', trigger: false })
			expect(triggers).toContainEqual({ method: 'onLeaveCompleted', trigger: false })
		})

		it('sets this.trigger to "initialLoad" during initialLoad()', () => {
			const r = makeRenderer()
			r.initialLoad()
			expect(r.trigger).toBe('initialLoad')
		})
	})

	describe('leave()', () => {
		it('calls remove() when removeOldContent is true', async () => {
			createDOM()
			const wrapper = document.querySelector('[data-taxi]')
			const contentEl = wrapper.querySelector('[data-taxi-view]')
			const page = document.cloneNode(true)
			const r = new Renderer({ wrapper, content: contentEl, title: 'Page', page })

			const removeSpy = vi.spyOn(r, 'remove')
			const t = new Transition({ wrapper })
			await r.leave(t, false, true)
			expect(removeSpy).toHaveBeenCalledOnce()
		})

		it('does NOT call remove() when removeOldContent is false', async () => {
			createDOM()
			const wrapper = document.querySelector('[data-taxi]')
			const contentEl = wrapper.querySelector('[data-taxi-view]')
			const page = document.cloneNode(true)
			const r = new Renderer({ wrapper, content: contentEl, title: 'Page', page })

			const removeSpy = vi.spyOn(r, 'remove')
			const t = new Transition({ wrapper })
			await r.leave(t, false, false)
			expect(removeSpy).not.toHaveBeenCalled()
		})
	})
})
