import Component from '@vyra/component';

export const LoadingView = new Component(`
  <section class="loading-view page-shell">
    <div>
      <div class="loading-view__spinner"></div>
      <h2>Switching control room view...</h2>
      <p class="hero__copy">Vyra router is preparing the selected route.</p>
    </div>
  </section>
`);