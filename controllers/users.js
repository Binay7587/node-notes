const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes')
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password === undefined) {
    return response
      .status(400)
      .send({ error: 'password is required' })
  }else if(password.length < 8){
    return response
      .status(400)
      .send({ error: 'password must be at least 8 digit' })
  }else if(!password.match(/[a-z]/)){
    return response
      .status(400)
      .send({ error: 'password must contain at least one lowercase letter' })
  }else if(!password.match(/[A-Z]/)){
    return response
      .status(400)
      .send({ error: 'password must contain at least one uppercase letter' })
  }else if(!password.match(/[0-9]/)){
    return response
      .status(400)
      .send({ error: 'password must contain at least one number' })
  }else if(!password.match(/[*@!#%&()^~{}]+/)){
    return response
      .status(400)
      .send({ error: 'password must contain at least one special character' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter