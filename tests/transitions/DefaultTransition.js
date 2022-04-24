import { Transition } from '../../src/taxi'
import gsap from 'gsap'

export default class DefaultTransition extends Transition {
    onLeave({ from, trigger, done }) {
        console.log('default transition leave')

        const overlay = document.querySelector('.js-overlay')

        gsap.timeline()
            .to(this.wrapper, { opacity: 0 }, 0)
            .to(overlay, { width: '100%', ease: 'power2.inOut' }, 0)
            .then(() => {
                done()
            })
    }

    onEnter({ to, trigger, done }) {
        console.log('default transition enter')

        const overlay = document.querySelector('.js-overlay')

        gsap.timeline()
            .to(overlay, { x: '100%', ease: 'power2.inOut' }, 0)
            .to(this.wrapper, { opacity: 1 }, 0)
            .then(() => {

                gsap.set(overlay, {width: 0, x: 0})
                done()
            })
    }
}
