import View from "./View";

type route = {
    path: string,
    view: View
}

export default class Router {
    static routes: route[] = [];

    static async router() {

        let route = Router.routes.find(r => r.path === location.pathname);

        if (!route) {
            route = { path: "/404", view: new View("<h1>OOPS - NOT FOUND 404</h1>", "NOT FOUND") };
        }

        // new View("<h1>LOADING...</h1>", "loading").view();
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