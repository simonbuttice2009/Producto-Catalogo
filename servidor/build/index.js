"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const node_path_1 = __importDefault(require("node:path"));
const cors_1 = __importDefault(require("cors")); // <--- 1. Importar cors
dotenv_1.default.config({ path: node_path_1.default.resolve(__dirname, "../.env") });
const app = (0, express_1.default)();
// --- 2. Configurar CORS para permitir el puerto 5500 ---
app.use((0, cors_1.default)({
    origin: "http://127.0.0.1:5500" // O puedes usar "http://localhost:5500" según cómo abras tu Live Server
}));
app.use(express_1.default.json());
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});
const raiz = node_path_1.default.resolve(__dirname, "../..");
app.get("/", (_req, res) => {
    res.sendFile(node_path_1.default.join(raiz, "index.html"));
});
app.get("/estilos.css", (_req, res) => {
    res.sendFile(node_path_1.default.join(raiz, "estilos.css"));
});
app.use("/dist", express_1.default.static(node_path_1.default.join(raiz, "dist")));
app.get("/api/categorias", async (_req, res) => {
    try {
        const [filas] = await pool.execute("SELECT id_categoria, categoria FROM categorias ORDER BY categoria");
        res.json(filas);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "No se pudieron leer las categorías." });
    }
});
app.get("/api/productos", async (_req, res) => {
    try {
        const [filas] = await pool.execute(`
      SELECT p.id_producto, p.nombre, c.categoria AS categoria,
             p.precio, p.stock
      FROM productos p JOIN categorias c ON p.id_categoria = c.id_categoria
      ORDER BY p.id_producto
    `);
        res.json(filas.map(fila => ({
            id: fila.id, nombre: fila.nombre, categoria: fila.categoria,
            precio: Number(fila.precio), stock: fila.stock
        })));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "No se pudieron leer los productos." });
    }
});
app.post("/api/productos", async (req, res) => {
    const { nombre, idCategoria, precio, stock } = req.body ?? {};
    const nombreValido = typeof nombre === "string" &&
        nombre.trim().length > 0 && nombre.trim().length <= 100;
    const precioValido = typeof precio === "number" &&
        Number.isFinite(precio) && precio >= 0 && precio <= 99999999.99 &&
        Math.abs(precio * 100 - Math.round(precio * 100)) < 0.000001;
    if (!nombreValido || !Number.isInteger(idCategoria) || idCategoria < 1 ||
        !precioValido || !Number.isInteger(stock) || stock < 0 ||
        stock > 2147483647) {
        res.status(400).json({ mensaje: "Revisen los datos del producto." });
        return;
    }
    try {
        const [categorias] = await pool.execute("SELECT id FROM categorias WHERE id = ?", [idCategoria]);
        if (categorias.length === 0) {
            res.status(400).json({ mensaje: "La categoría no existe." });
            return;
        }
        await pool.execute(`INSERT INTO productos (nombre, id_categoria, precio, stock)
       VALUES (?, ?, ?, ?)`, [nombre.trim(), idCategoria, precio, stock]);
        res.status(201).json({ mensaje: "Producto guardado." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "No se pudo guardar el producto." });
    }
});
async function iniciar() {
    try {
        await pool.query("SELECT 1");
        app.listen(3000, "127.0.0.1", () => {
            console.log("Catálogo disponible en http://127.0.0.1:3000");
        });
    }
    catch (error) {
        console.error("No se pudo conectar con MariaDB.", error);
        await pool.end();
        process.exitCode = 1;
    }
}
void iniciar();
