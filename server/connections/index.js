const mongoose = require('mongoose')
const db = require('../config/key').mongoTodosUri
const todos = mongoose.createConnection(db, { useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify: false })
module.exports = todos
