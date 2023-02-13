const express = require('express');
const router = express.Router();
const Book = require('./../models/Books.model')

const { isLoggedIn } = require('../middlewares/route-guard')

router.get('/listado', (req, res) => {

  Book
    .find()
    .select({ title: 1 })
    .sort({ title: 1 })
    .then(books => res.render('books/list', { books }))
    .catch(err => console.log(err))
})


// Create form render
router.get('/crear', isLoggedIn, (req, res) => {
  res.render('books/new-book-form')
})


// Create form handling
router.post('/crear', isLoggedIn, (req, res) => {

  const { title, description, author, rating } = req.body

  Book
    .create({ title, description, author, rating })
    .then(book => res.redirect(`/libros/${book._id}`))
    .catch(err => console.log(err))
})


// Render book details
router.get('/:book_id', (req, res) => {

  const { book_id } = req.params

  Book
    .findById(book_id)
    .then(book => res.render('books/details', book))
    .catch(err => console.log(err))
})



// Edit form render
router.get('/editar/:book_id', isLoggedIn, (req, res) => {

  const { book_id } = req.params

  Book
    .findById(book_id)
    .then(book => res.render('books/edit-book-form', book))
    .catch(err => console.log(err))
})


// Edit form handler
router.post('/editar', isLoggedIn, (req, res) => {

  const { title, description, author, rating, book_id } = req.body

  Book
    .findByIdAndUpdate(book_id, { title, description, author, rating })
    .then(book => res.redirect(`/libros/${book._id}`))
    .catch(err => console.log(err))
})



// Delete book
router.post('/eliminar/:book_id', isLoggedIn, (req, res) => {

  const { book_id } = req.params

  Book
    .findByIdAndDelete(book_id)
    .then(() => res.redirect('/libros/listado'))
    .catch(err => console.log(err))
})


module.exports = router