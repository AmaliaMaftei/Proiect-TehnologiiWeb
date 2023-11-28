import { ValidationError, EmptyResultError } from "sequelize"
import * as userService from "../services/user.js";

export const getUsers = async (req, res) => {
    res.json({ users: await userService.getUsers(req.query) });
};

export const getById = async (req, res) => {
    const user = await userService.getById(req.params.id);

    if (!!user) {
        res.status(201).json(user);
    }
    else {
        res.status(404).json({message: "No such user"});
    }
}

export const addUser = async (req, res) => {
    try {
        const user = await userService.addUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        if ((error instanceof ValidationError) || (error instanceof EmptyResultError)) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Request could not be handled" });
        }
    }
}
