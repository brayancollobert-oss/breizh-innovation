// Exporte les logos retenus en fichiers SVG : node tools/export-logos.js
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const code = fs.readFileSync(path.join(root, "assets/js/common.js"), "utf8");
const win = {};
const ctx = { window: win, document: { addEventListener() {} }, localStorage: { getItem() { return null; }, setItem() {} }, location: { search: "" }, URLSearchParams };
vm.createContext(ctx);
vm.runInContext(code.replace("})(window);", "})(window);"), ctx);
const BI = win.BI;
const out = path.join(root, "assets/logos");
fs.mkdirSync(out, { recursive: true });
const head = '<?xml version="1.0" encoding="UTF-8"?>\n';
for (const v of ["lames", "gwenn"]) {
  fs.writeFileSync(path.join(out, `logo-${v}.svg`), head + BI.logoSVG(v, { tagline: true }));
  fs.writeFileSync(path.join(out, `logo-${v}-fond-sombre.svg`), head + BI.logoSVG(v, { tagline: true, dark: true }));
  fs.writeFileSync(path.join(out, `icone-${v}.svg`), head + BI.faviconSVG(v));
}
console.log(fs.readdirSync(out).join("\n"));
