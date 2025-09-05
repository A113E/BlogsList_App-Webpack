// Modulo para definir funciones de prueba
const Blog = require('../models/blog')

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

// Funcion que devuelve todos los blogs actuales en la Base de datos en formato JSON
const blogsEnBd = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    blogsIniciales,
    idNoExistente,
    blogsEnBd
}