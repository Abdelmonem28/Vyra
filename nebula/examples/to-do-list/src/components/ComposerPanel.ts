import Component from '@nebula/component';

export const ComposerPanel = new Component(`
  <section class="composer-card panel">
    <form class="composer" data-form="create">
      <label class="sr-only" for="todo-draft">New task</label>
      <input
        id="todo-draft"
        class="composer__input"
        data-field="draft"
        type="text"
        value="{{state.draft}}"
        placeholder="What do you want to finish next?"
        autocomplete="off"
      />
      <button type="submit" class="primary-button">Add task</button>
    </form>

    <div class="quick-actions">
      <button type="button" class="ghost-button" data-action="toggle-all">{{state.toggleAllLabel}}</button>
      {{#if state.canClearCompleted}}
        <button type="button" class="ghost-button" data-action="clear-completed">Clear completed</button>
      {{/if}}
    </div>
  </section>
`);