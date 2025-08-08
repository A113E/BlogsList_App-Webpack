const mongoose = require('mongoose') // Modulo para conectar con MongoDB

mongoose.set('strictQuery', false) // Evita advertencias en consultas estrictas

// Url del entorno
const url = process.env.MONGODB_URI
console.log('Conectado', url)

// Conectar a la base de datos
mongoose.connect(url)
.then(resultado => {
    console.log('Conectado a MongoDB')
})
// Manejo de errores
.catch(error => {
    console.log('Error al conectar a MongoDB', error.message)
})

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
    likes: Number
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