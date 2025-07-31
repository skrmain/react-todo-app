import TasksContainer from './components/TasksContainer';

function App() {
    return (
        <>
            <h1 className="text-3xl m-4 text-center mb-9">Todo App</h1>
            <div className="flex justify-center flex-wrap gap-5">
                <TasksContainer title={'Today Tasks'} />
                {/* <TasksContainer title={'Next Priority'} />
                <TasksContainer title={'Next Year'} />
                <TasksContainer title={'Backlog'} /> */}
            </div>
        </>
    );
}

export default App;
