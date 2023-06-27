const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

authorSchema.pre('deleteOne', { document: true }, async function (next) { //The middle part is necessary to run pre methods/middleware on deleteOne
    const books = await Book.find({ author: this.id })
    if (books.length > 0) {
        try {
            next(new Error('This author has books still'))
        } catch {
            next(error)
        }
    } else {
        next()
    }
}) //Pre functions always run before the function in the brackets, also whenever using the This keyword in a function, use a normal callback instead of an arrow function, this is also middleware

module.exports = mongoose.model('Author', authorSchema) /* Every single file you wish to import into another must be exported, for mongoose file models, use this line */