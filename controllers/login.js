const jwt = require('jsonwebtoken') // Modulo para generar tokens
const bcrypt = require('bcrypt') // Encriptar contraseñas
const loginRouter = require('express').Router() // Enrutador
const Usuario = require('../models/usuario')

// Ruta para autentificar usuario
loginRouter.post('/', async (request, response) => {
    const { nombre_usuario, password } = request.body

    // En caso de que falten credenciales
    if (!nombre_usuario || !password) {
        return response.status(400).json({ error: 'Faltan Credenciales' })
    }

    const usuario = await Usuario.findOne({ nombre_usuario }) // Encuentra al usuario proporcionado por nombre_usuario en la base de datos
    const passwordCorrecta = usuario === null // Verifica que la contraseña sea correcta
    ? false
    : await bcrypt.compare(password, usuario.passwordHash)

    if (!(usuario && passwordCorrecta)) {
        return response.status(401).json({ // Si el nombre de usuario no existe o la contraseña es incorrecta devuelve error
            error: 'Nombre de usuario y contraseña no válidos'
        })
    }

    // Si las credenciales son correctas, crea el token de autentificación
    const tokenUsuario = {
        nombre_usuario: usuario.nombre_usuario,
        id: usuario._id
    }

    // Limitar el tiempo de autentificación del token
    const token = jwt.sign(
        tokenUsuario,
        process.env.SECRET,
        { expiresIn: 60*60 } // Expira en 1 hora
    )

    // Enviamos la respuesta al cliente con el token generado y datos del usuario
    response
    .status(200)
    .send({ token, nombre_usuario: usuario.nombre_usuario, nombre: usuario.nombre })
})

module.exports = loginRouter