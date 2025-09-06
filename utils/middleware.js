const logger = require('./logger') // Modulo que maneja la impresión de mensajes
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

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

// Middleware que maneja la extracción del token
const tokenExtractor = (request, response, next) => {
  const authorization = request.get ('authorization') // Lee el header Authorization

  // Si existe y comienza con 'bearer '
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // Elimina el bearer y guarda solo el token
    request.token = authorization.substring(7)
  } else {
    // Si no hay token devuelve nulo
    request.token = null
  }

  next()
}

// Middleware que maneja la extracción de usuario
const usuarioExtractor = async (request, response, next) => {
  // Verifica que el token está presente
  if (!request.token) {
    return response.status(401).json({ error: 'Token requerido' })
  }

  // Decodificar el token y obtener el id del usuario
  const tokenDecodificado = jwt.verify(request.token, process.env.SECRET)
  // Verificar si el token es valido
  if (!tokenDecodificado) {
    return response.status(401).json({ error: 'Token inválido' })
  }

  // Busca en la base de datos el usuario que creó el token
  const usuario = await Usuario.findById(tokenDecodificado.id)
  if (!usuario) {
    return response.status(404).json({ error: 'Usuario no encontrado' })
  }

  request.usuario = usuario

  next()
}

// Middleware para manejo de errores
const manejoErrores = (error, request, response, next) => {
  logger.error(error.message)

  // Verificación de tipo de error:
  if (error.name === 'CastError') { // Si es una excepción CastError: mal formarto de ID
    return response.status(400).send({ error: 'Formato de ID incorrecto' })
  } else if (error.name === 'ValidationError') { // Si es un error en la validación de datos de los campos
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'se espera que `nombre_usuario` sea único' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Token no válido' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'El Token expiró' })
  }

  next(error)
}

module.exports = {
    solicitudesInfo,
    rutasInexistentes,
    tokenExtractor,
    usuarioExtractor,
    manejoErrores
}