import { useEffect, useRef, useState } from 'react';

import NoTaskView from './NoTaskView';
import TaskList from './TaskList';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

// Task Structure = {id, title, done}

const TasksContainer = ({ taskListTitle }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isShowingCompleted, setIsShowingCompleted] = useState(false);
    const [draggingId, setDraggingId] = useState(null);
    const maxIdRef = useRef(0);

    useEffect(() => {
        const storedTasksRaw = localStorage.getItem(`Tasks-${taskListTitle}`) || '[]';
        const storedTasks = JSON.parse(storedTasksRaw);
        setTasks(storedTasks);
        maxIdRef.current = storedTasks.length
            ? storedTasks?.reduce((max, current) => (current.id > max ? current.id : max))
            : 1;
    }, [setTasks, taskListTitle]);

    const saveTask = () => {
        maxIdRef.current += 1;
        const newTaskList = [...tasks, { id: maxIdRef.current, title: newTask, done: false }];
        setTasks(newTaskList);
        setNewTask('');
        localStorage.setItem(`Tasks-${taskListTitle}`, JSON.stringify(newTaskList));
    };

    const updateTask = (updatedTask) => {
        const newTaskList = tasks.map((task) => {
            if (task.id === updatedTask.id) {
                task.title = updatedTask.title;
                task.done = updatedTask.done;
            }
            return task;
        });
        setTasks(newTaskList);
        localStorage.setItem(`Tasks-${taskListTitle}`, JSON.stringify(newTaskList));
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

        const updatedTasks = [...tasks];
        const [draggedItem] = updatedTasks.splice(draggedIndex, 1);
        updatedTasks.splice(targetIndex, 0, draggedItem);

        setTasks(updatedTasks);
        localStorage.setItem(`Tasks-${taskListTitle}`, JSON.stringify(updatedTasks));
        setDraggingId(null);
    };

    const handleDelete = (id) => {
        const wantToDelete = confirm('Do you really want to delete?');
        if (wantToDelete) {
            const newTaskList = tasks.filter((task) => task.id !== id);
            setTasks(newTaskList);
            localStorage.setItem(`Tasks-${taskListTitle}`, JSON.stringify(newTaskList));
        }
    };

    return (
        <div className="min-w-[25rem] min-h-[20rem] max-w-[30rem]  bg-slate-200 rounded p-4">
            <h2 className="text-center text-2xl">{taskListTitle}</h2>
            <div className="flex my-2">
                <input
                    type="text"
                    value={newTask}
                    className="w-full"
                    placeholder="Add a task"
                    onInput={(e) => {
                        setNewTask(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') saveTask();
                    }}
                />
            </div>
            <div className={`flex ${tasks.length === 0 ? 'h-full justify-center items-center' : 'pt-3'}`}>
                {tasks.filter((task) => !task.done).length ? (
                    <TaskList
                        tasks={tasks.filter((task) => !task.done)}
                        updateTask={updateTask}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        handleDelete={handleDelete}
                    />
                ) : (
                    <NoTaskView />
                )}
            </div>
            {!!tasks.filter((task) => task.done).length && (
                <div className="mt-3">
                    <div
                        className="flex mb-2 cursor-pointer"
                        onClick={() => setIsShowingCompleted(!isShowingCompleted)}
                    >
                        {isShowingCompleted ? <ChevronDownIcon /> : <ChevronRightIcon />}
                        Completed
                    </div>
                    <div className="ml-4">
                        {isShowingCompleted && (
                            <TaskList
                                tasks={tasks.filter((task) => task.done)}
                                updateTask={updateTask}
                                handleDragStart={handleDragStart}
                                handleDrop={handleDrop}
                                handleDelete={handleDelete}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksContainer;
