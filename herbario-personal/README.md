# Herbario Personal — guía de instalación

Sitio estático (sin backend propio) con panel de administración para subir
fotos de flores y tu análisis. Las fichas se guardan como archivos en tu
propio repositorio de GitHub — permanentes y gratis.

## Qué incluye

```
index.html              → página principal (catálogo de flores)
assets/css/style.css    → estilos
assets/js/main.js       → lee las fichas desde GitHub y las muestra
assets/images/          → aquí se guardan las fotos que subas
admin/index.html        → carga el panel de administración
admin/config.yml        → configuración del panel (campos del formulario)
content/flowers/        → una ficha (.json) por cada flor
```

## Paso 1 — Sube este proyecto a GitHub

1. Entra a github.com y crea una cuenta si no tienes una.
2. Crea un repositorio nuevo (botón "New repository"), público, sin
   plantilla, sin README (ya tienes uno).
3. En la página del repositorio recién creado, usa la opción
   "uploading an existing file" y arrastra **todos** los archivos y
   carpetas de este proyecto conservando su estructura.
4. Confirma el commit ("Commit changes").

## Paso 2 — Despliega en Netlify (gratis)

1. Entra a netlify.com y crea una cuenta (puedes usar tu cuenta de GitHub
   para registrarte, es más rápido).
2. "Add new site" → "Import an existing project" → conecta tu cuenta de
   GitHub → elige el repositorio que acabas de crear.
3. Deja la configuración de build vacía (no necesita build command ni
   publish directory especial; o pon `.` como publish directory) → Deploy.
4. En unos segundos tendrás una URL tipo `https://algo-al-azar.netlify.app`.
   Puedes cambiar ese nombre en "Site settings → Change site name".

## Paso 3 — Activa el panel de subida (Identity + Git Gateway)

Esto es lo que te da el botón "iniciar sesión" en `/admin` sin que tengas
que programar nada.

1. En tu sitio dentro de Netlify: pestaña **Identity** → "Enable Identity".
2. En "Registration preferences" elige **Invite only** (para que nadie
   más pueda crear una cuenta en tu panel).
3. Baja a **Services** → "Git Gateway" → "Enable Git Gateway".
4. Ve a **Identity → Invite users** e invítate a ti misma con tu correo.
   Te llegará un email para poner tu contraseña.

## Paso 4 — Conecta el panel a tu sitio real

Edita dos archivos con la URL real que te dio Netlify:

**`admin/config.yml`** — reemplaza:
```yaml
site_url: https://TU-SITIO.netlify.app
display_url: https://TU-SITIO.netlify.app
```

**`assets/js/main.js`** — reemplaza:
```js
const GITHUB_USER = "TU-USUARIO";     // tu usuario de GitHub
const GITHUB_REPO = "TU-REPOSITORIO"; // el nombre del repositorio
```

Sube estos dos archivos editados a GitHub (mismo método del Paso 1, GitHub
te dejará "reemplazar" el archivo existente). Netlify vuelve a desplegar
solo en 1-2 minutos.

## Paso 5 — Usa tu panel

1. Ve a `https://tu-sitio.netlify.app/admin/`
2. Inicia sesión con el correo/contraseña que configuraste.
3. Clic en "Nueva Flor" → sube la foto, escribe nombre, fecha, tu análisis
   → **Publicar**. Aparece en tu web en 1-2 minutos.
4. Puedes borrar la ficha de ejemplo ("Rosa damascena") desde el mismo panel.

## Notas

- Cada ficha publicada es un commit real en tu repositorio: nunca se pierde.
- El plan gratuito de Netlify e Identity cubre perfectamente un proyecto
  personal de este tamaño.
- Si algún día quieres tu propio dominio (ej. `miherbario.com`) en vez de
  `.netlify.app`, se conecta desde "Domain settings" — el resto no cambia.
