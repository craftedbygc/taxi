import { View } from '../../src'

export default class DefaultView extends View {
	onEnter() {
		console.log('view on enter', this.page)
	}

	onEnterCompleted() {
		console.log('view on enter completed')
	}

	onLeave() {
		console.log('view on leave')
	}

	onLeaveCompleted() {
		console.log('view on leave completed')
	}
}

// todo promisify?
