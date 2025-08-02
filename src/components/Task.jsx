import { useState } from 'react';

const Task = ({ task, updateTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    return (
        <div className="flex gap-1">
            <input type="checkbox" />
            {isEditing ? (
                <input
                    value={task.title}
                    className="w-full"
                    onInput={(e) => {
                        updateTask(task.id, e.target.value);
                    }}
                />
            ) : (
                <p
                    onMouseDown={(e) => {
                        console.log('E', e);
                        setIsEditing(true);
                    }}
                >
                    {task.title}
                </p>
            )}
        </div>
    );
};

export default Task;
