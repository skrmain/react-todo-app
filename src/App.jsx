import { CheckCheckIcon, PanelsTopLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import TasksContainer from './components/TasksContainer';
import ThemeToggle from './components/ThemeToggle';

const BOARDS = ['Today Tasks', 'Next Priority', 'Backlog'];
const THEME_STORAGE_KEY = 'todo-theme-preference';

const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function App() {
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
                    Add tasks, reorder priorities, and keep completed work tucked away but accessible.
                </p>
            </header>

            <main className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {BOARDS.map((title) => (
                        <TasksContainer key={title} taskListTitle={title} />
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
                        Use the drag handle on active tasks to reorder your focus list based on urgency.
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default App;
