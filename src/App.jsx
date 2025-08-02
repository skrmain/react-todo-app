import DraggableList from './components/DraggableList';
import TasksContainer from './components/TasksContainer';

function App() {
    return (
        <>
            <h1 className="text-3xl m-4 text-center mb-9">Todo App</h1>
            <div className="flex justify-center flex-wrap gap-5">
                <TasksContainer taskListTitle={'Today Tasks'} />
                {/* <TasksContainer taskListTitle={'Next Priority'} /> */}
                {/* <TasksContainer taskListTitle={'Next Year'} /> */}
                {/* <TasksContainer taskListTitle={'Backlog'} /> */}
                <DraggableList />
            </div>
        </>
    );
}

export default App;
