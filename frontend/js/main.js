let admin_panel = document.getElementById("admin_panel");
let manager_panel = document.getElementById("manager_panel");
let executor_panel = document.getElementById("executor_panel");

let task_list_box = document.getElementById("task-list-box");

async function handleLogin() {
    let username = document.getElementById("username").value;
    const response = await fetch("http://localhost:8080/api/v1/users/search?username=" + username, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.status === 200) {
        const data = await response.json();
        sessionStorage.setItem('user-data', JSON.stringify(data));
        
        switch (data.role) {
            case 0:
                admin_panel.style.display = "block";
                break;
            case 1:
                manager_panel.style.display = "block";
                break;
            case 2:
                executor_panel.style.display = "block";
                break;
            default:
                break;
        }
    } else {
        alert("Username invalid.");
    }
}

function displayAddTask() {
    const add_task_box = document.getElementById('add-task-box');
    add_task_box.style.display = "block";
}




function createTaskElement(taskData) {
    const userData = JSON.parse(sessionStorage.getItem('user-data'));

    var taskElement = document.createElement('div');
    taskElement.classList.add('details-container');
    
    let bgColor;
    let borderColor;
    if (taskData.status === "open") {
        bgColor = "#f8d7da";
        borderColor = "#e06a6a";
    } else if (taskData.status === "pending") {
        bgColor = "#f8f8da";
        borderColor = "#e0e06a";
    } else if (taskData.status === "completed") {
        bgColor = "#d8f8da";
        borderColor = "#6ae06a";
    }
    taskElement.style.backgroundColor = bgColor;
    taskElement.style.borderColor = borderColor;

    function createAndAppendElement(className, labelText, value) {
        var element = document.createElement('div');
        element.textContent = labelText + value;
        element.classList.add(className, 'item-data-element'); 
        return element;
    }

    var idElement = createAndAppendElement('task-id', 'ID: ', taskData.id);
    var titleElement = createAndAppendElement('task-title', 'Title: ', taskData.title);
    var descriptionElement = createAndAppendElement('task-description', 'Description: ', taskData.description);
    var assigneeElement = createAndAppendElement('task-assignee', 'Assignee: ', taskData.assignee);
    var statusElement = createAndAppendElement('task-status', 'Status: ', taskData.status);
    var createdAtElement = createAndAppendElement('task-created-at', 'Created At: ', taskData.createdAt);
    var updatedAtElement = createAndAppendElement('task-updated-at', 'Updated At: ', taskData.updatedAt);
    var updateButton = document.createElement('button');
    var finishButton = document.createElement('button');

    taskElement.appendChild(idElement);
    taskElement.appendChild(titleElement);
    taskElement.appendChild(descriptionElement);
    taskElement.appendChild(assigneeElement);
    taskElement.appendChild(statusElement);
    taskElement.appendChild(createdAtElement);
    taskElement.appendChild(updatedAtElement);

    if (userData.role != 2) {
        updateButton.textContent = 'UPDATE';
        updateButton.classList.add('btn', 'btn-primary', 'item-data-element'); 
        updateButton.addEventListener('click', function () {
            updateTaskDetails(taskData);
        });
        taskElement.appendChild(updateButton);
    } else if (taskData.status === "pending") {
        finishButton.textContent = 'FINISH';
        finishButton.classList.add('btn', 'btn-secondary', 'item-data-element');
        finishButton.addEventListener('click', function () {
            finishTask(taskData.id);
        });
        taskElement.appendChild(finishButton);
    }

    return taskElement;
}

function finishTask(id) {
    const userData = JSON.parse(sessionStorage.getItem('user-data'));

    fetch("http://localhost:8080/api/v1/tasks/" + id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            updater: userData.id,
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        viewTasks();
        const add_task_box = document.getElementById('add-task-box');
        add_task_box.style.display = "none";
    });
}


function viewTasks() {
    const userData = JSON.parse(sessionStorage.getItem('user-data'));

    fetch("http://localhost:8080/api/v1/tasks", {
        method: "GET"
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        let tasks = data["tasks"].map(task => {
            let date = new Date(task.createdAt);
            let day = String(date.getDate()).padStart(2, '0');
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let year = date.getFullYear();
            task.createdAt = day + '/' + month + '/' + year;

            date = new Date(task.updatedAt);
            day = String(date.getDate()).padStart(2, '0');
            month = String(date.getMonth() + 1).padStart(2, '0');
            year = date.getFullYear();
            task.updatedAt = day + '/' + month + '/' + year;
            return task;
        });

        let assignedTasks = tasks.filter(el => el.assignee === userData.id);

        const task_list_box = document.getElementById('task-list-box');
        task_list_box.replaceChildren();
        task_list_box.style.display = "block";

        if (userData.role === 2) {
            assignedTasks.forEach(taskData => {
                task_list_box.appendChild(createTaskElement(taskData));
            })
        }

        if (userData.role === 0 || userData.role === 1) {
            tasks.forEach(taskData => {
                task_list_box.appendChild(createTaskElement(taskData));
            })
        }
    });
}

function addTask() {
    const userData = sessionStorage.getItem('user-data');

    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;

    const requestBody = {
        title: title,
        description: description,
        reporter: JSON.parse(userData).id
    }
    console.log(JSON.stringify(requestBody));

    fetch("http://localhost:8080/api/v1/tasks/", {
        method: "POST",
        mode: "cors",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        viewTasks();
        const add_task_box = document.getElementById('add-task-box');
        add_task_box.style.display = "none";
    });
}


function updateTaskDetails(task) {
    var updateFormContainer = document.createElement('div');
    updateFormContainer.classList.add('rendered-form');


    function createFormElement(type, label, name, id, value, required) {
        var formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        var formLabel = document.createElement('label');
        formLabel.setAttribute('for', id);
        formLabel.classList.add('formbuilder-' + type + '-label');
        formLabel.textContent = label;

        var formElement = document.createElement(type === 'textarea' ? 'textarea' : (type === 'select' ? 'select' : 'input'));
        formElement.setAttribute('type', type);
        formElement.setAttribute('class', 'form-control');
        formElement.setAttribute('name', name);
        formElement.setAttribute('id', id);
        formElement.setAttribute('access', 'false');
        formElement.setAttribute('required', required ? 'required' : '');
        formElement.setAttribute('aria-required', required ? 'true' : '');

        if (type === 'select') {
            var options = ['open', 'pending', 'completed'];
            options.forEach(function (option, index) {
                var optionElement = document.createElement('option');
                optionElement.setAttribute('value', option);
                optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);

                formElement.appendChild(optionElement);
            });
            formElement.classList.add('form-control-select'); 
        } else {
            formElement.value = value || '';
        }

        formGroup.appendChild(formLabel);
        formGroup.appendChild(formElement);

        return formGroup;
    }

    var titleElement = createFormElement('text', 'Task title', 'task-title', 'task-title', task.title, true);
    var descriptionElement = createFormElement('textarea', 'Task description', 'task-description', 'task-description', task.description, true);
    var assigneeElement = createFormElement('text', 'Assignee', 'task-assignee', 'task-assignee', task.assignee);
    var statusElement = createFormElement('select', 'Status', 'task-status', 'task-status', task.status, true);

    // Create update button
    var updateButton = document.createElement('button');
    updateButton.type = 'submit';
    updateButton.textContent = 'Update Task';
    updateButton.classList.add('btn', 'btn-primary');
    updateButton.addEventListener('click', function () {
        let assignee = document.getElementById('task-assignee').value;
        updatedTask = {
            id: task.id,
            title: document.getElementById('task-title').value,
            description: document.getElementById('task-description').value,
            assignee: assignee ? assignee : undefined,
            status: document.getElementById('task-status').value
        }
        updateTask(updatedTask);
    });

    updateFormContainer.appendChild(titleElement);
    updateFormContainer.appendChild(descriptionElement);
    updateFormContainer.appendChild(assigneeElement);
    updateFormContainer.appendChild(statusElement);
    updateFormContainer.appendChild(updateButton);

 
    document.getElementById('single-item-box').innerHTML = '';
    document.getElementById('single-item-box').appendChild(updateFormContainer);
}


function updateTask(task) {
    var userData = JSON.parse(sessionStorage.getItem('user-data'));

    let requestBody = JSON.stringify({
        ...task,
        updater: userData.id
    });
    console.log(requestBody);

    fetch("http://localhost:8080/api/v1/tasks/" + task.id, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: requestBody
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        viewTasks();
    });
}
