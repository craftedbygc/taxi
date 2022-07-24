import { Renderer } from '../../../../src/taxi'
import Prism from 'prismjs';

export default class DefaultRenderer extends Renderer {
	onEnter() {
		Prism.manual = true;
		Prism.highlightAll()
	}

	onEnterCompleted() {
	}

	onLeave() {
	}

	onLeaveCompleted() {
	}
}
