var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Account = new Schema({
    username: String,
    password: String,
    access_token: String,
    email: String,
    picture: {type: String, default: '../images/icognito.png'}
});

Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', Account);
