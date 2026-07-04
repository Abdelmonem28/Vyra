import Component from '@vyra/component';

export const FilterBar = new Component(`
  <div class="filter-bar" role="tablist" aria-label="Task filters">
    <button type="button" class="filter-chip {{#if state.filterAllActive}}is-active{{/if}}" data-action="set-filter" data-filter="all">All</button>
    <button type="button" class="filter-chip {{#if state.filterActiveActive}}is-active{{/if}}" data-action="set-filter" data-filter="active">Active</button>
    <button type="button" class="filter-chip {{#if state.filterCompletedActive}}is-active{{/if}}" data-action="set-filter" data-filter="completed">Completed</button>
  </div>
`);