import Component from '@nebula/component';
import Router from '@nebula/router';

import {
    addMission,
    // beginEdit,
    cancelMissionEdit,
    clearCompletedMissions,
    getState,
    removeMission,
    resetControlRoom,
    saveMissionEdit,
    seedDemoMissions,
    setClockNow,
    setDraftField,
    setEditingField,
    setMissionFilter,
    setView,
    syncState,
    toggleAllMissions,
    toggleMission,
    toggleTheme,
    type MissionFilter,
    type RouteView,
} from './handlers';

import { DashboardView } from './components/DashboardView';
import { HeaderShell } from './components/HeaderShell';
import { LoadingView } from './components/LoadingView';
import { MetricsGrid } from './components/MetricsGrid';
import { MissionBoard } from './components/MissionBoard';
import { MissionComposer } from './components/MissionComposer';
import { MissionEditForm } from './components/MissionEditForm';
import { MissionFilters } from './components/MissionFilters';
import { MissionItem } from './components/MissionItem';
import { MissionReadonly } from './components/MissionReadonly';
import { MissionsView } from './components/MissionsView';
import { SettingsView } from './components/SettingsView';
import { StatusBanner } from './components/StatusBanner';

import './styles.css';

const root = new Component(`
  <main id="control-room" class="page-shell control-room">
    {{> HeaderShell}}
    {{#if state.activeNavDashboard}}
      {{> DashboardView}}
    {{/if}}
    {{#if state.activeNavMissions}}
      {{> MissionsView}}
    {{/if}}
    {{#if state.activeNavSettings}}
      {{> SettingsView}}
    {{/if}}
  </main>
`, 'Nebula Control Room');

const dashboardRoute = new Component(`
  <main id="control-room" class="page-shell control-room">
    {{> HeaderShell}}
    {{> DashboardView}}
  </main>
`, 'Nebula Control Room - Dashboard');

const missionsRoute = new Component(`
  <main id="control-room" class="page-shell control-room">
    {{> HeaderShell}}
    {{> MissionsView}}
  </main>
`, 'Nebula Control Room - Missions');

const settingsRoute = new Component(`
  <main id="control-room" class="page-shell control-room">
    {{> HeaderShell}}
    {{> SettingsView}}
  </main>
`, 'Nebula Control Room - Settings');

const sharedChildren = {
    DashboardView,
    HeaderShell,
    MetricsGrid,
    MissionBoard,
    MissionComposer,
    MissionEditForm,
    MissionFilters,
    MissionItem,
    MissionReadonly,
    MissionsView,
    SettingsView,
    StatusBanner,
};

function bindChildren(view: Component): void {
    view.data.children = sharedChildren;
}

function bindInteractions(view: Component): void {
    view.bindState('state', getState);

    view.setInteraction('control-room', 'click', (event: Event) => {
        const target = event.target;

        if (!(target instanceof HTMLElement)) {
            return;
        }

        const nav = target.closest('[data-nav]') as HTMLElement | null;
        if (nav) {
            const nextPath = nav.dataset.nav as RouteView | undefined;
            if (nextPath) {
                const routePath = nextPath === 'dashboard' ? '/' : `/${nextPath}`;
                setView(nextPath);
                void Router.navigateTo(routePath);
            }
            return;
        }

        const actionElement = target.closest('[data-action]') as HTMLElement | null;
        if (!actionElement) {
            return;
        }

        const action = actionElement.dataset.action;
        const id = Number(actionElement.dataset.id);

        switch (action) {
            case 'toggle-mission':
                if (!Number.isNaN(id)) {
                    toggleMission(id);
                }
                break;
            case 'remove-mission':
                if (!Number.isNaN(id)) {
                    removeMission(id);
                }
                break;
            case 'edit-mission':
                if (!Number.isNaN(id)) {
                    // beginEdit(id);
                }
                break;
            case 'cancel-edit':
                cancelMissionEdit();
                break;
            case 'toggle-all':
                toggleAllMissions();
                break;
            case 'clear-completed':
                clearCompletedMissions();
                break;
            case 'theme-toggle':
                toggleTheme();
                break;
            case 'clock-now':
                setClockNow();
                break;
            case 'seed-demo':
                seedDemoMissions();
                break;
            case 'reset-room':
                resetControlRoom();
                break;
        }
    });

    view.setInteraction('control-room', 'input', (event: Event) => {
        const target = event.target;

        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            const draftField = target.dataset.draftField as keyof import('./handlers').DraftMission | undefined;
            if (draftField) {
                setDraftField(draftField, target.value);
                return;
            }

            const editField = target.dataset.editField as keyof import('./handlers').DraftMission | undefined;
            if (editField) {
                setEditingField(editField, target.value);
            }
        }
    });

    view.setInteraction('control-room', 'change', (event: Event) => {
        const target = event.target;

        if (target instanceof HTMLSelectElement) {
            const draftField = target.dataset.draftField as keyof import('./handlers').DraftMission | undefined;
            if (draftField) {
                setDraftField(draftField, target.value);
                return;
            }

            const editField = target.dataset.editField as keyof import('./handlers').DraftMission | undefined;
            if (editField) {
                setEditingField(editField, target.value);
                return;
            }
        }

        if (target instanceof HTMLInputElement) {
            const filter = target.dataset.filter as MissionFilter | undefined;
            if (filter) {
                setMissionFilter(filter);
            }
        }
    });

    view.setInteraction('control-room', 'submit', (event: Event) => {
        if (!(event.target instanceof HTMLFormElement)) {
            return;
        }

        event.preventDefault();

        const formType = event.target.dataset.form;

        if (formType === 'create-mission') {
            addMission();
            return;
        }

        if (formType === 'save-mission') {
            const id = Number(event.target.dataset.id);
            if (!Number.isNaN(id)) {
                saveMissionEdit(id);
            }
        }
    });
}

function registerRoutes() {
    bindChildren(root);
    bindChildren(dashboardRoute);
    bindChildren(missionsRoute);
    bindChildren(settingsRoute);

    bindInteractions(root);
    bindInteractions(dashboardRoute);
    bindInteractions(missionsRoute);
    bindInteractions(settingsRoute);

    Router.routes = [
        { path: '/', view: dashboardRoute },
        { path: '/dashboard', view: dashboardRoute },
        { path: '/missions', view: missionsRoute },
        { path: '/settings', view: settingsRoute },
    ];

    dashboardRoute.setLoading(LoadingView);
    missionsRoute.setLoading(LoadingView);
    settingsRoute.setLoading(LoadingView);
}

export async function mountNebulaControlRoom(): Promise<void> {
    registerRoutes();
    syncState();

    const path = location.pathname;
    if (path === '/missions') {
        setView('missions');
    } else if (path === '/settings') {
        setView('settings');
    } else {
        setView('dashboard');
    }

    await Router.router();
}
