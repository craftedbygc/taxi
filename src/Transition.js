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
			this.onLeave({ ...props, done: resolve })
		})
	}

	/**
	 * @param {{ to: HTMLElement|Element, trigger: string|HTMLElement|false }} props
	 * @return {Promise<void>}
	 */
	enter(props) {
		return new Promise((resolve) => {
			this.onEnter({ ...props, done: resolve })
		})
	}

	/**
	 * Handle the transition leaving the previous page.
	 * @param {{from: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
	 */
	onLeave({ from, trigger, done }) {
		done()
	}

	/**
	 * Handle the transition entering the next page.
	 * @param {{to: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
	 */
	onEnter({ to, trigger, done }) {
		done()
	}
}
