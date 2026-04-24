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
     * 		enablePrefetch?: false | 'hover' | 'visible',
     * 		maxCacheSize?: number,
     * 		fetchOptions?: RequestInit,
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
        enablePrefetch?: false | 'hover' | 'visible';
        maxCacheSize?: number;
        fetchOptions?: RequestInit;
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
    /** @type {CacheEntry|null} */
    currentCacheEntry: CacheEntry;
    /** @type {Map<string, CacheEntry>} */
    cache: Map<string, CacheEntry>;
    renderers: { [x: string]: typeof Renderer };
    transitions: { [x: string]: typeof Transition };
    defaultRenderer: typeof Renderer;
    defaultTransition: typeof Transition;
    wrapper: Element;
    reloadJsFilter: boolean | ((element: HTMLElement) => boolean);
    reloadCssFilter: boolean | ((arg0: HTMLLinkElement) => boolean);
    removeOldContent: boolean;
    allowInterruption: boolean;
    bypassCache: boolean;
    enablePrefetch: false | 'hover' | 'visible';
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

    /** @param {string} renderer */
    setDefaultRenderer(renderer: string): void;

    /** @param {string} transition */
    setDefaultTransition(transition: string): void;

    /**
     * Registers a route into the RouteStore.
     */
    addRoute(fromPattern: string, toPattern: string, transition: string): void;
    router: RouteStore;

    /**
     * Prime the cache for a given URL.
     * Rejects if the server returns a non-2xx response or the page has no [data-taxi-view].
     */
    preload(url: string, preloadAssets?: boolean): Promise<CacheEntry>;

    /**
     * Updates the HTML cache for a given URL.
     * If no URL is passed, cache for the current page is updated.
     */
    updateCache(url?: string): void;

    /**
     * Clears the cache for a given URL.
     * If no URL is passed, cache for the current page is cleared.
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
     * Perform a programmatic navigation to the provided URL.
     */
    navigateTo(url: string, transition?: string | false, trigger?: string | false | HTMLElement): Promise<void | Error>;
    targetLocation: {
        raw: string;
        href: string;
        host: string;
        search: string;
        hasHash: boolean;
        pathname: string;
    };
    popTarget: string;

    /** Add an event listener. */
    on(event: string, callback: any): void;

    /** Remove an event listener. */
    off(event: string, callback?: any): void;
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
