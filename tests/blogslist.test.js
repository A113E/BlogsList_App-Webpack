// Pruebas para la lista de blogs
const { test, describe } = require('node:test')
const assert = require('node:assert') // Para comparar resultados
const ayudaPruebas = require('../utils/ayuda_lista')

// Bloque de pruebas para el total de likes
describe('Total de Likes', () => {
    // Array inicial con un solo blog
    const listaConUnBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      titulo: 'Go To Statement Considered Harmful',
      autor: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  // Array inicial con múltiples blogs
  const listaConMultiplesBlogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    titulo: "React patterns",
    autor: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    titulo: "Go To Statement Considered Harmful",
    autor: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    titulo: "Canonical string reduction",
    autor: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    titulo: "First class tests",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    titulo: "TDD harms architecture",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    titulo: "Type wars",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
  ]

  // Prueba que comprueba el total de likes de la lista de un solo blog
  test('Cuando la lista es de un solo blog, el total de likes es igual a ese blog', () => {
    const resultado = ayudaPruebas.totalLikes(listaConUnBlog)
    assert.strictEqual(resultado, 5) // Comprueba que el blog tiene 5 likes
  })

  // Prueba que comprueba que si la lista de blogs está vacia es igual a 0
  test('Cuando la lista esta vacia, el total de likes es 0', () => {
    const resultado = ayudaPruebas.totalLikes([])
    assert.strictEqual(resultado, 0) // Comprueba que hay 0 likes
  })

  // Prueba que comprueba que la suma total de likes de una lista multiple es correcta
  test('Cuando la lista es multiple, la suma de likes total es correcta', () => {
    const resultado = ayudaPruebas.totalLikes(listaConMultiplesBlogs)
    assert.strictEqual(resultado, 36) // Comprueba que la suma es 36
  })
})

// Bloque de pruebas para el blog favorito
describe('Blog Favorito', () => {
    // Array inicial con un solo blog
    const listaConUnBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      titulo: 'Go To Statement Considered Harmful',
      autor: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  // Array inicial con múltiples blogs
  const listaConMultiplesBlogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    titulo: "React patterns",
    autor: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    titulo: "Go To Statement Considered Harmful",
    autor: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    titulo: "Canonical string reduction",
    autor: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    titulo: "First class tests",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    titulo: "TDD harms architecture",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    titulo: "Type wars",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
  ]

  // Prueba que comprueba que si el array está vacio devuelve null
  test('Lista vacia es nula', () => {
    const resultado = ayudaPruebas.blogFavorito([])
    assert.strictEqual(resultado, null) // Comprueba que devuelva null
  })

  // Prueba que comprueba que devuelva el blog con mas likes en una lista de un solo blog
  test('Cuando la lista tiene un solo blog, ese es el blog favorito', () => {
    const resultado = ayudaPruebas.blogFavorito(listaConUnBlog)

    const blogDevuelto = {
        titulo: 'Go To Statement Considered Harmful',
        autor: 'Edsger W. Dijkstra',
        likes: 5
    }

    assert.deepStrictEqual(resultado, blogDevuelto) // Comprueba que devuelva el blog en ese formato
  })

  // Prueba que comprueba que devuelve el blog con mas likes de una lista multiple
  test('Devuelve el blog con más likes en una lista multiple', () => {
    const resultado = ayudaPruebas.blogFavorito(listaConMultiplesBlogs)

    const blogDevuelto = {
        titulo: "Canonical string reduction",
        autor: "Edsger W. Dijkstra",
        likes: 12
    }

    assert.deepStrictEqual(resultado, blogDevuelto) // Comprueba que devuelva el blog con ese formato
  })
})

// Bloque de pruebas para el autor con más blogs
describe('Autor con más blogs', () => {
    // Array inicial con un solo blog
    const listaConUnBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      titulo: 'Go To Statement Considered Harmful',
      autor: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  // Array inicial con múltiples blogs
  const listaConMultiplesBlogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    titulo: "React patterns",
    autor: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    titulo: "Go To Statement Considered Harmful",
    autor: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    titulo: "Canonical string reduction",
    autor: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    titulo: "First class tests",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    titulo: "TDD harms architecture",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    titulo: "Type wars",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
  ]

    // Prueba que comprueba que devuelva null si la lista esta vacia
    test('Si la lista esta vacia, devuelve null', () => {
        const resultado = ayudaPruebas.masBlogs([])
        assert.strictEqual(resultado, null) // Comprueba que devuelva null
    })

    // Prueba que comprueba que si la lista tiene un solo blog, devuelve el autor con la cantidad
    test('Si la lista tiene un solo blog, devuelve el autor con 1 blog', () => {
        const resultado = ayudaPruebas.masBlogs(listaConUnBlog)

        const autorDevuelto = {
            autor: 'Edsger W. Dijkstra',
            blogs: 1
        }

        assert.deepStrictEqual(resultado, autorDevuelto) // Comprueba que devuelva el autor con un 1 blog en ese formato
    })

    // Prueba que comprueba que halla el autor con más blogs de una lista multiple
    test('Descubre el autor con más blogs en una lista multiple', () => {
        const resultado = ayudaPruebas.masBlogs(listaConMultiplesBlogs)

        const autorDevuelto = {
            autor: 'Robert C. Martin',
            blogs: 3
        }

        assert.deepStrictEqual(resultado, autorDevuelto) // Comprueba que devuelva el autor con la mayor cantidad de blogs en ese formato
    })
})

// Bloque de prueba para el autor con más likes
describe('Autor con más Likes', () => {
    // Array inicial con un solo blog
    const listaConUnBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      titulo: 'Go To Statement Considered Harmful',
      autor: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  // Array inicial con múltiples blogs
  const listaConMultiplesBlogs = [
    {
    _id: "5a422a851b54a676234d17f7",
    titulo: "React patterns",
    autor: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    titulo: "Go To Statement Considered Harmful",
    autor: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    titulo: "Canonical string reduction",
    autor: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    titulo: "First class tests",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    titulo: "TDD harms architecture",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    titulo: "Type wars",
    autor: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
  ]

  // Prueba que comprueba que devuelva null si la lista esta vacia
  test('Devuelve null si la lista esta vacia', () => {
    const resultado = ayudaPruebas.masLikes([])
    assert.strictEqual(resultado, null) // Comprueba que devuelva null
  })

  // Prueba que comprueba que devuelva el autor con mas likes en una lista con un solo blog
  test('El autor con mas likes es devuelto en una lista con un solo blog', () => {
    const resultado = ayudaPruebas.masLikes(listaConUnBlog)

    const autorDevuelto = {
        autor: 'Edsger W. Dijkstra',
        likes: 5
    }

    assert.deepStrictEqual(resultado, autorDevuelto) // Comprueba que devuelva el autor con la cantidad de likes en ese formato
  })

  // Prueba que comprueba que devuelva el autor con más likes en una lista multiple
  test('El autor con mas likes es devuelto en una lista multiple', () => {
    const resultado = ayudaPruebas.masLikes(listaConMultiplesBlogs)

    const autorDevuelto = {
        autor: 'Edsger W. Dijkstra',
        likes: 17
    }

    assert.deepStrictEqual(resultado, autorDevuelto) // Comprueba que devuelva el autor con la mayor cantidad de likes en ese formato
  })
})