import { Transition } from '../../src/taxi'

export default class DefaultTransition extends Transition {
	onLeave({ from, trigger, done }) {
		console.log('default transition leave')

		done()
	}

	onEnter({ to, trigger, done }) {
		console.log('default transition enter')

		done()
	}
}
