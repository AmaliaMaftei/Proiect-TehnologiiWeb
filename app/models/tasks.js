const TaskStatus = {
    Open: 'open',
    Pending: 'pending',
    Completed: 'completed',
    Closed: 'closed'
};

const TaskTemplate = (db, DataTypes) => {
    return db.define("Task", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        assignee: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: TaskStatus.Open,
            allowNull: false,
            validate: {
                customValidate(value) {
                    if (!Object.values(TaskStatus).includes(value)) {
                        throw new Error("Invalid task status");
                    }
                }
            }
        }
    }, {
        timestamps: true,
        createdAt: 'creationDate',
        updatedAt: 'updatedOn'
    });
}

export { TaskTemplate, TaskStatus }
