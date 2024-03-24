const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
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
const appe = express();

appe.use(express.json());

appe.get("/home", (req, res) => {
    res.send("your are in about page ")
})


appe.listen(3000, () => {
    console.log("I'm listening in port 3000");
});
