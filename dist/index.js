"use strict";
const botonPrueba = document.querySelector("#boton-prueba");
const mensajePrueba = document.querySelector("#mensaje-prueba");
const buscador = document.querySelector("#buscarNombre");
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
