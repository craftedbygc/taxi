export default class Transition {
    /**
     * @param {{wrapper: HTMLElement}} props
     */
    constructor({ wrapper }: {
        wrapper: HTMLElement;
    });
    wrapper: HTMLElement;
    /**
     * @param {{ from: HTMLElement|Element, trigger: string|HTMLElement|false }} props
     * @return {Promise<void>}
     */
    leave(props: {
        from: HTMLElement | Element;
        trigger: string | HTMLElement | false;
    }): Promise<void>;
    /**
     * @param {{ to: HTMLElement|Element, trigger: string|HTMLElement|false }} props
     * @return {Promise<void>}
     */
    enter(props: {
        to: HTMLElement | Element;
        trigger: string | HTMLElement | false;
    }): Promise<void>;
    /**
     * Handle the transition leaving the previous page.
     * @param {{from: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
     */
    onLeave({ from, trigger, done }: {
        from: HTMLElement | Element;
        trigger: string | HTMLElement | false;
        done: Function;
    }): void;
    /**
     * Handle the transition entering the next page.
     * @param {{to: HTMLElement|Element, trigger: string|HTMLElement|false, done: function}} props
     */
    onEnter({ to, trigger, done }: {
        to: HTMLElement | Element;
        trigger: string | HTMLElement | false;
        done: Function;
    }): void;
}
