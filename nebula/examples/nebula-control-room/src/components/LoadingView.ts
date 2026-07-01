import Component from '@nebula/component';

export const LoadingView = new Component(`
  <section class="loading-view page-shell">
    <div>
      <div class="loading-view__spinner"></div>
      <h2>Switching control room view...</h2>
      <p class="hero__copy">Nebula router is preparing the selected route.</p>
    </div>
  </section>
`);