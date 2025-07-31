import { useCallback, useEffect, useState } from 'react';
import NoTaskView from './NoTaskView';
import TaskList from './TaskList';

const DummyTasks = [
    {
        id: 1,
        title: 'Update Design for No Task View',
    },
    {
        id: 2,
        title: 'Check to remove the base url fro the URL of deployment on GitHub',
    },
];

const TasksContainer = ({ title, debugEnabled = true }) => {
    const log = useCallback(
        (...args) => {
            if (!debugEnabled) return;
            console.log(`[${title}]`, ...args);
        },
        [title, debugEnabled]
    );
    const [tasks, setTasks] = useState([...DummyTasks]);

    useEffect(() => {
        if (tasks.length === 0) {
            log('No Tasks');
            setTasks([...DummyTasks]);
        }
    }, [setTasks, tasks, log]);

    return (
        <div className="min-w-[25rem] min-h-[20rem] max-w-[30rem]  bg-slate-200 rounded p-4">
            <h2 className="text-center text-2xl">{title}</h2>

            <div className={`flex justify-center h-full ${tasks.length === 0 ? 'items-center' : 'pt-5'}`}>
                {tasks.length ? <TaskList tasks={tasks} /> : <NoTaskView />}
            </div>
        </div>
    );
};

export default TasksContainer;
