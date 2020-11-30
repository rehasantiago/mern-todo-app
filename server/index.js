const express = require('express')
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());// DB Config
app.use(cors());

app.use(function(req,res,next){
console.log(req.body);
next();
})

const db = require('./config/key').mongoTodosUri

mongoose
  .connect(
    db,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const todos = require('./routes/todos')
app.use('/todos', todos);

app.listen(port, function() {
    console.log('running at localhost: ' + port);
});

