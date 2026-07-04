import Component from '@vyra/component';

export const HeaderShell = new Component(`
  <section class="control-room__hero">
    <div class="hero">
      <div>
        <p class="hero__eyebrow">Vyra Example Lab</p>
        <h1>Vyra Control Room</h1>
        <p class="hero__copy">
          A route-driven example that stress tests state updates, nested includes,
          conditional blocks, list rendering, and event interactions.
        </p>
      </div>

      <div class="hero__actions">
        <button type="button" class="brand__toggle" data-action="theme-toggle">{{state.themeButtonLabel}}</button>
        <button type="button" class="brand__toggle" data-action="clock-now">Sync clock {{state.clockLabel}}</button>
      </div>
    </div>

    <nav class="nav-tabs" aria-label="Control room sections">
      <button type="button" class="pill {{#if state.activeNavDashboard}}is-active{{/if}}" data-nav="dashboard">Dashboard</button>
      <button type="button" class="pill {{#if state.activeNavMissions}}is-active{{/if}}" data-nav="missions">Missions</button>
      <button type="button" class="pill {{#if state.activeNavSettings}}is-active{{/if}}" data-nav="settings">Settings</button>
    </nav>
  </section>
`);