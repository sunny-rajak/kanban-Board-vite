import { DndContext, closestCorners, DragOverlay } from "@dnd-kit/core";
import DroppableColumn from "./DroppableColumn";
import TaskCard from "./TaskCard";
import "../styles/BoardColumns.css";

export default function BoardColumns({
    tasks,
    columns,
    activeTask,
    setActiveTask,
    handleDragEnd,
    handleSmartAssign,
    setEditTask,
    handleDelete,
}) {
    console.log(
        "📊 BoardColumns → received tasks:",
        tasks.map((t) => ({ id: t._id, status: t.status }))
    );

    return (
        <DndContext
            collisionDetection={closestCorners}
            onDragStart={(event) => {
                const draggedId = event.active.id;
                const found = tasks.find((t) => t._id === draggedId);
                setActiveTask(found || null);
            }}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setActiveTask(null)}
        >
            <div className="board-grid">
                {columns.map((status) => (
                    <DroppableColumn
                        key={status}
                        status={status}
                        tasks={tasks.filter((t) => t.status === status)}
                        handleSmartAssign={handleSmartAssign}
                        activeTaskId={activeTask?.id}
                        setEditTask={setEditTask}
                        handleDelete={handleDelete}
                    />
                ))}
            </div>

            <DragOverlay>
                {activeTask && (
                    <TaskCard
                        task={activeTask}
                        handleSmartAssign={() => {}}
                        isOverlay={true}
                    />
                )}
            </DragOverlay>
        </DndContext>
    );
}
