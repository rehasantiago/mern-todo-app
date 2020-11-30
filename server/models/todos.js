const mongoose = require('mongoose');

const todos = require('../connections')

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    media: {
        type: String,
    },
    target_date: {
        type: Date
    },
    status: {
        type: String,
        enum : ['Todo','In-progress', 'Done'],
        default: 'Todo'
    }
})

module.exports = Todos = todos.model("todos", TodoSchema)
