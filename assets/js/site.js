/* PinkRyno Studios
   Menu close behavior and the parental gate.
   This file does not fetch anything and does not write cookies or storage. */
(function () {
  "use strict";

  var PROBLEMS = [
    { q: "What is 6 × 8?", a: "48" },
    { q: "What is 7 × 4?", a: "28" },
    { q: "What is 9 × 3?", a: "27" },
    { q: "What is 8 × 6?", a: "48" },
    { q: "What is 5 × 7?", a: "35" },
    { q: "What is 9 × 6?", a: "54" },
    { q: "What is 7 × 6?", a: "42" },
    { q: "What is 8 × 3?", a: "24" }
  ];

  var navCheck = document.getElementById("nav-check");
  var page = document.getElementById("page");
  var gate = document.getElementById("gate");
  var dialog = document.getElementById("gate-dialog");
  var form = document.getElementById("gate-form");
  var input = document.getElementById("gate-answer");
  var question = document.getElementById("gate-question");
  var error = document.getElementById("gate-error");
  var pendingUrl = "";
  var lastFocus = null;
  var answer = "";

  function safeUrl(url) {
    if (!url) return "";
    if (url.charAt(0) === "/" && url.charAt(1) !== "/") return url;
    if (url.indexOf("mailto:") === 0) return url;
    if (url.indexOf("https://") === 0) return url;
    return "";
  }

  if (navCheck) {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navCheck.checked && (!gate || gate.hidden)) {
        navCheck.checked = false;
      }
    });
    document.addEventListener("click", function (event) {
      if (!navCheck.checked) return;
      if (event.target.closest && event.target.closest(".header-inner")) return;
      navCheck.checked = false;
    });
  }

  if (!gate || !form || !input || !question || !error || !dialog) return;

  function pickProblem() {
    var problem = PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)];
    question.textContent = problem.q;
    answer = problem.a;
    input.value = "";
    input.removeAttribute("aria-invalid");
    error.hidden = true;
    error.textContent = "";
  }

  function openGate(url) {
    pendingUrl = url;
    lastFocus = document.activeElement;
    pickProblem();
    gate.hidden = false;
    document.body.classList.add("gate-open");
    if (page) page.inert = true;
    input.focus();
  }

  function closeGate() {
    gate.hidden = true;
    document.body.classList.remove("gate-open");
    pendingUrl = "";
    if (page) page.inert = false;
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function isGated(target) {
    return target && target.closest ? target.closest("[data-parent-gate]") : null;
  }

  document.addEventListener("click", function (event) {
    var link = isGated(event.target);
    if (!link) return;
    event.preventDefault();
    var url = safeUrl(link.getAttribute("href"));
    if (!url) return;
    openGate(url);
  });

  document.addEventListener("auxclick", function (event) {
    if (isGated(event.target)) event.preventDefault();
  });

  document.addEventListener("contextmenu", function (event) {
    if (isGated(event.target)) event.preventDefault();
  });

  gate.addEventListener("click", function (event) {
    if (event.target.closest && event.target.closest("[data-gate-dismiss]")) closeGate();
  });

  document.addEventListener("keydown", function (event) {
    if (gate.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeGate();
      return;
    }
    if (event.key !== "Tab") return;
    var focusable = dialog.querySelectorAll("input, button");
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var value = input.value.replace(/\s+/g, "");
    if (value !== "" && value === answer) {
      var url = pendingUrl;
      closeGate();
      if (url) window.location.href = url;
      return;
    }
    error.hidden = false;
    error.textContent = "That answer does not match. A grown-up can try again.";
    input.setAttribute("aria-invalid", "true");
    input.focus();
  });
})();
