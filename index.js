
// Import bcrypt for password hashing
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


const expressApp = express();
expressApp.use(express.json());

// Create a database array to store users temporarily (replace with Firebase later)
const users = [];

// Endpoint to handle user registration
expressApp.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user already exists
        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            return res.status(400).send("User already exists");
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save user data to the database (replace with Firebase)
        users.push({ email, password: hashedPassword });
        
        // Respond with success message
        res.status(201).send("User registered successfully");
    } catch (error) {
        // Handle errors
        console.error("Error registering user:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


expressApp.listen(3000, () => {
    console.log("Server is running on port 3000");
});
