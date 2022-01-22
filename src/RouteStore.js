export default class RouteStore {
	/**
	 * @type {Map<string, Map<string, string>>}
	 */
	data = new Map()

	/**
	 * @type {Map<string, RegExp>}
	 */
	regexCache = new Map()

	/**
	 *
	 * @param {string} fromPattern
	 * @param {string} toPattern
	 * @param {string} transition
	 */
	add(fromPattern, toPattern, transition) {
		if (!this.data.has(fromPattern)) {
			this.data.set(fromPattern, new Map())
			this.regexCache.set(fromPattern, new RegExp(`^${fromPattern}$`))
		}

		this.data.get(fromPattern).set(toPattern, transition)
		this.regexCache.set(toPattern, new RegExp(`^${toPattern}$`))
	}

	/**
	 *
	 * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} currentUrl
	 * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} nextUrl
	 * @return {string|null}
	 */
	findMatch(currentUrl, nextUrl) {
		// Loop through all from patterns
		for (const [fromPattern, potentialMatches] of this.data) {
			// If we have a match
			if (currentUrl.pathname.match(this.regexCache.get(fromPattern))) {
				// loop through all associated to patterns
				for (const [toPattern, transition] of potentialMatches) {
					// If we find a match, return it
					if (nextUrl.pathname.match(this.regexCache.get(toPattern))) {
						return transition
					}
				}

				break
			}
		}

		return null
	}
}
