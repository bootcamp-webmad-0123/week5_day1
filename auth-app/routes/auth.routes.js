const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

const saltRounds = 10


// Signup form render
router.get('/registro', isLoggedOut, (req, res) => {
  res.render('auth/signup-form')
})


// Signup form handling
router.post('/registro', (req, res) => {

  const { username, email, userPassword } = req.body

  bcrypt
    .genSalt(saltRounds)
    .then(salt => bcrypt.hash(userPassword, salt))
    .then(passwordHash => User.create({ email, username, password: passwordHash }))
    .then(user => res.redirect('/'))
    .catch(err => console.log(err))
})


// Login form render
router.get('/inicio-sesion', isLoggedOut, (req, res) => {
  res.render('auth/login-form')
})


// Login form handler
router.post('/inicio-sesion', (req, res) => {

  const { email, userPassword } = req.body

  if (email.length === 0 || userPassword.length === 0) {
    res.render('auth/login-form', { errorMessage: 'Por favor, rellena los campos' })
    return
  }

  User
    .findOne({ email })
    .then(user => {

      if (!user) {
        res.render('auth/login-form', { errorMessage: 'Usuario no registrado' })
      }
      else if (!bcrypt.compareSync(userPassword, user.password)) {
        res.render('auth/login-form', { errorMessage: 'Datos incorrectos (es la pwd...)' })
      }
      else {
        req.session.currentUser = user                // ESTO ES INICIAR SESIÓN
        console.log('ESTO ES EL OBJETO req.session --->', req.session)
        res.redirect('/')
      }
    })
})



// Logout
router.get('/cerrar-sesion', (req, res) => {
  req.session.destroy(() => res.redirect('/'))
})



module.exports = router