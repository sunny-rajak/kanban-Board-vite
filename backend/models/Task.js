const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["Todo", "In Progress", "Done"],
            default: "Todo",
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
