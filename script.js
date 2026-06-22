/* ============================================================
   自己紹介サイト・テンプレート（v4）
   素のJavaScriptのみ（ライブラリ不要）
   - スクロール出現（fade + blur解除、見出しはCSS側でマスクリビール）
   - ヒーローのロードシーケンス／グループ要素のスタガー出現
   - モバイルメニュー
   - お問い合わせ：mailto 起動
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ---------- 1. スクロールで出現 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- 1b. ヒーローのロードシーケンス（kicker→行→リード→ボタン） ---------- */
  var heroEl = document.querySelector(".hero");
  if (heroEl) {
    if (prefersReduced) {
      heroEl.classList.add("is-loaded");
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroEl.classList.add("is-loaded");
        });
      });
    }
  }

  /* ---------- 1c. グループ要素のスタガー出現（考え方・好きなもの・スキル） ---------- */
  function setupStaggerGroup(containerSelector, childSelector, stepMs) {
    document.querySelectorAll(containerSelector).forEach(function (container) {
      var children = container.querySelectorAll(childSelector);
      children.forEach(function (child, i) {
        child.style.setProperty("--d", i * stepMs + "ms");
      });

      if (prefersReduced || !("IntersectionObserver" in window)) {
        container.classList.add("is-visible");
        return;
      }

      var obs = new IntersectionObserver(
        function (entries, o) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              o.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      obs.observe(container);
    });
  }

  setupStaggerGroup(".about-cards", ".about-card", 70);
  setupStaggerGroup(".beliefs-list", ".belief", 90);
  setupStaggerGroup(".likes-list", ".likes-item", 70);

  /* ---------- 2. モバイルメニュー ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 4. 現在地に応じてナビをハイライト ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }
})();
