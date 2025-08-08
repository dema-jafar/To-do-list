const inputText = document.getElementById('inputText');
const addButton = document.getElementById('addButton');
const tasksList = document.getElementById('tasksList');

// load tasks from localstorage when the page loads
let tasks = JSON.parse(localStorage.getItem('tasks') || []);

// function to display tasks on the page
function renderTasks() {
    tasksList.innerHTML = '';

    tasks.forEach((task , index) => {
        const li = document.createElement('li');
        

        if (task.isUpdating) {
            // show input field for editing
            const input = document.createElement('input');
            const saveButton = document.createElement('button');
            const cancleButton = document.createElement('button');
            input.type = 'text';
            input.value = task.text;
            setTimeout(() => input.focus(),0)
            input.classList.add('updateInput');
            saveButton.textContent = 'Save';
            cancleButton.textContent = 'cancel';
            saveButton.classList.add('updateButton');
            cancleButton.classList.add('updateButton')

            saveButton.addEventListener('click' , ()=> {
                task.text = input.value.trim();
                task.isUpdating = false;
                saveTasks();
                renderTasks();
            })

            cancleButton.addEventListener('click' , ()=> {
                task.isUpdating = false;
                saveTasks();
                renderTasks();
            })

            input.addEventListener('keydown' , (e)=> {
                if (e.key === 'Enter') {
                    task.text = input.value.trim();
                    task.isUpdating = false;
                    saveTasks();
                    renderTasks();  
                }
            })

            const div = document.createElement('div');

            li.appendChild(input);
            div.appendChild(cancleButton);
            div.appendChild(saveButton);
            li.appendChild(div);
            tasksList.appendChild(li);
        } else {
            // show normal task
            li.textContent = task.text;

            // if the task is completed
            if (task.completed) {
                li.classList.add('completed');
            }

            // create delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('listButton');

            // create update button
            const updateButton = document.createElement('button');
            updateButton.textContent = '✏️';
            updateButton.classList.add('listButton');

            // toggle completed status on task click
            li.addEventListener('click' , (e)=> {
                // e.stopPropagation();
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            })

            // delete task when delete button is clicked
            deleteButton.addEventListener('click' , ()=> {
                tasks.splice(index , 1);
                saveTasks();
                renderTasks();
            })

            // edit task when edit button is clicked
            updateButton.addEventListener('click' , (e)=> {
                e.stopPropagation();
                task.isUpdating = true;
                renderTasks();
            })

            const div = document.createElement('div');

            div.appendChild(updateButton);
            div.appendChild(deleteButton);
            li.appendChild(div);
        }

        
        tasksList.appendChild(li);
    });
}

// save to localStorage
function saveTasks() {
    localStorage.setItem('tasks' , JSON.stringify(tasks));
}

// add new task
function addTask() {
    const taskText = inputText.value.trim();

    if (taskText !== "") {
        tasks.push({text: taskText , completed: false , isUpdating: false});
        saveTasks();
        renderTasks();
        inputText.value = '';
    }
}

// add task when the button is clicked
addButton.addEventListener('click' , addTask);

inputText.addEventListener('keydown' , (e)=> {
    if (e.key === 'Enter') {
        addTask();
    }
})

// render tasks on initial load
renderTasks();

