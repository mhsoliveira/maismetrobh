var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var admSchema = new Schema({
    type: String,
    crs: {},
    features: []
},{ collection: 'rmbh'});

module.exports = mongoose.model('Adm', admSchema,'rmbh');
