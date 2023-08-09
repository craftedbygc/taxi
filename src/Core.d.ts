/**
 * @typedef CacheEntry
 * @type {object}
 * @property {typeof Renderer|Renderer} renderer
 * @property {Document|Node} page
 * @property {array} scripts
 * @property {HTMLLinkElement[]} styles
 * @property {string} finalUrl
 * @property {boolean} skipCache
 * @property {string} title
 * @property {HTMLElement|Element} content
 */
export default class Core {
    /**
     * @param {{
     * 		links?: string,
     * 		removeOldContent?: boolean,
     * 		allowInterruption?: boolean,
     * 		bypassCache?: boolean,
     * 		enablePrefetch?: boolean,
     * 		renderers?: Object.<string, typeof Renderer>,
     * 		transitions?: Object.<string, typeof Transition>,
     * 		reloadJsFilter?: boolean|function(HTMLElement): boolean,
     * 		reloadCssFilter?: boolean|function(HTMLLinkElement): boolean
     * }} parameters
     */
    constructor(parameters?: {
        links?: string;
        removeOldContent?: boolean;
        allowInterruption?: boolean;
        bypassCache?: boolean;
        enablePrefetch?: boolean;
        renderers?: {
            [x: string]: typeof Renderer;
        };
        transitions?: {
            [x: string]: typeof Transition;
        };
        reloadJsFilter?: boolean | ((arg0: HTMLElement) => boolean);
        reloadCssFilter?: boolean | ((arg0: HTMLLinkElement) => boolean);
    });
    isTransitioning: boolean;
    /**
     * @type {CacheEntry|null}
     */
    currentCacheEntry: CacheEntry;
    /**
     * @type {Map<string, CacheEntry>}
     */
    cache: Map<string, CacheEntry>;
    /**
     * @private
     * @type {Map<string, Promise>}
     */
    private activePromises;
    renderers: {
        [x: string]: typeof Renderer;
    };
    transitions: {
        [x: string]: typeof Transition;
    };
    defaultRenderer: typeof Renderer;
    defaultTransition: typeof Transition;
    wrapper: Element;
    reloadJsFilter: boolean | ((element: HTMLElement) => boolean);
    reloadCssFilter: boolean | ((arg0: HTMLLinkElement) => boolean) | ((element: HTMLLinkElement) => true);
    removeOldContent: boolean;
    allowInterruption: boolean;
    bypassCache: boolean;
    enablePrefetch: boolean;
    isPopping: boolean;
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
     * @param {boolean} [preloadAssets]
     * @return {Promise}
     */
    preload(url: string, preloadAssets?: boolean): Promise<any>;
    /**
     * Updates the HTML cache for a given URL.
     * If no URL is passed, then cache for the current page is updated.
     * Useful when adding/removing content via AJAX such as a search page or infinite loader.
     *
     * @param {string} [url]
     */
    updateCache(url?: string): void;
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
    popTarget: string;
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
     * Load up styles from the target page if needed
     *
     * @param {HTMLLinkElement[]} cachedStyles
     */
    loadStyles(cachedStyles: HTMLLinkElement[]): void;
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
     * @return {void|boolean}
     */
    private onPopstate;
    /**
     * @private
     * @param {MouseEvent} e
     */
    private onPrefetch;
    /**
     * @private
     * @param {string} url
     * @param {boolean} [runFallback]
     * @return {Promise<{html: Document, url: string}>}
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
     * @param {string} url
     * @return {CacheEntry}
     */
    private createCacheEntry;
}
export type CacheEntry = {
    renderer: typeof Renderer | Renderer;
    page: Document | Node;
    scripts: any[];
    styles: HTMLLinkElement[];
    finalUrl: string;
    skipCache: boolean;
    title: string;
    content: HTMLElement | Element;
};
import Renderer from "./Renderer";
import Transition from "./Transition";
import RouteStore from "./RouteStore";
