const express = require('express')
const app = express() 
const cors = require('cors')

// Middlewares
// Middleware que imprime información de cada solicitud que se envía al servidore
const solicitudesInfo = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:', request.path);
    console.log('Body:', request.body);
    next() // Pasa al siguiente middleware
}

app.use(express.json()) // json-parser para añadir blogs (POST)
app.use(solicitudesInfo) // Usar el middleware solicitudInfo
app.use(cors()) // Usar el middleware para permitir solicitudes de todos los origenes
app.use(express.static('build')) // Middleware para que muestre contenido estático

let blogs = [
  {
    id: 1,
    titulo: "HTML is easy",
    autor: "Daniel Palomares",
    url: "https://miblog.com",
    likes: 20,
  },
  {
    id: 2,
    titulo: "Browser can execute only JavaScript",
    autor: "Roberto Alcantars",
    url: "https://miblog.com",
    likes: 40,
  },
  {
    id: 3,
    titulo: "GET and POST are the most important methods of HTTP protocol",
    autor: "Manuel Pezuño",
    url: "https://miblog.com",
    likes: 10,
  }
]

// Ruta para obtener la lista de blogs
app.get('/api/blogs', (request, response) => {
  response.json(blogs)
})
// Ruta para obtener un blog individual
app.get('/api/blogs/:id', (request, response) => {
  const id = Number(request.params.id) // Solicitud request para obtener el parámetro id
  const blog = blogs.find(blog => blog.id === id) // Buscamos el id del blog en especifico dentro del array)
  console.log(blog)
  // Condición si encuentra o no el blog
  if (blog) {
    response.json(blog) // Si encuentra el id del blog
  } else {
    response.status(404).end() // Si no lo encuentra responde con la solicitud 404 No Found
  }
})
// Ruta para eliminar un blog
app.delete('/api/blogs/:id', (request, response) => {
   const id = Number(request.params.id) // Solicitud request para obtener el parámetro id
   blogs = blogs.filter(blog => blog.id !== id) // El blog eliminado no se encuentra en el array
   // Si el blog se eliminó
   response.status(204).end() // Responde con 204 No content
})
// Función para generar un ID consecutivo
const generarId = () => {
    const maxId = blogs.length > 0 // Encuentra el id mayor
    ? Math.max(...blogs.map(b => b.id))  // Crea un nuevo array con todos los ids de los blogs
    : 0 // Si hay numeros empieza desde 0
    return maxId + 1 // Regresa el número de ID mayor y le suma 1
}
// Ruta para postear un blog
app.post('/api/blogs', (request, response) => {
    const body = request.body // Acceder a los datos de la propiedad body
    // Reglas si faltan datos en el post
    if (
    !body.titulo?.trim() ||
    !body.autor?.trim() ||
    !body.url?.trim() 
    ) {
    return response.status(400).json({ // Responde con Bad Requests
    error: 'Complete todos los datos necesarios',
    })
    }
    
    // Reglas para definir los tipos de datos creados
    nuevoBlog = {
        id: generarId(),
        titulo: body.titulo,
        autor: body.autor,
        url: body.url,
        likes: 0
    }
    blogs = blogs.concat(nuevoBlog) // Aggrega el nuevo blog a la array

    console.log(nuevoBlog)
    response.json(nuevoBlog) // Responde con el blog creado    
})
// Miiddleware para capturar solicitudes a rutas inexistentes
const rutasInexistentes = (request, response) => {
    // Responde con:
    response.status(404).send({ error: 'Ruta Inexistente' }) // No Found
}
app.use(rutasInexistentes) // Usar el middleware rutasInexistentes

// Puerto donde se desplegará la app
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})