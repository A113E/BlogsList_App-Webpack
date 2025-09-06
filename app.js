const config = require('./utils/config') // Modulo que maneja la variable de entorno
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs') // Controlador de rutas (blogs)
const usuariosRouter = require('./controllers/usuarios') // Controlador de rutas (usuarios)
const loginRouter = require('./controllers/login') // Controlador de rutas (login)
const middleware = require('./utils/middleware') // Modulo que maneja los middlewares
const logger = require('./utils/logger') // Modulo que maneja la impresión de mensajes
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// Mensaje de intento de conexión
logger.info('Conectando a', config.MONGODB_URI)

// Configuración de conexión a la base de datos
mongoose.connect(config.MONGODB_URI)
.then(() => {
    logger.info('Conectado a MongoDB')
})
.catch((error) => {
    logger.error('Error al conectar con MongoDB:', error.message)
})

app.use(cors()) // Permite solicitudes de cualquier origen
app.use(express.static('build')) // Middleware para que muestre contenido estático
app.use(express.json())
app.use(middleware.solicitudesInfo)
app.use(middleware.tokenExtractor)

// Enrutadores
app.use('/api/blogs', blogsRouter)
app.use('/api/usuarios', usuariosRouter)
app.use('/api/login', loginRouter)

app.use(middleware.rutasInexistentes)
app.use(middleware.manejoErrores)

module.exports = app