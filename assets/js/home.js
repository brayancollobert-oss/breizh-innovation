/* Page d'accueil */
document.addEventListener("DOMContentLoaded", () => {
  const { PRODUCTS, COLORS, shutterSVG, COMPANY, toast } = window.BI;

  /* Grille produits */
  const grid = document.getElementById("productGrid");
  grid.innerHTML = PRODUCTS.map(p => `
    <article class="product reveal">
      <div class="product-visual">
        ${p.tag ? `<span class="product-tag ${p.tagGold ? "gold" : ""}">${p.tag}</span>` : ""}
        ${shutterSVG(p.visual)}
      </div>
      <div class="product-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <ul class="product-feats">${p.feats.map(f => `<li>${f}</li>`).join("")}</ul>
        <div class="product-actions">
          <a class="btn btn-dark" href="commande.html?produit=${p.id}">Configurer</a>
          <a class="btn btn-ghost" href="#contact">Conseil</a>
        </div>
      </div>
    </article>`).join("");
  grid.querySelectorAll(".reveal").forEach(el => el.classList.add("in"));

  document.getElementById("footerProducts").innerHTML =
    PRODUCTS.map(p => `<li><a href="commande.html?produit=${p.id}">${p.short}</a></li>`).join("");

  document.getElementById("swatchBand").innerHTML = window.BI.COLOR_KEYS.map(k => COLORS[k]).slice(0, 8)
    .map(c => `<span class="swatch-chip"><i style="background:${c.hex}"></i>${c.name}</span>`).join("");

  /* Volet animé du hero */
  const hero = document.getElementById("heroShutter");
  let pos = 0.15, target = 0.62, raf = null;
  const draw = () => { hero.innerHTML = shutterSVG({ color: "7016", open: pos, coffre: "pan", solar: true, ratio: 1.05 }); };
  const step = () => {
    const d = target - pos;
    if (Math.abs(d) < 0.004) { pos = target; draw(); raf = null; return; }
    pos += Math.sign(d) * Math.min(Math.abs(d), 0.006);
    draw(); raf = requestAnimationFrame(step);
  };
  const go = t => { target = t; if (!raf) raf = requestAnimationFrame(step); };
  draw();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) setTimeout(() => go(0.62), 600); else { pos = 0.62; draw(); }

  document.querySelectorAll(".hero-remote button").forEach(b => b.addEventListener("click", () => {
    const d = b.dataset.dir;
    if (d === "up") go(1); else if (d === "down") go(0); else go(pos);
  }));

  /* Formulaire de rappel : ouvre le client mail pré-rempli (pas de serveur) */
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach(i => {
      const bad = i.type === "checkbox" ? !i.checked : !i.value.trim();
      i.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    if (!ok) { toast("Merci de compléter les champs obligatoires"); return; }
    const f = Object.fromEntries(new FormData(form));
    const body = `Nom : ${f.nom}\nTéléphone : ${f.tel}\nE-mail : ${f.email || "-"}\nCommune : ${f.ville || "-"}\n\n${f.message || ""}`;
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent("Demande de rappel — " + f.nom)}&body=${encodeURIComponent(body)}`;
    toast("Merci ! Votre demande est prête à être envoyée.");
    form.reset();
  });
});
