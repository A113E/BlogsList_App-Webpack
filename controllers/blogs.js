const blogsRouter = require('express').Router() // Enrutador
const Blog = require('../models/blog') // Modelo

// Ruta para obtener la lista de blogs
blogsRouter.get('/', (request, response, next) => {
  // Obtiene los blogs desde la base de datos MongoDB
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
  // Manejo de errores
  .catch((error) => next(error))
})

// Ruta para obtener un blog individual
blogsRouter.get('/:id', (request, response, next) => {
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
blogsRouter.delete('/:id', (request, response, next) => {
   const id = request.params.id // Solicitud request para obtener el parámetro id
   Blog.findByIdAndDelete(id)
   .then(() => {
    response.status(204).end() // Responde con "No content"
   })
   // Manejo de errores
   .catch((error) => next(error))
})

// Ruta para postear un blog
blogsRouter.post('/', (request, response, next) => {
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
blogsRouter.post('/:id/likes', (request, response, next) => {
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

module.exports = blogsRouter