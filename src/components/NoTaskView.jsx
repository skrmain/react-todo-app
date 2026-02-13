import { PartyPopperIcon } from 'lucide-react';

import RelaxImage from '/undraw_relaxation_jsge.svg';

const NoTaskView = () => {
    return (
        <div className="flex flex-col items-center justify-center px-4 text-center">
            <img className="mb-2 w-36 opacity-90" src={RelaxImage} alt="No task pending" />
            <h3 className="inline-flex items-center gap-2 text-base font-medium text-slate-700">
                <PartyPopperIcon size={16} className="text-emerald-600" />
                All clear for now
            </h3>
            <p className="mt-1 text-sm text-slate-500">Add your next task and keep the momentum going.</p>
        </div>
    );
};

export default NoTaskView;
