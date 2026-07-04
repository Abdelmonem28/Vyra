import Router from './Core/router';
document.addEventListener('DOMContentLoaded', async () => {
    await Router.router();
});
window.addEventListener('popstate', async () => {
    await Router.router();
});

export { default as Component } from './Core/component';
export { default as Router }    from './Core/router';
export { createState }          from './Core/state';