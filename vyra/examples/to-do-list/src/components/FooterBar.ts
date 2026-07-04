import Component from '@vyra/component';

export const FooterBar = new Component(`
  <footer class="footer-bar">
    <p><strong>{{state.remainingCount}}</strong> tasks left</p>
    <p class="muted">Filter: {{state.filter}}</p>
  </footer>
`);