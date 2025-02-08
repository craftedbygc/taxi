const parser = new DOMParser()

/**
 * Parse a HTML string into a proper Document.
 *
 * @param {string|Document} html
 * @return {Document|*}
 */
export function parseDom(html) {
	return typeof html === 'string' ? parser.parseFromString(html, 'text/html') : html
}

/**
 * Extract details from a given URL string. Assumed to be on the current TLD.
 *
 * @param {string} url
 * @return {{raw: string, href: string, host: string, search: string, hasHash: boolean, pathname: string}}
 */
export function processUrl(url) {
	const details = new URL(url, window.location.origin)
	const normalized = details.hash.length ? url.replace(details.hash, '') : null

	return {
		hasHash: details.hash.length > 0,
		pathname: details.pathname.replace(/\/+$/, ''),
		host: details.host,
		search: details.search,
		raw: url,
		href: normalized || details.href
	}
}

/**
 * Reloads a provided script/stylesheet by replacing with itself.
 *
 * @param {HTMLElement|HTMLScriptElement|HTMLStyleElement} node
 * @param {string} elementType - 'SCRIPT' or 'STYLE'
 */
export function reloadElement(node, elementType) {
	node.parentNode.replaceChild(duplicateElement(node, elementType), node)
}

/**
 * Loads a provided script/stylesheet by appending a clone to the current document.
 *
 * @param {HTMLElement|HTMLStyleElement} node
 * @param {string} elementType - 'SCRIPT' or 'STYLE'
 */
export function appendElement(node, elementType) {
	const target = node.parentNode.tagName === 'HEAD' ? document.head : document.body
	target.appendChild(duplicateElement(node, elementType))
}

/**
 * Creates a clone of a given HTMLElement or HTMLStyleElement
 *
 * @param {HTMLElement|HTMLStyleElement} node
 * @param {string} elementType - 'SCRIPT' or 'STYLE'
 * @return {HTMLElement|HTMLStyleElement}
 */
export function duplicateElement(node, elementType) {
	const replacement = document.createElement(elementType)

	for (let k = 0; k < node.attributes.length; k++) {
		const attr = node.attributes[k]
		replacement.setAttribute(attr.nodeName, attr.nodeValue)
	}

	// Inline Script or Style
	if (node.innerHTML) {
		replacement.innerHTML = node.innerHTML
	}

	return replacement
}
