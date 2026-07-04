import Component from '@vyra/component';

export const MissionsView = new Component(`
  <section class="control-room__main">
    {{> StatusBanner}}
    {{> MissionComposer}}
    {{> MissionBoard}}
  </section>
`);