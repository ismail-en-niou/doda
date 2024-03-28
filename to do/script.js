document.addEventListener('DOMContentLoaded', function() {
    // Get references to HTML elements
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task');
    const taskList = document.getElementById('task-list');

    // Event listener for the task form submission
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        const taskText = taskInput.value.trim(); // Get task input value
        if (taskText !== '') { // Check if the task text is not empty
            addTask(taskText); // Add the task
            taskInput.value = ''; // Clear the task input field
        }
    });

    // Function to add a task
    function addTask(taskText) {
        const li = document.createElement('li'); // Create a new list item
        li.textContent = taskText; // Set the text content of the list item
        li.addEventListener('click', function() {
            li.classList.toggle('completed'); // Toggle 'completed' class on click
        });
        const deleteButton = document.createElement('button'); // Create a delete button
        deleteButton.textContent = 'Delete'; // Set the delete button text
        deleteButton.addEventListener('click', function() {
            // When delete button is clicked, call deleteTaskToFirebase function
            deleteTaskToFirebase(authToken, todoid);
        });
        li.appendChild(deleteButton); // Append delete button to the list item
        taskList.appendChild(li); // Append the list item to the task list

        // Send the task data to the server
        saveTaskToFirebase(taskText, authToken); // Pass authToken to saveTaskToFirebase
    }

    // Function to delete a task from Firebase
    function deleteTaskToFirebase(authToken, todoid) {
        fetch('https://doda-o6sz.onrender.com/deletetodos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: authToken, todoId: todoid }) // Pass todoId instead of todoid
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            console.log('Task deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
    }
    
    // Function to save a task to Firebase
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

    // Function to get cookie value by name
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

    // Get authToken and todoid from cookies
    const todoid = getCookie("todoid");
    const authToken = getCookie('userid');

    // Function to fetch todos data from the server
    function fetchData() {
        fetch('https://doda-o6sz.onrender.com/showtodos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: authToken }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            return response.json();
        })
        .then(data => {
            taskList.innerHTML = '';
            data.todos.forEach(todo => {
                const todoid = todo.id; 
                function setCookie(name, value, daysTolive) {
                    const date = new Date();
                    date.setTime(date.getTime() + (daysTolive * 24 * 60 * 60 * 1000));
                    let expires = "expires" + date.toUTCString();
                    document.cookie = `${name}=${value}; ${expires}; path=/`;
                }
                setCookie("id", todoid, 365);
                const li = document.createElement('li');
                li.textContent = todo.data;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete'; 
                deleteButton.addEventListener('click', function() {
                    deleteTaskToFirebase(authToken,todoid)
                });
                li.appendChild(deleteButton); 
                taskList.appendChild(li); 
            });
        })
        .catch(error => {
            console.error('Error fetching todos:', error);
        });
    }
    fetchData();
    setInterval(fetchData, 1000);
});