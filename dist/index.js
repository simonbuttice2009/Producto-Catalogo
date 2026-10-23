"use strict";
const botonPrueba = document.querySelector("#boton-prueba");
const mensajePrueba = document.querySelector("#mensaje-prueba");
const buscador = document.querySelector("#buscarNombre");
const catalogo123 = document.querySelector("#catalogo");
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
let productos = [];
const catalogo = document.querySelector("#catalogo");
const formulario = document.querySelector("#formulario-producto");
const nombre = document.querySelector("#nombre");
const categoria = document.querySelector("#categoria");
const precio = document.querySelector("#precio");
const stock = document.querySelector("#stock");
const mensaje = document.querySelector("#mensaje");
const busqueda = document.querySelector("#busqueda");
function informar(texto) {
    if (mensaje)
        mensaje.textContent = texto;
}
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
        detalle.textContent =
            `${producto.categoria} | $${producto.precio} | Stock: ${producto.stock}`;
        tarjeta.append(titulo, detalle);
        catalogo.append(tarjeta);
    }
}
function mostrarLista() {
    const texto = busqueda?.value.trim().toLowerCase() ?? "";
    renderizarProductos(productos.filter(p => p.nombre.toLowerCase().includes(texto)));
}
async function cargarDatos() {
    if (!categoria)
        throw new Error("Falta el select de categoría.");
    const respuestaCategorias = await fetch("http://127.0.0.1:3000/api/categorias");
    if (!respuestaCategorias.ok)
        throw new Error("No se pudieron cargar las categorías.");
    const categorias = await respuestaCategorias.json();
    categoria.replaceChildren();
    for (const item of categorias) {
        const opcion = document.createElement("option");
        opcion.value = String(item.id);
        opcion.textContent = item.nombre;
        categoria.append(opcion);
    }
    await cargarProductos();
}
async function cargarProductos() {
    const respuesta = await fetch("http://127.0.0.1:3000/api/productos");
    if (!respuesta.ok)
        throw new Error("No se pudieron cargar los productos.");
    productos = await respuesta.json();
    mostrarLista();
}
busqueda?.addEventListener("input", mostrarLista);
formulario?.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (!nombre || !categoria || !precio || !stock)
        return;
    const nuevo = {
        nombre: nombre.value.trim(),
        idCategoria: Number(categoria.value),
        precio: precio.valueAsNumber,
        stock: stock.valueAsNumber
    };
    try {
        const respuesta = await fetch("http://127.0.0.1:3000/api/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevo)
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok)
            throw new Error(resultado.mensaje);
        formulario.reset();
        informar("Producto guardado. Actualizando catálogo…");
        await cargarProductos();
        informar("Producto guardado y catálogo actualizado.");
    }
    catch (error) {
        informar(error instanceof Error ? error.message : "Ocurrió un error.");
    }
});
void cargarDatos().catch((error) => {
    informar(error instanceof Error ? error.message : "No se pudo cargar el catálogo.");
});
