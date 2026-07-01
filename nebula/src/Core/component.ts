import Router from "./router";
import JSCompiler from "../Compiler";
import { data, interaction } from "../types";


export default class Component {
    // Raw component/template content.
    private component: string;
    // Optional document title when this view is rendered.
    private title?: string;
    // Unique class used to scope styles to this view.
    private unique: string;
    // Internal config container (styles + interactions).
    private componetData: data = { interactions: [] };
    // Main app mount element.
    private root: HTMLElement | null = document.getElementById("Zweb-App");
    // Per-instance loading view.
    private loading: Component | null = null;
    // Global fallback loading view.
    static loading: Component | null = null;
    // Reserved global error view.
    static error: Component | null = null;
    // Dynamic values passed to the compiler.
    public data: { [key: string]: any } = {};

    constructor(component: string, title?: string, data?: { [key: string]: any }) {
        this.component = component;
        this.title = title;
        this.unique = `Template-${Math.random().toString(36).substring(2, 9)}`;
        this.data = data || {};
    }

    // Renders the template to an HTML string without touching the DOM.
    public compile(context: { [key: string]: any } = {}): string {
        return JSCompiler(this.component, { ...context, ...this.data });
    }

    public async view() {
        // Compile the component string into HTML, then take the first body child.
        const wrapper = document.createElement('div');
        wrapper.innerHTML = this.compile();
        const view = wrapper.firstElementChild as HTMLElement;
        if (!view) throw new Error('Component template must have a single root element');

        // Tag root with a unique class for scoped styling.
        view.classList.add(this.unique);

        // Apply configured styles and interactions.
        if (this.componetData) {
            if (this.componetData.styles)
                this.setStyleP(this.componetData.styles, view);

            if (this.componetData.stylesPath)
                await this.applyExternalStyles(this.componetData.stylesPath, view);

            if (this.componetData.interactions)
                this.setInteractionP(this.componetData.interactions, view);
        }

        // Update page title if provided.
        if (this.title)
            document.title = this.title;

        if (this.root) {
            // Replace current content with the rendered view.
            this.root.innerText = '';
            this.root.append(view);
        } else {
            throw new Error("there is no root id: Zweb-App");
        }
    }

    // Sets inline style rules to be scoped to this view.
    public setStyle(styles: string) {
        this.componetData.styles = styles;
    }

    // Injects inline styles as a <style> tag inside the rendered view.
    private setStyleP(styles: string, view: HTMLElement): void {
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `.${this.unique} {${styles}}`;
        view.prepend(styleElement);
    }

    // Sets external stylesheet URL to load during render.
    public setStyleSheet(url: string): void {
        this.componetData.stylesPath = url;
    }

    // Fetches stylesheet text and injects it scoped to this view class.
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

    // Queues a DOM event binding for an element id inside this view.
    public setInteraction(id: string, eventType: string, handler: () => any) {
        const interaction: interaction = { id, event: eventType, handler }
        this.componetData.interactions?.push(interaction);
    }

    // Attaches all queued interactions to matching elements in the rendered view.
    private setInteractionP(interactions: interaction[], view: HTMLElement) {
        for (let i = 0; i < interactions.length; i++) {
            const interaction = interactions[i];
            const element = view.querySelector(`#${interaction.id}`);
            if (element)
                element.addEventListener(interaction.event, interaction.handler);
            else
                throw new Error(`Element with id "${interaction.id}" not found in the view for interaction binding.`);
        }
    }

    // Registers a trigger element that navigates to a path when activated.
    public setTrigger(trigger: HTMLElement | null, typeOfAction: string, path: string, root?: HTMLElement): void {
        this.root = root || this.root;
        Router.routes.push({ path, view: this });
        if (trigger)
            trigger.addEventListener(typeOfAction, async (e) => {
                if (path !== location.pathname) {
                    e.preventDefault();
                    // Show loading view while navigation is in progress.
                    if (this.loading)
                        this.loading.view();
                    else if (Component.loading)
                        Component.loading.view();
                    await Router.navigateTo(path);
                }
            });
        else
            console.error("the trigger is null");
    }

    // Sets loading view for only this instance.
    public setLoading(view: Component): void {
        this.loading = view;
    }

    // Sets a global loading view fallback.
    static setLoading(view: Component): void {
        Component.loading = view;
    }
}
