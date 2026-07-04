import Component from '@vyra/component';

import {
    addTodo,
    beginEdit,
    cancelEdit,
    clearCompleted,
    getState,
    removeTodo,
    saveEdit,
    setDraft,
    setEditingDraft,
    setFilter,
    syncAppState,
    toggleAll,
    toggleTheme,
    toggleTodo,
} from './handlers';

import { ComposerPanel } from './components/ComposerPanel';
import { EditTodoForm } from './components/EditTodoForm';
import { FilterBar } from './components/FilterBar';
import { FooterBar } from './components/FooterBar';
import { HeaderHero } from './components/HeaderHero';
import { StatsCard } from './components/StatsCard';
import { TaskList } from './components/TaskList';
import { TodoItem } from './components/TodoItem';
import { TodoRow } from './components/TodoRow';

import './styles.css';

const app = new Component(`
  <div id="todo-app" class="app-shell app-shell--{{state.theme}}">
    {{> HeaderHero}}
    {{> ComposerPanel}}
    {{> StatsCard}}
    {{> TaskList}}
    {{> FooterBar}}
  </div>
`);

function bindAppInteractions() {
    app.data.children = {
        ComposerPanel,
        EditTodoForm,
        FilterBar,
        FooterBar,
        HeaderHero,
        StatsCard,
        TaskList,
        TodoItem,
        TodoRow,
    };

    app.bindState('state', getState);

    app.setInteraction('todo-app', 'click', (event: Event) => {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const actionElement = target.closest('[data-action]') as HTMLElement | null;
        if (!actionElement) {
            return;
        }

        const action = actionElement.dataset.action;
        const id = Number(actionElement.dataset.id);
        const filter = actionElement.dataset.filter as import('./handlers').Filter | undefined;

        switch (action) {
            case 'toggle':
                if (!Number.isNaN(id)) {
                    toggleTodo(id);
                }
                break;
            case 'delete':
                if (!Number.isNaN(id)) {
                    removeTodo(id);
                }
                break;
            case 'edit':
                if (!Number.isNaN(id)) {
                    beginEdit(id);
                }
                break;
            case 'cancel-edit':
                cancelEdit();
                break;
            case 'toggle-all':
                toggleAll();
                break;
            case 'clear-completed':
                clearCompleted();
                break;
            case 'set-filter':
                if (filter) {
                    setFilter(filter);
                }
                break;
            case 'toggle-theme':
                toggleTheme();
                break;
        }
    });

    app.setInteraction('todo-app', 'input', (event: Event) => {
        const target = event.target;

        if (!(target instanceof HTMLInputElement)) {
            return;
        }

        if (target.dataset.field === 'draft') {
            setDraft(target.value);
            return;
        }

        if (target.dataset.field === 'edit') {
            setEditingDraft(target.value);
        }
    });

    app.setInteraction('todo-app', 'submit', (event: Event) => {
        if (!(event.target instanceof HTMLFormElement)) {
            return;
        }

        event.preventDefault();

        const formType = event.target.dataset.form;

        if (formType === 'create') {
            addTodo(getState().draft);
            return;
        }

        if (formType === 'edit') {
            const id = Number(event.target.dataset.id);

            if (!Number.isNaN(id)) {
                saveEdit(id);
            }
        }
    });
}

export async function mountTodoListApp(): Promise<void> {
    bindAppInteractions();
    syncAppState();
    await app.view();
}