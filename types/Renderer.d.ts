export default class Renderer {
    _contentString: string;
    _DOM: HTMLDivElement | null;
    page: Document | Node;
    title: string;
    wrapper: Element;
    content: Element | null;
    /** @type {string|HTMLElement|false} */
    trigger: string | HTMLElement | false;
    /**
     * @param {{content: HTMLElement|Element, page: Document|Node, title: string, wrapper: Element}} props
     */
    constructor({ content, page, title, wrapper }: {
        content: HTMLElement | Element;
        page: Document | Node;
        title: string;
        wrapper: Element;
    });
    onEnter(): void;
    onEnterCompleted(): void;
    onLeave(): void;
    onLeaveCompleted(): void;
    initialLoad(): void;
    update(): void;
    createDom(): void;
    remove(): void;
    /**
     * Called when transitioning into the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @param {Promise<void>|null} [extraWait] An additional promise (e.g. a View Transition's
     * `finished` promise) that must also resolve before onEnterCompleted() fires.
     * @return {Promise<null>}
     */
    enter(transition: Transition, trigger: string | HTMLElement | false, extraWait?: Promise<void> | null): Promise<null>;
    /**
     * Called when transitioning away from the current page.
     * @param {Transition} transition
     * @param {string|HTMLElement|false} trigger
     * @param {boolean} removeOldContent
     * @return {Promise<null>}
     */
    leave(transition: Transition, trigger: string | HTMLElement | false, removeOldContent: boolean): Promise<null>;
}
