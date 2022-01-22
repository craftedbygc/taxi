export default class Transition {
    /**
     * @param {{wrapper: HTMLElement}} props
     */
    constructor({ wrapper }: {
        wrapper: HTMLElement;
    });
    wrapper: HTMLElement;
    /**
     * @param {{ from: HTMLElement, trigger: string|HTMLElement|false }} props
     * @return {Promise<void>}
     */
    leave(props: {
        from: HTMLElement;
        trigger: string | HTMLElement | false;
    }): Promise<void>;
    /**
     * @param {{ to: HTMLElement, trigger: string|HTMLElement|false }} props
     * @return {Promise<void>}
     */
    enter(props: {
        to: HTMLElement;
        trigger: string | HTMLElement | false;
    }): Promise<void>;
    /**
     * Handle the transition leaving the previous page.
     * @param {{from: HTMLElement, trigger: string|HTMLElement|false, done: function}} props
     */
    onLeave({ from, trigger, done }: {
        from: HTMLElement;
        trigger: string | HTMLElement | false;
        done: Function;
    }): void;
    /**
     * Handle the transition entering the next page.
     * @param {{to: HTMLElement, trigger: string|HTMLElement|false, done: function}} props
     */
    onEnter({ to, trigger, done }: {
        to: HTMLElement;
        trigger: string | HTMLElement | false;
        done: Function;
    }): void;
}
