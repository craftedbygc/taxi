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
		return this.#run((p) => this.onLeave(p), props, 'onLeave')
	}

	/**
	 * @param {{ to: HTMLElement|Element, trigger: string|HTMLElement|false }} props
	 * @return {Promise<void>}
	 */
	enter(props) {
		return this.#run((p) => this.onEnter(p), props, 'onEnter')
	}

	/**
	 * Runs a hook, resolving when it calls done() or its returned Promise settles.
	 * A hook that throws or rejects is logged and treated as finished, so a broken
	 * animation can never leave the navigation hanging.
	 *
	 * @param {function(object): any} hook
	 * @param {object} props
	 * @param {string} name
	 * @return {Promise<void>}
	 */
	#run(hook, props, name) {
		return new Promise((resolve) => {
			const fail = (err) => {
				console.error(`Taxi: Transition ${name}() failed, continuing the navigation.`, err)
				resolve()
			}

			try {
				const result = hook({ ...props, done: resolve })

				if (result && typeof result.then === 'function') {
					result.then(() => resolve(), fail)
				}
			} catch (err) {
				fail(err)
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
