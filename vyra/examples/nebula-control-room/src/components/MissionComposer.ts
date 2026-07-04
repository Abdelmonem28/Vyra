import Component from '@vyra/component';

export const MissionComposer = new Component(`
  <section class="panel section">
    <div class="section__header">
      <div>
        <p class="section__eyebrow">Command Input</p>
        <h3>Create Mission</h3>
      </div>
    </div>

    <form class="composer" data-form="create-mission">
      <label>
        <span class="section__eyebrow">Title</span>
        <input
          id="draft-title"
          data-draft-field="title"
          type="text"
          value="{{state.draft.title}}"
          placeholder="Mission title"
          autocomplete="off"
        />
      </label>

      <label>
        <span class="section__eyebrow">Detail</span>
        <textarea
          id="draft-detail"
          data-draft-field="detail"
          placeholder="Describe mission scope"
        >{{state.draft.detail}}</textarea>
      </label>

      <label>
        <span class="section__eyebrow">Priority</span>
        <select id="draft-priority" data-draft-field="priority" value="{{state.draft.priority}}">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <button type="submit" class="primary-button">Add mission</button>
    </form>
  </section>
`);