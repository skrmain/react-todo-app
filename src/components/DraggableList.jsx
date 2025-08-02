import { GripVerticalIcon } from 'lucide-react';
import { useState } from 'react';

const DraggableList = () => {
    const [draggingId, setDraggingId] = useState(null);
    const [list, setList] = useState(['Apple', 'Banana', 'Cat', 'Dog']);

    return (
        <div className="bg-slate-100 w-[15rem] p-3 rounded">
            <h2 className="text-center m-3">Draggable List</h2>
            <div className="flex flex-col">
                {list.map((v) => (
                    <div
                        key={v}
                        draggable={true}
                        onDragStart={(e) => {
                            // console.log('AA', e);
                            // e.stopPropagation();

                            // if (!e.target.closest('.drag-handle')) {
                            //     console.log('AA');

                            //     e.preventDefault(); // Cancel drag if not from handle
                            //     return;
                            // }
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggingId(v);
                            // const dragGhost = e.currentTarget;
                            // e.dataTransfer.setDragImage(dragGhost, 0, 0); // sets full row as drag image
                        }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            // setDraggingId(null);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            console.log('Dragged', draggingId, ' --> ', 'Target', v);

                            if (draggingId === null || draggingId === v) return;
                            const draggedIndex = list.findIndex((item) => item === draggingId);
                            const targetIndex = list.findIndex((item) => item === v);

                            console.log('DR', draggedIndex);
                            console.log('T', targetIndex);
                            const updatedList = [...list];
                            const [draggedItem] = updatedList.splice(draggedIndex, 1);
                            updatedList.splice(targetIndex, 0, draggedItem);

                            setList(updatedList);
                            setDraggingId(null);
                        }}
                        className={`flex gap-1 m-2 ${
                            draggingId === v ? 'opacity-50' : ''
                        } transition-all duration-200 ease-in-out`}
                    >
                        <span className="drag-handle">
                            <GripVerticalIcon className="drag-handle cursor-grab" />
                        </span>
                        <p>{v}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DraggableList;
