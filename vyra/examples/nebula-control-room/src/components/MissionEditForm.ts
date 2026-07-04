import Component from '@vyra/component';

export const MissionEditForm = new Component(`
  <form class="mission-edit" data-form="save-mission" data-id="{{this.id}}">
    <label>
      <span class="section__eyebrow">Title</span>
      <input data-edit-field="title" type="text" value="{{state.editingDraft.title}}" autocomplete="off" />
    </label>

    <label>
      <span class="section__eyebrow">Detail</span>
      <textarea data-edit-field="detail">{{state.editingDraft.detail}}</textarea>
    </label>

    <label>
      <span class="section__eyebrow">Priority</span>
      <select data-edit-field="priority" value="{{state.editingDraft.priority}}">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </label>

    <button type="submit" class="primary-button">Save</button>
    <button type="button" class="secondary-button" data-action="cancel-edit">Cancel</button>
  </form>
`);