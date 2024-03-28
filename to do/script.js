document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    function addTask(taskText) {
        const li = document.createElement('li');
        li.textContent = taskText;
        li.addEventListener('click', function() {
            li.classList.toggle('completed');
        });
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            li.remove();
        });
        li.appendChild(deleteButton);
        taskList.appendChild(li);

        // Send the task data to the server
        saveTaskToFirebase(taskText);
    }

    function saveTaskToFirebase(todoData, authToken) {
        fetch('https://doda-o6sz.onrender.com/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todoData: todoData, user: authToken })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save task');
            }
            console.log('Task saved successfully');
        })
        .catch(error => {
            console.error('Error saving task:', error);
        });
    }
});

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

const authToken = getCookie('userid');
function fetchData() {
    fetch('https://doda-o6sz.onrender.com/showtodos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: authToken }) // Replace 'username' with the actual username
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch todos');
        }
        return response.json();
    })
    .then(data => {
        // Handle the received todos data
        console.log('Todos:', data.todos);
    })
    .catch(error => {
        console.error('Error fetching todos:', error);
    });
}

// Fetch data initially when the page loads
fetchData();

// Fetch data every 30 seconds
setInterval(fetchData, 10000);
