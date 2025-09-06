// Modulo para definir funciones de prueba
const Blog = require('../models/blog')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt') // Para encriptar contraseñas

const blogsIniciales = [
    {
        titulo: 'Blog Inicial 1',
        autor: 'Admin',
        url: 'www.miblog.com',
        likes: 3
    },
    {
        titulo: 'Blog Inicial 2',
        autor: 'Otro Admin',
        url: 'www.miblog.com',
        likes: 5
    },
]

const usuariosIniciales = async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)

    return [
        {
            nombre_usuario: 'root',
            nombre: 'Superusuario',
            passwordHash
        },
        {
            nombre_usuario: 'admin',
            nombre: 'Alberto',
            passwordHash
        }
    ]
}

// Función que genera un ID válido de MongoDB que no existe en la colección (para pruebas -- 404 No found)
const idNoExistente = async () => {
    const blog = new Blog({
        titulo: 'Blog no encontrado',
        autor: 'Desconocido',
        url: 'http://miapp.com',
        like: 0
    })

    await blog.save()
    await blog.deleteOne() // Elimina el blog inmediatamente

    return blog._id.toString()
}

// Función que genera un ID válido usuario de MongoDB que no existe en la colección (para pruebas -- 404 No found)
const idUsuarioNoExistente = async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    const usuario = new Usuario({
        nombre_usuario: 'Usuario no encontrado',
        nombre: 'Desconocido',
        passwordHash
    })

    await usuario.save()
    await usuario.deleteOne()

    return usuario._id.toString()
}

// Funcion que devuelve todos los blogs actuales en la Base de datos en formato JSON
const blogsEnBd = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

// Función que devuelve todos los usuarios actuales en la Base de datos
const usuariosEnBd = async () => {
    const usuarios = await Usuario.find({})
    return usuarios.map(usuario => usuario.toJSON())
}

module.exports = {
    blogsIniciales,
    usuariosIniciales,
    idNoExistente,
    idUsuarioNoExistente,
    blogsEnBd,
    usuariosEnBd
}