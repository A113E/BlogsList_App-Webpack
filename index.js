const app = require('./app') // Aplicación Express
const http = require('http')
const config = require('./utils/config') // Modulo para majenar la variable de entorno
const logger = require('./utils/logger') // Modulo para imprimir los mensajes

const server = http.createServer(app) // crea servidor a partir de la app

// Conexión del puerto
server.listen(config.PORT, () => {
  logger.info(`Servidor ejecutándose en el puerto ${config.PORT}`)
})