/* =========================================================
   Método ADN Inmobiliario — comportamiento
   No hace falta editar este archivo: todo se configura en config.js
   ========================================================= */
(function () {
  "use strict";

  var CFG = window.ADN_CONFIG || {};
  var TXT = CFG.textos || {};

  var RECURSOS = {
    1: {
      nombre: "25 tareas que puede delegar un asesor inmobiliario",
      intro: "Completá tus datos para recibir las 25 tareas en PDF.",
      valor: CFG.recurso1Valor || "25-tareas",
      pdf: CFG.pdfRecurso1 || ""
    },
    2: {
      nombre: "Tu ruta para empezar como Asistente Virtual en Bienes Raíces",
      intro: "Completá tus datos para recibir tu ruta de inicio en PDF.",
      valor: CFG.recurso2Valor || "ruta-av",
      pdf: CFG.pdfRecurso2 || ""
    }
  };

  function limpio(valor) { return typeof valor === "string" ? valor.trim() : ""; }

  /* ---------- Encabezado: sombra al hacer scroll ---------- */
  var encabezado = document.getElementById("encabezado");
  function actualizarSombra() {
    encabezado.classList.toggle("con-sombra", window.scrollY > 8);
  }
  window.addEventListener("scroll", actualizarSombra, { passive: true });
  actualizarSombra();

  /* ---------- Menú hamburguesa ---------- */
  var menuBoton = document.getElementById("menuBoton");
  var menu = document.getElementById("menuPrincipal");
  var menuEtiqueta = menuBoton.querySelector(".visualmente-oculto");

  function abrirMenu(abrir) {
    menuBoton.setAttribute("aria-expanded", String(abrir));
    menu.classList.toggle("abierto", abrir);
    menuEtiqueta.textContent = abrir ? "Cerrar menú" : "Abrir menú";
  }
  menuBoton.addEventListener("click", function () {
    abrirMenu(menuBoton.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) abrirMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("abierto")) {
      abrirMenu(false);
      menuBoton.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (menu.classList.contains("abierto") && !encabezado.contains(e.target)) abrirMenu(false);
  });

  /* ---------- Menú: marcar la sección visible ---------- */
  var enlacesMenu = menu.querySelectorAll('.menu__lista a[href^="#"]');
  if ("IntersectionObserver" in window && enlacesMenu.length) {
    var visibles = {};
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { visibles[e.target.id] = e.isIntersecting; });
      var actual = null;
      enlacesMenu.forEach(function (a) {
        if (!actual && visibles[a.getAttribute("href").slice(1)]) actual = a;
      });
      enlacesMenu.forEach(function (a) {
        if (a === actual) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    enlacesMenu.forEach(function (a) {
      var seccion = document.getElementById(a.getAttribute("href").slice(1));
      if (seccion) observador.observe(seccion);
    });
  }

  /* ---------- Fotos: placeholder si la imagen no existe ---------- */
  document.querySelectorAll(".foto img").forEach(function (img) {
    function marcarFaltante() { img.closest(".foto").classList.add("sin-imagen"); }
    if (img.complete && img.naturalWidth === 0) marcarFaltante();
    img.addEventListener("error", marcarFaltante);
  });

  /* ---------- Instagram ---------- */
  var enlaceInstagram = document.getElementById("enlaceInstagram");
  if (enlaceInstagram && limpio(CFG.instagramUrl)) enlaceInstagram.href = limpio(CFG.instagramUrl);

  /* ---------- Manual: precio, formato y entrega ---------- */
  var datos = document.getElementById("manualDatos");
  var hayDatos = false;
  datos.querySelectorAll("[data-campo]").forEach(function (fila) {
    var valor = limpio(CFG[fila.getAttribute("data-campo")]);
    if (valor) {
      fila.querySelector("dd").textContent = valor;
      fila.hidden = false;
      hayDatos = true;
    }
  });
  datos.hidden = !hayDatos;

  /* ---------- Manual: botones de pago ---------- */
  var mp = limpio(CFG.mercadoPagoUrl);
  var pp = limpio(CFG.paypalUrl);
  var pagoBotones = document.getElementById("pagoBotones");
  var pagoEstado = document.getElementById("pagoEstado");
  var pagoAviso = document.getElementById("pagoAviso");

  function botonPago(texto, url, clase) {
    var a = document.createElement("a");
    a.className = "btn " + clase;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = texto + '<span class="visualmente-oculto"> (se abre en una pestaña nueva)</span>';
    return a;
  }

  if (mp || pp) {
    pagoBotones.innerHTML = "";
    if (mp && pp) {
      pagoBotones.appendChild(botonPago("Pagar con Mercado Pago", mp, "btn--primario"));
      pagoBotones.appendChild(botonPago("Pagar con PayPal", pp, "btn--secundario"));
    } else {
      pagoBotones.appendChild(botonPago("Comprar con Mercado Pago o PayPal", mp || pp, "btn--primario"));
    }
    pagoEstado.hidden = true;
  } else {
    if (TXT.pagoEnPreparacion) {
      pagoEstado.lastChild.textContent = " " + TXT.pagoEnPreparacion;
    }
    document.getElementById("pagoPendiente").addEventListener("click", function () {
      pagoAviso.textContent = "";
      // pequeño retraso para que los lectores de pantalla anuncien el mensaje aunque se repita
      setTimeout(function () {
        pagoAviso.textContent = TXT.pagoAviso || "El botón quedará habilitado cuando conectemos el link de Mercado Pago.";
      }, 50);
    });
  }

  /* =========================================================
     Modal del formulario
     ========================================================= */
  var modal = document.getElementById("modalRecurso");
  var form = document.getElementById("formRecurso");
  var campoNombre = document.getElementById("campoNombre");
  var campoEmail = document.getElementById("campoEmail");
  var campoTrampa = document.getElementById("campoTrampa");
  var errorNombre = document.getElementById("errorNombre");
  var errorEmail = document.getElementById("errorEmail");
  var botonEnviar = document.getElementById("botonEnviar");
  var botonTexto = botonEnviar.querySelector(".btn__texto");
  var estado = document.getElementById("estadoFormulario");
  var vistaExito = document.getElementById("vistaExito");
  var textoExito = document.getElementById("textoExito");
  var botonDescarga = document.getElementById("botonDescarga");
  var introModal = document.getElementById("modal-intro");
  var nombreRecurso = document.getElementById("modalRecursoNombre");

  var recursoActual = 1;
  var disparador = null;
  var enviando = false;
  var TEXTO_BOTON = botonTexto.textContent;

  function mostrarEstado(mensaje, tipo) {
    estado.textContent = mensaje || "";
    estado.className = "formulario__estado" + (tipo ? " es-" + tipo : "");
  }

  function reiniciarModal() {
    form.hidden = false;
    vistaExito.hidden = true;
    mostrarEstado("");
    [campoNombre, campoEmail].forEach(function (c) { c.removeAttribute("aria-invalid"); });
    errorNombre.textContent = "";
    errorEmail.textContent = "";
    ponerCargando(false);
  }

  function abrirModal(numero, boton) {
    recursoActual = RECURSOS[numero] ? Number(numero) : 1;
    var r = RECURSOS[recursoActual];
    disparador = boton || document.activeElement;
    introModal.textContent = r.intro;
    nombreRecurso.textContent = r.nombre;
    reiniciarModal();

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
    document.body.style.overflow = "hidden";
    campoNombre.focus();
  }

  function cerrarModal() {
    if (modal.open && typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  modal.addEventListener("close", function () {
    document.body.style.overflow = "";
    if (disparador && typeof disparador.focus === "function") disparador.focus();
  });

  document.querySelectorAll("[data-abrir-recurso]").forEach(function (boton) {
    boton.addEventListener("click", function () {
      abrirModal(boton.getAttribute("data-abrir-recurso"), boton);
    });
  });

  modal.querySelectorAll("[data-cerrar-modal]").forEach(function (b) {
    b.addEventListener("click", cerrarModal);
  });

  // Clic afuera (sobre el fondo oscuro) cierra el modal
  modal.addEventListener("click", function (e) {
    if (e.target !== modal) return;
    var caja = modal.getBoundingClientRect();
    var adentro = e.clientX >= caja.left && e.clientX <= caja.right && e.clientY >= caja.top && e.clientY <= caja.bottom;
    if (!adentro) cerrarModal();
  });

  // Esc cierra y el foco queda atrapado dentro del modal
  modal.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      e.preventDefault();
      cerrarModal();
      return;
    }
    if (e.key !== "Tab") return;
    var enfocables = Array.prototype.filter.call(
      modal.querySelectorAll('a[href], button:not([disabled]), input:not([tabindex="-1"]):not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.offsetParent !== null || el === document.activeElement; }
    );
    if (!enfocables.length) return;
    var primero = enfocables[0];
    var ultimo = enfocables[enfocables.length - 1];
    if (e.shiftKey && (document.activeElement === primero || !modal.contains(document.activeElement))) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && (document.activeElement === ultimo || !modal.contains(document.activeElement))) {
      e.preventDefault();
      primero.focus();
    }
  });

  /* ---------- Validación ---------- */
  var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validar() {
    var ok = true;
    var nombre = campoNombre.value.trim();
    var email = campoEmail.value.trim();

    if (!nombre) {
      errorNombre.textContent = TXT.errorNombre || "Contame cómo te llamás.";
      campoNombre.setAttribute("aria-invalid", "true");
      ok = false;
    } else {
      errorNombre.textContent = "";
      campoNombre.removeAttribute("aria-invalid");
    }

    if (!email) {
      errorEmail.textContent = TXT.errorEmailVacio || "Escribí tu correo electrónico.";
      campoEmail.setAttribute("aria-invalid", "true");
      ok = false;
    } else if (!REGEX_EMAIL.test(email)) {
      errorEmail.textContent = TXT.errorEmailFormato || "Revisá el formato del correo.";
      campoEmail.setAttribute("aria-invalid", "true");
      ok = false;
    } else {
      errorEmail.textContent = "";
      campoEmail.removeAttribute("aria-invalid");
    }

    if (!ok) {
      (campoNombre.getAttribute("aria-invalid") ? campoNombre : campoEmail).focus();
    }
    return ok;
  }

  [campoNombre, campoEmail].forEach(function (campo) {
    campo.addEventListener("input", function () {
      if (campo.getAttribute("aria-invalid")) {
        campo.removeAttribute("aria-invalid");
        (campo === campoNombre ? errorNombre : errorEmail).textContent = "";
      }
    });
  });

  function ponerCargando(activo) {
    enviando = activo;
    botonEnviar.disabled = activo;
    botonEnviar.classList.toggle("cargando", activo);
    botonEnviar.setAttribute("aria-busy", String(activo));
    botonTexto.textContent = activo ? (TXT.formEnviando || "Enviando…") : TEXTO_BOTON;
  }

  function mostrarExito(mensaje) {
    var r = RECURSOS[recursoActual];
    form.hidden = true;
    vistaExito.hidden = false;
    textoExito.textContent = mensaje;
    if (r.pdf) {
      botonDescarga.href = r.pdf;
      botonDescarga.setAttribute("download", r.pdf.split("/").pop());
      botonDescarga.hidden = false;
    } else {
      botonDescarga.hidden = true;
    }
    textoExito.focus();
  }

  /* ---------- Mailchimp (JSONP con post-json) ---------- */
  function construirUrlMailchimp(action, nombre, email) {
    var base = action.replace("/post?", "/post-json?");
    if (base.indexOf("/post-json") === -1) base = base.replace("/post", "/post-json");
    if (base.indexOf("?") === -1) base += "?";

    var params = [];
    params.push("FNAME=" + encodeURIComponent(nombre));
    params.push("EMAIL=" + encodeURIComponent(email));

    var campoTag = limpio(CFG.mailchimpTagField);
    if (campoTag) params.push(encodeURIComponent(campoTag) + "=" + encodeURIComponent(RECURSOS[recursoActual].valor));

    // Honeypot: Mailchimp espera un campo vacío llamado b_<u>_<id>
    var u = (base.match(/[?&]u=([^&]+)/) || [])[1];
    var id = (base.match(/[?&]id=([^&]+)/) || [])[1];
    if (u && id) params.push("b_" + u + "_" + id + "=" + encodeURIComponent(campoTrampa.value));

    return base + (/[?&]$/.test(base) ? "" : "&") + params.join("&");
  }

  function jsonp(url, alTerminar) {
    var nombreCb = "adnMailchimp_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
    var script = document.createElement("script");
    var terminado = false;

    function limpiar() {
      terminado = true;
      clearTimeout(temporizador);
      try { delete window[nombreCb]; } catch (err) { window[nombreCb] = undefined; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    var temporizador = setTimeout(function () {
      if (terminado) return;
      limpiar();
      alTerminar(null);
    }, 15000);

    window[nombreCb] = function (respuesta) {
      if (terminado) return;
      limpiar();
      alTerminar(respuesta);
    };
    script.onerror = function () {
      if (terminado) return;
      limpiar();
      alTerminar(null);
    };
    script.src = url + "&c=" + nombreCb;
    document.body.appendChild(script);
  }

  function interpretarError(msg) {
    var texto = String(msg || "").toLowerCase();
    if (texto.indexOf("already subscribed") > -1 || texto.indexOf("ya está suscrit") > -1 || texto.indexOf("already a list member") > -1) {
      return { yaSuscripta: true };
    }
    if (texto.indexOf("too many") > -1 || texto.indexOf("demasiados") > -1) {
      return { mensaje: TXT.formDemasiadosIntentos };
    }
    if (texto.indexOf("email") > -1 || texto.indexOf("@") > -1 || texto.indexOf("correo") > -1) {
      return { mensaje: TXT.formEmailRechazado };
    }
    return { mensaje: TXT.formError };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (enviando) return;
    mostrarEstado("");
    if (!validar()) return;

    // Antispam: si un bot completó el campo trampa, no enviamos nada
    if (campoTrampa.value) return;

    var action = limpio(CFG.mailchimpActionUrl);
    if (!action) {
      mostrarEstado(TXT.formNoConectado || "El formulario está listo. Falta conectar el enlace de Mailchimp para activar el envío y la descarga.", "aviso");
      return;
    }

    ponerCargando(true);
    var url = construirUrlMailchimp(action, campoNombre.value.trim(), campoEmail.value.trim());

    jsonp(url, function (respuesta) {
      ponerCargando(false);
      if (!respuesta) {
        mostrarEstado(TXT.formError, "error");
        return;
      }
      if (respuesta.result === "success") {
        mostrarExito(TXT.formExito || "¡Listo! Revisá tu correo. También podés descargar el recurso ahora.");
        return;
      }
      var resultado = interpretarError(respuesta.msg);
      if (resultado.yaSuscripta) {
        mostrarExito(TXT.formYaSuscripta);
      } else {
        mostrarEstado(resultado.mensaje, "error");
      }
    });
  });
})();
