import { ValidationError, EmptyResultError } from "sequelize"
import * as userService from "../services/user.js";

const processError = (error, res) => {
    if ((error instanceof ValidationError) || (error instanceof EmptyResultError)) {
        res.status(400).json({ message: error.message });
    }
    else {
        res.status(500).json({ message: "Request could not be handled", err: error.message });
    }
}

export const getUsers = async (req, res) => {
    res.json({ users: await userService.getUsers(req.query) });
};

export const findByUsername = async (req, res) => {
    try {
        const user = await userService.getByUsername(req.query.username)
        res.status(200).json(user);
    } catch (error) {
        processError(error, res);
    }
}

export const getById = async (req, res) => {
    try {
        const user = await userService.getById(req.params.id);
        res.status(201).json(user);
    } catch (error) {
        processError(error, res);
    }
}

export const getTasks = async (req, res) => {
    try {
        const user = await userService.getById(req.params.id);
        const tasks = await user.getTasks({
            where: {
                status: "pending"
            }
        });

        res.status(201).json(tasks);

        // await userService.getTasks(req.params.id);
    } catch (error) {
        processError(error);
    }
}

export const addUser = async (req, res) => {
    try {
        const user = await userService.addUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        processError(error, res);
    }
}
