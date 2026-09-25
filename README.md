# Método ADN Inmobiliario · Landing page

Página de una sola sección para captar suscriptoras con dos recursos gratuitos y presentar el Manual ADN.
Está hecha con HTML, CSS y JavaScript simples: no hay que instalar nada. Se sube la carpeta tal cual.

```
MaiRoaWeb/
├── index.html          → la página
├── privacidad.html     → política de privacidad (BORRADOR, revisala)
├── styles.css          → diseño (colores, tipografías)
├── main.js             → funcionamiento (menú, formulario, botones de pago)
├── config.js           → ⭐ EL ÚNICO ARCHIVO QUE TENÉS QUE EDITAR
├── README.md           → este instructivo
└── assets/             → fotos, PDFs, favicon e imagen para compartir
```

> Para editar `config.js` podés usar cualquier editor de texto (TextEdit en modo "texto sin formato", o mejor [Visual Studio Code](https://code.visualstudio.com/), que es gratis).
> Regla de oro: **cambiá solo lo que está entre comillas** y no borres las comas del final de cada línea.

---

## 1. Dónde poner las fotos y los PDFs

Copiá estos archivos dentro de la carpeta `assets/`, **con estos nombres exactos** (minúsculas, sin espacios ni tildes):

| Archivo | Qué es | Recomendación |
|---|---|---|
| `mai-portada.jpg` | Foto de la portada: vos sosteniendo el tablero con conceptos de ADN Inmobiliario | Vertical, 880 × 1100 px aprox. |
| `mai-sobre-mi.jpg` | Foto de "Sobre mí": vos trabajando con la computadora | Vertical, 800 × 960 px aprox. |
| `25-tareas-asesor-inmobiliario.pdf` | Recurso 1 | — |
| `ruta-asistente-virtual-bienes-raices.pdf` | Recurso 2 | — |
| `og-imagen.jpg` | Imagen que aparece al compartir el link en WhatsApp/Instagram | Ya hay una de ejemplo. Si la cambiás: 1200 × 630 px |

- Mientras una foto no esté, la página muestra un recuadro que dice "Foto pendiente" con el nombre de archivo que falta.
- Antes de subir las fotos, comprimilas en [squoosh.app](https://squoosh.app) (que pesen menos de 300 KB cada una) para que la página cargue rápido en el celular.
- Si preferís otros nombres para los PDFs, cambialos también en `config.js` (`pdfRecurso1` y `pdfRecurso2`).

---

## 2. Conectar el formulario con Mailchimp

1. Entrá a Mailchimp → **Audiencia** (Audience) → **Formularios de registro** (Signup forms) → **Formularios integrados** (Embedded forms).
2. Mailchimp te muestra un bloque de código. Buscá la parte que dice `action="…"`. Se ve así:
   ```
   action="https://xxxxx.us21.list-manage.com/subscribe/post?u=1a2b3c4d&amp;id=5e6f7g8h&amp;f_id=00abc"
   ```
3. Copiá **solo lo que está entre comillas** y pegalo en `config.js`, cambiando `&amp;` por `&`:
   ```js
   mailchimpActionUrl: "https://xxxxx.us21.list-manage.com/subscribe/post?u=1a2b3c4d&id=5e6f7g8h&f_id=00abc",
   ```
4. Guardá. Listo: el formulario ya envía los datos sin salir de la página.

> **Doble confirmación (double opt-in):** si la tenés activada en tu audiencia, Mailchimp primero le manda a la persona un correo para confirmar su dirección, y recién después se dispara el correo con el PDF. Si querés que el PDF llegue directo, desactivala en **Audiencia → Configuración → Nombre y valores predeterminados de la audiencia → "Enable double opt-in"**. Igual, la página siempre le ofrece el botón **"Descargar ahora"** apenas se registra.

---

## 3. Saber qué recurso pidió cada persona y mandarle el correo correcto

La página envía a Mailchimp, además del nombre y el correo, un dato que dice qué recurso eligió:
- `25-tareas` → para el recurso 1
- `ruta-av` → para el recurso 2

### 3.1 Crear el campo en Mailchimp

1. **Audiencia** → **Configuración** (Settings) → **Campos de la audiencia y etiquetas \*|MERGE|\*** (Audience fields and \*|MERGE|\* tags).
2. **Agregar un campo** (Add a field) → tipo **Texto** (Text).
3. Nombre: `Recurso`. Etiqueta combinada (merge tag): `RECURSO`.
4. Destildá "Visible" (así no aparece en otros formularios) y guardá.
5. En `config.js` escribí el mismo nombre de etiqueta:
   ```js
   mailchimpTagField: "RECURSO",
   ```

### 3.2 Un correo automático distinto para cada PDF

Primero subí la página (paso 5) para tener el link público de cada PDF, por ejemplo
`https://tusitio.netlify.app/assets/25-tareas-asesor-inmobiliario.pdf`. Ese link es el que ponés en el botón del correo.

**Opción A — Recorrido con dos ramas (Customer Journey):**
1. **Automatizaciones** → **Recorridos del cliente** (Customer Journeys) → **Crear recorrido**.
2. Punto de inicio: **Se suscribe a la audiencia** (Signs up).
3. Agregá una regla **Si/Si no** (If/Else) → **Datos del contacto** → campo **Recurso** → **es** → `25-tareas`.
4. Rama **Sí**: correo con el link del PDF de las 25 tareas.
   Rama **No**: correo con el link de la Ruta para empezar como Asistente Virtual.
5. Activá el recorrido.

**Opción B — Un solo correo de bienvenida con contenido condicional:**
Un único correo automático de bienvenida, con este texto en el cuerpo (Mailchimp muestra solo la parte que corresponde):
```
*|IF:RECURSO=25-tareas|*
  Acá tenés tus 25 tareas: [botón con link al PDF 1]
*|ELSE:|*
  Acá tenés tu ruta para empezar: [botón con link al PDF 2]
*|END:IF|*
```

> Qué opciones tenés disponibles (ramas, varios pasos, contenido condicional) depende de tu plan de Mailchimp. Si una no aparece en tu cuenta, probá la otra o consultá la ayuda de Mailchimp.

> **Si alguien ya estaba suscripta:** Mailchimp no la vuelve a registrar ni le reenvía el correo automático. La página le avisa con un mensaje amable y le habilita igual el botón **"Descargar ahora"**.

---

## 4. Links de pago del Manual ADN

En `config.js`:
```js
mercadoPagoUrl: "https://mpago.la/xxxxxx",
paypalUrl: "https://www.paypal.com/ncp/payment/xxxxxx",
```

- **Mercado Pago:** Tu negocio → **Link de pago** → creá el link para el Manual y copialo.
- **PayPal:** **Botones de pago / Enlaces de pago** (PayPal Business) → creá el enlace y copialo.

Cómo se ve según lo que completes:
- **Ninguno:** botón "Comprar con Mercado Pago o PayPal" con el aviso "Link de pago en preparación".
- **Uno solo:** un botón "Comprar con Mercado Pago o PayPal" que lleva a ese link.
- **Los dos:** dos botones, "Pagar con Mercado Pago" y "Pagar con PayPal".

**Precio, formato y entrega (opcional):** completá `manualPrecio`, `manualFormato` y `manualEntrega` en `config.js`. Si los dejás vacíos, ese recuadro no se muestra.

**Textos de avisos:** todos los mensajes de estado del formulario y del pago están al final de `config.js`, en `textos`. Podés ajustarlos ahí.

---

## 5. Publicar gratis en Netlify (arrastrando la carpeta)

1. Entrá a [app.netlify.com/drop](https://app.netlify.com/drop) (creá una cuenta gratis si te lo pide).
2. Arrastrá **toda la carpeta** `MaiRoaWeb` a la zona que dice "Drag and drop your site folder here".
3. En unos segundos te da un link del tipo `https://nombre-raro-123.netlify.app`.
4. En **Site configuration → Change site name** podés cambiarlo, por ejemplo `metodo-adn.netlify.app`.
5. **Imagen para compartir:** abrí `index.html`, buscá `og:image` y reemplazá `assets/og-imagen.jpg` por el link completo, por ejemplo `https://metodo-adn.netlify.app/assets/og-imagen.jpg`. (WhatsApp e Instagram necesitan el link completo.)
6. **Cada vez que cambies algo** (fotos, config.js, etc.): en Netlify entrá al sitio → **Deploys** → arrastrá de nuevo la carpeta.

> Si más adelante tenés dominio propio (ej. `metodoadn.com`), se conecta desde **Domain management** en Netlify.

---

## 6. Lista de pruebas finales

Hacé cada prueba **en el celular y en la computadora**. En el celular, probá también en datos móviles (no solo wifi).

**Página**
- [ ] Se ven las dos fotos (no aparece "Foto pendiente").
- [ ] El menú lleva a Recursos, Manual y Sobre mí. En celular, el botón ☰ abre y cierra el menú.
- [ ] No hay que mover la página hacia los costados en el celular.
- [ ] El link de Instagram abre tu perfil en una pestaña nueva.
- [ ] "Política de privacidad" abre la página y ya no dice `[COMPLETAR CORREO]` ni `[COMPLETAR FECHA]`.

**Registro (usá un correo tuyo que NO esté en la audiencia; podés usar `tucorreo+prueba1@gmail.com`, `tucorreo+prueba2@gmail.com`, etc.)**
- [ ] Recurso 1: completo nombre y correo → aparece "¡Listo! Revisá tu correo…" y el botón "Descargar ahora".
- [ ] "Descargar ahora" baja el PDF de las **25 tareas**.
- [ ] Recurso 2 con otro correo → "Descargar ahora" baja la **Ruta para empezar como Asistente Virtual**.
- [ ] En Mailchimp aparecen los dos contactos con nombre y el campo Recurso (`25-tareas` / `ruta-av`).
- [ ] Llegó el correo automático correcto a cada uno (revisá también Spam y Promociones).
- [ ] El link del PDF dentro del correo funciona.
- [ ] Registrarte de nuevo con un correo ya usado muestra el aviso de "Ya estabas en la lista" y permite descargar.
- [ ] Sin nombre, o con un correo mal escrito (ej. `ana@gmail`), aparece el error debajo del campo.
- [ ] El formulario se cierra con la X, con la tecla Esc y tocando afuera.

**Pago**
- [ ] El/los botones de pago abren Mercado Pago / PayPal en una pestaña nueva con el precio correcto.
- [ ] Hacé una compra de prueba real (de bajo monto) y confirmá que la persona recibe el Manual como prometés en "Entrega".

**Compartir**
- [ ] Mandate el link por WhatsApp: aparece la imagen, el título y la descripción.

---

## Paleta y tipografías (por si las necesitás para Canva)

| Color | Código |
|---|---|
| Bordó (principal) | `#6B1E2C` |
| Bordó oscuro | `#4A1420` |
| Blanco (fondos) | `#FFFFFF` |
| Gris muy claro (fondos secundarios) | `#F4F3F3` |
| Verde (acentos) | `#3E6A50` |
| Verde claro | `#A9C4A6` |

Tipografías (Google Fonts, gratis): **Fraunces** para títulos y **DM Sans** para textos.

## Probar la página en tu computadora

Hacer doble clic en `index.html` sirve para ver el diseño. Para probar todo como en internet, abrí la Terminal en la carpeta y ejecutá:

```bash
python3 -m http.server 8765
```

y entrá a `http://localhost:8765`.
