const { initializeApp } = require("firebase/app");
const { getDatabase, ref, push } = require("firebase/database");
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
expressApp.use(express.json());
expressApp.post("/register", async (req, res) => {
    try {
        const { user, password } = req.body;
        
        // Check if user already exists
        const usersRef = ref(db, "/");
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            const users = snapshot.val();
            if (users[user]) {
                return res.status(400).send("User already exists");
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await set(ref(db, `/${user}`), {
            user,
            password: hashedPassword
        });   
        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});
