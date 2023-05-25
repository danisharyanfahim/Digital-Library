if (process.env.NODE_ENV !== 'production'){ //If the name of the .env file in the user environment (the IDE/dev environmnet for running the code) is not equal to production then it imports the dotenv module
    require('dotenv').config() //Try config works instead of .parse() for some reason, and .load() isn't supported anymore
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts') //----------A)Need to figure out what this does

const indexRouter = require('./routes/index')//Imports the router, the file name begins with ./ and then the folder name, and a new / for every sub file or folder within

app.set('view engine', 'ejs') //Sets view/template engine to ejs, template engines create/render the webpage, so they are needed in express
app.set('views', __dirname + '/views') //sets view folder name to /views
app.set('layout', 'layouts/layout')
app.use(expressLayouts)//Uses express layouts
app.use(express.static('public'))//Uses the public folder

const mongoose = require('mongoose') //Imports mongoose
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}) //Connects to database stored in .ENV file
const db = mongoose.connection //Puts the mongoose connection into a variable
db.on('error', error => console.error(error))  //prints an error if there is one in big red letters
db.once('open', () => console.log('Connected to Mongoose')) //Prints if it connects to mongoose, at least the first time around


app.use('/',indexRouter)//-------2)Uses the index router, still a little confused about it so I will look it up on the express API reference

app.listen(process.env.PORT || 3000)//Sets the port to 3000 if the user environment (process.env) doesn't exist


/* 
It seems as though node needs the ./ at the front when referencing repository/directory files, but express doesn't,
 look at the difference between require vs app.get or app.use. requie is a node.js function
*/