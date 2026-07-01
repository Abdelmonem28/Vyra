import Component from '@nebula/component';

export const HeaderHero = new Component(`
  <header class="hero">
    <div class="hero-copy">
      <p class="eyebrow">Nebula example</p>
      <h1>A todo list that stays reactive without losing polish.</h1>
      <p class="muted hero-text">
        Built with Nebula's component rendering and state subscription flow.
        Add items, edit them inline, filter them, clear the finished work, and
        keep the data on refresh.
      </p>
    </div>

    <button type="button" class="theme-toggle" data-action="toggle-theme">
      <span class="theme-toggle__label">Theme</span>
      <strong>{{state.themeLabel}}</strong>
    </button>
  </header>
`);