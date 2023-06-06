const express = require('express')
const router = express.Router() //This creates the router, routers and controllers are the same thing
const Book = require('../models/book')

router.get('/', async (req, res) => {
    // res.send('Hello World -Anything')
    let books
    try{
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', {
        books: books
    }) //Renders the index.ejs file in the views folder, the file must be nested, one level within the views folder
})


module.exports = router //This exports the router, it is necessary