const TaskList = ({ tasks }) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col gap-3">
                {tasks?.map((task) => (
                    <div key={task.id} className="flex gap-1">
                        <input type="checkbox" name="" id="" />
                        <p>{task.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
