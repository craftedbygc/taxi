import Prism from 'prismjs';
import E from '@unseenco/e'
import { Core } from '../../../src/taxi'
import DefaultRenderer from './renderers/DefaultRenderer'
import DefaultTransition from './transitions/DefaultTransition'

E.on('DOMContentLoaded', window, function() {
	const taxi = new Core({
		renderers: {
			default: DefaultRenderer
		},
		transitions: {
			default: DefaultTransition
		},
	})
})