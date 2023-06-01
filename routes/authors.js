const express = require('express')
const router = express.Router()
const Author = require('../models/author') //Should keep it capitalized

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') { //3
        searchOptions.name = new RegExp(req.query.name, 'i')
    } //Theres probably a way to do this with short circuiting
    try{
        const authors = await Author.find(searchOptions) //Mongoose function that allows you to find something in a DB, since it is empty it will return everything by default
        res.render('authors/index', { 
            authors: authors, 
            searchOptions: req.query
        }) //2
    }catch{
        res.redirect('/')
    }
})

// New Author Route
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() }) //1
})

//Create Author Route
router.post('/', async (req, res) => {


    // const author = new Author({
    //     name: req.body.name
    // })
    // author.save(
    //     (error, newAuthor)=>{
    //     if(error){
    //         res.render('authors/new', { //IF there is an error it will go back to the authors page
    //             author: author, //This will repopulate the name which was already being entered previously
    //             errorMessage: 'Error creating Author' //Will generate an error message displaying the string value
    //         })
    //     } else {
    //         res.redirect(`authors`)
    //     }
    // }) //Apprently .save() doesn't support callbacks anymore so I had to wrap everything in an asyn instead


    // const createAuthor = async () => {
    //     const author = await Author.create({
    //         name:req.body.name
    //     })
    //     try{
    //         res.redirect(`authors`)
    //     }catch(error){
    //         res.render('authors/new', { //IF there is an error it will go back to the authors page
    //             author: author, //This will repopulate the name which was already being entered previously
    //             errorMessage: 'Error creating Author' //Will generate an error message displaying the string value
    //         })
    //         console.log(error.message)
    //     }
    // }
    // createAuthor() //This is done with an async function and .create()

    // const author = new Author({
    //     name: req.body.name
    // })
    // author.save().then(() => res.redirect(`authors`)).catch(
    //     (newAuthor) => {
    //         res.render('authors/new', { //IF there is an error it will go back to the authors page
    //             author: author, //This will repopulate the name which was already being entered previously
    //             errorMessage: 'Error creating Author' //Will generate an error message displaying the string value
    //         })
    //     }) This is using promises

    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        res.redirect(`authors`)
    } catch {
        res.render('authors/new', { //IF there is an error it will go back to the authors page
            author: author, //This will repopulate the name which was already being entered previously
            errorMessage: 'Error creating Author' //Will generate an error message displaying the string value
        })
    }


    // res.send(req.body.name) //Request in this case refers to the form, which is the client request to the server
})





module.exports = router /* Every single file you wish to import into another must be exported, for router files use this line */

/* 1)Refers to the new.ejs file in the authors folder (Think of ejs files as html pages). Also,
the second paremeter in .render allows us to pass in a local variable into the render, in this 
case the the key in the key value pair in the object refers to the name of the variable, and 
the value refers to the type or value of it 

2)Refers to the index.ejs file in the authors folder, it renders it. Also, the {authors : authors} part of 
the function creates an variable called authors and passes in the variable we created immediately before 
called authors into it. Without this the authors variable in the index.ejs file doesn't exist. Basically,
we use res.render to send in variables into the ejs/html files, this allows for them to be used over there,
because they wont be able to access them normally. Same thing with searchOptions.

3) Important***, for GET requests, it sneds information through queries instead of through bodies like the post request,
so request.query is necessary
*/