/* =========================================================
   Maruf Hossain — All Projects showcase
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Preloader ---------------- */
  const preloader = $("#preloader");
  const preCount = $("#preCount");
  const preBar = $("#preBar");
  const preStatus = $("#preStatus");
  const preWord = $("#preWord");
  const preGrid = $("#preGrid");
  const C = 2 * Math.PI * 52;

  if (preGrid) {
    for (let i = 0; i < 126; i++) {
      const c = document.createElement("i");
      c.style.animationDelay = (i % 14) * 0.06 + (Math.floor(i / 14) * 0.04) + "s";
      preGrid.appendChild(c);
    }
  }
  const words = ["PROJECTS", "DASHBOARDS", "AUTOMATION", "RESULTS"];
  let wi = 0;
  const wordTimer = setInterval(() => {
    wi = (wi + 1) % words.length;
    if (preWord) { preWord.style.opacity = 0; setTimeout(() => { preWord.textContent = words[wi]; preWord.style.opacity = 1; }, 180); }
  }, 900);

  const stages = [[0, "Initializing"], [20, "Loading projects"], [45, "Compiling dashboards"], [70, "Rendering demos"], [90, "Almost ready"]];
  const statusFor = (p) => { let s = stages[0][1]; for (const [t, m] of stages) if (p >= t) s = m; return s; };

  function finish() {
    if (!preloader) return;
    if (preCount) preCount.textContent = "100";
    if (preBar) preBar.style.width = "100%";
    if (preStatus) preStatus.textContent = "Ready";
    preloader.classList.add("done");
    document.body.classList.add("loaded");
    document.body.classList.remove("locked");
    clearInterval(wordTimer);
    setTimeout(() => preloader.classList.add("hide"), 1400);
  }
  function run() {
    if (!preloader) return;
    if (reduce) return finish();
    const dur = 2400, t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 2.2);
      const pct = Math.round(e * 100);
      if (preCount) preCount.textContent = pct;
      if (preBar) preBar.style.width = pct + "%";
      if (preStatus) { const s = statusFor(pct); if (preStatus.textContent !== s) preStatus.textContent = s; }
      if (p < 1) requestAnimationFrame(step); else setTimeout(finish, 350);
    };
    requestAnimationFrame(step);
  }
  window.addEventListener("load", run);
  setTimeout(() => { if (!document.body.classList.contains("loaded")) finish(); }, 6000);

  /* ---------------- Theme ---------------- */
  const root = document.documentElement;
  const stored = localStorage.getItem("mmh-proj-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.setAttribute("data-theme", stored || (prefersLight ? "light" : "dark"));
  const tt = $("#themeToggle");
  if (tt) tt.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("mmh-proj-theme", next);
  });

  /* ---------------- Nav ---------------- */
  const nav = $("#nav"), navLinks = $("#navLinks"), burger = $("#burger"), toTop = $("#toTop");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);
    if (toTop) toTop.classList.toggle("show", window.scrollY > 560);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  if (burger) burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
  });
  $$("a", navLinks || document.createElement("div")).forEach((a) => a.addEventListener("click", () => { if (navLinks) navLinks.classList.remove("open"); if (burger) burger.classList.remove("open"); }));

  /* ---------------- Reveal ---------------- */
  const reveals = $$(".reveal");
  if (reduce) reveals.forEach((el) => el.classList.add("in"));
  else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add("in"), Number(e.target.dataset.delay || 0)); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------------- Card glow ---------------- */
  $$(".proj, .layer, .demo").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---------------- Project filter ---------------- */
  const filters = $$(".filter");
  const projects = $$(".proj");
  filters.forEach((f) => f.addEventListener("click", () => {
    filters.forEach((x) => x.classList.remove("active"));
    f.classList.add("active");
    const cat = f.dataset.cat;
    projects.forEach((p) => {
      const show = cat === "all" || p.dataset.cat.split(" ").includes(cat);
      p.classList.toggle("hide", !show);
      if (show) { p.classList.remove("in"); void p.offsetWidth; p.classList.add("in"); }
    });
  }));

  /* ---------------- Project modal ---------------- */
  const DATA = {
    "alel-pulse": {
      title: "ALEL Pulse", sub: "Real-time production pulse & daily performance monitoring",
      desc: "A live operational pulse for the plant: production vs target, OEE, downtime and alerts in one place, so the floor and management see the same numbers in real time.",
      features: ["Live production vs target tracking by line", "OEE, downtime and rejection visibility", "Automatic daily summary & alerts", "Role-based views for floor and management"],
      kpis: [["Real-time", "Visibility"], ["<5 min", "Data lag"], ["12", "Production units"]],
      tech: ["Google Apps Script", "Google Sheets", "HTML/CSS/JS", "GitHub Pages"],
    },
    "oee-entry": {
      title: "OEE Entry", sub: "Digital OEE data-entry with auto-lookup & live calculation",
      desc: "Replaces paper-based OEE tracking. Operators select an SKU and the form auto-fills product group, capacity and cycle time, then calculates OEE live and stores it in a central database.",
      features: ["SKU / product-group / capacity / cycle-time auto-lookup", "Real-time OEE calculation (A × P × Q)", "Validation & duplicate-entry protection", "Central Google Sheet database with history"],
      kpis: [["~100%", "Paperless"], ["Instant", "OEE calc"], ["0", "Manual tally sheets"]],
      tech: ["Apps Script", "Sheets DB", "Web front-end", "GitHub Pages"],
    },
    "fives-entry": {
      title: "5S Entry", sub: "Structured 5S audit data capture",
      desc: "A guided audit form so each floor's 5S score is captured consistently — sort, set-in-order, shine, standardize and sustain — with remarks and photo evidence.",
      features: ["5-category scoring (Seiri…Shitsuke)", "Floor / area based audits", "Remarks and evidence fields", "Consistent scoring rubric"],
      kpis: [["5", "Categories"], ["Audit", "Cadence"], ["By floor", "Granularity"]],
      tech: ["Apps Script", "Sheets DB", "Responsive UI"],
    },
    "fives-dashboard": {
      title: "5S Dashboard", sub: "Historical 5S trends by floor",
      desc: "Turns audit entries into trend lines per floor, highlights weak categories and shows movement over time so sustainment is measurable.",
      features: ["Trend tracking by floor over time", "Category-wise weak-spot analysis", "Score heat-map", "Exportable management view"],
      kpis: [["Trend", "By floor"], ["Category", "Breakdown"], ["Live", "Updates"]],
      tech: ["Apps Script", "Sheets", "Charts", "HTML/CSS/JS"],
    },
    "operation-bulletin": {
      title: "Operation Bulletin", sub: "Searchable SKU / item-code work-study bulletin (SMV)",
      desc: "A searchable bulletin library for every SKU: operations, machine, SMV, manpower and standards. Search by SKU name or item code to pull the exact standard instantly.",
      features: ["Search by SKU name or item code", "Operation sequence with machine & SMV", "Manpower and standard-time standards", "Covers 19 product groups (structure)"],
      kpis: [["19", "Product groups"], ["SMV", "Standards"], ["Searchable", "By code"]],
      tech: ["Single-file web app", "HTML/CSS/JS", "GitHub Pages"],
    },
    "qc-review": {
      title: "QC Review Workflow", sub: "Verify operator-reported rejects against sampled checks",
      desc: "A review layer that reconciles operator-reported rejects with sampled QC checks, flagging mismatches for RCA before they distort quality data.",
      features: ["Sampled QC vs operator rejects", "Mismatch flagging & RCA triggers", "First-pass-yield tracking", "Audit trail of reviews"],
      kpis: [["FPY", "Tracking"], ["RCA", "Triggered"], ["Audit", "Trail"]],
      tech: ["Apps Script", "Sheets DB", "Workflow UI"],
    },
    "gap-dashboard": {
      title: "Manufacturing Gap Assessment", sub: "Multi-plant ops gap assessment dashboards",
      desc: "Comparative manufacturing-system gap assessment dashboards across plants — visualising maturity gaps and corrective-action priorities for leadership review.",
      features: ["Multi-plant comparison", "Maturity gap scoring", "Corrective-action prioritisation", "Executive-ready visuals"],
      kpis: [["Multi", "Plant"], ["Gap", "Scoring"], ["Action", "Priorities"]],
      tech: ["HTML/CSS/JS", "Charts", "Static dashboards"],
    },
  };

  const modal = $("#modal"), modalBody = $("#modalBody"), modalTitle = $("#modalTitle"), modalSub = $("#modalSub"), modalClose = $("#modalClose");
  function openModal(id) {
    const d = DATA[id];
    if (!d || !modal) return;
    modalTitle.textContent = d.title;
    modalSub.textContent = d.sub;
    modalBody.innerHTML = `
      <p style="color:var(--muted)">${d.desc}</p>
      <h4>Key features</h4>
      <ul>${d.features.map((f) => `<li>${f}</li>`).join("")}</ul>
      <h4>Highlights</h4>
      <div class="kpis">${d.kpis.map((k) => `<div class="kpi"><b>${k[0]}</b><span>${k[1]}</span></div>`).join("")}</div>
      <h4>Built with</h4>
      <div class="tags">${d.tech.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
      <p class="oee-note" style="margin-top:16px">Demo description only — no source code or real company data is shown.</p>`;
    modal.classList.add("open");
    document.body.classList.add("locked");
  }
  function closeModal() { if (modal) modal.classList.remove("open"); document.body.classList.remove("locked"); }
  $$("[data-project]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.project)));
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  /* ---------------- OEE calculator (dummy) ---------------- */
  const ids = ["pt", "dt", "ct", "tc", "gc"];
  const inputs = ids.map((id) => $("#" + id)).filter(Boolean);
  function setGauge(sel, val) {
    const el = $(sel);
    if (!el) return;
    const circ = 251.3;
    const v = Math.max(0, Math.min(100, val));
    el.style.strokeDashoffset = circ * (1 - v / 100);
    const label = el.closest(".gauge").querySelector(".gv");
    if (label) label.textContent = v.toFixed(1) + "%";
  }
  function calcOEE() {
    const pt = parseFloat($("#pt")?.value) || 0;
    const dt = parseFloat($("#dt")?.value) || 0;
    const ct = parseFloat($("#ct")?.value) || 0;
    const tc = parseFloat($("#tc")?.value) || 0;
    const gc = parseFloat($("#gc")?.value) || 0;
    const run = Math.max(pt - dt, 0);
    const A = pt > 0 ? (run / pt) * 100 : 0;
    const P = run > 0 ? ((ct * tc) / 60 / run) * 100 : 0;
    const Q = tc > 0 ? (gc / tc) * 100 : 0;
    const OEE = (A / 100) * (P / 100) * (Q / 100) * 100;
    setGauge("#gA", A); setGauge("#gP", P); setGauge("#gQ", Q); setGauge("#gO", OEE);
    const t = $("#oeeVal");
    if (t) t.textContent = OEE.toFixed(1) + "%";
  }
  inputs.forEach((i) => i.addEventListener("input", calcOEE));
  calcOEE();

  /* ---------------- Operation Bulletin demo (dummy data) ---------------- */
  const BULLETINS = [
    { code: "DEMO-1001", name: "Demo MCB 06A 03KA", group: "MCB", ops: [
      { s: 1, op: "Coil winding", m: "Winder-01", smv: 0.42, mp: 1 },
      { s: 2, op: "Contact assembly", m: "Semi-auto line", smv: 0.85, mp: 2 },
      { s: 3, op: "Calibration & test", m: "Test bench", smv: 0.55, mp: 1 },
      { s: 4, op: "Packing", m: "Manual", smv: 0.30, mp: 1 },
    ]},
    { code: "DEMO-2007", name: "Demo LED Bulb 9W", group: "LED", ops: [
      { s: 1, op: "PCB loading", m: "SMT feeder", smv: 0.20, mp: 1 },
      { s: 2, op: "Driver assembly", m: "Assembly-2", smv: 0.65, mp: 2 },
      { s: 3, op: "Diffuser fitting", m: "Assembly-2", smv: 0.48, mp: 2 },
      { s: 4, op: "Ageing & QC", m: "Ageing rack", smv: 0.90, mp: 1 },
    ]},
    { code: "DEMO-3012", name: "Demo Exhaust Fan 12in", group: "Exhaust Fan", ops: [
      { s: 1, op: "Motor mounting", m: "Press-03", smv: 1.10, mp: 2 },
      { s: 2, op: "Blade balancing", m: "Balancer", smv: 0.75, mp: 1 },
      { s: 3, op: "Wiring & test", m: "Test-01", smv: 0.60, mp: 1 },
    ]},
    { code: "DEMO-4023", name: "Demo DB 8-Way", group: "DB", ops: [
      { s: 1, op: "Sheet cutting", m: "Shearing", smv: 0.40, mp: 1 },
      { s: 2, op: "Bending", m: "Bending-02", smv: 0.72, mp: 1 },
      { s: 3, op: "Busbar fitting", m: "Assembly-4", smv: 1.25, mp: 2 },
      { s: 4, op: "Final QC", m: "QC bench", smv: 0.35, mp: 1 },
    ]},
    { code: "DEMO-5099", name: "Demo Bracket Tube", group: "Bracket Tube", ops: [
      { s: 1, op: "Tube cutting", m: "Cutter-01", smv: 0.18, mp: 1 },
      { s: 2, op: "Piercing", m: "Press-05", smv: 0.26, mp: 1 },
      { s: 3, op: "Powder coat", m: "Coating line", smv: 0.44, mp: 2 },
    ]},
  ];
  const bulList = $("#bulList"), bulSearch = $("#bulSearch");
  function renderBulletins(q = "") {
    if (!bulList) return;
    const query = q.trim().toLowerCase();
    const list = BULLETINS.filter((b) => !query || b.name.toLowerCase().includes(query) || b.code.toLowerCase().includes(query) || b.group.toLowerCase().includes(query));
    if (!list.length) { bulList.innerHTML = `<div class="bul-empty">No dummy bulletin matches “${q}”.</div>`; return; }
    bulList.innerHTML = list.map((b, i) => `
      <div class="bul-item" data-i="${i}">
        <div class="bh"><span><b>${b.name}</b> &nbsp;<span class="code">${b.code}</span></span><span class="code">${b.group}</span></div>
        <div class="bb">
          <table><thead><tr><th>Seq</th><th>Operation</th><th>Machine</th><th>SMV</th><th>MP</th></tr></thead>
          <tbody>${b.ops.map((o) => `<tr><td>${o.s}</td><td>${o.op}</td><td>${o.m}</td><td>${o.smv}</td><td>${o.mp}</td></tr>`).join("")}</tbody></table>
        </div>
      </div>`).join("");
    $$(".bul-item .bh", bulList).forEach((h) => h.addEventListener("click", () => h.parentElement.classList.toggle("open")));
  }
  if (bulSearch) bulSearch.addEventListener("input", (e) => renderBulletins(e.target.value));
  renderBulletins();

  /* ---------------- 5S demo ---------------- */
  const FIVES = [["Sort (Seiri)", 88], ["Set in order (Seiton)", 82], ["Shine (Seiso)", 91], ["Standardize (Seiketsu)", 76], ["Sustain (Shitsuke)", 71]];
  const fiveWrap = $("#fiveS");
  if (fiveWrap) {
    fiveWrap.innerHTML = FIVES.map(([l, v]) => `<div class="five-row"><span class="lbl">${l}</span><span class="five-track"><i class="five-fill" data-v="${v}"></i></span><span class="val">${v}</span></div>`).join("") + `<div class="five-total">Overall 5S score: <b>${(FIVES.reduce((a, b) => a + b[1], 0) / FIVES.length).toFixed(1)} / 100</b> &nbsp;·&nbsp; <span class="badge-demo">Demo data</span></div>`;
    const fo = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          $$(".five-fill", fiveWrap).forEach((f, i) => setTimeout(() => (f.style.width = f.dataset.v + "%"), i * 90));
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    fo.observe(fiveWrap);
  }

  /* ---------------- Particles ---------------- */
  const canvas = $("#particles");
  if (canvas && !reduce) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, pts = [];
    const count = window.innerWidth < 780 ? 30 : 64;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.8 + 0.6 }));
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = "rgba(148,163,184,.5)"; ctx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 130) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(99,102,241,${(1 - d / 130) * 0.32})`; ctx.lineWidth = 1; ctx.stroke(); }
        }
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
