export default class Transition {
    constructor({ wrapper }: {
        wrapper: any;
    });
    wrapper: any;
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
     *
     * @param {HTMLElement} from The previous page's content
     * @param {string|HTMLElement|false} trigger The navigation trigger
     * @param {function} done
     */
    onLeave({ from, trigger, done }: HTMLElement): void;
    /**
     * Handle the transition entering the next page.
     *
     * @param {HTMLElement} to The next page's content
     * @param {string|HTMLElement|false} trigger The navigation trigger
     * @param {function} done
     */
    onEnter({ to, trigger, done }: HTMLElement): void;
}
