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
		this.content = this.wrapper.lastElementChild
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
		this.wrapper.appendChild(this._DOM.firstElementChild)
		this.content = this.wrapper.lastElementChild
		this._DOM = null
	}

	createDom() {
		if (!this._DOM) {
			this._DOM = document.createElement('div')
			this._DOM.innerHTML = this._contentString
		}
	}

	remove() {
		this.wrapper.firstElementChild.remove()
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
