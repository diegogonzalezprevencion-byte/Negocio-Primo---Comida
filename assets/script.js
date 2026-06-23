
const MENU_ITEMS = [
  { id: "pollo-napolitano", name: "Pollo napolitano", price: 5500 },
  { id: "res-saltado", name: "Res saltado", price: 5500 },
  { id: "arroz-almendrado", name: "Arroz almendrado", price: 5500 },
  { id: "quesadillas", name: "Quesadillas", price: 6500 },
  { id: "sandwich", name: "Sándwich", price: 6500 },
  { id: "tablas", name: "Tablas", price: 12000 }
];
const WHATSAPP_NUMBER = "56962160939";
const peso = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function fillProductSelect() {
  const select = document.querySelector("#producto");
  if (!select) return;
  MENU_ITEMS.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} · ${peso.format(item.price)} referencial`;
    select.appendChild(option);
  });
}

function getPedidoData() {
  const productId = document.querySelector("#producto")?.value || MENU_ITEMS[0].id;
  const product = MENU_ITEMS.find(item => item.id === productId) || MENU_ITEMS[0];
  const qty = Math.max(parseInt(document.querySelector("#cantidad")?.value || "1", 10), 1);
  const envio = parseInt(document.querySelector("#envio")?.value || "0", 10);
  const total = product.price * qty + envio;
  return { product, qty, envio, total };
}

function updatePedido() {
  const totalEl = document.querySelector("#totalPedido");
  const detailEl = document.querySelector("#detallePedido");
  const linkEl = document.querySelector("#whatsappPedido");
  if (!totalEl || !detailEl || !linkEl) return;
  const { product, qty, envio, total } = getPedidoData();
  const nombre = document.querySelector("#nombre")?.value.trim() || "";
  const direccion = document.querySelector("#direccion")?.value.trim() || "";
  const obs = document.querySelector("#observaciones")?.value.trim() || "";
  totalEl.textContent = peso.format(total);
  detailEl.textContent = `${qty} x ${product.name} + ${envio ? "envío a domicilio" : "retiro / coordinar"}. Valor referencial sujeto a confirmación.`;
  const lines = [
    "Hola Chef Oscar, quiero hacer un pedido:",
    `Producto: ${product.name}`,
    `Cantidad: ${qty}`,
    `Envío: ${envio ? "+ " + peso.format(envio) : "Retiro / coordinar"}`,
    `Total referencial: ${peso.format(total)}`,
    nombre ? `Nombre: ${nombre}` : null,
    direccion ? `Dirección: ${direccion}` : null,
    obs ? `Observaciones: ${obs}` : null
  ].filter(Boolean).join("\n");
  linkEl.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
}

function initMenuToggle() {
  const btn = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  if (!btn || !menu) return;
  btn.addEventListener("click", () => menu.classList.toggle("open"));
}

document.addEventListener("DOMContentLoaded", () => {
  fillProductSelect();
  updatePedido();
  initMenuToggle();
  ["producto", "cantidad", "envio", "nombre", "direccion", "observaciones"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updatePedido);
      el.addEventListener("change", updatePedido);
    }
  });
});
