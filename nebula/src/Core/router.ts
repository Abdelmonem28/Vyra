import View from "./component";

type route = {
    path: string,
    view: View
}

export default class Router {
    static routes: route[] = [];
    static currentComponent: View | null = null;

    static async router() {
        if (Router.currentComponent) {
            Router.currentComponent.dispose(); // clean up before switching
        }

        let route = Router.routes.find(r => r.path === location.pathname);

        if (!route) {
            route = { path: "/404", view: new View("<h1>OOPS - NOT FOUND 404</h1>", "NOT FOUND") };
        }

        Router.currentComponent = route.view;
        await route.view.view();

    }

    static async navigateTo(path: string) {
        try {
            history.pushState(null, '', path);
            await Router.router();
        } catch (ex) {
            console.log(ex);
        }
    }
}