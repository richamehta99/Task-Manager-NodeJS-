const { Router } = require('express')
const { Todos, Notes } = require('../task-notes')
const { Op } = require('sequelize')
const route = Router()

//API to get all tasks
route.get('/', async (req, res) => {
  const todos = await Todos.findAll({
    order : [
      ['status','ASC'],
      ['due','ASC'],
      ['priority','ASC']
    ]
  })
  res.send(todos)
})

//API to add new task
route.post('/', async (req, res) => {
    // if (typeof req.body.title !== 'string') {
    //   return res.status(400).send({ error: 'Task name not provided' })
    // }
    console.log(req.body.title)
    if (req.body.status === 'true') {
      req.body.status = true
    } else {
      req.body.status = false
    }
  
    const newTodo = await Todos.create({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        due: req.body.due
    })
  
    res.status(201).send({ success: 'New task added', data: newTodo })
  })

//API to get a task with particular id
route.get('/:id', async (req, res) => {
  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      error: 'todo id must be an integer',
    })
  }
  
  const todo = await Todos.findByPk(req.params.id)

  if (!todo) {
    return res.status(404).send({
      error: 'No todo found with id = ' + req.params.id,
    })
  }
  res.send(todo)
})

//API to modify details of a particular task by id
route.patch('/:id',async (req,res)=>{
  if (isNaN(Number(req.params.id))) {
    return res.status(400).send({
      error: 'todo id must be an integer',
    })
  }
  
  const todo = await Todos.findByPk(req.params.id)
  console.log(req.body.priority)
 
  todo.status= req.body.status
  todo.priority= req.body.priority
  todo.due= req.body.due
  
  await todo.save()
  //res.status(201).send({ success: 'New task added', data: todo })
})

//API to get list of all notes under a todo with its particular ID
route.get('/:id/notes', async (req, res) => {
  const getNotes = await Notes.findAll({
    where:{
      notesId:{ [Op.eq] :  req.params.id  }
    }
  })
  res.send(getNotes)
})

//API to add a new note under a todo with its particular ID
route.post('/:id/notes', async (req, res) =>{

  const addNote =await Notes.create({
    notesId:req.params.id,
    notes:req.body.notes
  })

  res.status(201).send({ success: 'New task added', data: addNote })
})


module.exports = route