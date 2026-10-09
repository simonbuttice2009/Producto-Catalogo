const botonPrueba = document.querySelector<HTMLButtonElement>("#boton-prueba");
const mensajePrueba = document.querySelector<HTMLParagraphElement>("#mensaje-prueba");
const buscador = document.querySelector<HTMLInputElement>("#buscarNombre");
const catalogo = document.querySelector<HTMLDivElement>("#catalogo");
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
interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

const productos: Producto[] = [
  { id: 1, nombre: "Teclado", categoria: "Periféricos", precio: 25000, stock: 8 },
  { id: 2, nombre: "Mouse", categoria: "Periféricos", precio: 15000, stock: 0 },
  { id: 3, nombre: "Monitor", categoria: "Pantallas", precio: 180000, stock: 4 }
];
function renderizarProductos(lista: Producto[]): void {
  if (!catalogo) return;
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





