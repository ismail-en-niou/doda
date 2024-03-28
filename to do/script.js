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
    function addTask(taskText) {
        const li = document.createElement('li'); 
        li.textContent = taskText; 
        li.addEventListener('click', function() {
            li.classList.toggle('completed'); 
        });
        const deleteButton = document.createElement('button'); 
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
    
            deleteTaskToFirebase(authToken, todoid);
        });
        li.appendChild(deleteButton); 
        taskList.appendChild(li);
        saveTaskToFirebase(taskText, authToken); 
    }


    function deleteTaskToFirebase(authToken, todoid) {
        fetch('https://doda-o6sz.onrender.com/deletetodos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: authToken, todoId: todoid }) 
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
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
        })
        .catch(error => {
            console.error('Error saving task:', error);
        });
    }

  
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
    const todoid = getCookie("todoid");
    const authToken = getCookie('userid');
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
            if (data.todos.length == 0) {
                taskList.style.display = "none"; 
            }else{
                taskList.style.display = "block";
            }
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