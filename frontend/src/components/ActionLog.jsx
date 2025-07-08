import { useEffect, useState } from "react";
import axios from "../api/axios";
import "../styles/ActionLog.css";

export default function ActionLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get("/tasks/logs/recent");
            setLogs(res.data);
        } catch (err) {
            console.error("Error fetching logs:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="action-log-container">
            <h3 className="action-log-title">Recent Activity Log</h3>
            {loading ? (
                <p>Loading logs...</p>
            ) : logs.length === 0 ? (
                <p className="action-log-empty">No recent activity</p>
            ) : (
                <ul className="action-log-list">
                    {logs.map((log) => (
                        <li key={log._id} className="action-log-item">
                            <span className="action-log-user">
                                {log.user?.username || "Unknown User"}
                            </span>{" "}
                            {log.action}{" "}
                            <span className="action-log-task">
                                {log.task?.title ? `(${log.task.title})` : ""}
                            </span>
                            <div className="action-log-time">
                                {new Date(log.timestamp).toLocaleString()}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
