import { Transition } from '../../../../src/taxi'
import gsap from 'gsap'

export default class DefaultTransition extends Transition {
	onLeave({ from, trigger, done }) {
		const overlay = document.querySelector('.js-overlay')

		gsap.timeline()
			.to(this.wrapper, { opacity: 0 }, 0)
			.to(overlay, { width: '100%', ease: 'power3.in', duration: .8 }, 0)
			.then(() => {
				done()
			})
	}

	onEnter({ to, trigger, done }) {
		const overlay = document.querySelector('.js-overlay')
		const tail = document.querySelector('.js-overlay-tail')

		gsap.timeline()
			.set(tail, {width: '100%'})
			.to(overlay, { x: '100%', ease: 'power3.out', duration: .85 }, 0)
			.to(tail, { x: '100%',  ease: 'power3.out', duration: .85 }, .15)
			.to(this.wrapper, { opacity: 1 }, .3)
			.then(() => {
				gsap.set(tail, { width: 0, x: 0 })
				gsap.set(overlay, { width: 0, x: 0 })
				done()
			})
	}
}
