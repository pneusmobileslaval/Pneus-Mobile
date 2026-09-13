/* ==========================================================
   Pneus Mobiles Laval — main.js
   Bilingual toggle, mobile nav, service tabs, forms
   ========================================================== */
(function(){
  "use strict";

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

  /* ---------------- NEWSLETTER (client-side confirmation) ---------------- */
  function initNewsletter(){
    var form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var lang = htmlEl.getAttribute("lang") === "en" ? "en" : "fr";
      var msg = lang === "en"
        ? "Thanks! We'll remind you before the season changes."
        : "Merci! On vous rappellera avant le changement de saison.";
      window.alert(msg);
      form.reset();
    });
  }

  /* ---------------- BOOKING FORM ----------------
     Uses Formspree (see README.md to configure your endpoint).
     Falls back to a mailto if no endpoint has been set.
  ------------------------------------------------- */
  function initBookingForm(){
    var form = document.getElementById("bookingForm");
    if (!form) return;

    form.addEventListener("submit", function(e){
      var action = form.getAttribute("action") || "";
      if (action.indexOf("VOTRE_ID_FORMSPREE") !== -1){
        e.preventDefault();
        var data = new FormData(form);
        var lines = [];
        data.forEach(function(value, key){ lines.push(key + ": " + value); });
        var body = encodeURIComponent(lines.join("\n"));
        var subject = encodeURIComponent("Demande de rendez-vous — Pneus Mobiles Laval");
        window.location.href = "mailto:contact@pneusmobileslaval.ca?subject=" + subject + "&body=" + body;
      }
      /* If a real Formspree (or other) endpoint is configured, let the
         browser submit the form normally. */
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
