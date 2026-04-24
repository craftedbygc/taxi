export default class Renderer {
    /**
     * @param {{content: HTMLElement|Element, page: Document|Node, title: string, wrapper: Element}} props
     */
    constructor({ content, page, title, wrapper }: {
        content: HTMLElement | Element;
        page: Document | Node;
        title: string;
        wrapper: Element;
    });
    _contentString: string;
    _DOM: HTMLDivElement;
    page: Node | Document;
    title: string;
    wrapper: Element;
    content: Element;
    /** The element or string that triggered the current navigation, or `false` for programmatic. Set to `'initialLoad'` during the first visit. */
    trigger: string | HTMLElement | false;

    /** Called when the new page has entered the DOM. */
    onEnter(): void;
    /** Called when the enter transition has fully completed. */
    onEnterCompleted(): void;
    /** Called when the current page begins to leave. */
    onLeave(): void;
    /** Called when the leave transition has fully completed. */
    onLeaveCompleted(): void;

    initialLoad(): void;
    update(): void;
    createDom(): void;
    remove(): void;

    /**
     * Called when transitioning into the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<null>}
     */
    enter(transition: Transition, trigger: string | HTMLElement | false): Promise<null>;

    /**
     * Called when transitioning away from the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @param {boolean} removeOldContent
     * @return {Promise<null>}
     */
    leave(transition: Transition, trigger: string | HTMLElement | false, removeOldContent: boolean): Promise<null>;
}
import Transition from "./Transition";
