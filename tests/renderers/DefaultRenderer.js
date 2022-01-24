import { Renderer } from '../../src/taxi'

export default class DefaultRenderer extends Renderer {
	onEnter() {
		console.log('view on enter', this.content)
	}

	onEnterCompleted() {
		console.log('view on enter completed', this.content)
	}

	onLeave() {
		console.log('view on leave', this.content)
	}

	onLeaveCompleted() {
		console.log('view on leave completed', this.content)
	}
}

// todo promisify?
