const botonPrueba = document.querySelector<HTMLButtonElement>("#boton-prueba");
const mensajePrueba = document.querySelector<HTMLParagraphElement>("#mensaje-prueba");
const buscador = document.querySelector<HTMLInputElement>("#buscarNombre");
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





