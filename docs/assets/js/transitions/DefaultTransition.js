import { Transition } from '../../../../src/taxi'
import gsap from 'gsap'

export default class DefaultTransition extends Transition {
    onLeave({ from, trigger, done }) {
        const overlay = document.querySelector('.js-overlay')

        gsap.timeline()
            .to(this.wrapper, { opacity: 0 }, 0)
            .to(overlay, { width: '100%', ease: 'power3.in'}, 0)
            .then(() => {
                done()
            })
    }

    onEnter({ to, trigger, done }) {
        const overlay = document.querySelector('.js-overlay')
        const tail = document.querySelector('.js-overlay-tail')
        const tailWidth = tail.getBoundingClientRect().width

        gsap.timeline()
            .to(overlay, { x: '100%', ease: 'power3.out', duration: 1 }, 0)
            .to(tail, { x: 0, width: 0, ease: 'power3.out', duration: 1.3 }, 0)
            .to(this.wrapper, { opacity: 1 }, 0)
            .then(() => {
                gsap.set(tail, {width: tailWidth, x: -tailWidth})
                gsap.set(overlay, {width: 0, x: 0})
                done()
            })
    }
}
