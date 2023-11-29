import { Op, ValidationError, EmptyResultError } from "sequelize";
import { Task, User } from "../models/config.js";

export const getTasks = async (query) => {
    return await Task.findAll();
};

export const getById = async (_id) => {
    const task = await Task.findOne({ where: { id: _id } });
    if (!task) {
        throw new EmptyResultError("No such task");
    }
    return task;
}

export const addTask = async (task, reporter) => {
    if (reporter.role !== User.Roles.Manager) {
        throw new ValidationError("User can't add tasks");
    }
    return await Task.create(task);
}

export const updateTask = async (id, taskUpdateData, updater) => {

    const task = await getById(id);

    delete taskUpdateData.id;

    if (updater.role === User.Roles.Executor) {
        if (!!taskUpdateData.title || !!taskUpdateData.description || !!taskUpdateData.assignee 
            || (updater.id != task.assignee)) {
            throw new ValidationError("Invalid action for Executor");
        }
        if (!!taskUpdateData.status && (taskUpdateData.status !== Task.Status.Completed)) {
            throw new ValidationError(`Executor can't set task status to ${taskUpdateData.status}`)
        }
        taskUpdateData.status = Task.Status.Completed;
    } 
    else if (updater.role === User.Roles.Manager) {
        if (task.status === Task.Status.Open) {
            // assignee mandatory
        }
        else if (task.status === Task.Status.Completed) {
            // 
        }
        if (!!taskUpdateData.status && (taskUpdateData.status !== Task.Status.Pending) 
            && (task.status !== Task.Status.Completed)) {
            throw new ValidationError("Invalid task transition");
        }
        else if (!taskUpdateData.assignee) {
            throw new ValidationError("Missing assignee");
        }
        else if (!!taskUpdateData.assignee && (task.status === Task.Status.Open)) {
            taskUpdateData.status = Task.Status.Pending;
        }
    }

    task.set({...taskUpdateData})
    await task.save();

    return task;
}
