const express = require('express')
const router = express.Router()
const Book = require ('../models/book')
const Author = require('../models/author') //Should keep it capitalized

// All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') { //3
        searchOptions.name = new RegExp(req.query.name, 'i')
    } //Theres probably a way to do this with short circuiting
    try {
        const authors = await Author.find(searchOptions) //Mongoose function that allows you to find something in a DB, since it is empty it will return everything by default
        res.render('authors/index', {
            authors: authors,
            searchOptions: req.query
        }) //2
    } catch {
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
        res.redirect(`/authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', { //IF there is an error it will go back to the authors page
            author: author, //This will repopulate the name which was already being entered previously
            errorMessage: 'Error creating Author' //Will generate an error message displaying the string value
        })
    }


    // res.send(req.body.name) //Request in this case refers to the form, which is the client request to the server
})

//Show/Edit/Update/Delete
//This get route which takes in id as a param, needs to be defined/written after the get route which uses /new. Otherwise it would interpret /new as an id
router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch(error) {
        console.log(error.message)
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch (error) {
        console.log(error.message)
        res.redirect('/authors')
    }
})

router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`) //4
    } catch {
        if (author == null) {
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating Author'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        //await author.remove() //Author.remove doesn't work
        await author.deleteOne()
        res.redirect(`/authors`)
    } catch{
        if (author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
}) //NEVER EVER use a get method for deleting, because google comes and deletes everything with a GET tag if there is one which is used for deleting


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

4) A slash needs to be put at the front of this, because if it isn't then it goes to author/author/id instead,
 which I don't really understand why its the case for this, when many of the others don't need a slash at the front.
 From what I have noticed, only redirect needs a slash, and only for the ones which have '/:id' instead of '/'.
  Render doesn't need it and it makes sense since it isn't a link, redirect is a link. I'd imagine the / at the front,
  already tells it that it is /authors, so putting in / isn't necessary and instead only authors, even though /authors also works
  But for the others they need a leading slash infront of authors because the problem above will happen.
*/