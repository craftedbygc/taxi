import { Core, Renderer, Transition } from '../../../src/taxi'

/**
 * A Renderer that just logs each lifecycle hook as it happens.
 * These hooks fire regardless of enableViewTransitions, but note that
 * onEnterCompleted (unlike onEnter) only fires once the browser's View
 * Transition animation has actually finished playing - so watch the gap
 * between the "onEnter" and "onEnterCompleted" logs below.
 */
class LoggingRenderer extends Renderer {
	initialLoad() {
		super.initialLoad()
	}

	onEnter() {
		console.log(`[taxi] Renderer.onEnter — entering "${this.title}"`)
	}

	onEnterCompleted() {
		console.log(`[taxi] Renderer.onEnterCompleted — "${this.title}" animation finished playing, now fully visible/interactive`)
	}

	onLeave() {
		console.log(`[taxi] Renderer.onLeave — leaving "${this.title}"`)
	}

	onLeaveCompleted() {
		console.log(`[taxi] Renderer.onLeaveCompleted — old content for "${this.title}" removed`)
	}
}

/**
 * Registered as the "default" transition. Taxi only ever runs a custom
 * Transition class when the View Transitions API is unavailable/disabled -
 * when it IS available, Taxi bypasses this in favour of
 * document.startViewTransition(). So if this logs, it's proof the browser
 * doesn't support the View Transitions API and Taxi has fallen back.
 */
class FallbackTransition extends Transition {
	onLeave({ from, trigger, done }) {
		console.log('[taxi] FallbackTransition.onLeave — View Transitions API unsupported, using JS fallback')
		done()
	}

	onEnter({ to, trigger, done }) {
		console.log('[taxi] FallbackTransition.onEnter — View Transitions API unsupported, using JS fallback')
		done()
	}
}

const taxi = new Core({
	enableViewTransitions: true,
	renderers: {
		default: LoggingRenderer
	},
	transitions: {
		default: FallbackTransition
	}
})

if (!('startViewTransition' in document)) {
	console.log('[taxi] This browser does not support the View Transitions API — FallbackTransition will be used for every navigation.')
}

taxi.on('NAVIGATE_OUT', ({ from, trigger }) => {
	console.log(`[taxi] event: NAVIGATE_OUT — leaving "${from.title}"`)
})

taxi.on('NAVIGATE_IN', ({ to, trigger }) => {
	console.log(`[taxi] event: NAVIGATE_IN — new content for "${to.title}" added to the DOM`)
})

taxi.on('NAVIGATE_END', ({ from, to, trigger }) => {
	console.log(`[taxi] event: NAVIGATE_END — navigation from "${from.title}" to "${to.title}" complete`)
})
