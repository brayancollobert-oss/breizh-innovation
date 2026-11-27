/* Page d'accueil */
document.addEventListener("DOMContentLoaded", () => {
  const { PRODUCTS, COMPANY, toast } = window.BI;
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';

  /* Grille produits */
  document.getElementById("productGrid").innerHTML = PRODUCTS.map((p, i) => `
    <a class="product" href="commande.html?produit=${p.id}">
      ${p.tag ? `<span class="product-tag ${p.tagGold ? "accent" : ""}">${p.tag}</span>` : ""}
      <span class="product-num">0${i + 1}</span>
      <div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <ul class="product-feats">${p.feats.map(f => `<li>${f}</li>`).join("")}</ul>
      <span class="link-arrow">Configurer ${arrow}</span>
    </a>`).join("");

  document.getElementById("footerProducts").innerHTML =
    PRODUCTS.map(p => `<li><a href="commande.html?produit=${p.id}">${p.short}</a></li>`).join("");

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
