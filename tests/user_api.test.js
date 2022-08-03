const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('P@ssw0rd123', 10)
    const user = new User({ username: 'root12345', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'binay7587',
      name: 'Binaya Karki',
      password: 'P@ssw0rd'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root12345',
      name: 'Super Admin',
      password: 'P@ssw0rd',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if username length is less than 6 digit', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'rooty',
      name: 'Super Admin',
      password: 'P@ssw0rd',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be at least 6 digit')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})

describe('password validation check', () => {
  test('creation fails if password length is less than 8 digit', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root122',
      name: 'Super Admin',
      password: 'P@ssw0',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 8 digit')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password is not provided', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root122',
      name: 'Super Admin',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is required')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password doesn\'t contain one lowercase', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root1221',
      name: 'Super Admin',
      password: 'P@SSW0RD',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must contain at least one lowercase letter')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password doesn\'t contain one uppercase', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root1221',
      name: 'Super Admin',
      password: 'p@ssw0rd',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must contain at least one uppercase letter')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password doesn\'t contain one number', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root1221',
      name: 'Super Admin',
      password: 'P@ssword',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must contain at least one number')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails if password doesn\'t contain one special character', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root1221',
      name: 'Super Admin',
      password: 'Passw0rd',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must contain at least one special character')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(() => {
  mongoose.connection.close()
})