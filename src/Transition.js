export default class Transition {
	constructor({ wrapper }) {
		this.wrapper = wrapper
	}

	/**
	 * @param {{ from: HTMLElement, trigger: string|HTMLElement|false }} props
	 * @return {Promise<void>}
	 */
	leave(props) {
		return new Promise((resolve) => {
			this.onLeave({ ...props, done: resolve })
		})
	}

	/**
	 * @param {{ to: HTMLElement, trigger: string|HTMLElement|false }} props
	 * @return {Promise<void>}
	 */
	enter(props) {
		return new Promise((resolve) => {
			this.onEnter({ ...props, done: resolve })
		})
	}

	/**
	 * Handle the transition leaving the previous page.
	 *
	 * @param {HTMLElement} from The previous page's content
	 * @param {string|HTMLElement|false} trigger The navigation trigger
	 * @param {function} done
	 */
	onLeave({ from, trigger, done }) {
		done()
	}

	/**
	 * Handle the transition entering the next page.
	 *
	 * @param {HTMLElement} to The next page's content
	 * @param {string|HTMLElement|false} trigger The navigation trigger
	 * @param {function} done
	 */
	onEnter({ to, trigger, done }) {
		done()
	}
}
