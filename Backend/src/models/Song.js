/* eslint-disable */
const mongoose = require("mongoose");

const songs = new mongoose.Schema({
    title : {type: String , required: true},
    artist  : {type: String , required: true},
    album  : {type: String , required: true},
    duration  : {type: Number , required: true},
    audioUrl  : {type: String , required: true},
    imageUrl  : {type: String , required: true}
});

const song = mongoose.model('song' , songs);

module.exports = song;