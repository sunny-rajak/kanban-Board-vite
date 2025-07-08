import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "../api/axios";
import Header from "../components/Header";
import BoardColumns from "../components/BoardColumns";
import ActionLog from "../components/ActionLog";
import TaskModal from "../components/TaskModal";
import "../styles/kanban.css";

export default function KanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTask, setActiveTask] = useState(null);
    const columns = ["Todo", "In Progress", "Done"];
    const [editTask, setEditTask] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.on("taskCreated", (task) => {
            setTasks((prev) => [...prev, task]);
        });
        socket.on("taskUpdated", (updatedTask) => {
            setTasks((prev) =>
                prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
            );
        });
        return () => socket.disconnect();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching tasks:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async ({ title, description, priority }) => {
        try {
            await axios.post("/tasks", { title, description, priority });
            setShowCreateModal(false);
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    const handleSmartAssign = async (taskId) => {
        try {
            await axios.post(`/tasks/${taskId}/smart-assign`);
            await fetchTasks();
        } catch (err) {
            console.error("Error assigning task:", err);
        }
    };

    const handleTaskUpdate = async (updatedTask) => {
        try {
            await axios.put(`/tasks/${updatedTask._id}`, updatedTask);
            await fetchTasks();
            setEditTask(null);
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?"))
            return;
        try {
            await axios.delete(`/tasks/${taskId}`);
            await fetchTasks();
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveTask(null);
        if (!over) return;

        const activeId = active.id;
        const newStatus = over.id;

        if (!columns.includes(newStatus)) return;

        try {
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === activeId
                        ? { ...task, status: newStatus }
                        : task
                )
            );

            await axios.patch(`/tasks/${activeId}`, { status: newStatus });
            // await fetchTasks();
        } catch (err) {
            console.error("Error updating status:", err);
        }
        console.log("Dropped:", active.id, " →", over?.id);
    };
    console.log(
        "🧩 KanbanBoard → tasks state:",
        tasks.map((t) => ({ id: t._id, status: t.status }))
    );

    return (
        <div className="kanban-wrapper">
            <Header currentUser={currentUser} setCurrentUser={setCurrentUser} />

            {loading ? (
                <div className="kanban-loading">Loading tasks...</div>
            ) : (
                <div className="kanban-section">
                    <BoardColumns
                        tasks={tasks}
                        columns={columns}
                        activeTask={activeTask}
                        setActiveTask={setActiveTask}
                        handleDragEnd={handleDragEnd}
                        handleSmartAssign={handleSmartAssign}
                        setEditTask={setEditTask}
                        handleDelete={handleDelete}
                    />
                </div>
            )}

            <div className="kanban-section">
                {currentUser ? (
                    <button
                        className="btn btn-purple"
                        onClick={() => setShowCreateModal(true)}
                    >
                        + Create Task
                    </button>
                ) : (
                    <div className="not-loggedin-message">
                        Please <a href="/login">login</a> to create tasks.
                    </div>
                )}

                {showCreateModal && (
                    <TaskModal
                        onClose={() => setShowCreateModal(false)}
                        onSubmit={handleCreate}
                    />
                )}
            </div>

            <div className="kanban-section">
                {editTask && (
                    <TaskModal
                        initialData={editTask}
                        onClose={() => setEditTask(null)}
                        onSubmit={handleTaskUpdate}
                        isEdit={true}
                    />
                )}
            </div>

            <div className="kanban-section">
                <ActionLog />
            </div>
        </div>
    );
}
