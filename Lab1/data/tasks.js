/*
* Catherine Javadian
* CS 554
* Lab 1
* I pledge my honor that I have abided by the Stevens Honor System.
*/


const mongoCollections = require("../config/mongoCollections");
const tasks = mongoCollections.tasks;
const uuid = require("node-uuid");

let exportedMethods = {
    // Shows a list of tasks TODO: .skip .limit
    // By default, it shows the first 20 tasks in the collection
    async getAllTasks(skip, take) {
        if (take > 100) {
            take = 100;
        }
        if (skip < 0) {
            skip = 0;
        }
        let taskCollection = await tasks();
        return await taskCollection.find({}, {projection:{ _id: 0}}).skip(skip).limit(take).toArray();
    },
    // Gets task by id
    async getTaskById(taskId) {
        let taskCollection = await tasks();
        let task = await taskCollection.findOne({id: taskId}, {projection:{ _id: 0}});
        if (!task) throw "Task not found";
        return task;
    },
    // Adds a task with a title, description, hoursEstimated, and whether or not it has been completed
    async addTask(title, description, hoursEstimated, completed) {
        if (!title || typeof title !== "string") throw "Need a title for a task and title must be a string";
        if (!description || typeof description !== "string") throw "Need a description for a task and description must be a string";
        if (!hoursEstimated || typeof hoursEstimated !== "number") throw "Need hours estimated for a task and hours estimated must be a number";
        if (typeof completed !== "boolean") throw "Need whether or not the task has been completed and completed must be a boolean";
        comments = [];
        let taskCollection = await tasks();
        let newTask = {
            id: uuid.v4(),
            title: title,
            description: description,
            hoursEstimated: hoursEstimated,
            completed: completed,
            comments: comments
        }
        await taskCollection.insertOne(newTask);
        return await this.getTaskById(newTask.id);
    },
    // Adds a new comment to the task
    async addComment(taskId, name, comment) {
        if (!taskId) throw "Need the task to id to add a comment";
        if (!name || typeof name !== "string") throw "A comment needs a name and it must be a string";
        if (!comment || typeof comment !== "string") throw "A comment needs a comment and it must be a string";
        let taskCollection = await tasks();
        let task = await taskCollection.findOne({id: taskId});
        if (!task) throw ("Task not found");
        let newComment = {
            id: uuid.v4(),
            name: name,
            comment: comment
        };
        await taskCollection.updateOne({id: taskId}, {$addToSet: {"comments": newComment}});
        return await this.getTaskById(taskId);
    },
    // Deletes the comment with an id of commentId on the task with an id of taskId
    async deleteComment(taskId, commentId) {
        if (!taskId || !commentId) throw "Need a taskId and a commentId";
        let taskCollection = await tasks();
        let task = await taskCollection.findOne({id: taskId});
        if (!task) throw "Task not found";
        let comment = await taskCollection.findOne({id: taskId}, {"comments": {id: commentId}});
        if (!comment) throw "Comment not found";
        await taskCollection.updateOne({id: taskId}, {$pull :{"comments": {id: commentId}}});
        return {deleted: "Comment has been deleted"};
    },
    // Updates the task with the supplied ID and returns the new task object
    // PUT calls must provide all details of the new state of the object
    // Cannot manipulate comments in this route
    async updateTask(taskId, title, description, hoursEstimated, completed) {
        if (!taskId) throw "Need a taskId";
        if (!title || typeof title !== "string") throw "Need a string for title";
        if (!description || typeof description !== "string") throw "Need a string for description";
        if (!hoursEstimated || typeof hoursEstimated !== "number") throw "Need a number for hoursEstimated";
        if (typeof completed !== "boolean") throw "Need a boolean for completed";
        let taskCollection = await tasks();
        let updatedTaskData = {
            title: title,
            description: description,
            hoursEstimated: hoursEstimated,
            completed: completed
        }
        await taskCollection.updateOne({id: taskId}, {$set: updatedTaskData});
        return await this.getTaskById(taskId);
    },
    // Updates the tasks with the supplied ID and returns the new task object
    // PATCH calls only provide deltas of the value to update
    // Cannot manipulate comments in this route
    async patchTask(taskId, patchedData) {
        if (!taskId) throw "Need a taskId";
        let taskCollection = await tasks();
        let oldTask = await taskCollection.findOne({id: taskId});
        if (!oldTask) throw "No task with that taskId exists";
        let patchedTask = {};
        if (typeof patchedData.title === "string") {
            patchedTask.title = patchedData.title;
        } else if (typeof patchedData.title !== "undefined" && typeof patchedData.title !== "string") {
            throw "Title needs to be a string";
        }
        if (typeof patchedData.description === "string") {
            patchedTask.description = patchedData.description;
        } else if (typeof patchedData.description !== "undefined" && typeof patchedData.description !== "string") {
            throw "Description needs to be a string";
        }
        if (typeof patchedData.hoursEstimated === "number") {
            patchedTask.hoursEstimated = patchedData.hoursEstimated;
        } else if (typeof patchedData.hoursEstimated !== "undefined" && typeof patchedData.hoursEstimated !== "number") {
            throw "hoursEstimated needs to be a number";
        }
        if (typeof patchedData.completed === "boolean") {
            patchedTask.completed = patchedData.completed;
        } else if (typeof patchedData.completed !== "undefined" && typeof patchedData.completed !== "boolean") {
            throw "Completed needs to be a boolean";
        }
        patchedTask.id = taskId;
        patchedTask.comments = oldTask.comments;
        await taskCollection.updateOne({id: taskId}, {$set: patchedTask});
        return await this.getTaskById(taskId);
    }
}

module.exports = exportedMethods;