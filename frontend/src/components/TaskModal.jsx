import { useState, useEffect } from "react";
import "../styles/TaskModal.css";

export default function TaskModal({
    initialData = {},
    onClose,
    onSubmit,
    isEdit = false,
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [error, setError] = useState("");

    useEffect(() => {
        if (initialData.title) setTitle(initialData.title);
        if (initialData.description) setDescription(initialData.description);
        if (initialData.priority) setPriority(initialData.priority);
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        onSubmit({ ...initialData, title, description, priority });
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>{isEdit ? "Edit Task" : "Create Task"}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                    {error && <p className="error-text">{error}</p>}
                    <button type="submit" className="btn btn-purple">
                        {isEdit ? "Save Changes" : "Create Task"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-cancel"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
