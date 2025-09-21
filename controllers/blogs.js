const blogsRouter = require('express').Router() // Enrutador
// Modelos
const Blog = require('../models/blog')
const { usuarioExtractor } = require('../utils/middleware')


// Ruta para obtener la lista de blogs
blogsRouter.get('/', async (request, response) => {
    // Obtiene los blogs desde la base de datos MongoDB
    const blogs = await Blog.find({}).populate('usuario', { nombre_usuario: 1, nombre: 1 }) // Populate para mostrar los datos del usuario que creó el blog
    response.json(blogs)
})

// Ruta para obtener un blog individual
blogsRouter.get('/:id', async (request, response) => {
  const id = request.params.id
    // Busca el blog por ID
    const blog = await Blog.findById(id)

    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
})

// Ruta para eliminar un blog
blogsRouter.delete('/:id', usuarioExtractor, async (request, response) => {
  const usuario = request.usuario
  const id = request.params.id
   const blog = await Blog.findByIdAndDelete(id).populate('usuario', { nombre_usuario: 1, nombre: 1 }) // Solicitud request para obtener el parámetro id y eliminar
   if (!blog) {
    return response.status(404).json({ error: 'Blog no encontrado' })
   }
   if (usuario.id.toString() !== blog.usuario.toString()) {
    return response.status(403).json({ error: 'Usuario no autorizado' })
   }

   usuario.blogs = usuario.blogs.filter(b => b.id.toString() !== blog.id.toString())

   await blog.deleteOne()
   response.status(204).end()
})

// Ruta para postear un blog
blogsRouter.post('/', usuarioExtractor, async (request, response) => {
    const body = request.body // Acceder a los datos de la propiedad body
    const usuario = request.usuario // Acceder a traves del middleware

    if (!usuario) {
      return response.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Crear un nuevo blog
    const nuevoBlog = new Blog({
        titulo: body.titulo,
        autor: body.autor,
        url: body.url,
        likes: body.likes || 0,
        usuario: usuario._id
    })

   const blogGuardado = await nuevoBlog.save()
   usuario.blogs = usuario.blogs.concat(blogGuardado._id)
   await usuario.save()

   response.status(201).json(blogGuardado)
})

// Ruta para actualizar un blog
blogsRouter.put('/:id', usuarioExtractor, async (request, response) => {
  const { titulo, autor, url, likes } = request.body
  const id = request.params.id
  const usuario = request.usuario

  if (!usuario) {
      return response.status(401).json({ error: 'Usuario no autenticado' })
    }

  // Verificar si ya existe otro blog con el mismo título
  const blogExistente = await Blog.findOne({ titulo })
  if (blogExistente && blogExistente._id.toString() !== id) {
    return response.status(400).json({ error: 'Ya existe un blog con ese título' })
  }


  const blogActualizado = await Blog.findByIdAndUpdate(
    id,
    { titulo, autor, url, likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('usuario', { nombre_usuario: 1, nombre: 1 })

  blogActualizado
  ? response.status(200).json(blogActualizado.toJSON())
  : response.status(404).end()
})

// Ruta para dar like a un blog
blogsRouter.post('/:id/likes', async (request, response) => {
  const id = request.params.id

  const blogLike = await Blog.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },  // incrementa likes en +1
      { new: true, runValidators: true, context: 'query' } // devuelve el blog actualizado
    )
  if (!blogLike) {
    return response.status(404).json({ error: 'Blog no encontrado' })
   }

  response.status(200).json(blogLike)
})

module.exports = blogsRouter