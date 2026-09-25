/* =========================================================
   CONFIGURACIÓN — Método ADN Inmobiliario
   Este es el ÚNICO archivo que necesitás editar.
   Completá los valores entre comillas. Si dejás algo vacío (""),
   la página sigue funcionando y muestra un aviso de "no conectado".
   ========================================================= */
window.ADN_CONFIG = {
  // --- Enlaces externos ---------------------------------------------------
  mailchimpActionUrl: "",   // URL "action" del formulario embebido de Mailchimp
  mailchimpTagField: "",    // nombre del campo/tag para identificar el recurso (ej. "RECURSO")
  pdfRecurso1: "assets/25-tareas-asesor-inmobiliario.pdf",
  pdfRecurso2: "assets/ruta-asistente-virtual-bienes-raices.pdf",
  mercadoPagoUrl: "",
  paypalUrl: "",
  instagramUrl: "https://instagram.com/soymairoa",

  // --- Valor que se envía a Mailchimp en el campo del recurso -------------
  recurso1Valor: "25-tareas",
  recurso2Valor: "ruta-av",

  // --- Datos del Manual ADN (si quedan vacíos, el bloque no se muestra) ---
  manualPrecio: "",         // ej. "USD 27 · ARS 25.000"
  manualFormato: "",        // ej. "PDF descargable de 60 páginas"
  manualEntrega: "",        // ej. "Lo recibís en tu correo apenas se acredita el pago"

  // --- Textos de estado ---------------------------------------------------
  textos: {
    formNoConectado: "El formulario está listo. Falta conectar el enlace de Mailchimp para activar el envío y la descarga.",
    formEnviando: "Enviando…",
    formExito: "¡Listo! Revisá tu correo. También podés descargar el recurso ahora.",
    formYaSuscripta: "¡Ya estabas en la lista con este correo! No hace falta que te registres de nuevo: podés descargar el recurso ahora.",
    formDemasiadosIntentos: "Hiciste varios intentos seguidos con este correo. Esperá unos minutos y volvé a probar.",
    formEmailRechazado: "Mailchimp no aceptó ese correo. Revisá que esté bien escrito y probá de nuevo.",
    formError: "No pudimos completar el envío. Revisá tu conexión e intentá de nuevo en unos minutos.",
    errorNombre: "Contame cómo te llamás.",
    errorEmailVacio: "Escribí tu correo electrónico.",
    errorEmailFormato: "Revisá el correo: parece que falta algo (por ejemplo, la @ o el dominio).",
    pagoEnPreparacion: "Link de pago en preparación",
    pagoAviso: "El botón quedará habilitado cuando conectemos el link de Mercado Pago."
  }
};
