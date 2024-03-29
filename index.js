const { initializeApp } = require("firebase/app");
const { getDatabase, ref, get, set ,push ,remove } = require("firebase/database");
const bcrypt = require('bcrypt');
const express = require("express");

const firebaseConfig = {
  apiKey: "AIzaSyCrJsBOKV-pcUUGL5I5etcxd9WNDMFVTPY",
  authDomain: "my-data-base-54f9a.firebaseapp.com",
  databaseURL: "https://my-data-base-54f9a-default-rtdb.firebaseio.com",
  projectId: "my-data-base-54f9a",
  storageBucket: "my-data-base-54f9a.appspot.com",
  messagingSenderId: "268612316568",
  appId: "1:268612316568:web:0f98c5a375710722a1cfed",
  measurementId: "G-VS4P08TY15"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const expressApp = express();


expressApp.use(cors());
expressApp.use(express.json());

expressApp.post("/register", async (req, res) => {
    try {
        const { user, password } = req.body;
        const usersRef = ref(db, `/${user}`);
        const snapshot = await get(usersRef);
        
        if (snapshot.exists()) {
            res.status(400).send({ statut: "1", message: "User already exists" });
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await set(ref(db, `/${user}`), {
                user,
                password: hashedPassword
            });   
            res.status(201).send({ statut: "0", message: "User registered successfully" });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send({ statut: "1", message: "Internal Server Error" });
    }
});



expressApp.post("/login", async (req, res) => {
    try {
        const { user, password } = req.body;
        const userRef = ref(db, `/${user}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists()) {
            return res.status(400).send({ statut: "1", message: "User not found" });
        }
        const userData = userSnapshot.val();
        const hashedPassword = userData.password;

        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        if (!passwordMatch) {
            return res.status(401).send({
                statut: "1",
                message: "Incorrect password"
            });
        }
        res.status(200).send({ statut: "0", message: "Login successful" });
       
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).send({ statut: "1", message: "Internal Server Error" });
    }
});


expressApp.post("/todos", async (req, res) => {
    try {
        const { todoData, user } = req.body;
        const userRef = ref(db, `/${user}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists()) {
            return res.status(404).send({ status: "1", message: "User not found" });
        }
        
        const userTodosRef = ref(db, `/${user}/todos`);
        const newTodoRef = push(userTodosRef); // Create a new unique ID for the todo
        await set(newTodoRef, todoData); // Save the todo data to the new unique ID
        
        res.status(201).send({ status: "0", message: "ToDo added successfully" });
    } catch (error) {
        console.error("Error adding ToDo:", error);
        res.status(500).send({ status: "1", message: "Internal Server Error" });
    }
});


expressApp.post("/showtodos", async (req, res) => {
    try {
        const { user } = req.body;
        const userRef = ref(db, `/${user}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists()) {
            return res.status(404).send({ status: "1", message: "User not found" });
        }
        
        const userTodosRef = ref(db, `/${user}/todos`);
        const userTodosSnapshot = await get(userTodosRef);

        const todos = [];
        userTodosSnapshot.forEach((childSnapshot) => {
            todos.push({
                id: childSnapshot.key,
                data: childSnapshot.val()
            });
        });

        res.status(200).send({ status: "0", message: "Todos retrieved successfully", todos: todos });
    } catch (error) {
        console.error("Error retrieving Todos:", error);
        res.status(500).send({ status: "1", message: "Internal Server Error" });
    }
});


expressApp.post("/deletetodos", async (req, res) => {
    try {
        const { user, todoId } = req.body; // Add todoId to request body
        const userRef = ref(db, `/${user}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
            return res.status(404).send({ status: "1", message: "User not found" });
        }

        const userTodosRef = ref(db, `/${user}/todos/${todoId}`); // Reference to the specific todo
        const todoSnapshot = await get(userTodosRef);

        if (!todoSnapshot.exists()) {
            return res.status(404).send({ status: "1", message: "Todo not found" });
        }

        await remove(userTodosRef); 

        res.status(200).send({ status: "0", message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error deleting Todo:", error);
        res.status(500).send({ status: "1", message: "Internal Server Error" });
    }
});


expressApp.listen(3000, () => {
    console.log("Server is running on port 3000");
});

