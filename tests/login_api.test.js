const { test, after, beforeEach, describe } = require('node:test')
const Usuario = require('../models/usuario')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const ayuda = require('../utils/ayuda_prueba') // asegúrate que ruta sea correcta
const assert = require('assert')

const api = supertest(app)

beforeEach(async () => {
    await Usuario.deleteMany({})

    const usuarios = await ayuda.usuariosIniciales()
    await Usuario.insertMany(usuarios)
})

describe('Pruebas de login', () => {

    test('Login de usuario correcto devuelve token', async () => {
        const credenciales = {
            nombre_usuario: 'root',
            password: 'sekret'
        }

        const resultado = await api
            .post('/api/login')
            .send(credenciales)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.ok(resultado.body.token, 'No se devolvió token')
        assert.strictEqual(resultado.body.nombre_usuario, 'root')
    })

    test('Falla si contraseña es incorrecta', async () => {
        const credenciales = {
            nombre_usuario: 'root',
            password: 'wrongpass'
        }

        const resultado = await api
            .post('/api/login')
            .send(credenciales)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert.ok(resultado.body.error.includes('Nombre de usuario y contraseña no válidos'))
        assert.strictEqual(resultado.body.token, undefined)
    })

    test('Falla si faltan credenciales', async () => {
        const credenciales = {
            nombre_usuario: 'root'
        } // Falta password

        const resultado = await api
            .post('/api/login')
            .send(credenciales)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.ok(resultado.body.error.includes('Faltan Credenciales'))
    })

})

after(async () => {
    await mongoose.connection.close()
})
