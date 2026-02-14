import { CheckCheckIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';

import ConfirmDialog from './components/ConfirmDialog';
import TasksContainer from './components/TasksContainer';
import ThemeToggle from './components/ThemeToggle';

const THEME_STORAGE_KEY = 'todo-theme-preference';
const SECTIONS_STORAGE_KEY = 'TaskSections-v2';
const LEGACY_SECTIONS_STORAGE_KEY = 'TaskSections-v1';
const WELCOME_DIALOG_STORAGE_KEY = 'todo-welcome-dialog-seen-v1';

const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const DEFAULT_SECTIONS = [
    { id: 'today-tasks', title: 'My Tasks', isLocked: true },
    { id: 'next-priority', title: 'Next Priority', isLocked: false },
    { id: 'backlog', title: 'Backlog', isLocked: false },
];

function App() {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: '',
        description: '',
        confirmLabel: 'Delete',
    });

    const [themePreference, setThemePreference] = useState('system');

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'system') {
            setThemePreference(storedTheme);
        }
    }, []);

    useEffect(() => {
        const rootElement = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const applyTheme = (nextPreference) => {
            const resolvedTheme = nextPreference === 'system' ? getSystemTheme() : nextPreference;
            rootElement.dataset.theme = resolvedTheme;
        };

        applyTheme(themePreference);

        if (themePreference !== 'system') {
            localStorage.setItem(THEME_STORAGE_KEY, themePreference);
            return undefined;
        }

        localStorage.setItem(THEME_STORAGE_KEY, 'system');

        const handleSystemChange = () => applyTheme('system');

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleSystemChange);
            return () => mediaQuery.removeEventListener('change', handleSystemChange);
        }

        mediaQuery.onchange = handleSystemChange;
        return () => {
            mediaQuery.onchange = null;
        };
    }, [themePreference]);

    useEffect(() => {
        const welcomeDialogSeen = localStorage.getItem(WELCOME_DIALOG_STORAGE_KEY);
        if (!welcomeDialogSeen) {
            setIsWelcomeDialogOpen(true);
        }
    }, []);

    useEffect(() => {
        const storedRaw = localStorage.getItem(SECTIONS_STORAGE_KEY) || localStorage.getItem(LEGACY_SECTIONS_STORAGE_KEY);
        if (!storedRaw) {
            setSections(DEFAULT_SECTIONS);
            return;
        }

        try {
            const parsed = JSON.parse(storedRaw);
            const normalized = Array.isArray(parsed)
                ? parsed
                      .filter((section) => section?.id && section?.title)
                      .map((section) => ({
                          id: section.id,
                          title: section.title,
                          isLocked: Boolean(section?.isLocked ?? (section?.id === 'today-tasks')),
                      }))
                : [];

            const primarySection = normalized.find((section) => section.id === 'today-tasks');
            const otherSections = normalized.filter((section) => section.id !== 'today-tasks');

            setSections([
                primarySection
                    ? { ...primarySection, isLocked: true }
                    : { id: 'today-tasks', title: 'My Tasks', isLocked: true },
                ...otherSections,
            ]);
        } catch {
            setSections(DEFAULT_SECTIONS);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(SECTIONS_STORAGE_KEY, JSON.stringify(sections));
    }, [sections]);

    const requestDeleteConfirm = useCallback(({ title, description, confirmLabel }) => {
        return new Promise((resolve) => {
            setConfirmState({
                open: true,
                title,
                description,
                confirmLabel: confirmLabel || 'Delete',
                onResolve: resolve,
            });
        });
    }, []);

    const closeDialog = (confirmed) => {
        if (confirmState.onResolve) {
            confirmState.onResolve(confirmed);
        }
        setConfirmState({
            open: false,
            title: '',
            description: '',
            confirmLabel: 'Delete',
            onResolve: null,
        });
    };

    const closeWelcomeDialog = () => {
        localStorage.setItem(WELCOME_DIALOG_STORAGE_KEY, '1');
        setIsWelcomeDialogOpen(false);
    };

    const sectionTitleExists = useMemo(() => {
        const normalized = newSectionTitle.trim().toLowerCase();
        if (!normalized) return false;
        return sections.some((section) => section.title.trim().toLowerCase() === normalized);
    }, [newSectionTitle, sections]);

    const addSection = () => {
        const normalizedTitle = newSectionTitle.trim();
        if (!normalizedTitle || sectionTitleExists) return;

        const sectionId = `${normalizedTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')}-${Date.now()}`;

        setSections((prev) => [...prev, { id: sectionId, title: normalizedTitle, isLocked: false }]);
        setNewSectionTitle('');
        setIsAddingSection(false);
    };

    const handleDeleteSection = (sectionId) => {
        setSections((prev) => {
            const sectionToDelete = prev.find((current) => current.id === sectionId);
            if (!sectionToDelete || sectionToDelete.isLocked) return prev;

            localStorage.removeItem(`Tasks-${sectionId}`);
            return prev.filter((current) => current.id !== sectionId);
        });
    };

    return (
        <div className="app-shell mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="panel-card panel-animate mb-8 p-6">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3 text-slate-700">
                        <CheckCheckIcon size={22} />
                        <span className="text-sm font-medium uppercase tracking-[0.2em]">Daily Planner</span>
                    </div>
                    <ThemeToggle value={themePreference} onChange={setThemePreference} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {!isAddingSection ? (
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            onClick={() => setIsAddingSection(true)}
                        >
                            <PlusIcon size={16} />
                            New section
                        </button>
                    ) : (
                        <div className="flex w-full max-w-xl flex-wrap items-center gap-2 rounded-[var(--radius-lg)] border border-slate-200 bg-white p-2">
                            <input
                                value={newSectionTitle}
                                placeholder="Section name"
                                className="min-w-0 flex-1 bg-transparent px-2 py-1 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                                onChange={(e) => setNewSectionTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') addSection();
                                    if (e.key === 'Escape') {
                                        setIsAddingSection(false);
                                        setNewSectionTitle('');
                                    }
                                }}
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={addSection}
                                disabled={!newSectionTitle.trim() || sectionTitleExists}
                                className="rounded-[var(--radius-md)] bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Add section
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddingSection(false);
                                    setNewSectionTitle('');
                                }}
                                className="rounded-[var(--radius-md)] border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    {sectionTitleExists ? <p className="text-xs text-rose-600">Section name already exists.</p> : null}
                </div>
            </header>

            <main className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {sections.map((section) => (
                    <TasksContainer
                        key={section.id}
                        sectionId={section.id}
                        taskListTitle={section.title}
                        isLockedSection={section.isLocked}
                        requestDeleteConfirm={requestDeleteConfirm}
                        onDeleteSection={handleDeleteSection}
                    />
                ))}
            </main>

            {isWelcomeDialogOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
                    <button
                        type="button"
                        className="dialog-backdrop"
                        aria-label="Close welcome dialog"
                        onClick={closeWelcomeDialog}
                    />
                    <div className="dialog-panel panel-animate relative z-10 w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-6 shadow-2xl">
                        <h2 className="text-xl font-semibold text-slate-900">Plan your day in one focused space</h2>
                        <p className="mt-2 text-sm text-slate-600">
                            Keep important work in clear sections, add what matters now, and remove what you no longer need.
                        </p>
                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={closeWelcomeDialog}
                                className="rounded-[var(--radius-md)] bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                Start planning
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                description={confirmState.description}
                confirmLabel={confirmState.confirmLabel}
                onCancel={() => closeDialog(false)}
                onConfirm={() => closeDialog(true)}
            />
        </div>
    );
}

export default App;
