import { useEffect, useState } from 'react';

import NoTaskView from './NoTaskView';
import TaskList from './TaskList';

// Task Structure = {id, title}

const TasksContainer = ({ title }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const saveTask = () => {
        const newTaskList = [...tasks, { id: 5, title: newTask }];
        setTasks(newTaskList);
        setNewTask('');
        localStorage.setItem(`Tasks-${title}`, JSON.stringify(newTaskList));
    };

    useEffect(() => {
        const storedTasksRaw = localStorage.getItem(`Tasks-${title}`) || '[]';
        const storedTasks = JSON.parse(storedTasksRaw);
        setTasks(storedTasks);
    }, [setTasks, title]);

    return (
        <div className="min-w-[25rem] min-h-[20rem] max-w-[30rem]  bg-slate-200 rounded p-4">
            <h2 className="text-center text-2xl">{title}</h2>
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
                {tasks.length ? <TaskList tasks={tasks} /> : <NoTaskView />}
            </div>
        </div>
    );
};

export default TasksContainer;
