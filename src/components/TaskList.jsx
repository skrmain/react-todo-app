import Task from './Task';

const TaskList = ({ tasks, updateTask, handleDragStart, handleDrop, handleDelete }) => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col gap-3 w-full">
                {tasks?.map((task) => (
                    <Task
                        key={task.id}
                        task={task}
                        updateTask={updateTask}
                        handleDragStart={handleDragStart}
                        handleDrop={handleDrop}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default TaskList;
