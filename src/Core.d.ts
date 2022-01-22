/**
 * @typedef CacheEntry
 * @type {object}
 * @property {View} view
 * @property {Document|Node} page
 * @property {array} scripts
 * @property {string} title
 * @property {HTMLElement|Element} content
 */
export default class Core {
    /**
     * @param {string} [parameters.links] Selector to select elements attach highway link events to
     * @param {Object.<string, View>} [parameters.views] All Views for the application
     * @param {Object.<string, Transition>} [parameters.transitions] All Transitions for the application
     * @param {function(node: HTMLElement)} [parameters.reloadJsFilter]
     */
    constructor(parameters?: {});
    isTransitioning: boolean;
    /**
     * @type {CacheEntry|null}
     */
    currentView: CacheEntry | null;
    /**
     * @type {Map<string, CacheEntry>}
     */
    cache: Map<string, CacheEntry>;
    views: any;
    transitions: any;
    defaultView: any;
    defaultTransition: any;
    wrapper: Element;
    reloadJsFilter: any;
    currentLocation: {
        raw: string;
        href: string;
        hasHash: boolean;
        pathname: string;
    };
    /**
     * @param {string} view
     */
    setDefaultView(view: string): void;
    /**
     * @param {string} transition
     */
    setDefaultTransition(transition: string): void;
    addRoute(fromPattern: any, toPattern: any, transition: any): void;
    router: RouteStore;
    /**
     * Prime the cache for a given URL
     *
     * @param {string} url
     * @return {Core}
     */
    preload(url: string): Core;
    /**
     * @param {string} url
     * @param {string|false} [transition]
     * @param {string|false|HTMLElement} [trigger]
     * @return {Promise<void|Error>}
     */
    navigate(url: string, transition?: string | false, trigger?: string | false | HTMLElement): Promise<void | Error>;
    targetLocation: {
        raw: string;
        href: string;
        hasHash: boolean;
        pathname: string;
    };
    /**
     * Add an event listener.
     * @param {string} event
     * @param {any} callback
     */
    on(event: string, callback: any): void;
    /**
     * Remove an event listener.
     * @param {string} event
     * @param {any} callback
     */
    off(event: string, callback: any): void;
    /**
     * @private
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
     * @param {Transition} TransitionClass
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<void>}
     */
    private beforeFetch;
    /**
     * @private
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} url
     * @param {Transition} TransitionClass
     * @param {CacheEntry} entry
     * @param {string|HTMLElement|false} trigger
     * @return {Promise<void>}
     */
    private afterFetch;
    /**
     * Load up scripts from the target page if needed
     *
     * @param {HTMLElement[]} cachedScripts
     */
    loadScripts(cachedScripts: HTMLElement[]): void;
    /**
     * @private
     * @param {string} links
     */
    private attachEvents;
    /**
     * @private
     * @param {MouseEvent} e
     */
    private onClick;
    /**
     * @private
     * @return {boolean}
     */
    private onPopstate;
    /**
     * @private
     * @param {string} url
     * @return {Promise<Document>}
     */
    private fetch;
    /**
     * @private
     * @param {string|false} transition
     * @return {Transition|function}
     */
    private chooseTransition;
    /**
     * @private
     * @param {Document|Node} page
     * @return {CacheEntry}
     */
    private createCacheEntry;
}
export type CacheEntry = {
    view: View;
    page: Document | Node;
    scripts: any[];
    title: string;
    content: HTMLElement | Element;
};
import RouteStore from "./RouteStore";
import { View } from "./taxi";
