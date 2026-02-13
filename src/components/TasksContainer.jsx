import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    CirclePlusIcon,
    ListTodoIcon,
    SparklesIcon,
} from 'lucide-react';

import NoTaskView from './NoTaskView';
import PanelCard from './PanelCard';
import TaskList from './TaskList';

const TasksContainer = ({ taskListTitle }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isShowingCompleted, setIsShowingCompleted] = useState(false);
    const [draggingId, setDraggingId] = useState(null);
    const maxIdRef = useRef(0);

    const storageKey = `Tasks-${taskListTitle}`;

    useEffect(() => {
        const storedTasksRaw = localStorage.getItem(storageKey) || '[]';
        const storedTasks = JSON.parse(storedTasksRaw);
        setTasks(storedTasks);
        maxIdRef.current = storedTasks.length
            ? storedTasks.reduce((max, current) => (current.id > max ? current.id : max), 0)
            : 0;
    }, [storageKey]);

    const persistTasks = (nextTasks) => {
        setTasks(nextTasks);
        localStorage.setItem(storageKey, JSON.stringify(nextTasks));
    };

    const saveTask = () => {
        const trimmedTask = newTask.trim();
        if (!trimmedTask) return;

        maxIdRef.current += 1;
        persistTasks([...tasks, { id: maxIdRef.current, title: trimmedTask, done: false }]);
        setNewTask('');
    };

    const updateTask = (updatedTask) => {
        const nextTasks = tasks.map((task) => (task.id === updatedTask.id ? { ...task, ...updatedTask } : task));
        persistTasks(nextTasks);
    };

    const handleDragStart = (e, id) => {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDrop = (e, targetId) => {
        e.preventDefault();
        if (draggingId === null || draggingId === targetId) return;

        const draggedIndex = tasks.findIndex((task) => task.id === draggingId);
        const targetIndex = tasks.findIndex((task) => task.id === targetId);
        if (draggedIndex < 0 || targetIndex < 0) return;

        const updatedTasks = [...tasks];
        const [draggedItem] = updatedTasks.splice(draggedIndex, 1);
        updatedTasks.splice(targetIndex, 0, draggedItem);

        persistTasks(updatedTasks);
        setDraggingId(null);
    };

    const handleDelete = (id) => {
        const wantToDelete = confirm('Do you really want to delete this task?');
        if (!wantToDelete) return;
        persistTasks(tasks.filter((task) => task.id !== id));
    };

    const activeTasks = useMemo(() => tasks.filter((task) => !task.done), [tasks]);
    const completedTasks = useMemo(() => tasks.filter((task) => task.done), [tasks]);

    return (
        <PanelCard
            title={taskListTitle}
            subtitle="Capture and prioritize your top tasks"
            icon={ListTodoIcon}
            className="min-h-[26rem]"
        >
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                <input
                    type="text"
                    value={newTask}
                    className="w-full bg-transparent px-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                    placeholder="Add a new task"
                    onInput={(e) => {
                        setNewTask(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTask();
                    }}
                />
                <button
                    type="button"
                    onClick={saveTask}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                >
                    <CirclePlusIcon size={14} />
                    Add
                </button>
            </div>

            <div className={`${tasks.length === 0 ? 'flex h-64 items-center justify-center' : ''}`}>
                {activeTasks.length ? (
                    <TaskList
                        tasks={activeTasks}
                        updateTask={updateTask}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        handleDelete={handleDelete}
                    />
                ) : (
                    <NoTaskView />
                )}
            </div>

            {!!completedTasks.length && (
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                    <button
                        type="button"
                        className="flex w-full items-center justify-between text-sm font-medium text-slate-700"
                        onClick={() => setIsShowingCompleted(!isShowingCompleted)}
                    >
                        <span className="inline-flex items-center gap-2">
                            <SparklesIcon size={16} className="text-slate-500" />
                            Completed ({completedTasks.length})
                        </span>
                        {isShowingCompleted ? <ChevronDownIcon size={18} /> : <ChevronRightIcon size={18} />}
                    </button>
                    {isShowingCompleted ? (
                        <div className="mt-3">
                            <TaskList
                                tasks={completedTasks}
                                updateTask={updateTask}
                                handleDragStart={handleDragStart}
                                handleDrop={handleDrop}
                                handleDelete={handleDelete}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </PanelCard>
    );
};

export default TasksContainer;
