import { useEffect, useRef, useState } from 'react';

import NoTaskView from './NoTaskView';
import TaskList from './TaskList';

// Task Structure = {id, title}

const TasksContainer = ({ taskListTitle }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const maxIdRef = useRef(0);

    const saveTask = () => {
        maxIdRef.current += 1;
        const newTaskList = [...tasks, { id: maxIdRef.current, title: newTask }];
        setTasks(newTaskList);
        setNewTask('');
        localStorage.setItem(`Tasks-${taskListTitle}`, JSON.stringify(newTaskList));
    };

    const updateTask = (id, title) => {
        const newTaskList = tasks.map((task) => {
            if (task.id === id) {
                task.title = title;
            }
            return task;
        });
        setTasks(newTaskList);
        localStorage.setItem(`Tasks-${taskListTitle}`, JSON.stringify(newTaskList));
    };

    useEffect(() => {
        const storedTasksRaw = localStorage.getItem(`Tasks-${taskListTitle}`) || '[]';
        const storedTasks = JSON.parse(storedTasksRaw);
        setTasks(storedTasks);
        maxIdRef.current = storedTasks.length
            ? storedTasks?.reduce((max, current) => (current.id > max ? current.id : max))
            : 1;
    }, [setTasks, taskListTitle]);

    return (
        <div className="min-w-[25rem] min-h-[20rem] max-w-[30rem]  bg-slate-200 rounded p-4">
            <h2 className="text-center text-2xl">{taskListTitle}</h2>
            <div className="mb-4 flex my-4">
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
            <div className={`flex h-full ${tasks.length === 0 ? 'justify-center items-center' : 'pt-5'}`}>
                {tasks.length ? <TaskList tasks={tasks} updateTask={updateTask} /> : <NoTaskView />}
            </div>
        </div>
    );
};

export default TasksContainer;
