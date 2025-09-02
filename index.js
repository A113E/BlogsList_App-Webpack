const app = require('./app') // Aplicación Express
const config = require('./utils/config') // Modulo para majenar la variable de entorno
const logger = require('./utils/logger') // Modulo para imprimir los mensajes

// Conexión del puerto
app.listen(config.PORT, () => {
  logger.info(`Servidor ejecutándose en el puerto ${config.PORT}`)
})