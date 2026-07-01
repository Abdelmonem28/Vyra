import Component from '@nebula/component';

export const MissionsView = new Component(`
  <section class="control-room__main">
    {{> StatusBanner}}
    {{> MissionComposer}}
    {{> MissionBoard}}
  </section>
`);