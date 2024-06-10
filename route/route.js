const express = require('express')
const {creatUser, getUsers, getUser, updateUser, deleteUser, loginUser} = require('../controllers/controler')

const route = express.Router()

route.post('/', creatUser)
route.get('/', getUsers)
route.get('/:id', getUser)
route.put('/:id', updateUser)
route.delete('/:id', deleteUser)
route.post('/login', loginUser)


module.exports = route;