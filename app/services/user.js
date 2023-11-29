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

export const getTasks = async (user) => {
    // unused
}

export const addUser = async (user) => {
    const _creator = await getById(user.addedBy);

    if ((_creator.role >= user.role) && (_creator.role !== User.Roles.Admin)) {
        throw new ValidationError("This user cannot add another users");
    }

    return await User.create(user);
}
