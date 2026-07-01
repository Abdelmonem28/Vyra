import Router from './Core/router';
document.addEventListener('DOMContentLoaded', async () => {
    await Router.router();
});
window.addEventListener('popstate', async () => {
    await Router.router();
});

export { default } from './Core/component';