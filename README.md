# Chef Oscar - Web estática para comidas a domicilio

Sitio estático listo para subir a GitHub y desplegar en Vercel como página de venta de comidas caseras a domicilio.

## Incluye

- Página de inicio orientada a venta de comida casera.
- Menú diario con: pollo napolitano, res saltado, arroz almendrado, quesadillas, sándwich y tablas.
- Formulario de pedido que abre WhatsApp con el mensaje armado.
- Backroom de administración en `backroom.html` con PIN inicial `1234`.
- Gestión de menú diario, semanal, mensual o especial.
- Botón para marcar platos como disponible / no disponible.
- Sección de promociones usando las imágenes entregadas como referencia visual.
- Páginas de contacto y políticas de pedido.
- Configuración `vercel.json` sin instalación ni build.

## Archivos principales

- `index.html`
- `menu.html`
- `pedidos.html`
- `promociones.html`
- `contacto.html`
- `politicas.html`
- `assets/`

También se dejaron redirecciones simples desde `destinos.html`, `cotizar.html` y `experiencias.html` para evitar que aparezca contenido antiguo si alguien entra por un enlace anterior.

## Cómo subirlo correctamente

1. En GitHub, elimina el contenido anterior del repositorio.
2. Sube solamente el contenido interno de este ZIP, no la carpeta completa.
3. Confirma que `index.html` quede en la raíz del repositorio.
4. En Vercel usa:
   - Framework Preset: Other
   - Install Command: vacío
   - Build Command: vacío
   - Output Directory: ./

## Datos editables importantes

- WhatsApp: editar `WHATSAPP_NUMBER` en `assets/script.js` y los enlaces en los HTML si cambia el número.
- PIN del backroom: editar `BACKROOM_PIN` en `assets/script.js`.
- Menú inicial: editar `DEFAULT_MENU_ITEMS` en `assets/script.js`.
- Imágenes: reemplazar archivos dentro de `assets/img/` manteniendo los mismos nombres o ajustar las rutas HTML.


## Corrección aplicada

Esta versión incluye control de caché en `assets/script.js` y `assets/styles.css` mediante parámetro de versión, para evitar que el navegador siga usando una versión antigua del JavaScript. Si el backroom no abre después de subirlo, borra caché o recarga con Ctrl + F5.

Nota: al ser web estática, la administración usa `localStorage` del navegador. Para que los cambios se vean para todos los clientes en internet en tiempo real, el siguiente paso sería conectar una base de datos o backend.
