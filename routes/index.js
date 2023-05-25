const express = require('express')
const router = express.Router() //This creates the router, routers and controllers are the same thing

router.get('/', (req, res) => {
    // res.send('Hello World -Anything')
    res.render('index') //Renders the index.ejs file in the views folder, the file must be nested, one level within the views folder
})


module.exports = router //This exports the router, it is necessary