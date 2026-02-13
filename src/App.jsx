import { CheckCheckIcon, PanelsTopLeftIcon } from 'lucide-react';

import DraggableList from './components/DraggableList';
import TasksContainer from './components/TasksContainer';

function App() {
    return (
        <div className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <header className="mb-8 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-[0_10px_50px_-30px_rgba(15,23,42,0.7)] backdrop-blur">
                <div className="flex items-center gap-3 text-slate-700">
                    <CheckCheckIcon size={22} />
                    <span className="text-sm font-medium uppercase tracking-[0.2em]">Daily Planner</span>
                </div>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    Plan your day with a cleaner board
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                    Add tasks, reorder priorities, and keep completed work tucked away but accessible.
                </p>
            </header>

            <main className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <TasksContainer taskListTitle="Today Tasks" />
                <div className="space-y-5">
                    <DraggableList />
                    <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 text-sm text-slate-600 shadow-[0_10px_40px_-20px_rgba(15,23,42,0.6)] backdrop-blur">
                        <div className="mb-2 flex items-center gap-2 font-medium text-slate-800">
                            <PanelsTopLeftIcon size={16} />
                            Workflow Tip
                        </div>
                        Use the drag handle on active tasks to reorder your focus list based on urgency.
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
