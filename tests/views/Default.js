import { View } from '../../src/taxi'

export default class DefaultView extends View {
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
