import { GripVerticalIcon, PencilLineIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

const Task = ({ task, index, updateTask, handleDragStart, handleDrop, handleDelete }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div
            className={`task-enter group flex w-full items-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 transition ${
                task.done
                    ? 'border-slate-200 bg-white/70'
                    : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow'
            }`}
            style={{ '--stagger-index': index }}
            draggable={!task.done}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, task.id)}
        >
            {!task.done ? <GripVerticalIcon className="cursor-grab text-slate-400" size={18} /> : null}
            <input
                type="checkbox"
                checked={task.done}
                className="h-4 w-4 cursor-pointer accent-slate-900"
                onChange={() => {
                    updateTask({ ...task, done: !task.done });
                    if (!task.done) {
                        setIsEditing(false);
                    }
                }}
            />

            {isEditing ? (
                <input
                    value={task.title}
                    autoFocus
                    className="w-full rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-2 py-1 text-sm text-slate-800 outline-none ring-2 ring-transparent transition focus:ring-slate-300"
                    onInput={(e) => {
                        updateTask({ ...task, title: e.target.value });
                    }}
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Escape') {
                            setIsEditing(false);
                        }
                    }}
                />
            ) : (
                <div className="flex w-full items-center justify-between gap-2">
                    <p
                        onDoubleClick={() => {
                            if (!task.done) setIsEditing(true);
                        }}
                        className={`w-full truncate text-sm ${task.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                        title={task.done ? task.title : 'Double click to edit'}
                    >
                        {task.title}
                    </p>
                    {!task.done ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-[var(--radius-sm)] p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                            aria-label={`Edit ${task.title}`}
                        >
                            <PencilLineIcon size={14} />
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={() => handleDelete(task.id)}
                        className="rounded-[var(--radius-sm)] p-1 text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Delete ${task.title}`}
                    >
                        <Trash2Icon size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Task;
