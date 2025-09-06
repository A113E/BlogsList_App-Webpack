const mongoose = require('mongoose') // Modulo para conectar con MongoDB

// Esquema BD para la lista de blogs
const blogSchema = new mongoose.Schema({
    titulo: {
        type: String,
        minLength: 5, // Minimo 5 caracteres
        required: true // Campo requerido
    },
    autor: {
       type: String,
        minLength: 5, // Minimo 5 caracteres
        required: true // Campo requerido
    },
    url: {
        type: String,
        minLength: 5, // Minimo 5 caracteres
        required: true // Campo requerido
    },
    likes: {
        type: Number,
        default: 0
    },
    usuario: { // Matriz ID que hace referncia a los usuarios
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})

// Configuración de los blogs a formato JSON
blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString() // Crea un campo id y lo convierte en una cadena
        // Elimina el campo "_id" original
        delete returnedObject._id
       // Elimina el campo "__v"
       delete returnedObject.__v
    }
})

module.exports = mongoose.model('Blog', blogSchema)