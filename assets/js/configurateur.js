/* Configurateur de volets roulants — Breizh Innovation
   Aucune donnée bancaire, aucun paiement : la demande est transmise par e-mail. */
document.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const { PRODUCTS, COLORS, TABLIERS, MANOEUVRES, AXES, COMPANY, shutterSVG, toast, store } = window.BI;

  const $ = s => document.querySelector(s);
  const form = $("#confForm");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const MOTOR_IDS = MANOEUVRES.slice(0, 3).flatMap(g => g.items.map(i => i.id));
  const RADIO_IDS = MANOEUVRES[0].items.map(i => i.id).concat(["somfy-solar"]);
  const allManoeuvres = MANOEUVRES.flatMap(g => g.items);

  const DEFAULTS = {
    qty: 1, repere: "", largeurType: "coulisses", hauteurType: "coffre",
    L: "", H: "", tablier: "", coloris: "9016", coffre: "pan",
    manoeuvre: "", secours: false, commande: "telecommande",
    moustiquaire: false, enroulement: "ext", cote: "droite",
    attaches: "verrous", arretsBas: true, serrure: false, ajourage: "sans",
    axe: "", pose: "pose", metre: true, notes: ""
  };

  const params = new URLSearchParams(location.search);
  const startId = PRODUCTS.some(p => p.id === params.get("produit")) ? params.get("produit") : "renovation";
  let state = Object.assign({ product: startId }, DEFAULTS);
  let previewOpen = 0.45;
  let cart = store.get("bi-cart", []);

  const product = () => PRODUCTS.find(p => p.id === state.product);

  /* ---------- Briques HTML ---------- */
  const choice = (name, value, title, sub, opts = {}) => {
    const id = `${name}-${value}`.replace(/[^a-z0-9-]/gi, "");
    const checked = String(state[name]) === String(value) ? "checked" : "";
    return `<div class="choice">
      <input type="radio" name="${name}" id="${id}" value="${esc(value)}" ${checked} ${opts.disabled ? "disabled" : ""}>
      <label for="${id}">${opts.pre || ""}<strong>${title}</strong>${sub ? `<span>${sub}</span>` : ""}</label>
      ${opts.badge ? `<span class="badge">${opts.badge}</span>` : ""}
    </div>`;
  };
  const seg = (name, items) => `<div class="seg">${items.map(([v, l]) => {
    const id = `${name}-${v}`;
    return `<input type="radio" name="${name}" id="${id}" value="${v}" ${String(state[name]) === String(v) ? "checked" : ""}><label for="${id}">${l}</label>`;
  }).join("")}</div>`;
  const toggle = (name, label, sub) => `<label class="check" style="margin:6px 0;color:var(--ink)">
      <input type="checkbox" name="${name}" ${state[name] ? "checked" : ""}> <span><strong>${label}</strong>${sub ? `<br><span class="hint">${sub}</span>` : ""}</span></label>`;

  /* ---------- Étapes ---------- */
  const STEPS = {
    produit: {
      title: "Choisissez votre modèle",
      hint: "Toute la gamme est fabriquée en France, sur mesure.",
      done: () => !!state.product,
      html: () => `<div class="choices product-choices">${PRODUCTS.map(p =>
        choice("product", p.id, p.short, "", { pre: `<img src="${p.img}" alt="" loading="lazy">`, badge: p.tagGold ? "Solaire" : (p.tag === "Le plus demandé" ? "Populaire" : "") })).join("")}</div>`
    },
    dims: {
      title: "Dimensions",
      hint: "En millimètres. Des cotes approximatives suffisent : nous les vérifions sur place avant fabrication.",
      done: () => validDims().ok,
      html: () => {
        const p = product();
        let types = "";
        let lbl = ["Largeur", "Hauteur"];
        if (p.dims === "reno") {
          types = `<div class="conf-group"><span class="conf-group-title">Mesure de la largeur</span>${seg("largeurType", [["coulisses", "Coulisses comprises"], ["dos", "Dos de coulisses"]])}</div>
                   <div class="conf-group"><span class="conf-group-title">Mesure de la hauteur</span>${seg("hauteurType", [["coffre", "Coffre compris"], ["sous", "Sous coffre"]])}</div>`;
        } else if (p.dims === "trad") lbl = ["Largeur du tableau", "Hauteur du tableau"];
        else if (p.dims === "tablier") lbl = ["Largeur du tablier (entre coulisses)", "Hauteur du tablier"];
        else if (p.dims === "axe") lbl = ["Longueur de l'axe (embouts compris)", ""];
        const v = validDims();
        return `
          <div class="dims">
            <div class="field"><label for="qty">Quantité</label><input class="input" type="number" id="qty" name="qty" min="1" max="50" value="${esc(state.qty)}"></div>
            <div class="field"><label for="repere">Repère <span class="hint">(ex : Chambre 1)</span></label><input class="input" id="repere" name="repere" maxlength="40" value="${esc(state.repere)}" placeholder="Séjour, chambre…"></div>
          </div>
          ${types}
          <div class="dims conf-group">
            <div class="field"><label for="L">${lbl[0]}</label><div class="dim-input"><input class="input ${v.errL ? "invalid" : ""}" type="number" inputmode="numeric" id="L" name="L" min="300" max="5000" placeholder="ex. 1200" value="${esc(state.L)}"><em>mm</em></div></div>
            ${lbl[1] ? `<div class="field"><label for="H">${lbl[1]}</label><div class="dim-input"><input class="input ${v.errH ? "invalid" : ""}" type="number" inputmode="numeric" id="H" name="H" min="300" max="3000" placeholder="ex. 1400" value="${esc(state.H)}"><em>mm</em></div></div>` : ""}
          </div>
          <div id="dimMsg">${dimMessage()}</div>`;
      }
    },
    tablier: {
      title: "Tablier (lames)",
      hint: "PVC : léger et économique. Aluminium : plus rigide, pour les grandes largeurs et la sécurité.",
      done: () => !!state.tablier,
      html: () => ["PVC", "Alu"].map(m => `
        <div class="conf-group"><span class="conf-group-title">${m === "PVC" ? "Lames PVC" : "Lames aluminium"}</span>
        <div class="choices">${TABLIERS.filter(t => t.mat === m).map(t => choice("tablier", t.id, t.name, `${t.desc}<br>${t.max}`, { badge: t.popular ? "Conseillé" : "" })).join("")}</div></div>`).join("")
    },
    coloris: {
      title: "Coloris",
      hint: "Tablier, coulisses et coffre assortis. Teintes ≃ RAL, d'autres finitions sur demande.",
      done: () => !!state.coloris,
      html: () => `<div class="choices swatches">${window.BI.COLOR_KEYS.map(k => [k, COLORS[k]]).map(([k, c]) => {
        const dis = c.only && state.tablier && !c.only.includes(state.tablier);
        return choice("coloris", k, c.name, c.ral + (c.only ? " · PVC P42/P55" : ""), { pre: `<i style="background:${c.wood ? `repeating-linear-gradient(170deg,${c.hex} 0 5px,${window.BI.shade(c.hex, -0.15)} 5px 7px)` : c.hex}"></i>`, disabled: dis });
      }).join("")}</div>`
    },
    coffre: {
      title: "Forme du coffre",
      hint: "Le coffre se pose à l'extérieur, au-dessus de la fenêtre. Taille calculée automatiquement selon la hauteur.",
      done: () => !!state.coffre,
      html: () => `<div class="choices cols-2">
        ${choice("coffre", "pan", "Pan coupé 45°", "Lignes droites, look contemporain", { pre: `<span style="display:block;max-width:120px">${shutterSVG({ color: state.coloris, open: .7, coffre: "pan", ratio: .6 })}</span>` })}
        ${choice("coffre", "quart", "Quart de rond", "Formes douces, style traditionnel", { pre: `<span style="display:block;max-width:120px">${shutterSVG({ color: state.coloris, open: .7, coffre: "quart", ratio: .6 })}</span>` })}
      </div>`
    },
    manoeuvre: {
      title: "Manœuvre et motorisation",
      hint: "Moteurs garantis 5 ans (7 ans en solaire). Réglage et mise en service inclus avec la pose.",
      done: () => !!state.manoeuvre,
      html: () => {
        const p = product();
        const groups = MANOEUVRES.filter(g => !(p.id === "axe-seul" && g.group === "Motorisation solaire"));
        const motor = MOTOR_IDS.includes(state.manoeuvre);
        const radio = RADIO_IDS.includes(state.manoeuvre);
        return groups.map(g => `<div class="conf-group"><span class="conf-group-title">${g.group}</span>
          <div class="choices">${g.items.map(i => choice("manoeuvre", i.id, i.name, i.desc, { badge: i.badge })).join("")}</div></div>`).join("") +
          (motor ? `<div class="conf-group"><span class="conf-group-title">Commande</span>
            ${radio ? seg("commande", [["telecommande", "Télécommande"], ["telecommande-mural", "Télécommande + inverseur mural sans fil"], ["centralisee", "Télécommande multi-volets"]])
                    : seg("commande", [["saillie", "Inverseur en saillie"], ["encastre", "Inverseur encastré"], ["sans", "Sans inverseur"]])}
            <div style="margin-top:12px">${toggle("secours", "Manivelle de secours", "Pour manœuvrer le volet en cas de coupure de courant")}</div></div>` : "");
      }
    },
    axe: {
      title: "Type d'axe",
      hint: "Le diamètre dépend du poids du tablier. Dans le doute, nous le déterminons lors de notre passage.",
      done: () => !!state.axe,
      html: () => `<div class="choices">${AXES.map(a => choice("axe", a.id, a.name, a.desc)).join("")}</div>`
    },
    options: {
      title: "Options et finitions",
      hint: "Tout est optionnel, nous vous conseillons lors du rappel.",
      done: () => true,
      html: () => {
        const p = product();
        const solar = p.fixedManoeuvre === "somfy-solar";
        return `${solar ? `<div class="alert alert-info" style="margin-top:0">Motorisation <strong>Somfy RS100 Solar io</strong> incluse : panneau solaire et batterie intégrés, télécommande fournie.</div>` : ""}
          ${p.dims === "reno" ? `<div class="conf-group">${toggle("moustiquaire", "Moustiquaire intégrée", "Enroulable, intégrée dans le coffre et les coulisses")}</div>` : ""}
          ${p.dims === "trad" ? `<div class="conf-group"><span class="conf-group-title">Sens d'enroulement</span>${seg("enroulement", [["ext", "Extérieur"], ["int", "Intérieur"]])}</div>` : ""}
          ${p.dims === "reno" ? `<div class="conf-group"><span class="conf-group-title">Sens d'enroulement</span>${seg("enroulement", [["ext", "Extérieur (standard)"], ["int", "Intérieur"]])}</div>` : ""}
          <div class="conf-group"><span class="conf-group-title">Sortie de manœuvre (vue de l'intérieur)</span>${seg("cote", [["gauche", "À gauche"], ["droite", "À droite"]])}</div>
          <div class="conf-group"><span class="conf-group-title">Fixation du tablier</span>${seg("attaches", [["verrous", "Verrous anti-relevage"], ["souples", "Attaches souples"]])}</div>
          <div class="conf-group">
            ${toggle("arretsBas", "Arrêts bas de coulisses")}
            ${toggle("serrure", "Serrure sur lame finale", "Condamnation à clé, recommandée en rez-de-chaussée")}
          </div>`;
      }
    },
    finitions: {
      title: "Finitions du tablier",
      hint: "Pour s'adapter à votre coffre et à vos coulisses existants.",
      done: () => true,
      html: () => `
        <div class="conf-group"><span class="conf-group-title">Ajourage (passage de lumière)</span>${seg("ajourage", [["sans", "Sans ajourage"], ["total", "Ajourage total"]])}</div>
        <div class="conf-group"><span class="conf-group-title">Fixation sur l'axe</span>${seg("attaches", [["verrous", "Verrous anti-relevage"], ["souples", "Attaches souples"]])}</div>
        <div class="conf-group">${toggle("serrure", "Serrure sur lame finale")}</div>`
    },
    pose: {
      title: "Pose et visite technique",
      hint: "La pose par nos équipes est couverte par notre garantie décennale.",
      done: () => !!state.pose,
      html: () => `
        <div class="choices cols-2">
          ${choice("pose", "pose", "Fourniture + pose", "Dépose de l'ancien volet, pose, réglages et évacuation des déchets", { badge: "Recommandé" })}
          ${choice("pose", "fourniture", "Fourniture seule", "Retrait à notre atelier de Quéven ou livraison")}
        </div>
        <div class="conf-group">${toggle("metre", "Je souhaite un métré sur place (offert)", "Un technicien vérifie toutes les cotes avant la fabrication")}</div>
        <div class="field conf-group"><label for="notes">Remarque pour cette fenêtre</label><textarea class="input" id="notes" name="notes" style="min-height:80px" placeholder="Ex : ancien volet battant bois à déposer, 1er étage…">${esc(state.notes)}</textarea></div>`
    }
  };

  function stepList() { return ["produit"].concat(product().steps); }

  /* ---------- Validation dimensions ---------- */
  function validDims() {
    const p = product();
    const L = +state.L, H = +state.H;
    const needH = p.dims !== "axe";
    const r = { ok: true, errL: false, errH: false, msgs: [] };
    if (!state.L) r.ok = false;
    else if (L < 300 || L > 5000) { r.ok = false; r.errL = true; r.msgs.push(["err", "La largeur doit être comprise entre 300 et 5 000 mm."]); }
    if (needH) {
      if (!state.H) r.ok = false;
      else if (H < 300 || H > 3000) { r.ok = false; r.errH = true; r.msgs.push(["err", "La hauteur doit être comprise entre 300 et 3 000 mm."]); }
    }
    if (!(+state.qty >= 1)) r.ok = false;
    if (r.ok && needH) {
      const s = L * H / 1e6;
      if (s > 12) r.msgs.push(["warn", `Surface de ${s.toFixed(2)} m² : au-delà de 12 m², nous vous proposerons une solution adaptée (deux volets ou tablier renforcé).`]);
      if (state.tablier && state.tablier.startsWith("P") && L > 2700) r.msgs.push(["warn", "Au-delà de 2,7 m de large, un tablier aluminium est recommandé."]);
      if (["sangle", "tirage"].includes(state.manoeuvre) && s > 3) r.msgs.push(["warn", "Pour cette surface, une manœuvre par manivelle ou un moteur est conseillé."]);
    }
    return r;
  }
  function dimMessage() {
    return validDims().msgs.map(([t, m]) => `<div class="alert ${t === "err" ? "alert-err" : "alert-warn"}">${m}</div>`).join("");
  }

  /* ---------- Rendu ---------- */
  function render(focusSel) {
    const p = product();
    if (p.fixedManoeuvre) state.manoeuvre = p.fixedManoeuvre;
    if (state.coloris && COLORS[state.coloris].only && state.tablier && !COLORS[state.coloris].only.includes(state.tablier)) state.coloris = "9016";
    form.innerHTML = stepList().map((k, i) => {
      const s = STEPS[k];
      return `<section class="conf-card" data-step="${k}">
        <h3><span class="n ${s.done() ? "done" : ""}">${i + 1}</span>${s.title}</h3>
        <p class="hint">${s.hint}</p>
        ${s.html()}
      </section>`;
    }).join("");
    if (focusSel) { const el = form.querySelector(focusSel); if (el) el.focus({ preventScroll: true }); }
    update();
  }

  function refreshBadges() {
    form.querySelectorAll(".conf-card").forEach(c => {
      const s = STEPS[c.dataset.step];
      c.querySelector(".n").classList.toggle("done", s.done());
    });
  }

  function update() {
    const p = product();
    const ratio = state.L && state.H && +state.L > 0 ? (+state.H) / (+state.L) : 1.1;
    $("#preview").innerHTML = shutterSVG(Object.assign({}, p.visual, {
      color: state.coloris, open: previewOpen, ratio,
      coffre: p.dims === "reno" ? state.coffre : p.visual.coffre,
      moustiquaire: state.moustiquaire && previewOpen > .2
    }));
    $("#openRange").closest(".preview-ctrl").style.display = p.visual.mode ? "none" : "";
    const pn = $("#previewName"); if (pn) pn.textContent = p.visual.mode === "axe" ? "" : COLORS[state.coloris].name;

    const steps = stepList();
    const done = steps.filter(k => STEPS[k].done()).length;
    $("#progressBar").style.width = Math.round(done / steps.length * 100) + "%";
    $("#recapTitle").textContent = p.name;
    $("#recapList").innerHTML = summary().map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join("");
    const missing = missingSteps();
    $("#recapAlert").innerHTML = missing.length ? `<div class="alert alert-info">À compléter : ${missing.join(", ")}</div>` : "";
    $("#addBtn").disabled = missing.length > 0;
    refreshBadges();
  }

  function missingSteps() {
    return stepList().filter(k => !STEPS[k].done()).map(k => STEPS[k].title.toLowerCase());
  }

  function summary() {
    const p = product();
    const rows = [];
    rows.push(["Quantité", `${state.qty || 1}${state.repere ? " · " + state.repere : ""}`]);
    if (state.L) rows.push(["Dimensions", p.dims === "axe" ? `L ${state.L} mm` : `${state.L} × ${state.H || "?"} mm`]);
    if (p.dims === "reno" && state.L) rows.push(["Prise de cotes", `${state.largeurType === "dos" ? "Dos de coulisses" : "Coulisses comprises"} / ${state.hauteurType === "coffre" ? "coffre compris" : "sous coffre"}`]);
    if (p.steps.includes("tablier") && state.tablier) rows.push(["Tablier", TABLIERS.find(t => t.id === state.tablier).name]);
    if (p.steps.includes("coloris")) rows.push(["Coloris", `${COLORS[state.coloris].name} (${COLORS[state.coloris].ral})`]);
    if (p.steps.includes("coffre")) rows.push(["Coffre", state.coffre === "pan" ? "Pan coupé 45°" : "Quart de rond"]);
    if (p.steps.includes("axe") && state.axe) rows.push(["Axe", AXES.find(a => a.id === state.axe).name]);
    if (state.manoeuvre && (p.steps.includes("manoeuvre") || p.fixedManoeuvre)) {
      let m = allManoeuvres.find(i => i.id === state.manoeuvre).name;
      if (MOTOR_IDS.includes(state.manoeuvre) && p.steps.includes("manoeuvre")) {
        const cmd = { telecommande: "télécommande", "telecommande-mural": "télécommande + inverseur mural", centralisee: "télécommande multi-volets", saillie: "inverseur en saillie", encastre: "inverseur encastré", sans: "sans inverseur" }[state.commande];
        if (cmd) m += " · " + cmd;
        if (state.secours) m += " · secours manivelle";
      }
      rows.push(["Manœuvre", m]);
    }
    const opts = [];
    if (p.steps.includes("options")) {
      if (p.dims === "reno" && state.moustiquaire) opts.push("moustiquaire");
      if (p.dims !== "axe") opts.push(state.enroulement === "int" ? "enroulement intérieur" : "enroulement extérieur");
      opts.push("manœuvre à " + state.cote);
      opts.push(state.attaches === "verrous" ? "verrous anti-relevage" : "attaches souples");
      if (state.arretsBas) opts.push("arrêts bas");
      if (state.serrure) opts.push("serrure");
    }
    if (p.steps.includes("finitions")) {
      opts.push(state.ajourage === "total" ? "ajourage total" : "sans ajourage");
      opts.push(state.attaches === "verrous" ? "verrous anti-relevage" : "attaches souples");
      if (state.serrure) opts.push("serrure");
    }
    if (opts.length) rows.push(["Options", opts.join(", ")]);
    rows.push(["Prestation", (state.pose === "pose" ? "Fourniture + pose" : "Fourniture seule") + (state.metre ? " · métré sur place" : "")]);
    if (state.notes) rows.push(["Remarque", state.notes]);
    return rows;
  }

  /* ---------- Événements ---------- */
  const RERENDER = ["product", "tablier", "manoeuvre", "coloris", "coffre"];
  form.addEventListener("change", e => {
    const t = e.target; if (!t.name) return;
    if (t.type === "checkbox") state[t.name] = t.checked;
    else if (t.type === "radio") state[t.name] = t.value;
    else state[t.name] = t.value;
    if (t.name === "product") {
      const keep = { qty: state.qty, repere: state.repere, L: state.L, H: state.H, coloris: state.coloris };
      state = Object.assign({ product: t.value }, DEFAULTS, keep);
      history.replaceState(null, "", "?produit=" + t.value);
    }
    if (RERENDER.includes(t.name)) render(`input[name="${t.name}"][value="${t.value}"]`);
    else { if (["L", "H", "qty"].includes(t.name)) syncDims(); update(); }
  });
  form.addEventListener("input", e => {
    const t = e.target;
    if (["L", "H", "qty", "repere", "notes"].includes(t.name)) {
      state[t.name] = t.value.trim ? t.value.trim() : t.value;
      if (["L", "H", "qty"].includes(t.name)) syncDims();
      update();
    }
  });
  function syncDims() {
    const v = validDims();
    const L = form.querySelector("#L"), H = form.querySelector("#H");
    if (L) L.classList.toggle("invalid", v.errL);
    if (H) H.classList.toggle("invalid", v.errH);
    const m = form.querySelector("#dimMsg"); if (m) m.innerHTML = dimMessage();
  }
  $("#openRange").addEventListener("input", e => { previewOpen = e.target.value / 100; update(); });

  /* ---------- Panier de demande ---------- */
  function saveCart() { store.set("bi-cart", cart); renderCart(); }
  function renderCart() {
    $("#cartCount").textContent = cart.length;
    $("#navCount").textContent = `(${cart.length})`;
    $("#checkoutBtn").disabled = !cart.length;
    $("#cartList").innerHTML = cart.length ? cart.map((it, i) => `
      <div class="cart-item">
        <div><strong>${it.qty} × ${esc(it.name)}</strong><small>${esc(it.dims)}${it.repere ? " · " + esc(it.repere) : ""}</small></div>
        <div style="text-align:right"><button type="button" data-edit="${i}">Modifier</button><br><button type="button" data-del="${i}">Retirer</button></div>
      </div>`).join("") : `<p class="cart-empty">Aucun volet ajouté pour l'instant.</p>`;
  }
  $("#cartList").addEventListener("click", e => {
    const d = e.target.dataset;
    if (d.del != null) { cart.splice(+d.del, 1); saveCart(); toast("Volet retiré de la demande"); }
    if (d.edit != null) {
      const it = cart.splice(+d.edit, 1)[0]; saveCart();
      state = Object.assign({}, DEFAULTS, it.state); render();
      form.scrollIntoView({ behavior: "smooth" });
      toast("Modifiez puis ajoutez à nouveau ce volet");
    }
  });

  $("#addBtn").addEventListener("click", () => {
    if (missingSteps().length) return;
    const p = product();
    cart.push({
      name: p.name, ref: p.ref, img: p.img, qty: +state.qty || 1, repere: state.repere,
      dims: p.dims === "axe" ? `L ${state.L} mm` : `${state.L} × ${state.H} mm`,
      lines: summary(), state: Object.assign({}, state),
      visual: Object.assign({}, p.visual, { color: state.coloris, coffre: p.dims === "reno" ? state.coffre : p.visual.coffre, ratio: (+state.H / +state.L) || 1, open: .45 })
    });
    saveCart();
    toast(`${p.short} ajouté à votre demande`);
    state.repere = ""; state.notes = ""; state.qty = 1;
    render();
  });

  /* ---------- Finalisation ---------- */
  $("#checkoutBtn").addEventListener("click", () => {
    const sec = $("#checkout"); sec.classList.add("open");
    $("#orderLines").innerHTML = cart.map(it => `
      <div class="order-line">
        <img src="${esc(it.img || (PRODUCTS.find(x => x.name === it.name) || {}).img || "")}" alt="">

        <div><strong>${esc(it.name)}</strong>${it.repere ? ` — ${esc(it.repere)}` : ""}
          <p>${it.lines.filter(l => !["Quantité"].includes(l[0])).map(l => `${l[0]} : ${esc(l[1])}`).join(" · ")}</p></div>
        <span class="qty">× ${it.qty}</span>
      </div>`).join("");
    sec.scrollIntoView({ behavior: "smooth" });
  });

  const cf = $("#customerForm");
  cf.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    cf.querySelectorAll("[required]").forEach(i => {
      let bad = i.type === "checkbox" ? !i.checked : !i.value.trim();
      if (i.type === "email" && i.value && !/^\S+@\S+\.\S+$/.test(i.value)) bad = true;
      if (i.name === "cp" && i.value && !/^\d{5}$/.test(i.value)) bad = true;
      i.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    if (!ok) { toast("Merci de vérifier les champs en rouge"); return; }
    if (!cart.length) { toast("Ajoutez au moins un volet"); return; }

    const c = Object.fromEntries(new FormData(cf));
    const d = new Date();
    const ref = `BI-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const lines = [];
    lines.push(`DEMANDE DE DEVIS ${ref}`, "");
    lines.push(`Client : ${c.nom}${c.societe ? " — " + c.societe : ""} (${c.profil})`);
    lines.push(`Tél : ${c.tel} · E-mail : ${c.email}`);
    lines.push(`Chantier : ${c.adresse}, ${c.cp} ${c.ville}`);
    lines.push(`Rappel : ${c.creneau} · Délai : ${c.delai}`, "");
    cart.forEach((it, i) => {
      lines.push(`— ${i + 1}. ${it.name} [${it.ref}] × ${it.qty}`);
      it.lines.forEach(l => lines.push(`   ${l[0]} : ${l[1]}`));
      lines.push("");
    });
    if (c.message) lines.push("Précisions : " + c.message);
    const body = lines.join("\n");
    const mailto = `mailto:${COMPANY.email}?subject=${encodeURIComponent(`Demande de devis volets roulants ${ref} — ${c.nom}`)}&body=${encodeURIComponent(body)}`;

    const orders = store.get("bi-orders", []);
    orders.push({ ref, date: d.toISOString(), client: c, items: cart });
    store.set("bi-orders", orders);

    $("#checkoutCard").hidden = true;
    $("#successCard").hidden = false;
    $("#orderRef").textContent = "Référence " + ref;
    $("#mailAgain").href = mailto;
    $("#successCard").scrollIntoView({ behavior: "smooth", block: "center" });
    window.location.href = mailto;
    cart = []; saveCart();
  });

  render();
  renderCart();
});
