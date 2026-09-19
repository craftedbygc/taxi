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
		/** @type {string|HTMLElement|false} */
		this.trigger = false
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
		this.trigger = 'initialLoad'
	}

	update() {
		if (!this._DOM) {
			throw new Error('Taxi Renderer: update() was called before createDom(). Ensure createDom() runs first.')
		}

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
		this.content.remove()
	}

	/**
	 * Called when transitioning into the current page.
	 * @param {Transition} transition
	 * @param {string|HTMLElement|false} trigger
	 * @param {Promise<void>|null} [extraWait] An additional promise (e.g. a View Transition's
	 * `finished` promise) that must also resolve before onEnterCompleted() fires.
	 * @return {Promise<null>}
	 */
	enter(transition, trigger, extraWait = null) {
		return new Promise((resolve) => {
			this.trigger = trigger
			this.onEnter()

			const transitionDone = transition.enter({ trigger, to: this.content })
			const done = extraWait ? Promise.all([transitionDone, extraWait]) : transitionDone

			done
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
			this.trigger = trigger
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
