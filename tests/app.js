import E from '@unseenco/e'
import { Core } from '../src/taxi'
import DefaultRenderer from "./renderers/DefaultRenderer"
import DefaultTransition from "./transitions/DefaultTransition"
import OverrideTransition from "./transitions/OverrideTransition"

E.on('DOMContentLoaded', window, function() {

	const taxi = new Core({
		links: 'a:not([target]):not([href^=\\#]):not([download]):not([data-router-disabled]):not(.sf-dump-toggle):not(#wpadminbar a)',
		renderers: {
			default: DefaultRenderer
		},
		transitions: {
			default: DefaultTransition,
			override: OverrideTransition
		}
	})

})
