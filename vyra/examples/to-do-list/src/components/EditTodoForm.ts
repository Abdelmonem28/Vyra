import Component from '@vyra/component';

export const EditTodoForm = new Component(`
  <form class="edit-form" data-form="edit" data-id="{{this.id}}">
    <label class="sr-only" for="edit-{{this.id}}">Edit task</label>
    <input
      id="edit-{{this.id}}"
      class="edit-input"
      data-field="edit"
      type="text"
      value="{{state.editingDraft}}"
      autocomplete="off"
    />
    <div class="row-actions">
      <button type="submit" class="primary-button primary-button--small">Save</button>
      <button type="button" class="ghost-button" data-action="cancel-edit">Cancel</button>
    </div>
  </form>
`);