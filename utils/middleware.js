const logger = require('./logger') // Modulo que maneja la impresión de mensajes

// Middlewares
// Middleware que imprime información de cada solicitud que se envía al servidore
const solicitudesInfo = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:', request.path);
    logger.info('Body:', request.body);
    next() // Pasa al siguiente middleware
}

// Miiddleware para capturar solicitudes a rutas inexistentes
const rutasInexistentes = (request, response) => {
    // Responde con:
    response.status(404).send({ error: 'Ruta Inexistente' }) // No Found
}

// Middleware para manejo de errores
const manejoErrores = (error, request, response, next) => {
  logger.error(error.message)

  // Verificación de tipo de error:
  if (error.name === 'CastError') { // Si es una excepción CastError: mal formarto de ID
    return response.status(400).send({ error: 'Formato de ID incorrecto' })
  } else if (error.name === 'ValidationError') { // Si es un error en la validación de datos de los campos
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
    solicitudesInfo,
    rutasInexistentes,
    manejoErrores
}