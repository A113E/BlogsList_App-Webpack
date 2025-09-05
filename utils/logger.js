const info = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
    console.log(...params) // Imprime mensajes de registro normales
  }
}

const error = (...params) => {
    if (process.env.NODE_ENV !== 'test') {
    console.error(...params) // Imprime mensajes de error
  }
}

module.exports = {
    info, error
}