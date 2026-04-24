export default class Transition {
	/**
	 * @param {{wrapper: HTMLElement}} props
	 */
	constructor({ wrapper }) {
		this.wrapper = wrapper
	}

	/**
	 * @param {{ from: HTMLElement|Element, trigger: string|HTMLElement|false }} props
	 * @return {Promise<void>}
	 */
	leave(props) {
		return new Promise((resolve) => {
			const result = this.onLeave({ ...props, done: resolve })
			if (result && typeof result.then === 'function') {
				result.then(resolve)
			}
		})
	}

	/**
	 * @param {{ to: HTMLElement|Element, trigger: string|HTMLElement|false }} props
	 * @return {Promise<void>}
	 */
	enter(props) {
		return new Promise((resolve) => {
			const result = this.onEnter({ ...props, done: resolve })
			if (result && typeof result.then === 'function') {
				result.then(resolve)
			}
		})
	}

	/**
	 * Handle the transition leaving the previous page.
	 * Call done() or return a Promise when the animation is complete.
	 * @param {{from: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
	 */
	onLeave({ from, trigger, done }) {
		done()
	}

	/**
	 * Handle the transition entering the next page.
	 * Call done() or return a Promise when the animation is complete.
	 * @param {{to: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
	 */
	onEnter({ to, trigger, done }) {
		done()
	}
}
