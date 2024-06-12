import Router from "./Router";
import JSCompiler from "./Compiler";

type interaction = {
    id: string,
    event: string,
    handler: () => any
}

type data = {
    styles?: string,
    stylesPath?: string,
    interactions?: interaction[];
}

export default class View {
    private component: string;
    private title?: string;
    private unique: string;
    private componetData: data = { interactions: [] };
    private root: HTMLElement | null = document.getElementById("Zweb-App");
    private loading: View | null = null;
    static loading: View | null = null;
    static error: View | null = null;
    public data: { [key: string]: any } = {};

    constructor(component: string, title?: string, data?: { [key: string]: any }) {
        this.component = component;
        this.title = title;
        this.unique = `Template-${Math.random().toString(36).substring(2, 9)}`;
        this.data = data || {};
    }

    public async view() {
        const view = new DOMParser().parseFromString(JSCompiler(this.component, this.data), "text/html").documentElement.children[1].children[0] as HTMLElement;
        view.classList.add(this.unique);

        if (this.componetData) {
            if (this.componetData.styles)
                this.setStyleP(this.componetData.styles, view);

            if (this.componetData.stylesPath)
                await this.applyExternalStyles(this.componetData.stylesPath, view);

            if (this.componetData.interactions)
                this.setInteractionP(this.componetData.interactions, view);
        }

        if (this.title)
            document.title = this.title;
        if (this.root) {
            this.root.innerText = '';
            this.root.append(view);
        } else {
            throw new Error("there is no root id: Zweb-App");
        }
    }

    public setStyle(styles: string) {
        this.componetData.styles = styles;
    }

    private setStyleP(styles: string, view: HTMLElement): void {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `.${this.unique} {${styles}}`;
        view.prepend(styleElement);
    }

    public setStyleSheet(url: string): void {
        this.componetData.stylesPath = url;
    }

    private async applyExternalStyles(url: string, view: HTMLElement) {
        try {
            const response = await fetch(url);
            const styles = await response.text();
            const styleElement = document.createElement('style');
            styleElement.textContent = `.${this.unique} {${styles}}`;
            view.appendChild(styleElement);
        } catch (error) {
            throw new Error(`Failed to load styles from ${url}: ${error}`);
        }
    }

    public setInteraction(id: string, eventType: string, handler: () => any) {
        const interaction: interaction = { id, event: eventType, handler }
        this.componetData.interactions?.push(interaction);
    }

    private setInteractionP(interactions: interaction[], view: HTMLElement) {
        for (let i = 0; i < interactions.length; i++) {
            const interaction = interactions[i];
            const element = view.querySelector(`#${interaction.id}`);
            if (element)
                element.addEventListener(interaction.event, interaction.handler);
        }
    }

    public setTrigger(trigger: HTMLElement | null, typeOfAction: string, path: string, root?: HTMLElement): void {
        this.root = root || this.root;
        Router.routes.push({ path, view: this });
        if (trigger)
            trigger.addEventListener(typeOfAction, async (e) => {
                if (path !== location.pathname) {
                    e.preventDefault();
                    if (this.loading)
                        this.loading.view();
                    else if (View.loading)
                        View.loading.view();
                    await Router.navigateTo(path);
                }
            });
        else
            console.error("the trigger is null");
    }

    public setLoading(view: View): void {
        this.loading = view;
    }

    static setLoading(view: View): void {
        View.loading = view;
    }
}
