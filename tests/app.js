import E from '@unseenco/e'
import { Core } from '../src/taxi'
import DefaultView from "./views/Default"
import DefaultTransition from "./transitions/DefaultTransition"
import OverrideTransition from "./transitions/OverrideTransition"

E.on('DOMContentLoaded', window, function() {

	const taxi = new Core({
		links: 'a:not([target]):not([href^=\\#]):not([download]):not([data-router-disabled]):not(.sf-dump-toggle):not(#wpadminbar a)',
		views: {
			default: DefaultView
		},
		transitions: {
			default: DefaultTransition,
			override: OverrideTransition
		}
	})
	console.log('yo')
})
