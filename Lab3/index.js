//REQUIRE THE NEEDED MODULES AND PACKAGES
const express = require('express')
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
//REQUIRE THE OTHER ROUTES TO USE IN THE MAIN FILE LIKE IMPORT
var routes = require('./routes');
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))


//USING THE TEMPLATE ENGINE HBS ON ROUTE "/" TO LOAD THE  VARIABLES IN HTML INSERVER SIDE BEFORE 
//SENDING THE RESPONSE TO DECREASE THE REQUERTS AND IMPROVE PERFORMANCE 
var hbs = require('hbs');
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {

    res.locals = {
        //PASS THE ITERATOR OBJECT TO THE OBJECT IN HBS TO USE IT
        todos: JSON.parse(fs.readFileSync('./toDoList.json'))
    }
    res.render('todos');
});

// shouldn't the app use the routes ? not the other way around 
// app.use("/todo",todoRouter)
routes(app);

app.listen(5000)
