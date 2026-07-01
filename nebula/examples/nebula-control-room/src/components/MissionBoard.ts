import Component from '@nebula/component';

export const MissionBoard = new Component(`
  <section class="board">
    <div class="board__header">
      <div>
        <p class="section__eyebrow">Mission Board</p>
        <h3>Mission Queue</h3>
      </div>

      {{> MissionFilters}}
    </div>

    <div class="board__controls">
      <button type="button" class="secondary-button" data-action="toggle-all">{{state.toggleAllLabel}}</button>
      {{#if state.canClearCompleted}}
        <button type="button" class="secondary-button" data-action="clear-completed">Clear completed</button>
      {{/if}}
    </div>

    {{#if state.hasMissions}}
      {{#if state.hasFilteredMissions}}
        <div class="mission-list">
          {{#each state.filteredMissions}}
            {{> MissionItem}}
          {{/each}}
        </div>
      {{else}}
        <div class="empty-state">
          <h3>No missions match this filter</h3>
          <p>Try another filter or add a new mission.</p>
        </div>
      {{/if}}
    {{else}}
      <div class="empty-state">
        <h3>No missions yet</h3>
        <p>Create a mission to start the control cycle.</p>
      </div>
    {{/if}}
  </section>
`);