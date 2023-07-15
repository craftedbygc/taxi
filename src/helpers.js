const parser = new DOMParser()

/**
 * Parse a HTML string into a proper Document.
 * @param {string|Document} html
 * @return {Document|*}
 */
export function parseDom(html) {
	return typeof html === 'string' ? parser.parseFromString(html, 'text/html') : html
}

/**
 * Extract details from a given URL string. Assumed to be on the current TLD.
 * @param {string} url
 * @return {{raw: string, href: string, host: string, hasHash: boolean, pathname: string}}
 */
export function processUrl(url) {
	const details = new URL(url, window.location.origin)
	let normalized = null

	if (details.hash.length) {
		normalized = url.replace(details.hash, '')
	}

	return {
		hasHash: details.hash.length > 0,
		pathname: details.pathname,
		host: details.host,
		raw: url,
		href: normalized || details.href
	}
}

/**
 * Reloads a provided script/stylesheet by replacing with itself.
 * @param {HTMLElement|HTMLScriptElement} node
 */
export function reloadScript(node) {
	node.parentNode.replaceChild(duplicateScript(node), node)
}

/**
 * Loads a provided script/stylesheet by appending a clone to the current document.
 * @param {HTMLElement} node
 */
export function appendScript(node) {
	if (node.parentNode.tagName === 'HEAD') {
		document.head.appendChild(duplicateScript(node))
	} else {
		document.body.appendChild(duplicateScript(node))
	}
}

/**
 * Creates a clone of a given HTMLElement
 * @param {HTMLElement} node
 * @return {HTMLElement}
 */
export function duplicateScript(node) {
	const replacement = document.createElement('SCRIPT')

	// Loop Over Attributes
	for (let k = 0; k < node.attributes.length; k++) {
		// Get Attribute
		const attr = node.attributes[k]

		// Set Attribute
		replacement.setAttribute(attr.nodeName, attr.nodeValue)
	}

	// Inline Script
	if (node.innerHTML) {
		replacement.innerHTML = node.innerHTML
	}

	return replacement
}
