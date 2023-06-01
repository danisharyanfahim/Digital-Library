if (process.env.NODE_ENV !== 'production'){ //If the name of the .env file in the user environment (the IDE/dev environmnet for running the code) is not equal to production then it imports the dotenv module
    require('dotenv').config() //Try config works instead of .parse() for some reason, and .load() isn't supported anymore
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts') //----------A)Need to figure out what this does
const bodyParser = require('body-parser') //hyphens are used to seperate words in package names

const indexRouter = require('./routes/index')//Imports the router, the file name begins with ./ and then the folder name, and a new / for every sub file or folder within
const authorRouter = require('./routes/authors') //1


app.set('view engine', 'ejs') //Sets view/template engine to ejs, template engines create/render the webpage, so they are needed in express
app.set('views', __dirname + '/views') //sets view folder name to /views
app.set('layout', 'layouts/layout')
app.use(expressLayouts)//Uses express layouts
app.use(express.static('public'))//Uses the public folder
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) //Will need to look up this shit on the bodyParser API reference/documentation, the first parameter increases the upload size

// console.log(app.set('views', __dirname + '/views'))

const mongoose = require('mongoose') //Imports mongoose
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true}) //Connects to database stored in .ENV file
const db = mongoose.connection //Puts the mongoose connection into a variable
db.on('error', error => console.error(error))  //prints an error if there is one in big red letters
db.once('open', () => console.log('Connected to Mongoose')) //Prints if it connects to mongoose, at least the first time around


app.use('/', indexRouter)//-------B)Uses the index router when there is nothing after the localhost:3000 url or just a '/', still a little confused about it so I will look it up on the express API reference
app.use('/authors', authorRouter) //Uses the authorRouter when there is a /author in the url

app.listen(process.env.PORT || 3000)//Sets the port to 3000 if the user environment (process.env) doesn't exist


/* 
It seems as though node needs the ./ at the front when referencing repository/directory files, but express doesn't,
 look at the difference between require vs app.get or app.use. requie is a node.js function


//Server.js: Is the server, it runs the website. 

The routes folder: Contains route files, which are also JS. 
These contain code for express and uses express to control/route the website, meaning connect them together.
Think of them like doorways or portals which send you to different places, which in this case are web pages

THe views folder: Basically all of the html(ejs) files, this is what will be shown to the user/client

The models folder: Will contain JS code and database code for mongoDB using mongoose

So, in short. Server.js is the server/controller, Routes folder is mainly js express code, Views folder is
html/ejs code, and models folder is database/mongodb/mongoose js code.

Look at the 'Model, Controller, View' Model

1) The '.' at the front indicates how many levels you want to go out, for this example,
 using one '.' will go one level out from where server.js is located, to the DIGITAL library project folder,
 then the '/' is used to go one level in. Since the '.' took us to the project folder, we use /routes to go
 into the routes folder, and then after that you into the authors .ejs file with /authors

*/