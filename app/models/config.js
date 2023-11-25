import { DataTypes, Sequelize } from "sequelize";
import { UserTemplate, UserRoles } from "./users.js"
import { TaskTemplate, TaskStatus,  } from "./tasks.js"

export const db = new Sequelize({
    dialect: "sqlite",
    storage: "action.db" 
});

export const User = UserTemplate(db, DataTypes);
export const Task = TaskTemplate(db, DataTypes);

Task.hasOne(User, { through: "assignee" });
User.hasMany(Task);

export const synchronizeDatabase = async () => {
    await db.authenticate();
    await db.sync();
};
