const { test, after, beforeEach, describe } = require('node:test')
const Usuario = require('../models/usuario')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const ayuda = require('../utils/ayuda_prueba')
const assert = require('node:assert')

const api = supertest(app) // Instancia para hacer solicitudes HTTP

// Pruebas para la administración de usuarios
describe('Usuarios', () => {
    // BeforeEach antes de cada prueba
    beforeEach(async () => {
        await Usuario.deleteMany({})

        const usuarios = await ayuda.usuariosIniciales()
        await Usuario.insertMany(usuarios)
    })

    // Prueba que comprueba que todos los usuarios son devueltos en formato JSON
    test('los usuarios son devueltos en formato JSON', async () => {
        await api
        .get('/api/usuarios')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    // Prueba para verificar la cantidad de usuarios
    test('la cantidad de usuarios es correcta', async () => {
        const respuesta = await api.get('/api/usuarios')

        const usuariosIniciales = await ayuda.usuariosIniciales()
        assert.strictEqual(respuesta.body.length, usuariosIniciales.length) // Comprueba la cantidad de usuarios registrados
    })

    // Prueba para comprobar que un usuario existe por el nombre_usuario
    test('el usuario con nombre_usuario "root" existe', async () => {
        const respuesta = await api.get('/api/usuarios')
        const usuario = respuesta.body.map(u => u.nombre_usuario)

        assert(usuario.includes('root')) // Comprueba que el nombre de usuario root esté registrado
    })

    // Prueba para verificar que todos los usuarios tienen la propiedad id en lugar de _id
    test('todos los usuarios tienen la propiedad id en lugar de _id', async () => {
        const respuesta = await api.get('/api/usuarios')
        const usuarios = respuesta.body

        usuarios.forEach(usuario => {
            assert.ok(usuario.id) // Verifica que tiene la propiedad id
            assert.strictEqual(usuario._id, undefined) // Verifica que la propiedad _id no existe
        })
    })

    // Bloque de pruebas para la visualización de un usuario en especifico
    describe('Visualización de un usuario en específico', () => {
        // Prueba para comprobar que un usuario especifico por id puede ser visto
        test('un usuario en especifico por id puede ser visto', async () => {
            const usuariosInicio = await ayuda.usuariosEnBd()
            const usuarioVer = usuariosInicio[0]

            const resultado = await api
            .get(`/api/usuarios/${usuarioVer.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

            assert.strictEqual(resultado.body.id, usuarioVer.id) // Comprueba que devuelve el usuario a ver
        })

        // Prueba que verifica que si un usuario no existe responde con status 404
        test('si un usuario no existe responde con status 404', async () => {
            const idUsuarioNoExiste = await ayuda.idUsuarioNoExistente()

            await api
            .get(`/api/usuarios/${idUsuarioNoExiste}`)
            .expect(404)
        })

        // Prueba que verifica si un id no es válido responde con status 400
        test('si id es inválido responde con status 400', async () => {
            const idInvalido = '12345abc'

            await api
            .get(`/api/usuarios/${idInvalido}`)
            .expect(400)
        })
    })

    // Bloque de pruebas para la creación de usuarios
    describe('Creación de usuarios', () => {
        // Prueba para verificar que un usuario válido puede ser creado
        test('un nuevo usuario válido puede ser creado', async () => {
            const usuariosAlInicio = await ayuda.usuariosEnBd()

            const nuevoUsuario = {
            nombre_usuario: 'mluukkai',
            nombre: 'Matti Luukkainen',
            password: 'salainen'
            }

            await api
            .post('/api/usuarios')
            .send(nuevoUsuario)
            .expect(201)
            .expect('Content-Type', /application\/json/)

            const usuariosAlFinal = await ayuda.usuariosEnBd()
            assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length +  1) // Comprueba que se agregó un nuevo usuario

            const nombres_usuarios = usuariosAlFinal.map(u => u.nombre_usuario)
            assert(nombres_usuarios.includes(nuevoUsuario.nombre_usuario)) // Comprueba que el nombre de usuario nuevo está en a base de datos
        })

        // Prueba que verifica que falle la creación de usuario si el nombre de usuario ya está tomado
        test('la creación del usuario falla si el nombre de usuario ya está tomado', async () => {
            const usuariosAlInicio = await ayuda.usuariosEnBd()

            const nuevoUsuario = {
                nombre_usuario: 'root', // Nombre de usuario existente
                nombre: 'Superuser',
                password: 'salainen'
            }

            const resultado = await api
            .post('/api/usuarios')
            .send(nuevoUsuario)
            .expect(400)
            .expect('Content-Type', /application\/json/)

            const usuariosAlFinal = await ayuda.usuariosEnBd()
            assert(resultado.body.error.includes('El nombre de usuario ya está en uso')) // Comprueba que muestre el mensaje de error

            assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length) // Comprueba que la base de datos no cambió
        })

        // Prueba que comprueba que si falta alguna propiedad, el usuario no puede ser creado
        test('si falta el nombre de usuario, no se puede crear el usuario', async () => {
            const nuevoUsuario = {
                nombre: 'Nuevo',
                password: 'sekret'
            }

            await api
            .post('/api/usuarios')
            .send(nuevoUsuario)
            .expect(400)

            const usuariosAlFinal = await ayuda.usuariosEnBd()
            const usuariosIniciales = await ayuda.usuariosIniciales() // Llama a la función de ayuda
            assert.strictEqual(usuariosAlFinal.length, usuariosIniciales.length) // Comprueba que la base de datos no cambió
        })

        // Prueba que verifica que un usuario no puede ser creado si tiene menos de 3 caracteres
        test('un usuario no puede ser creado si el nombre tiene menos de 3 caracteres', async () => {
            const usuariosAlInicio = await ayuda.usuariosEnBd()

            const nuevoUsuario = {
                nombre_usuario: 'ad',
                nombre: 'Albe',
                password: 'sekret'
            }

            await api
            .post('/api/usuarios')
            .send(nuevoUsuario)
            .expect(400)
            .expect('Content-Type', /application\/json/)

            const usuariosAlFinal = await ayuda.usuariosEnBd()
            assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length) // Comprueba que la base de datos no cambió
        })

        // Prueba que verifica que un usuario no puede ser creado si la contraseña tiene menos de 3 caracteres
        test('un usuario no puede ser creado si la contraseña tiene menos de 3 caracteres', async () => {
            const usuariosAlInicio = await ayuda.usuariosEnBd()

            const nuevoUsuario = {
                nombre_usuario: 'admin',
                nombre: 'Albe',
                password: 'se'
            }

            await api
            .post('/api/usuarios')
            .send(nuevoUsuario)
            .expect(400)
            .expect('Content-Type', /application\/json/)

            const usuariosAlFinal = await ayuda.usuariosEnBd()
            assert.strictEqual(usuariosAlFinal.length, usuariosAlInicio.length) // Comprueba que la base de datos no cambió
        })
    })
})


// Cierra la conexión luego de las pruebas
after(async () => {
    await mongoose.connection.close()
})