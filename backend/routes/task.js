const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const ActionLog = require("../models/ActionLog");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Task
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        // Validate title
        const existing = await Task.findOne({ title });
        if (existing) {
            return res
                .status(400)
                .json({ message: "Task title must be unique" });
        }
        if (["Todo", "In Progress", "Done"].includes(title)) {
            return res
                .status(400)
                .json({ message: "Title cannot match column names" });
        }

        const task = new Task({
            title,
            description,
            priority,
        });
        await task.save();

        // Log action
        await ActionLog.create({
            action: `created task "${title}"`,
            user: req.user.id,
            task: task._id,
        });

        // Emit real-time update
        const io = req.app.get("socketio");
        io.emit("taskCreated", task);

        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get All Tasks
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find().populate(
            "assignedTo",
            "username email"
        );
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            description,
            status,
            priority,
            assignedTo,
            clientUpdatedAt,
        } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Check for conflict
        if (clientUpdatedAt && new Date(clientUpdatedAt) < task.updatedAt) {
            return res.status(409).json({
                message: "Conflict detected",
                serverTask: task,
            });
        }

        if (title && title !== task.title) {
            const existing = await Task.findOne({ title });
            if (existing) {
                return res
                    .status(400)
                    .json({ message: "Task title must be unique" });
            }
            if (["Todo", "In Progress", "Done"].includes(title)) {
                return res
                    .status(400)
                    .json({ message: "Title cannot match column names" });
            }
        }

        // Update fields
        if (title) task.title = title;
        if (description) task.description = description;
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (assignedTo) task.assignedTo = assignedTo;

        await task.save();

        // Log action
        await ActionLog.create({
            action: `updated task "${task.title}"`,
            user: req.user.id,
            task: task._id,
        });

        const io = req.app.get("socketio");
        io.emit("taskUpdated", task);

        res.json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete Task
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        await Task.deleteOne({ _id: task._id });

        // Log action
        await ActionLog.create({
            action: `deleted task "${task.title}"`,
            user: req.user.id,
            task: task._id,
        });

        const io = req.app.get("socketio");
        io.emit("taskDeleted", { id: req.params.id });

        res.json({ message: "Task deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Smart Assign
router.post("/:id/smart-assign", authMiddleware, async (req, res) => {
    try {
        // 1. Find all users
        const users = await Task.aggregate([
            {
                $match: { status: { $ne: "Done" } },
            },
            {
                $group: {
                    _id: "$assignedTo",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Build a map: userId -> active task count
        const counts = {};
        users.forEach((u) => {
            if (u._id) counts[u._id.toString()] = u.count;
        });

        // Find all users in the system
        const User = require("../models/User");
        const allUsers = await User.find();

        let minTasks = Infinity;
        let selectedUser = null;

        for (const user of allUsers) {
            const taskCount = counts[user._id.toString()] || 0;
            if (taskCount < minTasks) {
                minTasks = taskCount;
                selectedUser = user;
            }
        }

        if (!selectedUser) {
            return res.status(400).json({ message: "No users to assign" });
        }

        // Update task assignment
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.assignedTo = selectedUser._id;
        await task.save();

        // Log action
        await ActionLog.create({
            action: `smart assigned task "${task.title}" to ${selectedUser.username}`,
            user: req.user.id,
            task: task._id,
        });

        const io = req.app.get("socketio");
        io.emit("taskUpdated", task); // 🔥 real-time update to frontend

        res.json({
            message: `Assigned to ${selectedUser.username}`,
            task,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/logs/recent", authMiddleware, async (req, res) => {
    try {
        const logs = await ActionLog.find()
            .populate("user", "username")
            .populate("task", "title")
            .sort({ timestamp: -1 })
            .limit(20);

        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update task status
router.patch("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        ).populate("assignedTo", "username");
        const io = req.app.get("socketio");
        io.emit("taskUpdated", updatedTask); // ✅ notify clients
        res.json(updatedTask);
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ message: "Server error updating status" });
    }
});
module.exports = router;
