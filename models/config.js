import { DataTypes, Sequelize } from "sequelize";
import { UserTemplate, UserRoles } from "./users.js"

export const db = new Sequelize({
    dialect: "sqlite",
    storage: "action.db" 
});

export const User = UserTemplate(db, DataTypes);

User.Roles = UserRoles;

export const synchronizeDatabase = async () => {
    await db.authenticate();
    await db.sync();
};
