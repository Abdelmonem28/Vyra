import Component from '@vyra/component';

export const DashboardView = new Component(`
  <section class="control-room__main">
    {{> StatusBanner}}
    {{> MetricsGrid}}
    {{> MissionComposer}}
    {{> MissionBoard}}
  </section>
`);