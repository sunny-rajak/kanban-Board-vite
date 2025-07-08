import { useDroppable } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import "../styles/DroppableColumn.css";

export default function DroppableColumn({
    status,
    tasks,
    handleSmartAssign,
    activeTaskId,
    setEditTask,
    handleDelete,
}) {
    const { setNodeRef } = useDroppable({ id: status });
    console.log(
        "📊 BoardColumns → received tasks:",
        tasks.map((t) => ({ id: t._id, status: t.status }))
    );

    return (
        <div ref={setNodeRef} id={status} className="column-container">
            <h3 className="column-title">{status}</h3>
            <SortableContext
                items={tasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
            >
                {tasks.map((task) => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        handleSmartAssign={handleSmartAssign}
                        handleEdit={() => setEditTask(task)}
                        handleDelete={() => handleDelete(task._id)}
                        isOverlay={task._id === activeTaskId}
                    />
                ))}
            </SortableContext>
        </div>
    );
}
