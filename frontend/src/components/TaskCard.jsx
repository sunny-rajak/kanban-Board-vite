import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragHandle } from "react-icons/md";
import "../styles/TaskCard.css";

export default function TaskCard({
    task,
    handleSmartAssign,
    handleEdit,
    handleDelete,
    isOverlay = false,
}) {
    console.log("🧱 TaskCard Render →", task._id, "status:", task.status);

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: task._id });

    console.log("Rendering TaskCard", task._id, "status:", task.status);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isOverlay ? 50 : undefined,
    };
    return (
        <div
            ref={!isOverlay ? setNodeRef : null}
            style={style}
            className="task-card"
        >
            {/* Drag handle */}
            {!isOverlay && (
                <div
                    {...attributes}
                    {...listeners}
                    className="drag-handle"
                    title="Drag task"
                >
                    <MdDragHandle />
                </div>
            )}
            <h4 className="task-title">{task.title}</h4>
            <p className="task-desc">{task.description}</p>
            <p className="task-meta">Priority: {task.priority}</p>
            <p className="task-meta">
                Assigned To: {task.assignedTo?.username || "Unassigned"}
            </p>
            {!isOverlay && (
                // <button
                //     onClick={() => handleSmartAssign(task._id)}
                //     className="task-assign-btn"
                // >
                //     Smart Assign
                // </button>

                <div className="task-buttons">
                    <button
                        onClick={() => handleSmartAssign(task._id)}
                        className="btn btn-assign"
                    >
                        Smart Assign
                    </button>
                    <button
                        onClick={() => handleEdit(task)}
                        className="btn btn-edit"
                        title="Edit"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(task._id)}
                        className="btn btn-delete"
                        title="Delete"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
