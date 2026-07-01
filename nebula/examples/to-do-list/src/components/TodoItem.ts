import Component from '@nebula/component';

export const TodoItem = new Component(`
  <article class="todo-card {{#if this.completed}}is-complete{{/if}}">
    {{#if this.isEditing}}
      {{> EditTodoForm}}
    {{else}}
      {{> TodoRow}}
    {{/if}}
  </article>
`);