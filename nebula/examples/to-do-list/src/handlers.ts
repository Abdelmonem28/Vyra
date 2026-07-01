import { createState } from '@nebula/state';

export type Filter = 'all' | 'active' | 'completed';
export type Theme = 'sunrise' | 'midnight';

export type Todo = {
    id: number;
    title: string;
    completed: boolean;
};

export type BaseState = {
    todos: Todo[];
    draft: string;
    filter: Filter;
    editingId: number | null;
    editingDraft: string;
    theme: Theme;
    nextId: number;
};

export type ViewTodo = Todo & {
    isEditing: boolean;
};

export type AppState = BaseState & {
    filteredTodos: ViewTodo[];
    totalCount: number;
    remainingCount: number;
    completedCount: number;
    hasTodos: boolean;
    hasVisibleTodos: boolean;
    canClearCompleted: boolean;
    allCompleted: boolean;
    filterAllActive: boolean;
    filterActiveActive: boolean;
    filterCompletedActive: boolean;
    toggleAllLabel: string;
    themeLabel: string;
};

const STORAGE_KEY = 'nebula-to-do-list-state';

const seedTodos: Todo[] = [
    { id: 1, title: 'Sketch the landing page', completed: true },
    { id: 2, title: 'Wire the Nebula todo actions', completed: false },
];

function loadBaseState(): BaseState {
    const fallback: BaseState = {
        todos: seedTodos,
        draft: '',
        filter: 'all',
        editingId: null,
        editingDraft: '',
        theme: 'sunrise',
        nextId: 3,
    };

    if (typeof localStorage === 'undefined') {
        return fallback;
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return fallback;
        }

        const parsed = JSON.parse(raw) as Partial<BaseState>;
        const todos = Array.isArray(parsed.todos)
            ? parsed.todos
                .filter((todo): todo is Todo => Boolean(todo) && typeof todo.id === 'number' && typeof todo.title === 'string')
                .map((todo) => ({
                    id: todo.id,
                    title: todo.title,
                    completed: Boolean(todo.completed),
                }))
            : fallback.todos;

        return {
            todos,
            draft: typeof parsed.draft === 'string' ? parsed.draft : fallback.draft,
            filter: parsed.filter === 'active' || parsed.filter === 'completed' ? parsed.filter : fallback.filter,
            editingId: typeof parsed.editingId === 'number' ? parsed.editingId : null,
            editingDraft: typeof parsed.editingDraft === 'string' ? parsed.editingDraft : fallback.editingDraft,
            theme: parsed.theme === 'midnight' ? parsed.theme : fallback.theme,
            nextId: typeof parsed.nextId === 'number' ? parsed.nextId : fallback.nextId,
        };
    } catch {
        return fallback;
    }
}

function toBaseState(state: AppState): BaseState {
    return {
        todos: state.todos,
        draft: state.draft,
        filter: state.filter,
        editingId: state.editingId,
        editingDraft: state.editingDraft,
        theme: state.theme,
        nextId: state.nextId,
    };
}

function persistBaseState(state: AppState): void {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toBaseState(state)));
}

function normalizeState(base: BaseState): AppState {
    const completedCount = base.todos.filter((todo) => todo.completed).length;
    const remainingCount = base.todos.length - completedCount;

    const filteredTodos = base.todos
        .filter((todo) => {
            if (base.filter === 'active') {
                return !todo.completed;
            }

            if (base.filter === 'completed') {
                return todo.completed;
            }

            return true;
        })
        .map((todo) => ({
            ...todo,
            isEditing: base.editingId === todo.id,
        }));

    return {
        ...base,
        filteredTodos,
        totalCount: base.todos.length,
        remainingCount,
        completedCount,
        hasTodos: base.todos.length > 0,
        hasVisibleTodos: filteredTodos.length > 0,
        canClearCompleted: completedCount > 0,
        allCompleted: base.todos.length > 0 && remainingCount === 0,
        filterAllActive: base.filter === 'all',
        filterActiveActive: base.filter === 'active',
        filterCompletedActive: base.filter === 'completed',
        toggleAllLabel: base.todos.length > 0 && remainingCount === 0 ? 'Mark all open' : 'Mark all complete',
        themeLabel: base.theme === 'sunrise' ? 'Switch to night' : 'Switch to sunrise',
    };
}

function ensureTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
}

const [getState, setState] = createState(normalizeState(loadBaseState()));

export function syncAppState(): void {
    const current = getState();
    ensureTheme(current.theme);
    persistBaseState(current);
}

function updateState(updater: (state: BaseState) => BaseState): void {
    setState((previous) => normalizeState(updater(toBaseState(previous))));
    syncAppState();
}

export function setDraft(draft: string): void {
    updateState((state) => ({
        ...state,
        draft,
    }));
}

export function setEditingDraft(editingDraft: string): void {
    updateState((state) => ({
        ...state,
        editingDraft,
    }));
}

export function addTodo(title: string): void {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
        return;
    }

    updateState((state) => ({
        ...state,
        todos: [...state.todos, { id: state.nextId, title: cleanTitle, completed: false }],
        draft: '',
        editingId: null,
        editingDraft: '',
        nextId: state.nextId + 1,
    }));
}

export function toggleTodo(id: number): void {
    updateState((state) => ({
        ...state,
        todos: state.todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    }));
}

export function removeTodo(id: number): void {
    updateState((state) => ({
        ...state,
        todos: state.todos.filter((todo) => todo.id !== id),
        editingId: state.editingId === id ? null : state.editingId,
        editingDraft: state.editingId === id ? '' : state.editingDraft,
    }));
}

export function beginEdit(id: number): void {
    const todo = getState().todos.find((item) => item.id === id);

    if (!todo) {
        return;
    }

    updateState((state) => ({
        ...state,
        editingId: id,
        editingDraft: todo.title,
    }));
}

export function cancelEdit(): void {
    updateState((state) => ({
        ...state,
        editingId: null,
        editingDraft: '',
    }));
}

export function saveEdit(id: number): void {
    const cleanTitle = getState().editingDraft.trim();

    if (!cleanTitle) {
        return;
    }

    updateState((state) => ({
        ...state,
        todos: state.todos.map((todo) => (todo.id === id ? { ...todo, title: cleanTitle } : todo)),
        editingId: null,
        editingDraft: '',
    }));
}

export function toggleAll(): void {
    const current = getState();

    if (!current.todos.length) {
        return;
    }

    const nextCompleted = !current.allCompleted;

    updateState((state) => ({
        ...state,
        todos: state.todos.map((todo) => ({ ...todo, completed: nextCompleted })),
    }));
}

export function clearCompleted(): void {
    updateState((state) => ({
        ...state,
        todos: state.todos.filter((todo) => !todo.completed),
        editingId: state.editingId && state.todos.some((todo) => todo.id === state.editingId && !todo.completed) ? state.editingId : null,
        editingDraft: state.editingId ? state.editingDraft : '',
    }));
}

export function setFilter(filter: Filter): void {
    updateState((state) => ({
        ...state,
        filter,
    }));
}

export function toggleTheme(): void {
    updateState((state) => ({
        ...state,
        theme: state.theme === 'sunrise' ? 'midnight' : 'sunrise',
    }));
}

export { getState };