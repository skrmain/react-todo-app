import RelaxImage from '/undraw_relaxation_jsge.svg';

const NoTaskView = () => {
    return (
        <div className="flex justify-center flex-col">
            <img className="w-[10rem]" src={RelaxImage} alt="No Task" />
            <h3 className="text-center">No Task</h3>
        </div>
    );
};

export default NoTaskView;
