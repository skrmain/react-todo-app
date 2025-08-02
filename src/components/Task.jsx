import { GripVerticalIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

const Task = ({ task, updateTask, handleDragStart, handleDrop, handleDelete }) => {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div
            className="flex gap-1 w-full"
            draggable={!task.done}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, task.id)}
        >
            {!task.done && <GripVerticalIcon className="cursor-grab" />}
            <input
                type="checkbox"
                checked={task.done}
                onChange={() => {
                    updateTask({ ...task, done: !task.done });
                }}
            />
            {isEditing ? (
                <input
                    value={task.title}
                    className="w-full"
                    onInput={(e) => {
                        updateTask({ ...task, title: e.target.value });
                    }}
                />
            ) : (
                <div className="flex items-center w-full justify-between">
                    <p
                        onMouseDown={() => {
                            if (task.done) return;
                            setIsEditing(true);
                        }}
                        className={`${task.done ? 'line-through' : ''}`}
                    >
                        {task.title}
                    </p>
                    <TrashIcon size={15} color="red" className="cursor-pointer" onClick={() => handleDelete(task.id)} />
                </div>
            )}
        </div>
    );
};

export default Task;
