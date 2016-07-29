var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var IdeaSchema = new Schema({
    type: String,
    apoios: Number,
    coordinates: [],
    rating: {type: [Number], default:0},
    judgers:[String],
    desc: {type: [String], default:''},
    refs: {type: [String], default:''},
    comments: [{ body: String, user: String, photo: String }],
    date: String,
    user: {username: String, picture: String }
},{ collection: 'layercollection'});



// Mongoose Model definition
var Idea = mongoose.model('JString', IdeaSchema,'layercollection');

module.exports = mongoose.model('Idea', IdeaSchema,'layercollection');
