/**
 * @module Taxi/View
 */
export default class View {
    /**
     * @param {{content: HTMLElement|Element, page: Document|Node, title: string, wrapper: Element}} props
     */
    constructor({ content, page, title, wrapper }: {
        content: HTMLElement | Element;
        page: Document | Node;
        title: string;
        wrapper: Element;
    });
    content: Element | HTMLElement;
    page: Node | Document;
    title: string;
    wrapper: Element;
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
import Transition from "./Transition";