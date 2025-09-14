const bcrypt = require('bcrypt') // Para encriptar contraseñas
const usuariosRouter = require('express').Router() // Enrutador
const Usuario = require('../models/usuario') // Modelo

// Ruta para obtener todos los usuarios
usuariosRouter.get('/', async (request, response) => {
    const usuarios = await Usuario.find({}).populate('blogs', { titulo: 1, autor: 1, url: 1, likes: 1 }) // Populate: muestra los blogs creados por el usuario
    response.json(usuarios)
})

// Ruta para obtener un usuario especifico por el id
usuariosRouter.get('/:id', async (request, response) => {
    // Busca el usuario por ID
    const usuario = await Usuario.findById(request.params.id)

    if (usuario) {
        response.json(usuario.toJSON())
    } else {
        response.status(404).end()
    }
})

// Ruta para crear un nuevo usuario
usuariosRouter.post('/', async (request, response) => {
    const { nombre_usuario, nombre, password } = request.body

    // Validaciones
    // Si falta usuario, nombre o contraseña
    if (!nombre_usuario) {
        return response.status(400).json({ error: 'Nombre de usuario es requerido' })
    }
    if (!nombre) {
        return response.status(400).json({ error: 'Nombre es requerido' })
    }
    if (!password) {
        return response.status(400).json({ error: 'Contraseña es requerida' })
    }
    // Si nombre de usuario y contraseña tienen menos de 3 caracteres
    if (nombre_usuario.length < 3 || password.length < 3) {
        return response.status(400).json({ error: 'Nombre de usuario y contraseña deben de tener al menos 3 caracteres' })
    }

    // Verificación de unicidad de nombre de usuario
    const usuarioExistente = await Usuario.findOne({ nombre_usuario })
    if (usuarioExistente) {
        return response.status(400).json({ error: 'El nombre de usuario ya está en uso' })
    }


    const saltRounds = 10 // Valor para balancear seguridad y rendimiento
    const passwordHash = await bcrypt.hash(password, saltRounds) // Cifra la contraseña original

    // Crear un nuevo usuario
    const usuario = new Usuario({
        nombre_usuario,
        nombre,
        passwordHash
    })

    const usuarioGuardado = await usuario.save()
    response.status(201).json(usuarioGuardado)
})

// Ruta para eliminar un usuario
usuariosRouter.delete('/:id', async (request, response) => {
    const usuario = await Usuario.findByIdAndDelete(request.params.id)

    if (!usuario) {
        return response.status(404).json({ error: 'Usuario no encontrado' })
    }

    response.status(204).end()
})

module.exports = usuariosRouter