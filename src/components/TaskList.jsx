import Task from './Task';

const TaskList = ({ tasks, updateTask, handleDragStart, handleDrop, handleDelete }) => {
    return (
        <div className="flex w-full flex-col gap-2">
            {tasks?.map((task, index) => (
                <Task
                    key={task.id}
                    task={task}
                    index={index}
                    updateTask={updateTask}
                    handleDragStart={handleDragStart}
                    handleDrop={handleDrop}
                    handleDelete={handleDelete}
                />
            ))}
        </div>
    );
};

export default TaskList;
