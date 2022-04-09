import { Transition } from '../../src/taxi'
import gsap from 'gsap'

export default class DefaultTransition extends Transition {
    onLeave({ from, trigger, done }) {
        console.log('default transition leave')

        gsap.to(this.wrapper, { opacity: 0 })
            .then(() => {
                done()
            })
    }

    onEnter({ to, trigger, done }) {
        console.log('default transition enter')

        gsap.to(this.wrapper, { opacity: 1 })
            .then(() => {
                done()
            })
    }
}
