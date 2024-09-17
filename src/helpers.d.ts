/**
 * Parse a HTML string into a proper Document.
 *
 * @param {string|Document} html
 * @return {Document|*}
 */
export function parseDom(html: string | Document): Document | any;
/**
 * Extract details from a given URL string. Assumed to be on the current TLD.
 *
 * @param {string} url
 * @return {{raw: string, href: string, host: string, search: string, hasHash: boolean, pathname: string}}
 */
export function processUrl(url: string): {
    raw: string;
    href: string;
    host: string;
    search: string;
    hasHash: boolean;
    pathname: string;
};
/**
 * Reloads a provided script/stylesheet by replacing with itself.
 *
 * @param {HTMLElement|HTMLScriptElement|HTMLStyleElement} node
 * @param {string} elementType - 'SCRIPT' or 'STYLE'
 */
export function reloadElement(node: HTMLElement | HTMLScriptElement | HTMLStyleElement, elementType: string): void;
/**
 * Loads a provided script/stylesheet by appending a clone to the current document.
 *
 * @param {HTMLElement|HTMLStyleElement} node
 * @param {string} elementType - 'SCRIPT' or 'STYLE'
 */
export function appendElement(node: HTMLElement | HTMLStyleElement, elementType: string): void;
/**
 * Creates a clone of a given HTMLElement or HTMLStyleElement
 *
 * @param {HTMLElement|HTMLStyleElement} node
 * @param {string} elementType - 'SCRIPT' or 'STYLE'
 * @return {HTMLElement|HTMLStyleElement}
 */
export function duplicateElement(node: HTMLElement | HTMLStyleElement, elementType: string): HTMLElement | HTMLStyleElement;
