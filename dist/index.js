"use strict";
const botonPrueba = document.querySelector("#boton-prueba");
const mensajePrueba = document.querySelector("#mensaje-prueba");
const buscador = document.querySelector("#buscarNombre");
const catalogo = document.querySelector("#catalogo");
if (botonPrueba !== null && mensajePrueba !== null) {
    botonPrueba.addEventListener("click", () => {
        mensajePrueba.textContent = "¡La conexión funciona!";
    });
}
if (buscador !== null && mensajePrueba !== null) {
    buscador.addEventListener("input", () => {
        mensajePrueba.textContent = "Estás buscando: " + buscador.value;
    });
}
const productos = [
    { id: 1, nombre: "Teclado", categoria: "Periféricos", precio: 25000, stock: 8 },
    { id: 2, nombre: "Mouse", categoria: "Periféricos", precio: 15000, stock: 0 },
    { id: 3, nombre: "Monitor", categoria: "Pantallas", precio: 180000, stock: 4 }
];
function renderizarProductos(lista) {
    if (!catalogo)
        return;
    catalogo.replaceChildren();
    if (lista.length === 0) {
        catalogo.textContent = "No hay productos para mostrar.";
        return;
    }
    for (const producto of lista) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";
        const titulo = document.createElement("h3");
        titulo.textContent = producto.nombre;
        const detalle = document.createElement("p");
        detalle.textContent = `${producto.categoria} | $${producto.precio} | Stock: ${producto.stock}`;
        tarjeta.append(titulo, detalle);
        catalogo.append(tarjeta);
    }
}
// Llamada inicial para mostrar los productos
renderizarProductos(productos);
