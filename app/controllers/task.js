import { ValidationError, EmptyResultError } from "sequelize"
import * as taskService from "../services/task.js";
import * as userService from "../services/user.js";

const processError = (error, res) => {
    if ((error instanceof ValidationError) || (error instanceof EmptyResultError)) {
        res.status(400).json({ message: error.message });
    }
    else {
        res.status(500).json({ message: "Request could not be handled", err: error.message });
    }
}

export const getTasks = async (req, res) => {
    res.json({ tasks: await taskService.getTasks(req.query) });
};

export const getById = async (req, res) => {
    try {
        const task = await taskService.getById(req.params.id);
        res.status(201).json(task);
    } catch (error) {
        processError(error, res)
    }
}

export const addTask = async (req, res) => {
    try {
        if (!req.body.reporter) {
            throw new ValidationError("Missing reporter")
        }
        if (!req.body.title) {
            throw  new ValidationError("Missing or empty title")
        }
        const reporter = await userService.getById(req.body.reporter);

        const task = await taskService.addTask(req.body, reporter);
        res.status(201).json(task);
    } catch (error) {
        processError(error, res);
    }
}

export const updateTask = async (req, res) => {
    try {
        if (!req.body.updater) {
            throw new ValidationError("Missing updater")
        }
        const updater = await userService.getById(req.body.updater);
        const updatedTask = await taskService.updateTask(req.params.id, req.body, updater);

        res.status(201).json(updatedTask);
    } catch (error) {
        processError(error, res);
    }
}