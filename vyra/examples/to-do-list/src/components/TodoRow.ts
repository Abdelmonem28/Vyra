import Component from '@vyra/component';

export const TodoRow = new Component(`
  <div class="todo-main">
    <button type="button" class="todo-toggle" data-action="toggle" data-id="{{this.id}}">
      {{#if this.completed}}Undo{{else}}Done{{/if}}
    </button>
    <div class="todo-copy">
      <p class="todo-title">{{this.title}}</p>
      <p class="todo-meta">{{#if this.completed}}Completed{{else}}In progress{{/if}}</p>
    </div>
  </div>

  <div class="row-actions">
    <button type="button" class="ghost-button" data-action="edit" data-id="{{this.id}}">Edit</button>
    <button type="button" class="danger-button" data-action="delete" data-id="{{this.id}}">Delete</button>
  </div>
`);