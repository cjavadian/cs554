/*
* Catherine Javadian
* CS 554
* Lab 1
* I pledge my honor that I have abided by the Stevens Honor System.
*/

const tasksRoutes = require("./tasks");

const constructorMethod = app => {
    app.use("/api/tasks", tasksRoutes);

    app.use("*", (req, res) => {
        res.status(404).json({error: "Not found"});
    });
};

module.exports = constructorMethod;