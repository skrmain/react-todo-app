import { CheckCheckIcon, PanelsTopLeftIcon, PlusIcon } from 'lucide-react';
import { useEffect, useState, useCallback, useMemo } from 'react';

import ConfirmDialog from './components/ConfirmDialog';
import TasksContainer from './components/TasksContainer';
import ThemeToggle from './components/ThemeToggle';

const BOARDS = ['Today Tasks', 'Next Priority', 'Backlog'];
const THEME_STORAGE_KEY = 'todo-theme-preference';

const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const DEFAULT_SECTIONS = [
    { id: 'today-tasks', title: 'Today Tasks', isDefault: true },
    { id: 'next-priority', title: 'Next Priority', isDefault: true },
    { id: 'backlog', title: 'Backlog', isDefault: true },
];

const SECTIONS_STORAGE_KEY = 'TaskSections-v1';

function App() {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);
    const [newSectionTitle, setNewSectionTitle] = useState('');
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [confirmState, setConfirmState] = useState({
        open: false,
        title: '',
        description: '',
        confirmLabel: 'Delete',
    });

    useEffect(() => {
        const storedRaw = localStorage.getItem(SECTIONS_STORAGE_KEY);
        if (!storedRaw) {
            setSections(DEFAULT_SECTIONS);
            return;
        }

        try {
            const parsed = JSON.parse(storedRaw);
            const validParsed = Array.isArray(parsed)
                ? parsed.filter((section) => section?.id && section?.title && typeof section?.isDefault === 'boolean')
                : [];

            const customSections = validParsed.filter((section) => !section.isDefault);
            setSections([...DEFAULT_SECTIONS, ...customSections]);
        } catch {
            setSections(DEFAULT_SECTIONS);
        }
    }, []);

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

        mediaQuery.addListener(handleSystemChange);
        return () => mediaQuery.removeListener(handleSystemChange);
    }, [themePreference]);

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

    const sectionTitleExists = useMemo(() => {
        const normalized = newSectionTitle.trim().toLowerCase();
        return sections.some((section) => section.title.toLowerCase() === normalized);
    }, [newSectionTitle, sections]);

    const addSection = () => {
        const normalizedTitle = newSectionTitle.trim();
        if (!normalizedTitle || sectionTitleExists) return;

        const sectionId = `${normalizedTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')}-${Date.now()}`;
        setSections((prev) => [...prev, { id: sectionId, title: normalizedTitle, isDefault: false }]);
        setNewSectionTitle('');
        setIsAddingSection(false);
    };

    const handleDeleteSection = (sectionId) => {
        setSections((prev) => {
            const section = prev.find((current) => current.id === sectionId);
            if (!section || section.isDefault) return prev;
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
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Plan your day with a cleaner board
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                    Create sections like Google Tasks lists, add what matters, and trim what you no longer need.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-2">
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

            <main className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {sections.map((section) => (
                        <TasksContainer
                            key={section.id}
                            sectionId={section.id}
                            taskListTitle={section.title}
                            isDefaultSection={section.isDefault}
                            requestDeleteConfirm={requestDeleteConfirm}
                            onDeleteSection={handleDeleteSection}
                        />
                    ))}
                </section>

                <aside className="space-y-5">
                    <div
                        className="panel-card panel-animate p-4 text-sm text-slate-600"
                        style={{ animationDelay: '120ms' }}
                    >
                        <div className="mb-2 flex items-center gap-2 font-medium text-slate-800">
                            <PanelsTopLeftIcon size={16} />
                            Workflow Tip
                        </div>
                        Default sections are fixed. Custom sections can be removed from the section header menu.
                    </div>
                </aside>
            </main>

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
