/* Breizh Innovation — données partagées + rendu SVG des volets */
(function (w) {
  "use strict";
  document.documentElement.classList.add("js");

  const COMPANY = {
    name: "Breizh Innovation",
    email: "bzhinnov.comptabilite@gmail.com",
    phone: "07 49 69 57 15",
    phoneLink: "+33749695715",
    phone2: "02 97 78 42 86",
    phone2Link: "+33297784286",
    address: "Lieu-dit Le Busset, 56530 Quéven",
    hours: "Lun – Ven · 8h00–12h00 / 13h30–19h00",
    facebook: "https://www.facebook.com/Breizh-Innovation-106490024116001/"
  };

  /* Coloris (≃ RAL) */
  const COLORS = {
    "9016": { name: "Blanc", ral: "RAL 9016", hex: "#F1F0EA" },
    "7016": { name: "Gris anthracite", ral: "RAL 7016", hex: "#383E42" },
    "9006": { name: "Gris métal", ral: "RAL 9006", hex: "#A5A8A6" },
    "7038": { name: "Gris agate", ral: "RAL 7038", hex: "#B4B8B0", only: ["P42", "P55"] },
    "8019": { name: "Marron", ral: "RAL 8019", hex: "#403A3A" },
    "8014": { name: "Brun sépia", ral: "RAL 8014", hex: "#4A3526" },
    "1015": { name: "Ivoire clair", ral: "RAL 1015", hex: "#E6D2B5" },
    "9005": { name: "Noir", ral: "RAL 9005", hex: "#121212" },
    "chene": { name: "Chêne doré", ral: "Ton bois", hex: "#A86B32", wood: true },
    "makassar": { name: "Makassar", ral: "Ton bois", hex: "#4A2C1D", wood: true }
  };

  /* Ordre d'affichage (les clés numériques seraient sinon triées par JS) */
  const COLOR_KEYS = ["9016", "7016", "9006", "7038", "8019", "8014", "1015", "9005", "chene", "makassar"];

  /* Tabliers */
  const TABLIERS = [
    { id: "P37", mat: "PVC", name: "PVC P37", desc: "Double paroi · lame 37 mm · ép. 7,5 mm", max: "Largeur ≤ 1,8 m" },
    { id: "P42", mat: "PVC", name: "PVC P42", desc: "Double paroi · lame 42 mm · ép. 8,5 mm", max: "Largeur ≤ 2,2 m", popular: true },
    { id: "P55", mat: "PVC", name: "PVC P55", desc: "Double paroi · lame 55 mm · ép. 14 mm", max: "Largeur ≤ 2,7 m" },
    { id: "A37", mat: "Alu", name: "Alu A37", desc: "Double paroi injectée mousse PU · 37 mm", max: "Coffres compacts" },
    { id: "A42", mat: "Alu", name: "Alu A42", desc: "Double paroi injectée mousse PU · 42 mm", max: "Largeur ≤ 3 m", popular: true },
    { id: "A42RS", mat: "Alu", name: "Alu A42 renforcé", desc: "Renforcée, injectée mousse PU · ép. 9,2 mm", max: "Plus de sécurité" },
    { id: "A55", mat: "Alu", name: "Alu A55", desc: "Double paroi injectée mousse PU · ép. 13 mm", max: "Baies jusqu'à 4 m" },
    { id: "A55RS", mat: "Alu", name: "Alu A55 renforcé", desc: "Renforcée, injectée mousse PU · ép. 14 mm", max: "Grandes baies" },
    { id: "A77", mat: "Alu", name: "Alu A77", desc: "Injectée mousse PU · lame 77 mm", max: "Très grandes largeurs" },
    { id: "EX44", mat: "Alu", name: "Alu extrudé EX44", desc: "Aluminium extrudé · ép. 9,5 mm", max: "Haute sécurité / anti-effraction" }
  ];

  /* Manœuvres */
  const MANOEUVRES = [
    { group: "Motorisation radio (télécommande)", items: [
      { id: "somfy-io", name: "Somfy RS100 io", desc: "Silencieux, compatible TaHoma / domotique", badge: "Best-seller" },
      { id: "simu-bhz", name: "Simu BHz", desc: "Radio, compatible io" },
      { id: "eck-rts", name: "Eckermann by ZF radio", desc: "Compatible RTS · garantie 5 ans" }
    ]},
    { group: "Motorisation filaire (interrupteur)", items: [
      { id: "somfy-fil", name: "Somfy filaire", desc: "Inverseur mural" },
      { id: "simu-fil", name: "Simu filaire", desc: "Inverseur mural" },
      { id: "eck-fil", name: "Eckermann by ZF filaire", desc: "Robuste et économique" }
    ]},
    { group: "Motorisation solaire", items: [
      { id: "somfy-solar", name: "Somfy RS100 Solar io", desc: "Sans raccordement électrique · garantie 7 ans", badge: "Éco" }
    ]},
    { group: "Manœuvre manuelle", items: [
      { id: "sangle", name: "Sangle", desc: "Enrouleur intérieur" },
      { id: "manivelle", name: "Manivelle", desc: "Treuil + manivelle blanche" },
      { id: "tirage", name: "Tirage direct", desc: "Petites dimensions" }
    ]}
  ];

  const AXES = [
    { id: "oct40", name: "Octogonal Ø40", desc: "Petites fenêtres, manœuvre manuelle" },
    { id: "zf54", name: "ZF Ø54", desc: "Standard fenêtres et portes-fenêtres" },
    { id: "zf64", name: "ZF Ø64", desc: "Baies et tabliers lourds" },
    { id: "zf80", name: "ZF Ø80", desc: "Très grandes dimensions" },
    { id: "inconnu", name: "Je ne sais pas", desc: "Déterminé lors de notre visite" }
  ];

  /* Produits (gamme volets roulants sur mesure) */
  const PRODUCTS = [
    {
      id: "renovation-solaire", ref: "VRRS", name: "Volet roulant rénovation solaire",
      short: "Rénovation solaire",
      tag: "Sans électricien", tagGold: true,
      desc: "Panneau solaire et batterie intégrés : aucun raccordement électrique, pose express sur menuiserie existante.",
      feats: ["Énergie solaire", "Somfy Solar io", "Garantie 7 ans"],
      visual: { color: "7016", open: 0.35, coffre: "pan", solar: true },
      steps: ["dims", "tablier", "coloris", "coffre", "options", "pose"],
      fixedManoeuvre: "somfy-solar",
      dims: "reno"
    },
    {
      id: "renovation", ref: "VRR", name: "Volet roulant rénovation",
      short: "Rénovation",
      tag: "Le plus demandé",
      desc: "Coffre extérieur posé sur la fenêtre existante : remplacement d'un ancien volet sans gros travaux.",
      feats: ["Coffre pan coupé / ¼ rond", "Moustiquaire possible", "Pose en 1/2 journée"],
      visual: { color: "9016", open: 0.45, coffre: "pan" },
      steps: ["dims", "tablier", "coloris", "coffre", "manoeuvre", "options", "pose"],
      dims: "reno"
    },
    {
      id: "traditionnel-optimo", ref: "VRT-O", name: "Volet roulant traditionnel Optimo",
      short: "Traditionnel Optimo",
      tag: "Nouveau",
      desc: "Système optimisé pour coffre maçonné ou menuisé : moins de pièces, pré-monté en atelier, pose rapide.",
      feats: ["Pré-montage atelier", "Neuf & rénovation", "Moteur 5 ans"],
      visual: { color: "9006", open: 0.5, coffre: "trad" },
      steps: ["dims", "tablier", "coloris", "manoeuvre", "options", "pose"],
      dims: "trad"
    },
    {
      id: "traditionnel", ref: "VRT", name: "Volet roulant traditionnel pose drapeau",
      short: "Traditionnel drapeau",
      desc: "Le grand classique pour coffre bois ou maçonnerie, fixé par supports drapeau. Jusqu'à 5 m de large.",
      feats: ["Coffre bois / maçonné", "Jusqu'à 5 m", "SAV pièces rapide"],
      visual: { color: "8019", open: 0.3, coffre: "trad" },
      steps: ["dims", "tablier", "coloris", "manoeuvre", "options", "pose"],
      dims: "trad"
    },
    {
      id: "tablier-seul", ref: "TAB", name: "Tablier seul de volet roulant",
      short: "Tablier seul",
      desc: "Vous gardez coffre et coulisses : on remplace uniquement le rideau, au millimètre, PVC ou alu.",
      feats: ["Économique", "PVC ou alu", "Réparation"],
      visual: { color: "9016", open: 0, mode: "tablier" },
      steps: ["dims", "tablier", "coloris", "finitions", "pose"],
      dims: "tablier"
    },
    {
      id: "axe-seul", ref: "AXE", name: "Axe seul de volet roulant",
      short: "Axe seul",
      desc: "Axe sur mesure pour remplacer un axe usé ou motoriser un volet manuel existant.",
      feats: ["Motorisation d'un volet", "Somfy · Simu · Eckermann", "Tous coffres"],
      visual: { color: "9006", mode: "axe" },
      steps: ["dims", "axe", "manoeuvre", "pose"],
      dims: "axe"
    }
  ];

  /* Photos produits (fabricant Qualiferm) */
  PRODUCTS.forEach(p => { p.img = `assets/img/p-${p.id}.jpg`; });

  /* ---------- Utils couleurs ---------- */
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = pct < 0 ? 0 : 255, p = Math.abs(pct);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  let uidN = 0;

  /* ---------- Rendu SVG d'un volet ----------
     o = { color, open (0 fermé → 1 ouvert), coffre: 'pan'|'quart'|'trad', solar, mode: 'tablier'|'axe', ratio (h/w), moustiquaire } */
  function shutterSVG(o) {
    o = o || {};
    const id = "s" + (++uidN);
    const c = COLORS[o.color] || COLORS["9016"];
    const base = c.hex, dark = shade(base, -0.28), light = shade(base, 0.18);

    if (o.mode === "axe") return axeSVG(id, o);

    const W = 220;
    const ratio = o.ratio || 1.1;
    const H = Math.round(Math.min(Math.max(W * ratio, 120), 320));
    const pad = 22;
    const cof = (o.mode === "tablier" || o.coffre === "trad") ? 0 : 34;
    const vbW = W + pad * 2, vbH = pad + cof + H + 26;
    const top = pad + cof;
    const open = Math.max(0, Math.min(1, o.open == null ? 0.4 : o.open));
    const tabH = Math.max(8, (H - 6) * (1 - open));
    const slat = 9;

    const slatPattern = `<pattern id="${id}p" width="10" height="${slat}" patternUnits="userSpaceOnUse">
        <rect width="10" height="${slat}" fill="${base}"/>
        <rect y="0" width="10" height="2" fill="${light}" opacity=".55"/>
        <rect y="${slat - 1.6}" width="10" height="1.6" fill="${dark}" opacity=".7"/>
        ${c.wood ? `<rect y="3.5" width="10" height=".7" fill="${dark}" opacity=".35"/>` : ""}
      </pattern>`;

    if (o.mode === "tablier") {
      const th = H * 0.92;
      return `<svg viewBox="0 0 ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tablier de volet roulant">
        <defs>${slatPattern}</defs>
        <g transform="translate(${pad},${pad})">
          <rect x="6" y="6" width="${W - 12}" height="${th}" rx="3" fill="#0D1726" opacity=".08"/>
          <rect width="${W}" height="${th}" rx="2" fill="url(#${id}p)"/>
          <rect y="${th - 10}" width="${W}" height="10" rx="2" fill="${dark}"/>
          <rect x="-4" y="0" width="8" height="${th}" rx="2" fill="${shade(base, -0.12)}"/>
          <rect x="${W - 4}" y="0" width="8" height="${th}" rx="2" fill="${shade(base, -0.12)}"/>
          <rect x="${W * 0.18}" y="-8" width="10" height="14" rx="2" fill="#7A8597"/>
          <rect x="${W * 0.78}" y="-8" width="10" height="14" rx="2" fill="#7A8597"/>
        </g>
      </svg>`;
    }

    const coffreFill = o.coffre === "quart"
      ? `<path d="M${pad - 6} ${pad} h${W + 12} v${cof - 14} q0 14 -14 14 h-${W - 16} q-14 0 -14 -14z" fill="url(#${id}cq)"/>`
      : o.coffre === "pan"
        ? `<rect x="${pad - 6}" y="${pad}" width="${W + 12}" height="${cof - 12}" rx="2" fill="${base}"/>
           <rect x="${pad - 6}" y="${pad + cof - 12}" width="${W + 12}" height="12" fill="${light}"/>
           <rect x="${pad - 6}" y="${pad + cof - 12}" width="${W + 12}" height="1.5" fill="${dark}" opacity=".35"/>`
        : "";

    const solar = o.solar && cof ? `
      <g transform="translate(${pad + W - 64},${pad + 5})">
        <rect width="58" height="16" rx="2" fill="#1B2A4A"/>
        <path d="M14.5 0v16M29 0v16M43.5 0v16M0 8h58" stroke="#4A6BA8" stroke-width="1"/>
        <rect width="58" height="16" rx="2" fill="url(#${id}sg)" opacity=".5"/>
      </g>` : "";

    const lintel = o.coffre === "trad"
      ? `<rect x="${pad - 18}" y="${pad - 16}" width="${W + 36}" height="16" fill="#D9D3C5"/>
         <rect x="${pad - 18}" y="${pad - 2}" width="${W + 36}" height="2" fill="#BDB5A3"/>` : "";

    const mous = o.moustiquaire ? `<rect x="${pad + 12}" y="${top + 12}" width="${W - 24}" height="${H - 24}" fill="url(#${id}m)" opacity=".5"/>` : "";

    return `<svg viewBox="0 0 ${vbW} ${vbH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Volet roulant ${c.name}">
      <defs>
        ${slatPattern}
        <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#CFE3F7"/><stop offset=".55" stop-color="#EAF3FB"/><stop offset="1" stop-color="#B9D3EE"/>
        </linearGradient>
        <linearGradient id="${id}cq" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${base}"/><stop offset=".7" stop-color="${base}"/><stop offset="1" stop-color="${light}"/>
        </linearGradient>
        <linearGradient id="${id}sg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
        <pattern id="${id}m" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0h4M0 0v4" stroke="#56606E" stroke-width=".4"/></pattern>
        <clipPath id="${id}c"><rect x="${pad}" y="${top}" width="${W}" height="${H}"/></clipPath>
      </defs>
      ${lintel}
      <!-- Dormant / fenêtre -->
      <rect x="${pad}" y="${top}" width="${W}" height="${H}" fill="#FFFFFF" stroke="#CBD2DC" stroke-width="1.5"/>
      <rect x="${pad + 12}" y="${top + 12}" width="${(W - 30) / 2}" height="${H - 24}" fill="url(#${id}g)" stroke="#D8DEE7"/>
      <rect x="${pad + 18 + (W - 30) / 2}" y="${top + 12}" width="${(W - 30) / 2}" height="${H - 24}" fill="url(#${id}g)" stroke="#D8DEE7"/>
      <path d="M${pad + 30} ${top + H - 40} l40 -40 M${pad + 40} ${top + H - 30} l24 -24" stroke="#fff" stroke-width="5" opacity=".6" stroke-linecap="round"/>
      ${mous}
      <!-- Tablier -->
      <g clip-path="url(#${id}c)">
        <rect x="${pad}" y="${top}" width="${W}" height="${tabH}" fill="url(#${id}p)"/>
        <rect x="${pad}" y="${top + tabH - 8}" width="${W}" height="8" fill="${dark}"/>
        <rect x="${pad}" y="${top + tabH}" width="${W}" height="3" fill="#0D1726" opacity=".12"/>
      </g>
      <!-- Coulisses -->
      <rect x="${pad - 6}" y="${top}" width="9" height="${H}" rx="1.5" fill="${shade(base, -0.1)}"/>
      <rect x="${pad + W - 3}" y="${top}" width="9" height="${H}" rx="1.5" fill="${shade(base, -0.1)}"/>
      ${coffreFill}
      ${solar}
      <!-- Appui -->
      <rect x="${pad - 14}" y="${top + H}" width="${W + 28}" height="9" rx="2" fill="#C9CED6"/>
      <rect x="${pad - 14}" y="${top + H + 9}" width="${W + 28}" height="3" fill="#0D1726" opacity=".08"/>
    </svg>`;
  }

  function axeSVG(id, o) {
    const motor = o.motor !== false;
    return `<svg viewBox="0 0 264 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Axe de volet roulant">
      <defs>
        <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#E7EAEE"/><stop offset=".35" stop-color="#C3C9D1"/><stop offset=".7" stop-color="#9BA3AF"/><stop offset="1" stop-color="#B8BFC9"/>
        </linearGradient>
        <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#3B4A63"/><stop offset=".5" stop-color="#1A2638"/><stop offset="1" stop-color="#2D3B52"/>
        </linearGradient>
      </defs>
      <ellipse cx="132" cy="158" rx="112" ry="8" fill="#0D1726" opacity=".08"/>
      <rect x="22" y="86" width="220" height="44" rx="6" fill="url(#${id}a)"/>
      <path d="M22 96h220M22 120h220" stroke="#8A93A0" stroke-width="1" opacity=".5"/>
      ${motor ? `<rect x="168" y="90" width="74" height="36" rx="5" fill="url(#${id}m)"/>
      <rect x="236" y="84" width="14" height="48" rx="3" fill="#1F5BD6"/>
      <circle cx="243" cy="100" r="2.5" fill="#fff"/>` : `<rect x="236" y="96" width="12" height="24" rx="2" fill="#7A8597"/>`}
      <rect x="12" y="96" width="14" height="24" rx="3" fill="#7A8597"/>
      <rect x="4" y="103" width="10" height="10" rx="2" fill="#5B6574"/>
      <g fill="#1F5BD6" opacity=".9"><rect x="64" y="80" width="6" height="56" rx="2"/><rect x="118" y="80" width="6" height="56" rx="2"/></g>
    </svg>`;
  }

  /* ---------- Logos retenus : "lames" (Lames & Hermine) et "gwenn" (Gwenn ha Du) ---------- */
  const LOGO_FONT = "Manrope,system-ui,'Segoe UI',sans-serif";
  function ermine(x, y, w, h, fill) {
    return `<g transform="translate(${x},${y}) scale(${w / 20},${h / 30})" fill="${fill}">
      <circle cx="10" cy="3" r="2.3"/><circle cx="5.2" cy="6.2" r="2.3"/><circle cx="14.8" cy="6.2" r="2.3"/>
      <path d="M10 8.5C11.4 13.5 12.2 17.5 15.5 24.5L12.2 23 10 29.5 7.8 23 4.5 24.5C7.8 17.5 8.6 13.5 10 8.5Z"/></g>`;
  }
  function logoIcon(variant, dark) {
    const ink = dark ? "#FFFFFF" : "#0D1726", paper = dark ? "#0D1726" : "#FFFFFF";
    if (variant === "gwenn") {
      const fg = dark ? "#FFFFFF" : "#000000", bg = dark ? "#0D1726" : "#FFFFFF";
      return `<rect x="10" y="18" width="94" height="10" rx="2" fill="${fg}"/>
        <rect x="12" y="28" width="90" height="76" fill="${bg}"/>
        <g fill="${fg}"><rect x="54" y="28" width="48" height="8.5"/><rect x="54" y="45" width="48" height="8.5"/><rect x="12" y="62" width="90" height="8.5"/><rect x="12" y="79" width="90" height="8.5"/><rect x="12" y="96" width="90" height="8"/></g>
        ${ermine(18, 31, 11, 15, fg)}${ermine(35, 31, 11, 15, fg)}${ermine(26.5, 44, 11, 15, fg)}
        <rect x="12" y="28" width="90" height="76" fill="none" stroke="${fg}" stroke-width="2"/>`;
    }
    return `<rect x="10" y="14" width="92" height="92" rx="20" fill="${ink}"/>
      <rect x="26" y="28" width="60" height="11" rx="3" fill="${paper}"/>
      <rect x="29" y="43" width="54" height="5.5" rx="1.5" fill="${paper}"/>
      <rect x="29" y="52" width="54" height="5.5" rx="1.5" fill="${paper}"/>
      <rect x="29" y="61" width="54" height="5.5" rx="1.5" fill="${paper}"/>
      ${ermine(43, 70, 26, 31, "#F2B33D")}`;
  }
  /* opts: { dark, tagline } */
  function logoSVG(variant, opts) {
    opts = opts || {};
    const ink = opts.dark ? "#FFFFFF" : (variant === "gwenn" ? "#000000" : "#0D1726");
    const tag = opts.tagline;
    let text;
    if (variant === "gwenn") {
      text = `<text x="120" y="${tag ? 58 : 64}" font-family="${LOGO_FONT}" fill="${ink}" font-size="33" font-weight="800">Breizh</text>
        <text x="120" y="${tag ? 86 : 94}" font-family="${LOGO_FONT}" fill="${ink}" font-size="27" font-weight="400">Innovation</text>
        ${tag ? `<text x="121" y="104" font-family="${LOGO_FONT}" fill="${opts.dark ? "#A9B4C6" : "#5D6778"}" font-size="9.5" font-weight="800" letter-spacing="2.2">VOLETS ROULANTS SUR MESURE</text>` : ""}`;
    } else {
      text = `<text x="120" y="${tag ? 60 : 64}" font-family="${LOGO_FONT}" fill="${ink}" font-size="34" font-weight="800" letter-spacing="1">BREIZH</text>
        <text x="121" y="${tag ? 86 : 92}" font-family="${LOGO_FONT}" fill="${ink}" font-size="19" font-weight="500" letter-spacing="5.6">INNOVATION</text>
        ${tag ? `<text x="121" y="104" font-family="${LOGO_FONT}" fill="${opts.dark ? "#7FA6F0" : "#1F5BD6"}" font-size="9.5" font-weight="800" letter-spacing="2.2">VOLETS ROULANTS SUR MESURE</text>` : ""}`;
    }
    return `<svg viewBox="0 0 ${tag ? 340 : 300} 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Breizh Innovation">${logoIcon(variant, opts.dark)}${text}</svg>`;
  }
  function faviconSVG(variant) {
    const inner = variant === "gwenn"
      ? `<rect width="64" height="64" rx="14" fill="#fff"/><rect x="8" y="8" width="48" height="7" rx="1.5" fill="#000"/><g fill="#000"><rect x="32" y="15" width="24" height="6"/><rect x="32" y="27" width="24" height="6"/><rect x="8" y="39" width="48" height="6"/><rect x="8" y="51" width="48" height="5"/></g>${ermine(14, 17, 12, 17, "#000")}<rect x="8" y="15" width="48" height="41" fill="none" stroke="#000" stroke-width="2"/>`
      : `<rect width="64" height="64" rx="14" fill="#0D1726"/><rect x="12" y="11" width="40" height="8" rx="2" fill="#fff"/><rect x="14" y="22" width="36" height="4" rx="1" fill="#fff"/><rect x="14" y="29" width="36" height="4" rx="1" fill="#fff"/><rect x="14" y="36" width="36" height="4" rx="1" fill="#fff"/>${ermine(25, 41, 14, 19, "#F2B33D")}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${inner}</svg>`;
  }
  const LOGO_NAMES = { lames: "Lames & Hermine", gwenn: "Gwenn ha Du" };
  function currentLogo() {
    const q = new URLSearchParams(location.search).get("logo");
    if (q && LOGO_NAMES[q]) { store.set("bi-logo", q); return q; }
    const s = store.get("bi-logo", "lames");
    return LOGO_NAMES[s] ? s : "lames";
  }
  function applyLogo(v) {
    document.querySelectorAll("[data-logo]").forEach(el => {
      el.innerHTML = logoSVG(v, { dark: el.dataset.logo === "dark", tagline: el.dataset.logo === "dark" });
    });
    let link = document.querySelector('link[rel="icon"]');
    if (link) link.href = "data:image/svg+xml," + encodeURIComponent(faviconSVG(v));
    document.querySelectorAll(".logo-switch button").forEach(b => b.setAttribute("aria-pressed", b.dataset.v === v));
  }
  function initLogoSwitch() {
    const v = currentLogo();
    if (!document.querySelector("[data-logo]")) return;
    /* Sélecteur temporaire pour comparer les 2 logos sur le site — à retirer une fois le choix fait */
    const sw = document.createElement("div");
    sw.className = "logo-switch no-print";
    sw.innerHTML = `<span>Logo</span>` + Object.entries(LOGO_NAMES).map(([k, n]) => `<button type="button" data-v="${k}">${n}</button>`).join("");
    sw.addEventListener("click", e => {
      const b = e.target.closest("button"); if (!b) return;
      store.set("bi-logo", b.dataset.v); applyLogo(b.dataset.v);
    });
    document.body.appendChild(sw);
    applyLogo(v);
  }

  /* ---------- Icônes ---------- */
  const ICONS = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
  };

  /* ---------- Comportements communs ---------- */
  function initCommon() {
    const header = document.querySelector(".header");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    const burger = document.querySelector(".burger"), nav = document.querySelector(".nav");
    if (burger && nav) {
      burger.addEventListener("click", () => {
        const o = nav.classList.toggle("open"); burger.classList.toggle("open", o);
        burger.setAttribute("aria-expanded", o);
      });
      nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); burger.classList.remove("open"); }));
    }

    initLogoSwitch();

    document.querySelectorAll("[data-shutter]").forEach(el => {
      try { el.innerHTML = shutterSVG(JSON.parse(el.getAttribute("data-shutter"))); } catch (e) { /* noop */ }
    });

    const yr = document.querySelectorAll("[data-year]");
    yr.forEach(e => e.textContent = new Date().getFullYear());

    /* Apparition au défilement : sans jamais laisser un bloc ou une photo masqués */
    const showAll = () => document.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0, rootMargin: "0px 0px -8% 0px" });
      document.querySelectorAll(".reveal").forEach(el => io.observe(el));
      setTimeout(showAll, 2500);
    } else showAll();
  }

  function toast(msg) {
    let t = document.querySelector(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = ICONS.check + "<span></span>"; t.querySelector("span").textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* noop */ } }
  };

  w.BI = { COMPANY, COLORS, COLOR_KEYS,TABLIERS, MANOEUVRES, AXES, PRODUCTS, shutterSVG, shade, logoSVG, faviconSVG, ICONS, toast, store, initCommon };
  document.addEventListener("DOMContentLoaded", initCommon);
})(window);
