/**
 * @module Taxi/View
 */
export default class View {
	/**
	 * @param {HTMLElement|Element} content
	 * @param {Document|Node} page
	 * @param {string} title
	 * @param {Element} wrapper
	 */
	constructor({ content, page, title, wrapper }) {
		this.content = content
		this.page = page
		this.title = title
		this.wrapper = wrapper
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
		this.wrapper.insertAdjacentHTML('beforeend', this.content.outerHTML)
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
	 * @return {Promise<null>}
	 */
	leave(transition, trigger) {
		return new Promise((resolve) => {
			this.onLeave()

			transition.leave({ trigger, from: this.content })
				.then(() => {
					this.remove()
					this.onLeaveCompleted()
					resolve()
				})
		})
	}
}
