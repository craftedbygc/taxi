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
		},
	})

	// update cache testing
	E.delegate('click', '#add-content', () => {
		const target = document.getElementById('extra-content')
		let p = document.createElement("p")
		p.append('some text')
		target.append(p)
	})

	E.delegate('click', '#update-cache', () => {
		taxi.updateCache()
	})

	E.delegate('click', '#clear-cache', () => {
		taxi.clearCache()
	})
})
