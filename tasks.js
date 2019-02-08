/*
* Catherine Javadian
* CS 554
* Lab 1
* I pledge my honor that I have abided by the Stevens Honor System.
*/

const express = require("express");
const router = express.Router();
const data = require("../data");
const taskData = data.tasks;

// Creates a task with the supplied detail and returns created object
// Fails request if not all details supplied
router.post("/", async (req, res) => {
    let newTaskData = req.body;
    try {
        let createdTask = await taskData.addTask(newTaskData.title, newTaskData.description, newTaskData.hoursEstimated, newTaskData.completed);
        res.json(createdTask);
    } catch (e) {
        console.log(e);
        res.status(500).json({error:e})
    }
});

// Adds a new comment to the task
router.post("/:id/comments", async (req, res) => {
    let newCommentData = req.body;
    try {
        let createdComment = await taskData.addComment(req.params.id, newCommentData.name, newCommentData.comment);
        res.json(createdComment);
    } catch (e) {
        res.status(404).json({message: "Comment not successfully added"});
    }
});

// Shows the task with the supplied ID
router.get("/:id", async (req, res) => {
  try {
    const task = await taskData.getTaskById(req.params.id);
    res.json(task);
  } catch (e) {
    res.status(404).json({ message: "Task not found" });
  }
});

// Shows a list of tasks
router.get("/", async (req, res) => {
  try {
    let skip = 0;
    let take = 20;
    // Cite: Function to check if a number is NaN
    // https://stackoverflow.com/questions/2652319/how-do-you-check-that-a-number-is-nan-in-javascript
    if (!isNaN(parseFloat(req.query.skip))) {
        skip = parseFloat(req.query.skip);
    } else if (!isNaN(parseFloat(req.query.skip))) {
        res.status(404).json({ error: "Skip must be a number" });
    }
    if (!isNaN(parseFloat(req.query.take))) {
        take = parseFloat(req.query.take);
    } else if (!isNaN(parseFloat(req.query.take))) {
        res.status(404).json({ error: "Take must be a number" });
    }
    const taskList = await taskData.getAllTasks(skip, take);
    res.json(taskList);
  } catch (e) {
    res.status(500).send();
  }
});

// Updates the task with the supplied ID and returns the new task object
router.put("/:id", async (req, res) => {
    try {
        let task = await taskData.getTaskById(req.params.id);
        try {
            let newTaskData = req.body;
            let updatedTask = await taskData.updateTask(req.params.id, newTaskData.title, newTaskData.description, newTaskData.hoursEstimated, newTaskData.completed);
            res.json(updatedTask);
        } catch (e) {
            res.status(500).json({error: e});
        }
    } catch (e) {
        res.status(500).send({error: "Task not found"});
    }
});

// Updates the task with the supplied ID and returns the new task object
// Calls only provide deltas of the value to update
router.patch("/:id", async (req, res) => {
    try {
        let task = await taskData.getTaskById(req.params.id);
        try {
            let newTaskData = req.body;
            let patchedTask = await taskData.patchTask(req.params.id, newTaskData);
            res.json(patchedTask);
        } catch (e) {
            res.status(500).json({error: e});
        }
    } catch (e) {
        res.status(500).send({error: "Task not found"});
    }
});

// Deletes the comment with an id of commentId on the task with an id of taskId
router.delete("/:taskId/:commentId", async (req, res) => {
    try {
        let task = await taskData.getTaskById(req.params.taskId);
        try {
            let removedComment = await taskData.deleteComment(req.params.taskId, req.params.commentId);
            res.json(removedComment);
        } catch (e) {
            res.status(500).json({error: e});
        }
    } catch (e) {
        res.status(500).send({error: e});
    }
});

module.exports = router;