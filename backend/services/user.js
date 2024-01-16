import { Op, ValidationError, EmptyResultError } from "sequelize";
import { User } from "../models/config.js";

export const getUsers = async (query) => {
    return await User.findAll();
};

export const getById = async (_id) => {
    const user = await User.findOne({ where: { id: _id } });
    if (!user) {
        throw new EmptyResultError("No such user");
    }
    return user;
}

export const getByUsername = async (un) => {
    const user = await User.findOne({ where: { name: un } });
    if (!user) {
        throw new EmptyResultError("No such user");
    }
    return user;
}

export const getTasks = async (user) => {
}

export const addUser = async (user) => {
    const _creator = await getById(user.addedBy);
    const _manager = await getById(user.manager);

    if ((_creator.role !== User.Roles.Admin)) {
        throw new ValidationError("This user cannot add another users");
    }

    if (_manager.role !== User.Roles.Manager) {
        throw new ValidationError("Provider user is not an manager");
    }

    return await User.create(user);
}
