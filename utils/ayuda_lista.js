// Modulo para definir funciones de apoyo para las pruebas
const _ = require('lodash') // Libreria para conteos y maximos

// Función que toma un array (blogs) y devuelve la suma total de likes en todos los blogs
const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0) // El valor inicial del acumulador(sum) es 0, sumando cada like del blog al acumulador (sum)
}

// Función que toma un array (blogs) y el descubre el blog con más likes
const blogFavorito = (blogs) => {
    if (blogs.length === 0) {
        return null // Si no hay blogs devuelve null
    }

    // Encuentra el blog con más likes
    const maxLikesBlog = blogs.reduce((fav, blog) => blog.likes > fav.likes ? blog : fav)

    // Retorna solo los campos requeridos
    return {
        titulo: maxLikesBlog.titulo,
        autor: maxLikesBlog.autor,
        likes: maxLikesBlog.likes
    }
}

// Función que toma un array (blogs) y descubre el autor con más blogs
const masBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null // Si no hay blogs devuelve null
    }

    // Determinar maximos usando libreria lodash
    const cantidad = _.countBy(blogs, 'autor') // Crea un objeto autor => cantidad
    const topAutor = _.maxBy(Object.keys(cantidad), (a) => cantidad[a]) // Devuelve la clave cuyo computado por fn es mayor (osea el autor con más blogs)
    return { autor: topAutor, blogs: cantidad[topAutor] }
}

// Función que toma un array (blogs) y devuelve el autor con los blogs con más likes y el número total de likes recibidos
const masLikes = (blogs) => {
    if (blogs.length === 0) {
        return null // Si no hay blogs devuelve null
    }

    const blogsAgrupados = _.groupBy(blogs, 'autor') // Agrupar blogs por autor
    // Transformar en {autor, likes}
    const likesPorAutor = _.map(blogsAgrupados, (blogsAutor, autor) => ({
        autor,
        likes: _.sumBy(blogsAutor, 'likes'),
    }))

    // Devuelve el autor con más likes
    return _.maxBy(likesPorAutor, 'likes')
}

module.exports = {
    totalLikes,
    blogFavorito,
    masBlogs,
    masLikes
}