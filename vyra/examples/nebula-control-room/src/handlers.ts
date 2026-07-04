import { createState } from '@vyra/state';

export type RouteView = 'dashboard' | 'missions' | 'settings';
export type Theme = 'day' | 'midnight';
export type MissionPriority = 'low' | 'medium' | 'high';

export type Mission = {
    id: number;
    title: string;
    detail: string;
    priority: MissionPriority;
    completed: boolean;
};

export type MissionFilter = 'all' | 'active' | 'completed' | 'high';

export type DraftMission = {
    title: string;
    detail: string;
    priority: MissionPriority;
};

export type BaseState = {
    view: RouteView;
    theme: Theme;
    clockLabel: string;
    missions: Mission[];
    missionFilter: MissionFilter;
    draft: DraftMission;
    editingId: number | null;
    editingDraft: DraftMission;
    nextMissionId: number;
};

export type ViewMission = Mission & {
    isEditing: boolean;
    priorityClass: string;
    priorityLabel: string;
};

export type AppState = BaseState & {
    metrics: {
        total: number;
        active: number;
        completed: number;
        highPriorityOpen: number;
    };
    filteredMissions: ViewMission[];
    hasMissions: boolean;
    hasFilteredMissions: boolean;
    canClearCompleted: boolean;
    toggleAllLabel: string;
    activeNavDashboard: boolean;
    activeNavMissions: boolean;
    activeNavSettings: boolean;
    filterAllActive: boolean;
    filterActiveActive: boolean;
    filterCompletedActive: boolean;
    filterHighActive: boolean;
    themeButtonLabel: string;
    statusBannerTitle: string;
    statusBannerCopy: string;
    missionCountLabel: string;
};

const STORAGE_KEY = 'nebula-control-room-state';

const seedMissions: Mission[] = [
    {
        id: 1,
        title: 'Bootstrap telemetry board',
        detail: 'Connect mission stream and baseline anomaly thresholds.',
        priority: 'high',
        completed: false,
    },
    {
        id: 2,
        title: 'Review deployment checklist',
        detail: 'Validate signed artifacts for tonight release.',
        priority: 'medium',
        completed: true,
    },
    {
        id: 3,
        title: 'Prepare briefing notes',
        detail: 'Summarize performance deltas and top regressions.',
        priority: 'low',
        completed: false,
    },
];

function nowLabel(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function emptyDraft(): DraftMission {
    return {
        title: '',
        detail: '',
        priority: 'medium',
    };
}

function fallbackState(): BaseState {
    return {
        view: 'dashboard',
        theme: 'day',
        clockLabel: nowLabel(),
        missions: seedMissions,
        missionFilter: 'all',
        draft: emptyDraft(),
        editingId: null,
        editingDraft: emptyDraft(),
        nextMissionId: 4,
    };
}

function priorityClass(priority: MissionPriority): string {
    return `priority priority--${priority}`;
}

function priorityLabel(priority: MissionPriority): string {
    if (priority === 'high') return 'High';
    if (priority === 'medium') return 'Medium';
    return 'Low';
}

function applyTheme(theme: Theme): void {
    document.documentElement.dataset.theme = theme;
}

function toBaseState(state: AppState): BaseState {
    return {
        view: state.view,
        theme: state.theme,
        clockLabel: state.clockLabel,
        missions: state.missions,
        missionFilter: state.missionFilter,
        draft: state.draft,
        editingId: state.editingId,
        editingDraft: state.editingDraft,
        nextMissionId: state.nextMissionId,
    };
}

function saveState(state: AppState): void {
    if (typeof localStorage === 'undefined') {
        return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toBaseState(state)));
}

function parsePriority(value: unknown, fallback: MissionPriority): MissionPriority {
    if (value === 'low' || value === 'medium' || value === 'high') {
        return value;
    }

    return fallback;
}

function sanitizeMission(value: unknown): Mission | null {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const candidate = value as Partial<Mission>;

    if (typeof candidate.id !== 'number' || typeof candidate.title !== 'string' || typeof candidate.detail !== 'string') {
        return null;
    }

    return {
        id: candidate.id,
        title: candidate.title,
        detail: candidate.detail,
        priority: parsePriority(candidate.priority, 'medium'),
        completed: Boolean(candidate.completed),
    };
}

function loadState(): BaseState {
    const fallback = fallbackState();

    if (typeof localStorage === 'undefined') {
        return fallback;
    }

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return fallback;
        }

        const parsed = JSON.parse(raw) as Partial<BaseState>;
        const missions = Array.isArray(parsed.missions)
            ? parsed.missions.map(sanitizeMission).filter((mission): mission is Mission => mission !== null)
            : fallback.missions;

        return {
            view: parsed.view === 'missions' || parsed.view === 'settings' ? parsed.view : fallback.view,
            theme: parsed.theme === 'midnight' ? 'midnight' : 'day',
            clockLabel: typeof parsed.clockLabel === 'string' ? parsed.clockLabel : fallback.clockLabel,
            missions,
            missionFilter: parsed.missionFilter === 'active' || parsed.missionFilter === 'completed' || parsed.missionFilter === 'high'
                ? parsed.missionFilter
                : fallback.missionFilter,
            draft: {
                title: typeof parsed.draft?.title === 'string' ? parsed.draft.title : '',
                detail: typeof parsed.draft?.detail === 'string' ? parsed.draft.detail : '',
                priority: parsePriority(parsed.draft?.priority, 'medium'),
            },
            editingId: typeof parsed.editingId === 'number' ? parsed.editingId : null,
            editingDraft: {
                title: typeof parsed.editingDraft?.title === 'string' ? parsed.editingDraft.title : '',
                detail: typeof parsed.editingDraft?.detail === 'string' ? parsed.editingDraft.detail : '',
                priority: parsePriority(parsed.editingDraft?.priority, 'medium'),
            },
            nextMissionId: typeof parsed.nextMissionId === 'number' ? parsed.nextMissionId : fallback.nextMissionId,
        };
    } catch {
        return fallback;
    }
}

function normalizeState(base: BaseState): AppState {
    const completed = base.missions.filter((mission) => mission.completed).length;
    const active = base.missions.length - completed;
    const highPriorityOpen = base.missions.filter((mission) => mission.priority === 'high' && !mission.completed).length;

    const filteredMissions = base.missions
        .filter((mission) => {
            if (base.missionFilter === 'active') {
                return !mission.completed;
            }

            if (base.missionFilter === 'completed') {
                return mission.completed;
            }

            if (base.missionFilter === 'high') {
                return mission.priority === 'high';
            }

            return true;
        })
        .map((mission) => ({
            ...mission,
            isEditing: base.editingId === mission.id,
            priorityClass: priorityClass(mission.priority),
            priorityLabel: priorityLabel(mission.priority),
        }));

    return {
        ...base,
        metrics: {
            total: base.missions.length,
            active,
            completed,
            highPriorityOpen,
        },
        filteredMissions,
        hasMissions: base.missions.length > 0,
        hasFilteredMissions: filteredMissions.length > 0,
        canClearCompleted: completed > 0,
        toggleAllLabel: active > 0 ? 'Mark all complete' : 'Reopen all',
        activeNavDashboard: base.view === 'dashboard',
        activeNavMissions: base.view === 'missions',
        activeNavSettings: base.view === 'settings',
        filterAllActive: base.missionFilter === 'all',
        filterActiveActive: base.missionFilter === 'active',
        filterCompletedActive: base.missionFilter === 'completed',
        filterHighActive: base.missionFilter === 'high',
        themeButtonLabel: base.theme === 'day' ? 'Switch to midnight mode' : 'Switch to daylight mode',
        statusBannerTitle: base.view === 'dashboard'
            ? 'Mission snapshot'
            : base.view === 'missions'
                ? 'Mission board'
                : 'Control settings',
        statusBannerCopy: base.view === 'dashboard'
            ? 'Track throughput, urgency, and completion from one panel.'
            : base.view === 'missions'
                ? 'Create missions, reprioritize quickly, and keep operators aligned.'
                : 'Tune themes, inspect state, and test loading/error placeholders.',
        missionCountLabel: `${active} active / ${completed} completed`,
    };
}

const [getState, setState] = createState(normalizeState(loadState()));

function updateState(updater: (state: BaseState) => BaseState): void {
    setState((current) => normalizeState(updater(toBaseState(current))));
    syncState();
}

export function syncState(): void {
    const current = getState();
    applyTheme(current.theme);
    saveState(current);
}

export function setClockNow(): void {
    updateState((state) => ({
        ...state,
        clockLabel: nowLabel(),
    }));
}

export function setView(view: RouteView): void {
    updateState((state) => ({
        ...state,
        view,
    }));
}

export function toggleTheme(): void {
    updateState((state) => ({
        ...state,
        theme: state.theme === 'day' ? 'midnight' : 'day',
    }));
}

export function setMissionFilter(filter: MissionFilter): void {
    updateState((state) => ({
        ...state,
        missionFilter: filter,
    }));
}

export function setDraftField(field: keyof DraftMission, value: string): void {
    updateState((state) => ({
        ...state,
        draft: {
            ...state.draft,
            [field]: field === 'priority' ? parsePriority(value, state.draft.priority) : value,
        },
    }));
}

export function setEditingField(field: keyof DraftMission, value: string): void {
    updateState((state) => ({
        ...state,
        editingDraft: {
            ...state.editingDraft,
            [field]: field === 'priority' ? parsePriority(value, state.editingDraft.priority) : value,
        },
    }));
}

export function addMission(): void {
    const draft = getState().draft;
    const title = draft.title.trim();
    const detail = draft.detail.trim();

    if (!title || !detail) {
        return;
    }

    updateState((state) => ({
        ...state,
        missions: [
            {
                id: state.nextMissionId,
                title,
                detail,
                priority: draft.priority,
                completed: false,
            },
            ...state.missions,
        ],
        draft: emptyDraft(),
        nextMissionId: state.nextMissionId + 1,
    }));
}

export function toggleMission(id: number): void {
    updateState((state) => ({
        ...state,
        missions: state.missions.map((mission) =>
            mission.id === id ? { ...mission, completed: !mission.completed } : mission
        ),
    }));
}

export function removeMission(id: number): void {
    updateState((state) => ({
        ...state,
        missions: state.missions.filter((mission) => mission.id !== id),
        editingId: state.editingId === id ? null : state.editingId,
        editingDraft: state.editingId === id ? emptyDraft() : state.editingDraft,
    }));
}

export function startMissionEdit(id: number): void {
    const current = getState().missions.find((mission) => mission.id === id);
    if (!current) {
        return;
    }

    updateState((state) => ({
        ...state,
        editingId: id,
        editingDraft: {
            title: current.title,
            detail: current.detail,
            priority: current.priority,
        },
    }));
}

export function cancelMissionEdit(): void {
    updateState((state) => ({
        ...state,
        editingId: null,
        editingDraft: emptyDraft(),
    }));
}

export function saveMissionEdit(id: number): void {
    const current = getState().editingDraft;
    const title = current.title.trim();
    const detail = current.detail.trim();

    if (!title || !detail) {
        return;
    }

    updateState((state) => ({
        ...state,
        missions: state.missions.map((mission) =>
            mission.id === id
                ? {
                    ...mission,
                    title,
                    detail,
                    priority: current.priority,
                }
                : mission
        ),
        editingId: null,
        editingDraft: emptyDraft(),
    }));
}

export function toggleAllMissions(): void {
    const activeExists = getState().missions.some((mission) => !mission.completed);

    updateState((state) => ({
        ...state,
        missions: state.missions.map((mission) => ({
            ...mission,
            completed: activeExists,
        })),
    }));
}

export function clearCompletedMissions(): void {
    updateState((state) => ({
        ...state,
        missions: state.missions.filter((mission) => !mission.completed),
        editingId: state.editingId && state.missions.some((mission) => mission.id === state.editingId && !mission.completed)
            ? state.editingId
            : null,
        editingDraft: state.editingId ? state.editingDraft : emptyDraft(),
    }));
}

export function seedDemoMissions(): void {
    updateState((state) => ({
        ...state,
        missions: [...seedMissions, ...state.missions],
    }));
}

export function resetControlRoom(): void {
    updateState(() => fallbackState());
}

export { getState };