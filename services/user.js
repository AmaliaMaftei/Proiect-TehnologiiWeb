import { Op, ValidationError } from "sequelize";
import { User } from "../models/config.js";

export const getUsers = async (query) => {
    return await User.findAll();
};

const getUserById = async (_id) => {
    return await User.findOne({ where: { id: _id } });
}

export const addUser = async (user) => {
    const _creator = await getUserById(user.addedBy);
    if ((_creator.role >= user.role) && (_creator.role !== User.Roles.Admin)) {
        throw new ValidationError("This user cannot add another users");
    }

    return await User.create(user);
}
