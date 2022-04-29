/**
 * @typedef CacheEntry
 * @type {object}
 * @property {Renderer} renderer
 * @property {Document|Node} page
 * @property {array} scripts
 * @property {string} title
 * @property {HTMLElement|Element} content
 */
export default class Core {
    /**
     * @param {{
     * 		links?: string,
     * 		removeOldContent?: boolean,
     * 		renderers?: Object.<string, Renderer>,
     * 		transitions?: Object.<string, Transition>,
     * 		reloadJsFilter?: boolean|function(HTMLElement): boolean
     * }} parameters
     */
    constructor(parameters?: {
        links?: string;
        removeOldContent?: boolean;
        renderers?: {
            [x: string]: Renderer;
        };
        transitions?: {
            [x: string]: Transition;
        };
        reloadJsFilter?: boolean | ((arg0: HTMLElement) => boolean);
    });
    isTransitioning: boolean;
    /**
     * @type {CacheEntry|null}
     */
    currentCacheEntry: CacheEntry | null;
    /**
     * @type {Map<string, CacheEntry>}
     */
    cache: Map<string, CacheEntry>;
    renderers: {
        [x: string]: Renderer;
    } | {
        default: typeof Renderer;
    };
    transitions: {
        [x: string]: Transition;
    } | {
        default: typeof Transition;
    };
    defaultRenderer: Renderer | typeof Renderer;
    defaultTransition: Transition | typeof Transition;
    wrapper: Element;
    reloadJsFilter: boolean | ((element: HTMLElement) => boolean);
    removeOldContent: boolean;
    currentLocation: {
        raw: string;
        href: string;
        host: string;
        hasHash: boolean;
        pathname: string;
    };
    /**
     * @param {string} renderer
     */
    setDefaultRenderer(renderer: string): void;
    /**
     * @param {string} transition
     */
    setDefaultTransition(transition: string): void;
    /**
     * Registers a route into the RouteStore
     *
     * @param {string} fromPattern
     * @param {string} toPattern
     * @param {string} transition
     */
    addRoute(fromPattern: string, toPattern: string, transition: string): void;
    router: RouteStore;
    /**
     * Prime the cache for a given URL
     *
     * @param {string} url
     * @return {Promise}
     */
    preload(url: string): Promise<any>;
    /**
     * Updates the HTML cache for the current URL
     * Useful when adding/removing content via AJAX such as a search page or infinite loader
     */
    updateCache(): void;
    /**
     * Clears the cache for a given URL.
     * If no URL is passed, then cache for the current page is cleared.
     *
     * @param {string} [url]
     */
    clearCache(url?: string): void;
    /**
     * @param {string} url
     * @param {string|false} [transition]
     * @param {string|false|HTMLElement} [trigger]
     * @return {Promise<void|Error>}
     */
    navigateTo(url: string, transition?: string | false, trigger?: string | false | HTMLElement): Promise<void | Error>;
    targetLocation: {
        raw: string;
        href: string;
        host: string;
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
     * @param {any} [callback]
     */
    off(event: string, callback?: any): void;
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
     * @param {{ raw: string, href: string, host: string, hasHash: boolean, pathname: string }} url
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
    renderer: Renderer;
    page: Document | Node;
    scripts: any[];
    title: string;
    content: HTMLElement | Element;
};
import Renderer from "./Renderer";
import Transition from "./Transition";
import RouteStore from "./RouteStore";
