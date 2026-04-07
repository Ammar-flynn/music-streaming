/* eslint-disable */

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Song = require('./models/Song');

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo Db connected ..."))
    .catch((err) => console.log("Database error: " , err));

app.listen(PORT , () => {
    console.log("Server is running on port " + PORT)
});
