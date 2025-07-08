import { useState } from "react";
import "../styles/CreateTask.css";

export default function CreateTask({ onCreate }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("Title is required.");
            return;
        }

        try {
            await onCreate({ title, description, priority });

            setTitle("");
            setDescription("");
            setPriority("Medium");
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to create task.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="create-task-form">
            <h3>Create New Task</h3>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Description"
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
            {error && <div className="error-text">{error}</div>}
            <button type="submit">Create Task</button>
        </form>
    );
}
