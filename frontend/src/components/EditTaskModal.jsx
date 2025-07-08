import { useState } from "react";
import "../styles/EditTaskModal.css";

export default function EditTaskModal({ task, onClose, onSave }) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority);
    const [error, setError] = useState("");

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        onSave({ ...task, title, description, priority });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Edit Task</h3>
                <form onSubmit={handleUpdate} className="space-y-2">
                    <input
                        autoFocus
                        value={title}
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" className="btn btn-purple">
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-delete"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
