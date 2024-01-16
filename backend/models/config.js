import { DataTypes, Sequelize } from "sequelize";
import { UserTemplate, UserRoles } from "./users.js"
import { TaskTemplate, TaskStatus } from "./tasks.js"

export const db = new Sequelize({
    dialect: "sqlite",
    storage: "action.db"
});

export const User = UserTemplate(db, DataTypes);
export const Task = TaskTemplate(db, DataTypes);

User.hasMany(Task, {
    foreignKey: 'assignee'
});

Task.belongsTo(User, {
    foreignKey: 'assignee',
    constraints: false
})

User.Roles = UserRoles;
Task.Status = TaskStatus;

const addAdminUser = async () => {
    const users = await User.findAll();

    if (0 === users.length) {
        User.create({
            name: "Admin",
            role: 0,
            addedBy: 0
        })
    }
}

export const synchronizeDatabase = async () => {
    await db.authenticate();
    await db.sync();
    await addAdminUser();
};
