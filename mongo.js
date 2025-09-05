const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('solicita contraseña')
    process.exit(1)
}

const contraseña = process.argv[2]

const url =
  `mongodb+srv://admin:${contraseña}@cluster0.lm4im.mongodb.net/BlogListaTest?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
    titulo: String,
    autor: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blogs = [
  {
    titulo: 'Probando base de datos',
    autor: 'Admin',
    url: 'www.admin.local',
    likes: 0
  },
  {
    titulo: 'Segundo blog de prueba',
    autor: 'Otro Autor',
    url: 'www.otroblog.local',
    likes: 5
  }
]

Blog.insertMany(blogs)
  .then(() => {
    console.log('Blogs guardados')
    mongoose.connection.close()
  })
  .catch(error => {
    console.error(error)
    mongoose.connection.close()
  })