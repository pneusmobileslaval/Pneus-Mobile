/* ==========================================================
   Pneus Mobiles Laval — main.js
   Bilingue, menu mobile, onglets, formulaires -> Google Sheets
   ========================================================== */
(function(){
  "use strict";

  /* =====================================================================
     COLLEZ ICI L'URL DE VOTRE APPLICATION WEB GOOGLE APPS SCRIPT
     (ex: "https://script.google.com/macros/s/AKfycb.../exec")
     Tant que ce n'est pas fait, les formulaires basculent sur un envoi
     par courriel (mailto) automatiquement.
  ===================================================================== */
  var GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz7jThvLNuZ3oG1ZYJFyKlKwfm_60jNraiAbgVVG1a0w7_-YTHwfXsfiNwWFeBM39ag/exec";

  var STORAGE_KEY = "pml_lang";
  var htmlEl = document.documentElement;

  /* ---------------- LANGUAGE TOGGLE ---------------- */
  function applyLang(lang){
    htmlEl.setAttribute("lang", lang === "en" ? "en" : "fr");

    document.querySelectorAll("[data-fr]").forEach(function(el){
      var text = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-fr");
      if (text === null) return;

      if (el.hasAttribute("data-attr") && el.getAttribute("data-attr") === "content"){
        el.setAttribute("content", text);
      } else if (el.tagName === "OPTION" || el.tagName === "SPAN" || el.tagName === "LABEL" ||
                 el.tagName === "STRONG" || el.tagName === "CITE" || el.tagName === "TITLE" ||
                 el.tagName === "H1" || el.tagName === "H2" || el.tagName === "H3" || el.tagName === "H4" ||
                 el.tagName === "P" || el.tagName === "A" || el.tagName === "BUTTON" || el.tagName === "TD" || el.tagName === "TH"){
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    document.querySelectorAll("[data-ph-fr]").forEach(function(el){
      var ph = lang === "en" ? el.getAttribute("data-ph-en") : el.getAttribute("data-ph-fr");
      if (ph) el.setAttribute("placeholder", ph);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch(e){ /* storage may be unavailable */ }
  }

  function initLang(){
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch(e){ /* ignore */ }
    var browserLang = (navigator.language || "fr").toLowerCase().indexOf("en") === 0 ? "en" : "fr";
    var initial = saved || browserLang;
    applyLang(initial);

    var switcher = document.getElementById("langSwitch");
    if (switcher){
      switcher.addEventListener("click", function(){
        var current = htmlEl.getAttribute("lang") === "en" ? "en" : "fr";
        applyLang(current === "en" ? "fr" : "en");
      });
    }
  }

  /* ---------------- MOBILE NAV ---------------- */
  function initNav(){
    var burger = document.getElementById("burger");
    var nav = document.getElementById("mainNav");
    if (!burger || !nav) return;

    burger.addEventListener("click", function(){
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- SERVICE TABS ---------------- */
  function initTabs(){
    var tabs = document.querySelectorAll(".tab");
    if (!tabs.length) return;

    tabs.forEach(function(tab){
      tab.addEventListener("click", function(){
        tabs.forEach(function(t){
          t.classList.remove("is-active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");

        document.querySelectorAll(".tab-panel").forEach(function(panel){
          panel.classList.remove("is-active");
        });
        var target = document.getElementById("panel-" + tab.getAttribute("data-target"));
        if (target) target.classList.add("is-active");
      });
    });
  }

  /* ---------------- FOOTER YEAR ---------------- */
  function initYear(){
    var y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------------- CURRENT LANGUAGE HELPER ---------------- */
  function currentLang(){
    return htmlEl.getAttribute("lang") === "en" ? "en" : "fr";
  }

  /* ---------------- GENERIC SUBMIT TO GOOGLE SHEETS ----------------
     Sends the form's fields to the Apps Script Web App using a normal
     POST with mode:"no-cors" (Apps Script does not send back CORS
     headers, so the browser can't read the response — but the request
     still goes through and the row still gets appended). We treat the
     submission as successful once the request has been sent.
  ------------------------------------------------------------------- */
  function submitToSheet(form, formTypeLabel, onDone){
    var isConfigured = GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.indexOf("COLLEZ_ICI") === -1;

    if (!isConfigured){
      // Fallback: no Google Script configured yet -> send by email instead.
      var data = new FormData(form);
      var lines = [];
      data.forEach(function(value, key){ lines.push(key + ": " + value); });
      var body = encodeURIComponent(lines.join("\n"));
      var subject = encodeURIComponent(formTypeLabel + " — Pneus Mobiles Laval");
      window.location.href = "mailto:contact@pneusmobileslaval.ca?subject=" + subject + "&body=" + body;
      if (onDone) onDone();
      return;
    }

    var formData = new FormData(form);
    formData.append("Formulaire", formTypeLabel);

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    }).then(function(){
      if (onDone) onDone();
    }).catch(function(){
      // Even on network error, still let the person know / fallback to email
      if (onDone) onDone();
    });
  }

  /* ---------------- NEWSLETTER FORM ---------------- */
  function initNewsletter(){
    var form = document.getElementById("newsletterForm");
    if (!form) return;

    form.addEventListener("submit", function(e){
      e.preventDefault();
      submitToSheet(form, "Newsletter", function(){
        var lang = currentLang();
        var msg = lang === "en"
          ? "Thanks! We'll remind you before the season changes."
          : "Merci! On vous rappellera avant le changement de saison.";
        window.alert(msg);
        form.reset();
      });
    });
  }

  /* ---------------- BOOKING FORM ---------------- */
  function initBookingForm(){
    var form = document.getElementById("bookingForm");
    if (!form) return;

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var lang = currentLang();

      if (submitBtn){
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = lang === "en" ? "Sending…" : "Envoi en cours…";
      }

      submitToSheet(form, "Rendez-vous", function(){
        var msg = lang === "en"
          ? "Thank you! Your request has been received — we'll contact you shortly to confirm your appointment."
          : "Merci! Votre demande a été reçue — on vous contacte sous peu pour confirmer votre rendez-vous.";
        window.alert(msg);
        form.reset();
        if (submitBtn){
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText;
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    initLang();
    initNav();
    initTabs();
    initYear();
    initNewsletter();
    initBookingForm();
  });
})();
