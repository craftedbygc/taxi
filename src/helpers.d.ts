/**
 * Parse a HTML string into a proper Document.
 * @param {string|Document} html
 * @return {Document|*}
 */
export function parseDom(html: string | Document): Document | any;
/**
 * Extract details from a given URL string. Assumed to be on the current TLD.
 * @param {string} url
 * @return {{raw: string, href: string, host: string, hasHash: boolean, pathname: string}}
 */
export function processUrl(url: string): {
    raw: string;
    href: string;
    host: string;
    hasHash: boolean;
    pathname: string;
};
/**
 * Reloads a provided script/stylesheet by replacing with itself.
 * @param {HTMLElement|HTMLScriptElement} node
 */
export function reloadScript(node: HTMLElement | HTMLScriptElement): void;
/**
 * Loads a provided script/stylesheet by appending a clone to the current document.
 * @param {HTMLElement} node
 */
export function appendScript(node: HTMLElement): void;
/**
 * Creates a clone of a given HTMLElement
 * @param {HTMLElement} node
 * @return {HTMLElement}
 */
export function duplicateScript(node: HTMLElement): HTMLElement;
