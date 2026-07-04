import Component from '@vyra/component';

export const TaskList = new Component(`
  <section class="panel task-panel">
    <div class="panel-header">
      <div>
        <p class="section-label">Tasks</p>
        <h2>Move the work forward</h2>
      </div>

      {{> FilterBar}}
    </div>

    {{#if state.hasTodos}}
      {{#if state.hasVisibleTodos}}
        <ul class="todo-list">
          {{#each state.filteredTodos}}
            <li class="todo-item">
              {{> TodoItem}}
            </li>
          {{/each}}
        </ul>
      {{else}}
        <div class="empty-state">
          <h3>No tasks in this filter</h3>
          <p>Change the filter or add a new task to keep the board moving.</p>
        </div>
      {{/if}}
    {{else}}
      <div class="empty-state">
        <h3>Your board is empty</h3>
        <p>Add your first task and start building momentum.</p>
      </div>
    {{/if}}
  </section>
`);