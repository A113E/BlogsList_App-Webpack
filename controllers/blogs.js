const blogsRouter = require('express').Router() // Enrutador
const Blog = require('../models/blog') // Modelo

// Ruta para obtener la lista de blogs
blogsRouter.get('/', async (request, response) => {
    // Obtiene los blogs desde la base de datos MongoDB
    const blogs = await Blog.find({})
    response.json(blogs)
})

// Ruta para obtener un blog individual
blogsRouter.get('/:id', async (request, response) => {
    // Busca el blog por ID
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
})

// Ruta para eliminar un blog
blogsRouter.delete('/:id', async (request, response) => {
   const blog = await Blog.findByIdAndDelete(request.params.id) // Solicitud request para obtener el parámetro id y eliminar
   if (!blog) {
    return response.status(404).json({ error: 'Blog no encontrado' })
   }
   response.status(204).end()
})

// Ruta para postear un blog
blogsRouter.post('/', async (request, response) => {
    const body = request.body // Acceder a los datos de la propiedad body

    // Crear un nuevo blog
    const nuevoBlog = new Blog({
        titulo: body.titulo,
        autor: body.autor,
        url: body.url,
        likes: body.likes || 0,
    })

   const blogGuardado = await nuevoBlog.save()
   response.status(201).json(blogGuardado)
})

// Ruta para dar like a un blog
blogsRouter.post('/:id/likes', async (request, response) => {
  const blogLike = await Blog.findByIdAndUpdate(
      request.params.id,
      { $inc: { likes: 1 } },  // incrementa likes en +1
      { new: true }           // devuelve el blog actualizado
    )
  if (!blogLike) {
    return response.status(404).json({ error: 'Blog no encontrado' })
   }

  response.status(200).json(blogLike)
})

module.exports = blogsRouter