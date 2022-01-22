export default class RouteStore {
    /**
     * @type {Map<string, Map<string, string>>}
     */
    data: Map<string, Map<string, string>>;
    /**
     * @type {Map<string, RegExp>}
     */
    regexCache: Map<string, RegExp>;
    /**
     *
     * @param {string} fromPattern
     * @param {string} toPattern
     * @param {string} transition
     */
    add(fromPattern: string, toPattern: string, transition: string): void;
    /**
     *
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} currentUrl
     * @param {{ raw: string, href: string, hasHash: boolean, pathname: string }} nextUrl
     * @return {string|null}
     */
    findMatch(currentUrl: {
        raw: string;
        href: string;
        hasHash: boolean;
        pathname: string;
    }, nextUrl: {
        raw: string;
        href: string;
        hasHash: boolean;
        pathname: string;
    }): string | null;
}
