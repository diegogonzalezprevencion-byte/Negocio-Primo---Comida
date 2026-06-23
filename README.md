# Chef Oscar - Web estática para comidas a domicilio

Sitio estático listo para subir a GitHub y desplegar en Vercel como página de venta de comidas caseras a domicilio.

## Incluye

- Página de inicio orientada a venta de comida casera.
- Menú administrable con: pollo napolitano, res saltado, arroz almendrado, quesadillas, sándwich y tablas.
- Backroom en `backroom.html` para agregar, editar, eliminar y activar/desactivar platos.
- Administración de menú diario, semanal, mensual o especial.
- Botón de disponibilidad en tiempo real para las pestañas abiertas del mismo navegador.
- Formulario de pedido que abre WhatsApp con el mensaje armado y solo muestra platos disponibles.
- Sección de promociones usando las imágenes entregadas como referencia visual.
- Configuración `vercel.json` sin instalación ni build.

## Backroom / Administración

Acceso:

- Archivo: `backroom.html`
- PIN inicial: `1234`
- Para cambiar el PIN, editar la variable `BACKROOM_PIN` en `assets/script.js`.

Desde el backroom puedes:

- Agregar platos nuevos.
- Modificar nombre, categoría, precio, descripción y programación.
- Definir si el plato pertenece a menú diario, semanal, mensual o especial.
- Marcar un plato como disponible o no disponible.
- Exportar/importar el menú en formato JSON.
- Restaurar el menú inicial.

## Importante sobre la actualización en tiempo real

Esta versión sigue siendo 100% estática, por lo tanto no usa base de datos ni servidor. Los cambios del backroom se guardan en `localStorage` del navegador.

Esto permite actualización inmediata en la misma sesión/navegador y es útil para pruebas, presentación y administración local. Para que los cambios se vean automáticamente en todos los clientes/celulares en internet, se debe conectar un backend o base de datos como Firebase, Supabase, Airtable, Google Sheets API o una API propia.

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

- WhatsApp: editar `WHATSAPP_NUMBER` en `assets/script.js`.
- PIN backroom: editar `BACKROOM_PIN` en `assets/script.js`.
- Menú inicial: editar `DEFAULT_MENU_ITEMS` en `assets/script.js`.
- Imágenes: reemplazar archivos dentro de `assets/img/` manteniendo los mismos nombres o ajustar las rutas HTML.
