const UserRoles = {
    Admin: 'admin',
    Manager: 'manager',
    Executor: 'executor'
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
            type: DataTypes.STRING,
            validate: {
                customValidate(value) {
                    if (!Object.values(UserRoles).includes(value)) {
                        throw new Error("Invalid user role");
                    }
                }
            },
            allowNull: false
        },
        manager: {
            type: DataTypes.INTEGER,
            validate: {
                customValidate(value) {
                    if ((this.role === UserRoles.Executor) && (!!value)) {
                        throw new Error("Mandatory for this user type");
                    }
                }
            }
        }
    });
};

export { UserTemplate, UserRoles };
