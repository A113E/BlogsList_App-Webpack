// Pruebas API
const { test, after, beforeEach, before, describe } = require('node:test')
const Blog = require('../models/blog')
const Usuario = require('../models/usuario')
const mongoose = require('mongoose')
const ayuda = require('../utils/ayuda_prueba')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')

const api = supertest(app) // Instancia para hacer solicitudes HTTP

// Usuario de prueba
const usuarioPrueba = {
    nombre_usuario: 'tester',
    nombre: 'Admin',
    password: 'sekret'
}

// Variables globales
let token
let usuarioId

// Bloque de pruebas para mostrar los blogs
describe('Los blogs se muestran al iniciar', () => {
    before(async () => {
        await Usuario.deleteMany({})
        // Crea el usuario de prueba
        let respuesta = await api.post('/api/usuarios').send(usuarioPrueba)
        usuarioId = respuesta.body.id

        // Inicia sesión con el usuario de prueba
        respuesta = await api.post('/api/login').send(usuarioPrueba)
        token = respuesta.body.token
    })
    // Se ejecuta antes de las pruebas
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(ayuda.blogsIniciales.map(blog => ({ ...blog, usuario: usuarioId })))
    })

    // Prueba para verificar que los blogs son devueltos en formato JSON
    test('los blogs son devueltos en formato JSON', async () => {
    await api
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/)
    })

    // Prueba para verificar que existen 2 blogs en la base de datos
    test('hay 2 blogs', async () => {
    const respuesta = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })

    assert.strictEqual(respuesta.body.length, ayuda.blogsIniciales.length)
    })

    // Prueba que verifica el titulo del primer blog
    test('el primer blog es "Blog Inicial 1"', async () => {
    const respuesta = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })
    const contenido = respuesta.body.map(e => e.titulo) // Busca el titulo

    assert(contenido.includes('Blog Inicial 1'))
    })

    // Prueba para verificar que todos los blogs tienen una propiedad id en lugar de _id
    test('todos los blogs tienen propiedad id en lugar de _id', async () => {
    const respuesta = await api.get('/api/blogs').set({ Authorization: `Bearer ${token}` })
    const blogs = respuesta.body

    blogs.forEach(blog => {
        assert.ok(blog.id) // Verifica que tiene la propiedad id
        assert.strictEqual(blog._id, undefined) // Verifica que la propiedad _id no existe
      })
    })

    // Bloque de pruebas para un blog especifico
    describe('Revisar un blog en específico', () => {
    // Prueba que verifica que un blog en especifico puede ser visto
    test('un blog en especifico puede ser visto', async () => {
    const blogsInicio = await ayuda.blogsEnBd()
    const blogVer = blogsInicio[0]

    const resultado = await api
    .get(`/api/blogs/${blogVer.id}`)
    .set({ Authorization: `Bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const blogFormateado = {
    ...blogVer,
    usuario: blogVer.usuario.toString()
    }

    assert.deepStrictEqual(resultado.body, blogFormateado) // Comprueba que el blog a ver es devuelto
    })

    // Prueba que verifica que si un blog no existe responde con status 404
    test('si el blog no existe, responde con status 404', async () => {
        const idBlogNoExistente = await ayuda.idNoExistente()

        await api
        .get(`/api/blogs/${idBlogNoExistente}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(404)
    })

    // Prueba que verifica si un id no es válido responde con status 400
    test('si el id no es válido responde con status 400', async () => {
        const idInvalido = '5a3d5da59070081a82a3445'

        await api
        .get(`/api/blogs/${idInvalido}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(400)
    })
    })

    // Bloque de pruebas para la creación de blogs
    describe('Creción de blogs', () => {
         // Prueba para verificar que un nuevo blog puede ser añadido
         test('un nuevo blog válido puede ser añadido', async () => {
         const nuevoBlog = {
         titulo: 'Blog Nuevo',
         autor: 'Adminstrador',
         url: 'http://mipp.com',
         likes: 0
             }

        await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(nuevoBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const blogsAlFinal = await ayuda.blogsEnBd()
        assert.strictEqual(blogsAlFinal.length, ayuda.blogsIniciales.length + 1) // Comprueba que se agrega el blog nuevo a la lista inicial

        const contenido = blogsAlFinal.map(b => b.titulo)
        assert(contenido.includes('Blog Nuevo')) // Comprueba que el titulo del blog esté en la lista final
        })

        // Prueba que comprueba que un blog sin titulo no puede ser añadido
        test('blog sin titulo, ni autor no puede ser añadido', async () => {
        const nuevoBlog = {
        url: 'www.miblog.com',
        likes: 0
          }

        await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(nuevoBlog)
        .expect(400)

        const blogsAlFinal = await ayuda.blogsEnBd()
        assert.strictEqual(blogsAlFinal.length, ayuda.blogsIniciales.length) // Comprueba que el número de blogs no cambia
        })

        // Prueba para verificar que si falta la propiedad like, el valor por defecto es 0
        test('si falta la propiedad like, el valor es 0 por defecto', async () => {
        const nuevoBlog = {
        titulo: 'Blog sin likes',
        autor: 'admin',
        url: 'miblog.com.net'
          }

        const respuesta = await api
        .post('/api/blogs')
        .set({ Authorization: `Bearer ${token}` })
        .send(nuevoBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(respuesta.body.likes, 0) // Comprueba que el blog creado tiene la propiedad likes con valor 0
        })

        // Prueba para verificar que un blog no puede ser añadido sin autorización
        test('un blog no puede ser añadido sin token', async () => {
            const nuevoBlog = {
                titulo: 'Blog sin validar',
                autor: 'tester',
                url: 'localhost',
                likes: 0
            }

            await api
            .post('/api/blogs')
            .send(nuevoBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)

            const blogsAlFinal = await ayuda.blogsEnBd()
            assert.strictEqual(blogsAlFinal.length, ayuda.blogsIniciales.length) // Comprueba que el número de blogs no cambia

            const titulos = blogsAlFinal.map(b => b.titulo)
            assert(!titulos.includes('Blog sin validar'))
        })
    })

    // Bloque de pruebas para actualizar un blog(likes)
    describe('Actualización de un blog', () => {
         // Prueba para verificar que se puede dar like a un blog y se incrementa en +1
         test('se puede dar like a un blog', async () => {
         const blogsInicio = await ayuda.blogsEnBd()
         const blogLikear = blogsInicio[0]

         const respuesta = await api
        .post(`/api/blogs/${blogLikear.id}/likes`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(200)
        .expect('Content-Type', /application\/json/)

        assert.strictEqual(respuesta.body.likes, blogLikear.likes + 1) // Comprueba si el número de likes aumentó en 1
        })
    })

    // Bloque de pruebas para la eliminación de un blog
    describe('Eliminación de un blog', () => {
         // Prueba que verifica que un blog puede ser eliminado
         test('un blog puede ser eliminado', async () => {
         const blogsInicio = await ayuda.blogsEnBd()
         const blogAeliminar = blogsInicio[0]

         await api
        .delete(`/api/blogs/${blogAeliminar.id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(204)

        const blogsAlFinal = await ayuda.blogsEnBd()

        const contenido = blogsAlFinal.map(b => b.titulo)
        assert(!contenido.includes(blogAeliminar.titulo)) // Comprueba que el titulo del blog eliminado no está en la base de datos

        assert.strictEqual(blogsAlFinal.length, ayuda.blogsIniciales.length - 1) // Comprueba que la lista inicial tenga un blog menos
        })
    })
})


// Cierra la conexión luego de las pruebas
after(async () => {
    await mongoose.connection.close()
})