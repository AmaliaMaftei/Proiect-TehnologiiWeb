import { ValidationError } from "sequelize"
import * as userService from "../services/user.js";

export const getUsers = async (req, res) => {
    res.send({ users: await userService.getUsers(req.query) });
};

export const addUser = async (req, res) => {
    try {
        const user = await userService.addUser(req.body);
        res.status(201).send(JSON.stringify(user, ' ', 2));
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).send({ message: error.message });
        }
        else {
            res.status(500).send({ message: "Request could not be handled" });
        }
    }
}