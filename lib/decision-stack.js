var _ = require('underscore'),
    mongoose = require('mongoose');

var decisionStackSchema = mongoose.Schema({
});

var DecisionStack = module.exports = mongoose.model('DecisionStack', decisionStackSchema);
