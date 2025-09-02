const info = (...params) => {
    console.log(...params) // Imprimir mensajes de registros normales
}

const error = (...params) => {
    console.error(...params) // Imprimir mensajes de error
}

module.exports = {
    info, error
}