import Component from '@vyra/component';

export const SettingsView = new Component(`
  <section class="control-room__main">
    {{> StatusBanner}}

    <section class="settings-panel">
      <div class="settings-panel__header">
        <div>
          <p class="section__eyebrow">Runtime Controls</p>
          <h3>Demo State Toolkit</h3>
        </div>
      </div>

      <div class="settings-panel__cards">
        <article class="settings-panel__card">
          <h4>Theme</h4>
          <p>Toggle visual mode to verify reactive styling updates.</p>
          <div class="settings-panel__card-actions">
            <button type="button" class="secondary-button" data-action="theme-toggle">Toggle theme</button>
          </div>
        </article>

        <article class="settings-panel__card">
          <h4>Mission Seeds</h4>
          <p>Inject baseline missions to test list rendering quickly.</p>
          <div class="settings-panel__card-actions">
            <button type="button" class="secondary-button" data-action="seed-demo">Seed demo missions</button>
          </div>
        </article>

        <article class="settings-panel__card">
          <h4>Reset State</h4>
          <p>Clear local edits and restore the initial control room setup.</p>
          <div class="settings-panel__card-actions">
            <button type="button" class="secondary-button" data-action="reset-room">Reset room</button>
          </div>
        </article>
      </div>

      <div>
        <p class="section__eyebrow">What This Example Tests</p>
        <ul class="settings-panel__list">
          <li>Nested component includes using the compiler \`{{> ...}}\` feature.</li>
          <li>State-driven rerenders with controlled inputs and textareas.</li>
          <li>Conditional and iterative template blocks for dynamic lists.</li>
          <li>Router path transitions and loading view usage.</li>
          <li>Multiple interaction types: click, input, change, submit.</li>
        </ul>
      </div>
    </section>
  </section>
`);