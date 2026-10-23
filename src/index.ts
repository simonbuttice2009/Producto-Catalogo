const botonPrueba = document.querySelector<HTMLButtonElement>("#boton-prueba");
const mensajePrueba = document.querySelector<HTMLParagraphElement>("#mensaje-prueba");
const buscador = document.querySelector<HTMLInputElement>("#buscarNombre");
const catalogo123 = document.querySelector<HTMLDivElement>("#catalogo");
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
interface Categoria { id: number; nombre: string; }
let productos: Producto[] = [];
const catalogo = document.querySelector<HTMLElement>("#catalogo");
const formulario = document.querySelector<HTMLFormElement>("#formulario-producto");
const nombre = document.querySelector<HTMLInputElement>("#nombre");
const categoria = document.querySelector<HTMLSelectElement>("#categoria");
const precio = document.querySelector<HTMLInputElement>("#precio");
const stock = document.querySelector<HTMLInputElement>("#stock");
const mensaje = document.querySelector<HTMLElement>("#mensaje");
const busqueda = document.querySelector<HTMLInputElement>("#busqueda");
function informar(texto: string): void {
  if (mensaje) mensaje.textContent = texto;
}
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
    detalle.textContent =
      `${producto.categoria} | $${producto.precio} | Stock: ${producto.stock}`;
    tarjeta.append(titulo, detalle);
    catalogo.append(tarjeta);
  }
}
function mostrarLista(): void {
  const texto = busqueda?.value.trim().toLowerCase() ?? "";
  renderizarProductos(productos.filter(p =>
    p.nombre.toLowerCase().includes(texto)));
}
async function cargarDatos(): Promise<void> {
  if (!categoria) throw new Error("Falta el select de categoría.");
  const respuestaCategorias = await fetch("http://127.0.0.1:3000/api/categorias");
  if (!respuestaCategorias.ok) throw new Error("No se pudieron cargar las categorías.");
  const categorias: Categoria[] = await respuestaCategorias.json();
  categoria.replaceChildren();
  for (const item of categorias) {
    const opcion = document.createElement("option");
    opcion.value = String(item.id);
    opcion.textContent = item.nombre;
    categoria.append(opcion);
  }
  await cargarProductos();
}
async function cargarProductos(): Promise<void> {
  const respuesta = await fetch("http://127.0.0.1:3000/api/productos");
  if (!respuesta.ok) throw new Error("No se pudieron cargar los productos.");
  productos = await respuesta.json();
  mostrarLista();
}
busqueda?.addEventListener("input", mostrarLista);
formulario?.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  if (!nombre || !categoria || !precio || !stock) return;
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
    const resultado: { mensaje: string } = await respuesta.json();
    if (!respuesta.ok) throw new Error(resultado.mensaje);
    formulario.reset();
    informar("Producto guardado. Actualizando catálogo…");
    await cargarProductos();
    informar("Producto guardado y catálogo actualizado.");
  } catch (error) {
    informar(error instanceof Error ? error.message : "Ocurrió un error.");
  }
});
void cargarDatos().catch((error: unknown) => {
  informar(error instanceof Error ? error.message : "No se pudo cargar el catálogo.");
});


