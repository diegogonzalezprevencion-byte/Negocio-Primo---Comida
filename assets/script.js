const DEFAULT_MENU_ITEMS = [
  {
    id: "pollo-napolitano",
    name: "Pollo napolitano",
    category: "Almuerzo diario",
    description: "Pollo jugoso con salsa napolitana, acompañamiento casero y porción abundante.",
    price: 5500,
    priceLabel: "Desde $5.500",
    available: true,
    period: "diario",
    day: "Lunes a viernes",
    validFrom: "",
    validTo: "",
    featured: true
  },
  {
    id: "res-saltado",
    name: "Res saltado",
    category: "Almuerzo diario",
    description: "Preparación sabrosa con carne, verduras salteadas y sazón de casa.",
    price: 5500,
    priceLabel: "Desde $5.500",
    available: true,
    period: "diario",
    day: "Lunes a viernes",
    validFrom: "",
    validTo: "",
    featured: true
  },
  {
    id: "arroz-almendrado",
    name: "Arroz almendrado",
    category: "Especial de casa",
    description: "Arroz aromático con almendras, ideal como base o acompañamiento especial.",
    price: 5500,
    priceLabel: "Desde $5.500",
    available: true,
    period: "semanal",
    day: "Según planificación",
    validFrom: "",
    validTo: "",
    featured: true
  },
  {
    id: "quesadillas",
    name: "Quesadillas",
    category: "Pedido rápido",
    description: "Quesadillas doradas, rellenas y sabrosas. Opción con papas.",
    price: 6500,
    priceLabel: "Consultar",
    available: true,
    period: "diario",
    day: "Lunes a sábado",
    validFrom: "",
    validTo: "",
    featured: true
  },
  {
    id: "sandwich",
    name: "Sándwich",
    category: "Pedido rápido",
    description: "Sándwich contundente, preparado al momento y con opción de papas.",
    price: 6500,
    priceLabel: "Consultar",
    available: true,
    period: "diario",
    day: "Lunes a sábado",
    validFrom: "",
    validTo: "",
    featured: true
  },
  {
    id: "tablas",
    name: "Tablas",
    category: "Para compartir",
    description: "Tablas para compartir, ideales para reuniones, tardes o pedidos especiales.",
    price: 12000,
    priceLabel: "Consultar",
    available: true,
    period: "mensual",
    day: "Pedido especial",
    validFrom: "",
    validTo: "",
    featured: true
  }
];

const WHATSAPP_NUMBER = "56962160939";
const BACKROOM_PIN = "1234";
const STORAGE_KEY = "chefOscar.menu.v2";
const SESSION_KEY = "chefOscar.backroom.unlocked";
const CHANNEL_NAME = "chefOscarMenuRealtime";
const peso = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
const realtimeChannel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_NAME) : null;

function html(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function slugify(text) {
  return String(text || "plato")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "plato";
}

function normalizeItem(item, index = 0) {
  const fallback = DEFAULT_MENU_ITEMS[index] || DEFAULT_MENU_ITEMS[0];
  const name = item?.name || fallback?.name || "Plato";
  return {
    id: item?.id || `${slugify(name)}-${Date.now()}-${index}`,
    name,
    category: item?.category || fallback?.category || "Menú",
    description: item?.description || fallback?.description || "Preparación casera y abundante.",
    price: Number.isFinite(Number(item?.price)) ? Number(item.price) : Number(fallback?.price || 0),
    priceLabel: item?.priceLabel || (Number(item?.price) > 0 ? peso.format(Number(item.price)) : "Consultar"),
    available: typeof item?.available === "boolean" ? item.available : true,
    period: item?.period || fallback?.period || "diario",
    day: item?.day || fallback?.day || "Según disponibilidad",
    validFrom: item?.validFrom || "",
    validTo: item?.validTo || "",
    featured: typeof item?.featured === "boolean" ? item.featured : true
  };
}

function getMenuItems() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored) && stored.length) return stored.map(normalizeItem);
  } catch (error) {
    console.warn("No se pudo leer el menú guardado:", error);
  }
  return DEFAULT_MENU_ITEMS.map(normalizeItem);
}

function saveMenuItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(normalizeItem)));
  notifyMenuChanged();
}

function notifyMenuChanged() {
  window.dispatchEvent(new Event("chefOscarMenuChanged"));
  if (realtimeChannel) realtimeChannel.postMessage({ type: "menu-updated", at: Date.now() });
}

function formatPrice(item) {
  return item.priceLabel || (item.price > 0 ? peso.format(item.price) : "Consultar");
}

function formatPeriod(item) {
  const period = String(item.period || "diario").toLowerCase();
  const label = period.charAt(0).toUpperCase() + period.slice(1);
  const dates = [item.validFrom, item.validTo].filter(Boolean).join(" al ");
  return [label, item.day, dates].filter(Boolean).join(" · ");
}

function cardHTML(item) {
  const availableClass = item.available ? "" : " unavailable";
  const statusText = item.available ? "Disponible" : "No disponible";
  const action = item.available
    ? `<a class="mini-link" href="pedidos.html?producto=${encodeURIComponent(item.id)}">Pedir ahora</a><span>+ envío a domicilio</span>`
    : `<span class="status-pill off">No disponible</span><span>Consulta otras opciones</span>`;
  return `<article class="food-card${availableClass}" data-menu-item="${html(item.id)}">
    <div class="food-top"><span>${html(item.category)}</span><strong>${html(formatPrice(item))}</strong></div>
    <div class="status-line"><span class="status-pill ${item.available ? "on" : "off"}">${statusText}</span><small>${html(formatPeriod(item))}</small></div>
    <h3>${html(item.name)}</h3>
    <p>${html(item.description)}</p>
    <div class="food-actions">${action}</div>
  </article>`;
}

function renderMenuCards() {
  document.querySelectorAll("[data-menu-cards]").forEach(container => {
    const items = getMenuItems();
    const filter = container.dataset.filter || "all";
    const limit = Number(container.dataset.limit || 0);
    let filtered = items;
    if (filter === "featured") filtered = items.filter(item => item.featured);
    if (filter === "available") filtered = items.filter(item => item.available);
    if (filter === "unavailable") filtered = items.filter(item => !item.available);
    if (limit > 0) filtered = filtered.slice(0, limit);
    container.innerHTML = filtered.length
      ? filtered.map(cardHTML).join("")
      : `<div class="empty-state">No hay platos cargados para esta vista.</div>`;
  });
}

function renderMenuTable() {
  const tableBody = document.querySelector("[data-menu-table]");
  if (!tableBody) return;
  const items = getMenuItems();
  tableBody.innerHTML = items.map(item => `<tr class="${item.available ? "" : "row-muted"}">
    <td><strong>${html(item.name)}</strong></td>
    <td>${html(item.description)}</td>
    <td>${html(item.category)}</td>
    <td>${html(formatPrice(item))}</td>
    <td>${html(formatPeriod(item))}</td>
    <td><span class="status-pill ${item.available ? "on" : "off"}">${item.available ? "Disponible" : "No disponible"}</span></td>
  </tr>`).join("");
}

function getQueryProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("producto");
}

function fillProductSelect() {
  const select = document.querySelector("#producto");
  if (!select) return;
  const previousValue = select.value || getQueryProductId();
  const availableItems = getMenuItems().filter(item => item.available);
  select.innerHTML = "";
  if (!availableItems.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No hay platos disponibles ahora";
    select.appendChild(option);
    select.disabled = true;
    return;
  }
  select.disabled = false;
  availableItems.forEach(item => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} · ${formatPrice(item)}`;
    select.appendChild(option);
  });
  if (availableItems.some(item => item.id === previousValue)) select.value = previousValue;
}

function getPedidoData() {
  const availableItems = getMenuItems().filter(item => item.available);
  const productId = document.querySelector("#producto")?.value || availableItems[0]?.id || "";
  const product = availableItems.find(item => item.id === productId) || availableItems[0] || null;
  const qty = Math.max(parseInt(document.querySelector("#cantidad")?.value || "1", 10), 1);
  const envio = parseInt(document.querySelector("#envio")?.value || "0", 10);
  const total = product ? product.price * qty + envio : envio;
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
  if (!product) {
    totalEl.textContent = "$0";
    detailEl.textContent = "No hay platos disponibles ahora. Puedes consultar disponibilidad por WhatsApp.";
    linkEl.textContent = "Consultar disponibilidad por WhatsApp";
    linkEl.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Chef Oscar, quiero consultar qué platos están disponibles hoy.")}`;
    return;
  }
  totalEl.textContent = peso.format(total);
  detailEl.textContent = `${qty} x ${product.name} + ${envio ? "envío a domicilio" : "retiro / coordinar"}. Valor referencial sujeto a confirmación.`;
  linkEl.textContent = "Enviar pedido por WhatsApp";
  const lines = [
    "Hola Chef Oscar, quiero hacer un pedido:",
    `Producto: ${product.name}`,
    `Cantidad: ${qty}`,
    `Precio publicado: ${formatPrice(product)}`,
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

function refreshPublicViews() {
  renderMenuCards();
  renderMenuTable();
  fillProductSelect();
  updatePedido();
}

function getBackroomEls() {
  return {
    lock: document.querySelector("#adminLock"),
    panel: document.querySelector("#adminPanel"),
    pinInput: document.querySelector("#adminPin"),
    unlockBtn: document.querySelector("#unlockAdmin"),
    logoutBtn: document.querySelector("#logoutAdmin"),
    form: document.querySelector("#dishForm"),
    list: document.querySelector("#adminDishList"),
    message: document.querySelector("#adminPanel:not([hidden]) #adminPanelMessage") || document.querySelector("#adminLock:not([hidden]) #adminLockMessage") || document.querySelector("#adminPanelMessage") || document.querySelector("#adminLockMessage"),
    cancelEdit: document.querySelector("#cancelEdit"),
    exportBtn: document.querySelector("#exportMenu"),
    importInput: document.querySelector("#importMenu"),
    resetBtn: document.querySelector("#resetMenu"),
    liveCards: document.querySelector("#adminLivePreview")
  };
}

function setAdminMessage(text, type = "ok") {
  const { message } = getBackroomEls();
  if (!message) return;
  message.textContent = text;
  message.className = `admin-message ${type}`;
  if (text) setTimeout(() => { if (message.textContent === text) message.textContent = ""; }, 3600);
}

function showAdminPanel(show) {
  const { lock, panel } = getBackroomEls();
  if (lock) lock.hidden = show;
  if (panel) panel.hidden = !show;
  if (show) renderAdmin();
}

function setFormMode(item = null) {
  const form = document.querySelector("#dishForm");
  if (!form) return;
  form.elements.id.value = item?.id || "";
  form.elements.name.value = item?.name || "";
  form.elements.category.value = item?.category || "Almuerzo diario";
  form.elements.price.value = item?.price ?? "";
  form.elements.priceLabel.value = item?.priceLabel || "";
  form.elements.period.value = item?.period || "diario";
  form.elements.day.value = item?.day || "";
  form.elements.validFrom.value = item?.validFrom || "";
  form.elements.validTo.value = item?.validTo || "";
  form.elements.description.value = item?.description || "";
  form.elements.available.checked = item ? !!item.available : true;
  form.elements.featured.checked = item ? !!item.featured : true;
  document.querySelector("#formTitle").textContent = item ? "Editar plato" : "Agregar nuevo plato";
  document.querySelector("#saveDish").textContent = item ? "Guardar cambios" : "Agregar plato";
  const cancel = document.querySelector("#cancelEdit");
  if (cancel) cancel.hidden = !item;
}

function renderAdmin() {
  const { list, liveCards } = getBackroomEls();
  const items = getMenuItems();
  if (list) {
    list.innerHTML = items.map(item => `<tr>
      <td><strong>${html(item.name)}</strong><br><small>${html(item.category)} · ${html(formatPeriod(item))}</small></td>
      <td>${html(formatPrice(item))}</td>
      <td><span class="status-pill ${item.available ? "on" : "off"}">${item.available ? "Disponible" : "No disponible"}</span></td>
      <td class="admin-actions">
        <button class="btn-table ${item.available ? "danger" : "success"}" type="button" data-admin-action="toggle" data-id="${html(item.id)}">${item.available ? "Marcar no disponible" : "Marcar disponible"}</button>
        <button class="btn-table" type="button" data-admin-action="edit" data-id="${html(item.id)}">Editar</button>
        <button class="btn-table danger" type="button" data-admin-action="delete" data-id="${html(item.id)}">Eliminar</button>
      </td>
    </tr>`).join("");
  }
  if (liveCards) {
    liveCards.innerHTML = items.map(cardHTML).join("");
  }
  refreshPublicViews();
}

function initBackroom() {
  if (!document.body.classList.contains("backroom-page")) return;
  const els = getBackroomEls();
  showAdminPanel(sessionStorage.getItem(SESSION_KEY) === "1");

  els.unlockBtn?.addEventListener("click", () => {
    if (els.pinInput?.value === BACKROOM_PIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      showAdminPanel(true);
      setAdminMessage("Backroom habilitado.");
    } else {
      setAdminMessage("PIN incorrecto. PIN inicial: 1234, editable en assets/script.js.", "error");
    }
  });

  els.pinInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") els.unlockBtn?.click();
  });

  els.logoutBtn?.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    showAdminPanel(false);
  });

  els.form?.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(els.form);
    const existingId = data.get("id") || "";
    const name = String(data.get("name") || "").trim();
    if (!name) return setAdminMessage("Debes ingresar el nombre del plato.", "error");
    const items = getMenuItems();
    const id = existingId || `${slugify(name)}-${Date.now()}`;
    const item = normalizeItem({
      id,
      name,
      category: String(data.get("category") || "Menú").trim(),
      price: Number(data.get("price") || 0),
      priceLabel: String(data.get("priceLabel") || "").trim() || (Number(data.get("price") || 0) ? peso.format(Number(data.get("price") || 0)) : "Consultar"),
      period: String(data.get("period") || "diario"),
      day: String(data.get("day") || "").trim(),
      validFrom: String(data.get("validFrom") || ""),
      validTo: String(data.get("validTo") || ""),
      description: String(data.get("description") || "").trim(),
      available: data.get("available") === "on",
      featured: data.get("featured") === "on"
    });
    const index = items.findIndex(menuItem => menuItem.id === id);
    if (index >= 0) items[index] = item;
    else items.push(item);
    saveMenuItems(items);
    setFormMode(null);
    els.form.reset();
    document.querySelector("#available")?.setAttribute("checked", "checked");
    renderAdmin();
    setAdminMessage(index >= 0 ? "Plato actualizado correctamente." : "Plato agregado correctamente.");
  });

  els.cancelEdit?.addEventListener("click", () => {
    setFormMode(null);
    els.form?.reset();
  });

  els.list?.addEventListener("click", event => {
    const button = event.target.closest("button[data-admin-action]");
    if (!button) return;
    const action = button.dataset.adminAction;
    const id = button.dataset.id;
    const items = getMenuItems();
    const index = items.findIndex(item => item.id === id);
    if (index < 0) return;
    if (action === "toggle") {
      items[index].available = !items[index].available;
      saveMenuItems(items);
      renderAdmin();
      setAdminMessage(`${items[index].name}: ${items[index].available ? "disponible" : "no disponible"}.`);
    }
    if (action === "edit") {
      setFormMode(items[index]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (action === "delete") {
      if (!confirm(`¿Eliminar ${items[index].name}?`)) return;
      const [removed] = items.splice(index, 1);
      saveMenuItems(items);
      renderAdmin();
      setAdminMessage(`${removed.name} eliminado.`);
    }
  });

  els.exportBtn?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(getMenuItems(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menu-chef-oscar.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  els.importInput?.addEventListener("change", async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = JSON.parse(await file.text());
      if (!Array.isArray(imported)) throw new Error("El archivo no contiene una lista de platos.");
      saveMenuItems(imported.map(normalizeItem));
      renderAdmin();
      setAdminMessage("Menú importado correctamente.");
    } catch (error) {
      setAdminMessage("No se pudo importar el menú. Revisa que sea un JSON válido.", "error");
    } finally {
      event.target.value = "";
    }
  });

  els.resetBtn?.addEventListener("click", () => {
    if (!confirm("¿Restaurar el menú inicial? Se perderán los cambios guardados en este navegador.")) return;
    localStorage.removeItem(STORAGE_KEY);
    notifyMenuChanged();
    renderAdmin();
    setAdminMessage("Menú restaurado al estado inicial.");
  });
}

function initRealtimeListeners() {
  window.addEventListener("chefOscarMenuChanged", () => {
    refreshPublicViews();
    if (document.body.classList.contains("backroom-page")) renderAdmin();
  });
  window.addEventListener("storage", event => {
    if (event.key === STORAGE_KEY) refreshPublicViews();
  });
  if (realtimeChannel) {
    realtimeChannel.onmessage = event => {
      if (event.data?.type === "menu-updated") refreshPublicViews();
    };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();
  refreshPublicViews();
  initBackroom();
  initRealtimeListeners();
  ["producto", "cantidad", "envio", "nombre", "direccion", "observaciones"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", updatePedido);
      el.addEventListener("change", updatePedido);
    }
  });
});
