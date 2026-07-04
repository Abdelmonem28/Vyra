import Component from '@vyra/component';

export const MissionFilters = new Component(`
  <div class="filters">
    <button type="button" class="pill {{#if state.filterAllActive}}is-active{{/if}}" data-filter="all">All</button>
    <button type="button" class="pill {{#if state.filterActiveActive}}is-active{{/if}}" data-filter="active">Active</button>
    <button type="button" class="pill {{#if state.filterCompletedActive}}is-active{{/if}}" data-filter="completed">Completed</button>
    <button type="button" class="pill {{#if state.filterHighActive}}is-active{{/if}}" data-filter="high">High priority</button>
  </div>
`);