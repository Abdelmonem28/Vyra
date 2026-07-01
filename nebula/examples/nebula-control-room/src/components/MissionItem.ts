import Component from '@nebula/component';

export const MissionItem = new Component(`
  <article class="mission-row {{#if this.completed}}is-complete{{/if}}">
    {{#if this.isEditing}}
      {{> MissionEditForm}}
    {{else}}
      {{> MissionReadonly}}
    {{/if}}
  </article>
`);