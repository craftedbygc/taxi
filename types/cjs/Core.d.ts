import Transition from './Transition.js';
import Renderer from './Renderer.js';
import RouteStore from './RouteStore.js';
export type CacheEntry = {
    renderer: Renderer;
    page: Document | Node;
    scripts: HTMLScriptElement[];
    styles: Array<HTMLLinkElement | HTMLStyleElement>;
    finalUrl: string;
    skipCache: boolean;
    title: string;
    content: HTMLElement | Element;
};
export type TaxiEvent = 'NAVIGATE_OUT' | 'NAVIGATE_IN' | 'NAVIGATE_END';
export type NavigationEventPayload = {
    from: CacheEntry;
    /**
     * For NAVIGATE_OUT, a stub with null values (except finalUrl) if the page isn't cached yet
     */
    to: CacheEntry;
    trigger: string | HTMLElement | false;
};
/**
 * @typedef CacheEntry
 * @type {object}
 * @property {Renderer} renderer
 * @property {Document|Node} page
 * @property {HTMLScriptElement[]} scripts
 * @property {Array<HTMLLinkElement|HTMLStyleElement>} styles
 * @property {string} finalUrl
 * @property {boolean} skipCache
 * @property {string} title
 * @property {HTMLElement|Element} content
 */
/**
 * @typedef {'NAVIGATE_OUT'|'NAVIGATE_IN'|'NAVIGATE_END'} TaxiEvent
 */
/**
 * @typedef NavigationEventPayload
 * @type {object}
 * @property {CacheEntry} from
 * @property {CacheEntry} to For NAVIGATE_OUT, a stub with null values (except finalUrl) if the page isn't cached yet
 * @property {string|HTMLElement|false} trigger
 */
export default class Core {
    #private;
    renderers: Record<string, typeof Renderer>;
    transitions: Record<string, typeof Transition>;
    defaultRenderer: typeof Renderer;
    defaultTransition: typeof Transition;
    wrapper: Element;
    reloadJsFilter: boolean | ((element: HTMLElement) => boolean);
    reloadCssFilter: boolean | ((element: HTMLLinkElement | HTMLStyleElement) => boolean);
    removeOldContent: boolean;
    allowInterruption: boolean;
    bypassCache: boolean;
    enablePrefetch: "hover" | "visible" | false;
    enableViewTransitions: boolean;
    enableAccessibility: boolean;
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
     * 		enableAccessibility?: boolean,
     * 		maxCacheSize?: number,
     * 		fetchOptions?: RequestInit,
     * 		renderers?: Object.<string, typeof Renderer>,
     * 		transitions?: Object.<string, typeof Transition>,
     * 		reloadJsFilter?: boolean|((element: HTMLElement) => boolean),
     * 		reloadCssFilter?: boolean|((element: HTMLLinkElement|HTMLStyleElement) => boolean),
     * }} parameters
     */
    constructor(parameters?: {
        links?: string;
        removeOldContent?: boolean;
        allowInterruption?: boolean;
        bypassCache?: boolean;
        enablePrefetch?: false | 'hover' | 'visible';
        enableViewTransitions?: boolean;
        enableAccessibility?: boolean;
        maxCacheSize?: number;
        fetchOptions?: RequestInit;
        renderers?: Record<string, typeof Renderer>;
        transitions?: Record<string, typeof Transition>;
        reloadJsFilter?: boolean | ((element: HTMLElement) => boolean);
        reloadCssFilter?: boolean | ((element: HTMLLinkElement | HTMLStyleElement) => boolean);
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
     * Removes all event listeners and observers added by Taxi.
     * The current page is left as-is.
     */
    destroy(): void;
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
     * @return {Promise<void>}
     */
    navigateTo(url: string, transition?: string | false, trigger?: string | false | HTMLElement): Promise<void>;
    /**
     * Add an event listener.
     * @param {TaxiEvent} event
     * @param {(payload: NavigationEventPayload) => void} callback
     */
    on(event: TaxiEvent, callback: (payload: NavigationEventPayload) => void): void;
    /**
     * Remove an event listener.
     * @param {TaxiEvent} event
     * @param {(payload: NavigationEventPayload) => void} [callback]
     */
    off(event: TaxiEvent, callback?: (payload: NavigationEventPayload) => void): void;
}
