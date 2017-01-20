let Todo = require('../models/todo')
let User = require('../models/user')

let todosController = {
  list: (req, res) => {
    // Todo.find({}, (err, todos) => {
    //   if (err) throw err
    //   // if (!req.user) {
    //   //   req.flash('error', 'You must first log in')
    //   //   res.redirect('/')
    //   // } else {
    //   res.render('todo/index', { todos: todos })
    //   // }
    // })
    User.findOne({ _id: req.user.id })
      .populate('todos')
      .exec((err, user) => {
        if (err) throw err
        res.render('todo/index', { todos: user.todos })
      })
  },

  new: (req, res) => {
    // if (!req.user) {
    //   req.flash('error', 'You must first log in')
    //   res.redirect('/')
    // } else {
    res.render('todo/create')
    // }
  },

  listOne: (req, res) => {
    Todo.findById(req.params.id, (err, todoItem) => {
      if (err) throw err
      res.render('todo/single-todo', { todoItem: todoItem })
    })
  },

  create: (req, res) => {
    let newTodo = new Todo({
      userCreator: req.user.id || res.locals.currentUser.id,
      title: req.body.title,
      description: req.body.description,
      completed: false
    })
    newTodo.save(function (err, savedEntry) {
      if (err) throw err
      User.findById(req.user.id, (err, user) => {
        user.todos.push(savedEntry._id)
        user.save()
      })
      res.redirect('/todo')
    })
  },

  edit: (req, res) => {
    Todo.findById(req.params.id, (err, todoItem) => {
      if (err) throw err
      res.render('todo/edit', { todoItem: todoItem })
    })
  },

  update: (req, res) => {
    Todo.findOneAndUpdate({
      _id: req.params.id
    }, {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed
    }, (err, todoItem) => {
      if (err) throw err
      req.flash('success', 'To-do successfully updated!')
      res.redirect('/todo/' + todoItem.id)
    })
  },

  delete: (req, res) => {
    Todo.findByIdAndRemove(req.params.id, (err, todoItem) => {
      if (err) throw err
      req.flash('success', 'To-do successfully deleted!')
      res.redirect('/todo')
    })
  }

}

module.exports = todosController
