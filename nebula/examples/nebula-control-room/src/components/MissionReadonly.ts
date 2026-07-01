import Component from '@nebula/component';

export const MissionReadonly = new Component(`
  <div class="mission-row__main">
    <input type="checkbox" data-action="toggle-mission" data-id="{{this.id}}" {{#if this.completed}}checked{{/if}} />
    <h4 class="mission-row__title">{{this.title}}</h4>
    <span class="{{this.priorityClass}}">{{this.priorityLabel}}</span>
  </div>

  <p class="mission-row__note">{{this.detail}}</p>

  <div class="mission-row__actions">
    <button type="button" class="secondary-button" data-action="edit-mission" data-id="{{this.id}}">Edit</button>
    <button type="button" class="secondary-button" data-action="remove-mission" data-id="{{this.id}}">Remove</button>
  </div>
`);