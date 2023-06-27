const express = require('express')
const router = express.Router()
const Book = require('../models/book') //Should keep it capitalized
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'] //***
// const multer = require('multer') //***
// const path = require('path') //***
// const uploadPath = path.join('public', Book.coverImageBasePath) //***
// const fs = require('fs') //*** 
// const upload = multer({ //***
//     dest: uploadPath, 
//     fileFilter: (req, file, callback) => { //***
//         callback(null, imageMimeTypes.includes(file.mimetype)) //***
//     }
// })

// All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }


})

// New Book Route
router.get('/new', async (req, res) => {
    renderFormPage(res, new Book(), 'new', true)
})

//Create Book Route
router.post('/', async (req, res) => { //*** has to match the name of the input in the form fields
    // const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })

    saveCover(book, req.body.cover)

    try {
        //console.log(book)
        const newBook = await book.save() //This isn't working for some reason, well now it does and I don't know why
        //console.log('done')
        res.redirect(`books/${newBook.id}`)
    } catch (error) {
        // if (book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        // }
        console.log(error.message)
        renderFormPage(res, book, 'new', true)
    }
})

// function removeBookCover(fileName){
//     fs.unlink(path.join(uploadPath, fileName), error => {
//         if (error) console.log (error)
//     })
// }

//Show Book Route
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('author').exec()
        res.render('books/show', { book: book })
    } catch {
        res.redirect('/')
    }
})

//Edit Book Route
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderFormPage(res, book, 'edit')
    } catch {
        res.redirect('/')
    }
})

//Update Book Route
router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
            console.log(req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch{
        if (book != null) {
            renderFormPage(res, book, 'edit', true)
        } else {
            res.redirect('/')
        }
    }
})

//Delete Route
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.deleteOne()
        res.redirect(`/books`)
    } catch{
        if (book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})


async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book,
        }
        if (hasError) {
            if (form === 'edit'){
                params.errorMessage = 'Error Updating Book'
            } else if (form === 'new'){
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`books/${form}`, params)
    } catch {
        res.redirect('books')
    }

}

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }
}



module.exports = router /* Every single file you wish to import into another must be exported, for router files use this line */

/* 
*/