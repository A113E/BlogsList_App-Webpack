const mongoose = require('mongoose')

const usuarioSchema = new mongoose.Schema({
    nombre_usuario: {
        type: String,
        minLength: 3,
        required: true,
        unique: true // Nombre de usuario único
    },
    nombre: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    blogs: [ // Matriz ID que hacer referncia a los blogs
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ],
})

// Formateo de los usuarios a formato JSON
usuarioSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash // La contraseña no debe mostrarse
    }
})

const Usuario = mongoose.model('Usuario', usuarioSchema)

module.exports = Usuario