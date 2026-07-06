import Transition from "./Transition"

export default class Renderer {
	/**
	 * @param {{content: HTMLElement|Element, page: Document|Node, title: string, wrapper: Element}} props
	 */
	constructor({ content, page, title, wrapper }) {
		this._contentString = content.outerHTML
		this._DOM = null
		this.page = page
		this.title = title
		this.wrapper = wrapper
		this.content = this.wrapper.querySelector('[data-taxi-view]') || this.wrapper.lastElementChild || content
	}

	onEnter() {

	}

	onEnterCompleted() {

	}

	onLeave() {

	}

	onLeaveCompleted() {

	}

	initialLoad() {
		this.onEnter()
		this.onEnterCompleted()
	}

	update() {
		document.title = this.title

		const activeView = this.wrapper.querySelector('[data-taxi-view]')
		const newContent = this._DOM.firstElementChild

		if (activeView) {
			activeView.parentNode.insertBefore(newContent, activeView.nextSibling)
		} else {
			const parent = this.wrapper._lastParentNode || this.wrapper
			const sibling = this.wrapper._lastNextSibling
			const nextSibling = (sibling && sibling.parentNode === parent) ? sibling : null

			parent.insertBefore(newContent, nextSibling)
		}

		this.content = newContent
		this._DOM = null
	}

	createDom() {
		if (!this._DOM) {
			this._DOM = document.createElement('div')
			this._DOM.innerHTML = this._contentString
		}
	}

	remove() {
		if (this.content) {
			this.content.remove()
		}
	}

	/**
	 * Called when transitioning into the current page.
	 * @param {Transition} transition
	 * @param {string|HTMLElement|false} trigger
	 * @return {Promise<null>}
	 */
	enter(transition, trigger) {
		return new Promise((resolve) => {
			this.onEnter()

			transition.enter({ trigger, to: this.content })
				.then(() => {
					this.onEnterCompleted()
					resolve()
				})
		})
	}

	/**
	 * Called when transitioning away from the current page.
	 * @param {Transition} transition
	 * @param {string|HTMLElement|false} trigger
	 * @param {boolean} removeOldContent
	 * @return {Promise<null>}
	 */
	leave(transition, trigger, removeOldContent) {
		return new Promise((resolve) => {
			this.onLeave()

			if (this.content) {
				this.wrapper._lastParentNode = this.content.parentNode
				this.wrapper._lastNextSibling = this.content.nextSibling
			}

			transition.leave({ trigger, from: this.content })
				.then(() => {
					if (removeOldContent) {
						this.remove()
					}

					this.onLeaveCompleted()
					resolve()
				})
		})
	}
}
