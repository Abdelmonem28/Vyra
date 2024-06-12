import Router from './lib/Router';
document.addEventListener('DOMContentLoaded', async () => {
    await Router.router();
});
window.addEventListener('popstate', async () => {
    await Router.router();
});

export { default } from './lib/View';