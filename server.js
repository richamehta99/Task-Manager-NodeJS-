const express = require('express')

const { db } = require('./task-notes')
const todoRoute = require('./routes/todos')

const SERVER_PORT= process.env.PORT || 7070
const app = express()
 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
 
app.use('/', express.static(__dirname + '/public'))
 
app.use('/todos', todoRoute)
 
db.sync()
  .then(() => {
    app.listen(SERVER_PORT)
  })
  .catch((err) => {
    console.error(err)
  })