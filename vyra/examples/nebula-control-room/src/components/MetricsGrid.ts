import Component from '@vyra/component';

export const MetricsGrid = new Component(`
  <section class="metrics-grid">
    <article class="metric-card">
      <p class="section__eyebrow">Tracked Missions</p>
      <div class="metric-card__value">{{state.metrics.total}}</div>
      <p class="metric-card__note">{{state.missionCountLabel}}</p>
    </article>

    <article class="metric-card">
      <p class="section__eyebrow">Active</p>
      <div class="metric-card__value">{{state.metrics.active}}</div>
      <p class="metric-card__note">Tasks currently in progress</p>
    </article>

    <article class="metric-card">
      <p class="section__eyebrow">Completed</p>
      <div class="metric-card__value">{{state.metrics.completed}}</div>
      <p class="metric-card__note">Missions closed successfully</p>
    </article>

    <article class="metric-card">
      <p class="section__eyebrow">High Priority Open</p>
      <div class="metric-card__value">{{state.metrics.highPriorityOpen}}</div>
      <p class="metric-card__note">Escalations awaiting review</p>
    </article>
  </section>
`);