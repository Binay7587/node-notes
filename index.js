const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const { info } = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})