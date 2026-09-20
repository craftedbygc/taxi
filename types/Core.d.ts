import Transition from './Transition';
import Renderer from './Renderer';
import RouteStore from './RouteStore';
export type CacheEntry = {
    renderer: typeof Renderer | Renderer;
    page: Document | Node;
    scripts: array;
    styles: HTMLLinkElement[];
    finalUrl: string;
    skipCache: boolean;
    title: string;
    content: HTMLElement | Element;
};
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
    #private;
    renderers: Record<string, typeof Renderer>;
    transitions: Record<string, typeof Transition>;
    defaultRenderer: typeof Renderer;
    defaultTransition: typeof Transition;
    wrapper: Element | null;
    reloadJsFilter: boolean | Function;
    reloadCssFilter: boolean | Function;
    removeOldContent: boolean;
    allowInterruption: boolean;
    bypassCache: boolean;
    enablePrefetch: "hover" | "visible" | false;
    enableViewTransitions: boolean;
    maxCacheSize: number;
    fetchOptions: RequestInit;
    isPopping: boolean;
    currentLocation: {
        raw: string;
        href: string;
        host: string;
        search: string;
        hasHash: boolean;
        pathname: string;
    };
    router: RouteStore | undefined;
    targetLocation: {
        raw: string;
        href: string;
        host: string;
        search: string;
        hasHash: boolean;
        pathname: string;
    } | undefined;
    popTarget: string | undefined;
    isTransitioning: boolean;
    /** @type {Map<string, CacheEntry>} */
    cache: Map<string, CacheEntry>;
    get currentCacheEntry(): CacheEntry | null;
    /**
     * @param {{
     * 		links?: string,
     * 		removeOldContent?: boolean,
     * 		allowInterruption?: boolean,
     * 		bypassCache?: boolean,
     * 		enablePrefetch?: false|'hover'|'visible',
     * 		enableViewTransitions?: boolean,
     * 		maxCacheSize?: number,
     * 		fetchOptions?: RequestInit,
     * 		renderers?: Object.<string, typeof Renderer>,
     * 		transitions?: Object.<string, typeof Transition>,
     * 		reloadJsFilter?: boolean|function(HTMLElement): boolean,
     * 		reloadCssFilter?: boolean|function(HTMLLinkElement): boolean,
     * }} parameters
     */
    constructor(parameters?: {
        links?: string;
        removeOldContent?: boolean;
        allowInterruption?: boolean;
        bypassCache?: boolean;
        enablePrefetch?: false | 'hover' | 'visible';
        enableViewTransitions?: boolean;
        maxCacheSize?: number;
        fetchOptions?: RequestInit;
        renderers?: Record<string, typeof Renderer>;
        transitions?: Record<string, typeof Transition>;
        reloadJsFilter?: boolean | Function;
        (HTMLElement: any): boolean;
        reloadCssFilter?: boolean | Function;
        (HTMLLinkElement: any): boolean;
    });
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
    /**
     * Prime the cache for a given URL.
     *
     * Rejects if the server returns a non-2xx response (after redirects) or if the
     * fetched page contains no [data-taxi-view] element, so callers can distinguish
     * a successful preload from a missing/broken page.
     *
     * @param {string} url
     * @param {boolean} [preloadAssets]
     * @return {Promise<CacheEntry>}
     */
    preload(url: string, preloadAssets?: boolean): Promise<CacheEntry>;
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
     * Navigate back in browser history, respecting the isTransitioning guard.
     */
    navigateBack(): void;
    /**
     * Navigate forward in browser history, respecting the isTransitioning guard.
     */
    navigateForward(): void;
    /**
     * @param {string} url
     * @param {string|false} [transition]
     * @param {string|false|HTMLElement} [trigger]
     * @return {Promise<void|Error>}
     */
    navigateTo(url: string, transition?: string | false, trigger?: string | false | HTMLElement): Promise<void | Error>;
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
}
