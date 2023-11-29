const UserRoles = {
    Admin: 0,
    Manager: 1,
    Executor: 2
}

const UserTemplate = (db, DataTypes) => {
    return db.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            validate: {
                customValidate(value) {
                    if (!Object.values(UserRoles).includes(value)) {
                        throw new Error("Invalid user role");
                    }
                    if ((this.role === UserRoles.Executor) && (!this.manager)) {
                        throw new Error("Manager not provided");
                    }
                }
            },
            allowNull: false
        },
        manager: {
            type: DataTypes.INTEGER,
        },
        addedBy: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};

export { UserTemplate, UserRoles };
