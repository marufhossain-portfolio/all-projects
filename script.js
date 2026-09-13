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

  /* ---------------- OEE Entry (dummy) ---------------- */
  const OEE_SKUS = [
    { name: "Demo MCB 06A 03KA", group: "MCB", cap: 723, ct: 6 },
    { name: "Demo LED Bulb 9W", group: "LED", cap: 900, ct: 4.5 },
    { name: "Demo Exhaust Fan 12in", group: "Exhaust Fan", cap: 240, ct: 15 },
    { name: "Demo DB 8-Way", group: "DB", cap: 180, ct: 20 },
    { name: "Demo Bracket Tube", group: "Bracket Tube", cap: 1200, ct: 3 },
  ];
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
    const set = (sel, v) => { const el = $(sel); if (el) el.textContent = v.toFixed(1) + "%"; };
    set("#kA", A); set("#kP", P); set("#kQ", Q); set("#oeeVal", OEE);
  }
  const oeeSku = $("#oeeSku");
  if (oeeSku) {
    oeeSku.innerHTML = OEE_SKUS.map((s, i) => `<option value="${i}">${s.name}</option>`).join("");
    const applySku = () => {
      const s = OEE_SKUS[Number(oeeSku.value) || 0];
      if ($("#oeeGroup")) $("#oeeGroup").value = s.group;
      if ($("#oeeCap")) $("#oeeCap").value = s.cap;
      if ($("#ct")) $("#ct").value = s.ct;
      calcOEE();
    };
    oeeSku.addEventListener("change", applySku);
    applySku();
  }
  ["pt", "dt", "ct", "tc", "gc"].map((id) => $("#" + id)).filter(Boolean).forEach((i) => i.addEventListener("input", calcOEE));
  calcOEE();

  /* ---------------- OEE QC Entry (dummy) ---------------- */
  const QC_ROWS = [
    ["Demo MCB 06A 03KA", 24, 22],
    ["Demo LED Bulb 9W", 8, 9],
    ["Demo Exhaust Fan 12in", 6, 2],
    ["Demo DB 8-Way", 14, 13],
    ["Demo Bracket Tube", 25, 25],
    ["Demo GSS Lumigold", 3, 3],
  ];
  const qcBody = $("#qcBody");
  if (qcBody) {
    qcBody.innerHTML = QC_ROWS.map(([sku, op, qc], i) => {
      const variance = op - qc;
      const status = Math.abs(variance) > 3 ? `<span class="badge bad">MISMATCH</span>` : Math.abs(variance) > 0 ? `<span class="badge warn">REVIEW</span>` : `<span class="badge ok">OK</span>`;
      return `<tr><td class="c">${i + 1}</td><td class="l">${sku}</td><td class="c">${op}</td><td class="c">${qc}</td><td class="c">${variance > 0 ? "+" : ""}${variance}</td><td class="c">${status}</td></tr>`;
    }).join("");
  }

  /* ---------------- Operation Bulletin replica (dummy data) ---------------- */
  const BULLETINS = [
    { code: "DEMO-1001", name: "Demo MCB 06A 03KA", group: "MCB", ob: "OB-0001", ops: [
      { op: "Insert screw into bush", m: "Manual", pc: 5, t: 16, mp: 1 },
      { op: "Bend the coil accessories", m: "Manual", pc: 5, t: 18, mp: 1 },
      { op: "Insert 18 items into shell", m: "Manual", pc: 3, t: 239, mp: 18 },
    ]},
    { code: "DEMO-2007", name: "Demo LED Bulb 9W", group: "LED", ob: "OB-0027", ops: [
      { op: "PCB loading", m: "SMT feeder", pc: 1, t: 12, mp: 1 },
      { op: "Driver assembly", m: "Assembly-2", pc: 1, t: 39, mp: 2 },
      { op: "Diffuser fitting", m: "Assembly-2", pc: 1, t: 29, mp: 2 },
      { op: "Ageing & QC", m: "Ageing rack", pc: 1, t: 54, mp: 1 },
    ]},
    { code: "DEMO-3012", name: "Demo Exhaust Fan 12in", group: "Exhaust Fan", ob: "OB-0044", ops: [
      { op: "Motor mounting", m: "Press-03", pc: 1, t: 66, mp: 2 },
      { op: "Blade balancing", m: "Balancer", pc: 1, t: 45, mp: 1 },
      { op: "Wiring & test", m: "Test-01", pc: 1, t: 36, mp: 1 },
    ]},
    { code: "DEMO-4023", name: "Demo DB 8-Way", group: "DB", ob: "OB-0061", ops: [
      { op: "Sheet cutting", m: "Shearing", pc: 1, t: 24, mp: 1 },
      { op: "Bending", m: "Bending-02", pc: 1, t: 43, mp: 1 },
      { op: "Busbar fitting", m: "Assembly-4", pc: 1, t: 75, mp: 2 },
      { op: "Final QC", m: "QC bench", pc: 1, t: 21, mp: 1 },
    ]},
    { code: "DEMO-5099", name: "Demo Bracket Tube", group: "Bracket Tube", ob: "OB-0088", ops: [
      { op: "Tube cutting", m: "Cutter-01", pc: 2, t: 11, mp: 1 },
      { op: "Piercing", m: "Press-05", pc: 2, t: 16, mp: 1 },
      { op: "Powder coat", m: "Coating line", pc: 4, t: 26, mp: 2 },
    ]},
  ];
  const RATING = 90, ALLOW = 15;
  function observed(t) { return [t - 2, t + 3, t + 1, t - 3, t + 1].map((v) => Math.max(1, Math.round(v))); }
  function productImg(group) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef2f6"/><stop offset="1" stop-color="#dbe6f2"/></linearGradient></defs><rect width="200" height="180" fill="url(#g)"/><g fill="none" stroke="#1f6feb" stroke-width="3"><rect x="55" y="42" width="90" height="90" rx="10"/><rect x="76" y="63" width="48" height="48" rx="6"/><circle cx="100" cy="87" r="10"/></g><text x="100" y="162" text-anchor="middle" font-family="Segoe UI" font-size="12" fill="#5b6b7b">${group}</text></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }
  function computeBulletin(b) {
    const rows = b.ops.map((o) => {
      const obs = observed(o.t);
      const avg = obs.reduce((a, c) => a + c, 0) / obs.length;
      const cycle = avg / o.pc / 60;
      const basic = (avg / o.pc) * (RATING / 100);
      const smv = (basic * (1 + ALLOW / 100)) / 60;
      const hourly = Math.round((60 / smv) * o.mp);
      return { ...o, obs, cycle, smv, hourly };
    });
    const totalSMV = rows.reduce((a, r) => a + r.smv, 0);
    const manpower = Math.max(...b.ops.map((o) => o.mp));
    const productivity = 60 / totalSMV;
    const capacity = Math.round(productivity * manpower);
    return { rows, totalSMV, manpower, productivity, capacity };
  }
  const bulList = $("#bulList"), bulSearch = $("#bulSearch"), bulChips = $("#bulChips");
  let bulGroup = "";
  function renderBulletins(q = "", group = "") {
    if (!bulList) return;
    const query = q.trim().toLowerCase();
    const list = BULLETINS.filter((b) => (!query || b.name.toLowerCase().includes(query) || b.code.toLowerCase().includes(query) || b.group.toLowerCase().includes(query)) && (!group || b.group === group));
    if (!list.length) { bulList.innerHTML = `<div class="note">No dummy bulletin matches “${q}”.</div>`; return; }
    bulList.innerHTML = list.map((b) => {
      const c = computeBulletin(b);
      const opRows = c.rows.map((r, i) => `<tr><td class="c">${i + 1}</td><td class="l">${r.op}</td><td class="l">${r.m}</td><td class="c">1</td><td class="c">${r.pc}</td><td class="c">${r.mp}</td>${r.obs.map((t) => `<td class="c">${t}</td>`).join("")}<td class="c">${r.cycle.toFixed(3)}</td><td class="c">${RATING}%</td><td class="c">${((r.obs.reduce((a, x) => a + x, 0) / 5 / r.pc) * RATING / 100).toFixed(4)}</td><td class="c">${ALLOW}%</td><td class="c" style="font-weight:800;color:#0e7c66">${r.smv.toFixed(5)}</td><td class="c">${r.hourly.toLocaleString()}</td></tr>`).join("");
      const alloc = [["Total Manpower", c.manpower + 10], ...b.ops.map((o) => [o.op, o.mp]), ["Machine", "02"], ["Production QC", "01"], ["Packaging", "3"], ["Supervisor", "01"]];
      return `
      <div class="bulletin" style="margin-bottom:18px">
        <div class="bhead">
          <div><div class="co">ALEL INDUSTRIES LIMITED</div><div class="doct">OPERATION BULLETIN</div><div class="docref">Work Study &amp; Capacity Standard — Standard Minute Value (SMV)</div></div>
          <div class="obmeta"><div><span>OB No.</span><b>${b.ob}</b></div><div><span>Date</span><b>13-Sep-2026</b></div><div><span>Rev.</span><b>00</b></div></div>
        </div>
        <div class="brow">
          <div class="pic"><div class="img"><img src="${productImg(b.group)}" alt="${b.name}" style="max-width:100%;max-height:100%" /></div><div class="piccap">Product Image</div></div>
          <div class="binfo">
            <table class="meta">
              <tr><th>Product Name / SKU</th><td>${b.name.toUpperCase()}</td></tr>
              <tr><th>Item Code</th><td style="color:#1f6feb;font-weight:800">${b.code}</td></tr>
              <tr><th>Product Group</th><td>${b.group}</td></tr>
              <tr><th>Work Sheet</th><td>${b.name.toUpperCase()}</td></tr>
            </table>
            <div class="kpis" style="margin-top:12px">
              <div class="kpi smv"><div class="lab">Total SMV</div><div class="val">${c.totalSMV.toFixed(5)}</div><div class="sub">(min / pc)</div></div>
              <div class="kpi mp"><div class="lab">Total Manpower</div><div class="val">${c.manpower}</div><div class="sub">(operators)</div></div>
              <div class="kpi hc"><div class="lab">Hourly Capacity</div><div class="val">${c.capacity.toLocaleString()}</div><div class="sub">(pcs / hr)</div></div>
              <div class="kpi prod"><div class="lab">Productivity</div><div class="val">${c.productivity.toFixed(2)}</div><div class="sub">(pcs / op-hr)</div></div>
            </div>
          </div>
        </div>
        <div style="padding:0 18px 8px"><h3>Operation Sequence &amp; Time Study</h3>
          <div style="overflow-x:auto"><table>
            <thead><tr><th>SL</th><th>Operation / Process</th><th>Machine / Manual</th><th>Pcs/Unit</th><th>Pcs/Cycle</th><th>MP</th><th>T1</th><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>Cycle (min)</th><th>Rating</th><th>Basic</th><th>Allow</th><th>SMV (min)</th><th>Hourly Cap.</th></tr></thead>
            <tbody>${opRows}<tr class="total"><td class="l" colspan="15">TOTAL (SMV per unit)</td><td class="c" style="font-weight:800;color:#0e7c66">${c.totalSMV.toFixed(5)}</td><td class="c"></td></tr></tbody>
          </table></div>
        </div>
        <div class="alloc"><h3>Manpower Allocation</h3><ul>${alloc.map(([l, v]) => `<li><span>${l}</span><b>${v}</b></li>`).join("")}</ul></div>
        <div class="sign"><div>Prepared By</div><div>Checked By</div><div>Approved By (I.E. / Prod.)</div></div>
      </div>`;
    }).join("");
  }
  if (bulSearch) bulSearch.addEventListener("input", (e) => renderBulletins(e.target.value, bulGroup));
  if (bulChips) {
    const groups = [...new Set(BULLETINS.map((b) => b.group))];
    bulChips.innerHTML = `<span class="chip on" data-g="">All</span>` + groups.map((g) => `<span class="chip" data-g="${g}">${g}</span>`).join("");
    bulChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      $$(".chip", bulChips).forEach((c) => c.classList.remove("on"));
      chip.classList.add("on");
      bulGroup = chip.dataset.g;
      renderBulletins(bulSearch ? bulSearch.value : "", bulGroup);
    });
  }
  renderBulletins();

  /* ---------------- 5S Entry + Dashboard (dummy) ---------------- */
  const FIVES = [["Sort (Seiri)", 88], ["Set in order (Seiton)", 82], ["Shine (Seiso)", 91], ["Standardize (Seiketsu)", 76], ["Sustain (Shitsuke)", 71]];
  const fiveEntry = $("#fiveEntry");
  if (fiveEntry) {
    fiveEntry.innerHTML = FIVES.map(([l, v], i) => `<div class="row"><span>${l}</span><input type="range" min="0" max="100" value="${v}" data-i="${i}" /><b class="fv" style="color:#0f2b46;text-align:right">${v}</b></div>`).join("") + `<div class="note" id="fiveAvg">Overall score: ${(FIVES.reduce((a, b) => a + b[1], 0) / FIVES.length).toFixed(1)} / 100</div>`;
    fiveEntry.addEventListener("input", (e) => {
      if (e.target.type !== "range") return;
      const b = e.target.nextElementSibling;
      if (b) b.textContent = e.target.value;
      const vals = $$("input[type=range]", fiveEntry).map((r) => Number(r.value));
      const avg = (vals.reduce((a, c) => a + c, 0) / vals.length).toFixed(1);
      const el = $("#fiveAvg");
      if (el) el.textContent = "Overall score: " + avg + " / 100";
    });
  }
  const fiveTrend = $("#fiveTrend");
  if (fiveTrend) {
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
    const vals = [68, 72, 75, 79, 82, 86];
    fiveTrend.innerHTML = months.map((m, i) => `<i style="height:${vals[i]}%" title="${m}: ${vals[i]}"></i>`).join("");
  }
  const fiveHeat = $("#fiveHeat");
  if (fiveHeat) {
    const floors = ["MCB", "LED", "Fan", "DB", "Tube", "GSS"];
    const scores = [88, 82, 91, 76, 71, 85];
    fiveHeat.innerHTML = floors.map((f, i) => {
      const v = scores[i];
      const col = v >= 85 ? "#0e7c66" : v >= 75 ? "#1f6feb" : v >= 70 ? "#b45309" : "#b91c1c";
      return `<i style="background:${col}" title="${f} floor">${v}</i>`;
    }).join("");
  }
  const fiveCats = $("#fiveCats");
  if (fiveCats) {
    fiveCats.innerHTML = FIVES.map(([l, v]) => `<div class="kpi"><div class="lab">${l.split(" ")[0]}</div><div class="val">${v}</div><div class="sub">/ 100</div></div>`).join("");
  }

  /* ---------------- Demo tabs + module hub ---------------- */
  const dts = $$(".dt");
  dts.forEach((dt) => dt.addEventListener("click", () => {
    dts.forEach((x) => x.classList.remove("active"));
    dt.classList.add("active");
    $$(".app-panel").forEach((p) => p.classList.remove("active"));
    const panel = $("#app-" + dt.dataset.app);
    if (panel) panel.classList.add("active");
  }));
  const appHub = $("#appHub");
  if (appHub) {
    const mods = [
      ["oee", "OEE Entry", "Daily OEE data entry with live calculation"],
      ["qc", "OEE QC Entry", "QC review vs operator-reported rejects"],
      ["fives-entry", "5S Entry", "5S audit scoring with photo evidence"],
      ["fives-dash", "5S Dashboard", "5S trends and scores by floor"],
      ["bulletin", "Operation Bulletin", "SMV & work-study standards"],
      ["all", "ALEL All Entry", "This hub"],
    ];
    appHub.innerHTML = mods.map(([k, t, d]) => `<a data-app="${k}"><div class="t">${t}</div><div class="d">${d}</div></a>`).join("");
    appHub.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const dt = $(`.dt[data-app="${a.dataset.app}"]`);
      if (dt) dt.click();
      const demos = $("#demos");
      if (demos) demos.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
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
