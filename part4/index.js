const app = require('./app') // the actual Express application
const config = require('./utils/config')
const logger = require('./utils/logger')
const http=require("http")
const Server=http.createServer(app)
app.listen(config.PORT, () => {
  console.log(config.PORT)
  logger.info(`Server running on port ${config.PORT}`)
})  