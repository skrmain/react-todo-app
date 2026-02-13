import { GripVerticalIcon, HandIcon } from 'lucide-react';
import { useState } from 'react';

import PanelCard from './PanelCard';

const DraggableList = () => {
    const [draggingId, setDraggingId] = useState(null);
    const [list, setList] = useState(['Apple', 'Banana', 'Cat', 'Dog']);

    const handleDrop = (target) => {
        if (draggingId === null || draggingId === target) return;

        const draggedIndex = list.findIndex((item) => item === draggingId);
        const targetIndex = list.findIndex((item) => item === target);
        if (draggedIndex < 0 || targetIndex < 0) return;

        const updatedList = [...list];
        const [draggedItem] = updatedList.splice(draggedIndex, 1);
        updatedList.splice(targetIndex, 0, draggedItem);

        setList(updatedList);
        setDraggingId(null);
    };

    return (
        <PanelCard
            title="Drag Demo"
            subtitle="Practice ordering a simple list"
            icon={HandIcon}
            className="lg:sticky lg:top-6"
        >
            <div className="flex flex-col gap-2">
                {list.map((item) => (
                    <div
                        key={item}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggingId(item);
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleDrop(item);
                        }}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${
                            draggingId === item
                                ? 'border-slate-300 bg-slate-100 opacity-60'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                        <GripVerticalIcon size={16} className="text-slate-400" />
                        <p className="text-slate-700">{item}</p>
                    </div>
                ))}
            </div>
        </PanelCard>
    );
};

export default DraggableList;
