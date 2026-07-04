import Component from '@vyra/component';

export const StatsCard = new Component(`
  <aside class="stats-card">
    <div>
      <p class="section-label">Overview</p>
      <h2>{{state.totalCount}} tasks tracked</h2>
      <p class="muted">{{state.remainingCount}} active and {{state.completedCount}} complete.</p>
    </div>
    <div class="stats-grid">
      <div>
        <strong>{{state.remainingCount}}</strong>
        <span>Open</span>
      </div>
      <div>
        <strong>{{state.completedCount}}</strong>
        <span>Done</span>
      </div>
      <div>
        <strong>{{state.totalCount}}</strong>
        <span>Total</span>
      </div>
    </div>
  </aside>
`);