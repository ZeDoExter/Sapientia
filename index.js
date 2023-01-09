require('dotenv').config()
const express = require('express')
const app = express()

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc);
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Bangkok')

const port = process.env.PORT || 3000;

const hbs = require('hbs')

const generalRouter = require('./routers/general')
const postsRouter = require('./routers/posts')

app.use(express.urlencoded({ extended: true}))
app.set('view engine', 'hbs')
hbs.registerPartials('views/partials')
app.use('/dist', express.static('dist'))

app.use('/', generalRouter)
app.use('/p', postsRouter)

app.listen(port, ()=>{})