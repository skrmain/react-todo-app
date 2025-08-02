import Task from './Task';

const TaskList = ({ tasks, updateTask }) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-3">
                {tasks?.map((task) => (
                    <Task key={task.id} task={task} updateTask={updateTask} />
                ))}
            </div>
        </div>
    );
};

export default TaskList;
