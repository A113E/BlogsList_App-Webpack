require('dotenv').config() // Libreria para variable de entorno
const express = require('express')
const app = express() 
const cors = require('cors')

const Blog = require('./models/blog') // Model

// Middlewares
// Middleware que imprime información de cada solicitud que se envía al servidore
const solicitudesInfo = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    next() // Pasa al siguiente middleware
}

app.use(cors()) // Usar el middleware para permitir solicitudes de todos los origenes
app.use(express.static('build')) // Middleware para que muestre contenido estático
app.use(express.json()) // json-parser para añadir blogs (POST)
app.use(solicitudesInfo) // Usar el middleware solicitudInfo


// Ruta para la página principal
app.get('/', (request, response) => {
  response.send('<h1>Lista de Blogs</h1>')
})
// Ruta para obtener la lista de blogs
app.get('/api/blogs', (request, response, next) => {
  // Obtiene los blogs desde la base de datos MongoDB
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
  // Manejo de errores
  .catch((error) => next(error))
})
// Ruta para obtener un blog individual
app.get('/api/blogs/:id', (request, response, next) => {
  const id = request.params.id // Solicitud request para obtener el parámetro id
  Blog.findById(id)
  .then(blog => {
    // Si encuentra el blog
    if (blog) {
      response.json(blog)
    } else { // Si no lo encuentra
      response.status(404).end() // No found
    }
  })
  // Manejo de errores
  .catch((error) => next(error))
})
// Ruta para eliminar un blog
app.delete('/api/blogs/:id', (request, response, next) => {
   const id = request.params.id // Solicitud request para obtener el parámetro id
   Blog.findByIdAndDelete(id)
   .then(() => {
    response.status(204).end() // Responde con "No content"
   })
   // Manejo de errores
   .catch((error) => next(error))
})
// Ruta para postear un blog
app.post('/api/blogs', (request, response, next) => {
    const body = request.body // Acceder a los datos de la propiedad body
   
    // Crear un nuevo blog
    const nuevoBlog = new Blog({
        titulo: body.titulo,
        autor: body.autor,
        url: body.url,
        likes: body.likes || 0,
    })
    
   nuevoBlog.save()
   .then(blogGuardado => {
    response.status(201).json(blogGuardado)
    console.log(blogGuardado)  
   })
   // Manejo de errores
   .catch((error) => next(error))
})
// Ruta para dar like a un blog
app.post('/api/blogs/:id/likes', (request, response, next) => {
  const id = request.params.id // Solicitud request para obtener el parámetro id
  Blog.findById(id)
  .then(blog => {
      if (!blog) {
        return response.status(404).json({ error: 'Blog no encontrado' })
      }
  blog.likes += 1

  return blog.save()
    })
    .then(blogActualizado => {
      response.status(200).json(blogActualizado)
    })
  // Manejo de errores
   .catch((error) => next(error))
})
// Miiddleware para capturar solicitudes a rutas inexistentes
const rutasInexistentes = (request, response) => {
    // Responde con:
    response.status(404).send({ error: 'Ruta Inexistente' }) // No Found
}
app.use(rutasInexistentes) // Usar el middleware rutasInexistentes

// Middleware para manejo de errores
const manejoErrores = (error, request, response, next) => {
  console.error(error.message)

  // Verificación de tipo de error:
  if (error.name === 'CastError') { // Si es una excepción CastError: mal formarto de ID
    return response.status(400).send({ error: 'Formato de ID incorrecto' })
  } else if (error.name === 'ValidationError') { // Si es un error en la validación de datos de los campos
    return response.status(300).json({ error: error.message })
  }

  next(error)
}

app.use(manejoErrores) // Usar el handler middleware ** DEBE SER EL ÚLTIMO MIDDLEWARE CARGADO **

// Puerto donde se desplegará la app
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})