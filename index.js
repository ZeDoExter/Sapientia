require('dotenv').config()
const express = require('express')
const app = express()

const port = process.env.APP_POST ?? process.env.PORT

const hbs = require('hbs')

const generalRouter = require('./routers/general')
const postsRouter = require('./routers/posts')

app.use(express.urlencoded({ extended: true}))
app.set('view engine', 'hbs')
hbs.registerPartials('views/partials')
app.use('/dist', express.static('dist'))

app.use('/', generalRouter)
app.use('/p', postsRouter)

app.listen(port, ()=>{
    console.log(`Now server is working http://localhost:${port}`)
})
