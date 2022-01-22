/**
 * @module Taxi/View
 */
export default class View {
    /**
     * @param {HTMLElement|Element} content
     * @param {Document|Node} page
     * @param {string} title
     * @param {Element} wrapper
     */
    constructor({ content, page, title, wrapper }: HTMLElement | Element);
    content: any;
    page: any;
    title: any;
    wrapper: any;
    onEnter(): void;
    onEnterCompleted(): void;
    onLeave(): void;
    onLeaveCompleted(): void;
    initialLoad(): void;
    update(): void;
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
     * @return {Promise<null>}
     */
    leave(transition: Transition, trigger: string | HTMLElement | false): Promise<null>;
}
