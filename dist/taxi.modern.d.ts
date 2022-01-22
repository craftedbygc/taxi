declare namespace o {
    export const __proto__: any;
    export { default as default };
}
declare class c {
    constructor({ wrapper: t }: {
        wrapper: any;
    });
    wrapper: any;
    leave(t: any): Promise<any>;
    enter(t: any): Promise<any>;
    onLeave({ done: t }: {
        done: any;
    }): void;
    onEnter({ done: t }: {
        done: any;
    }): void;
}
declare class s {
    constructor({ content: t, page: e, title: n, wrapper: r }: {
        content: any;
        page: any;
        title: any;
        wrapper: any;
    });
    content: any;
    page: any;
    title: any;
    wrapper: any;
    onEnter(): void;
    onEnterCompleted(): void;
    onLeave(): void;
    onLeaveCompleted(): void;
    initialLoad(): void;
    update(): void;
    remove(): void;
    enter(t: any, e: any): Promise<any>;
    leave(t: any, e: any): Promise<any>;
}
declare class _default {
    constructor(t?: {});
    isTransitioning: boolean;
    currentView: any;
    cache: Map<any, any>;
    onClick: (t: any) => any;
    currentLocation: {
        hasHash: boolean;
        pathname: string;
        raw: any;
        href: any;
    };
    onPopstate: () => boolean;
    views: any;
    transitions: any;
    defaultView: any;
    defaultTransition: any;
    wrapper: Element;
    reloadJsFilter: any;
    setDefaultView(t: any): void;
    setDefaultTransition(t: any): void;
    addRoute(t: any, e: any, n: any): void;
    router: a;
    preload(t: any): {
        isTransitioning: boolean;
        currentView: any;
        cache: Map<any, any>;
        onClick: (t: any) => any;
        currentLocation: {
            hasHash: boolean;
            pathname: string;
            raw: any;
            href: any;
        };
        onPopstate: () => boolean;
        views: any;
        transitions: any;
        defaultView: any;
        defaultTransition: any;
        wrapper: Element;
        reloadJsFilter: any;
        setDefaultView(t: any): void;
        setDefaultTransition(t: any): void;
        addRoute(t: any, e: any, n: any): void;
        router: a;
        preload(t: any): any;
        navigate(t: any, e?: boolean, r?: boolean): Promise<any>;
        targetLocation: {
            hasHash: boolean;
            pathname: string;
            raw: any;
            href: any;
        };
        beforeFetch(e: any, n: any, r: any): Promise<any>;
        afterFetch(e: any, n: any, r: any, i: any): Promise<any>;
        loadScripts(t: any): void;
        attachEvents(e: any): void;
        fetch(t: any): Promise<any>;
        chooseTransition(t: any): any;
        createCacheEntry(t: any): {
            page: any;
            content: any;
            scripts: any[];
            title: any;
            view: any;
        };
    };
    navigate(t: any, e?: boolean, r?: boolean): Promise<any>;
    targetLocation: {
        hasHash: boolean;
        pathname: string;
        raw: any;
        href: any;
    };
    beforeFetch(e: any, n: any, r: any): Promise<any>;
    afterFetch(e: any, n: any, r: any, i: any): Promise<any>;
    loadScripts(t: any): void;
    attachEvents(e: any): void;
    fetch(t: any): Promise<any>;
    chooseTransition(t: any): any;
    createCacheEntry(t: any): {
        page: any;
        content: any;
        scripts: any[];
        title: any;
        view: any;
    };
}
declare class a {
    data: Map<any, any>;
    regexCache: Map<any, any>;
    add(t: any, e: any, n: any): void;
    findMatch(t: any, e: any): any;
}
export { o as Taxi, c as Transition, s as View };
