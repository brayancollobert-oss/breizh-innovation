# Site Breizh Innovation — Volets roulants sur mesure

Site statique (HTML / CSS / JS, sans framework ni base de données).

| Page | Rôle |
|---|---|
| `index.html` | Accueil : gamme, méthode, motorisation, zone, FAQ, contact |
| `commande.html` | Configurateur de commande (inspiré de Qualiferm), plusieurs volets par demande |
| `logos.html` | 5 propositions de nouveau logo (page interne, `noindex`) |

## Prise de commande
- **Aucun paiement** : le client configure, ajoute ses volets, puis envoie une *demande de devis*.
- L'envoi ouvre la messagerie du client avec le récapitulatif complet adressé à `bzhinnov.comptabilite@gmail.com`, avec une référence `BI-AAMMJJ-XXXX`.
- La demande en cours est gardée dans le navigateur (localStorage) tant qu'elle n'est pas envoyée.

Pour recevoir les demandes sans passer par la messagerie du client, il suffira de brancher un service de formulaire (Formspree, Netlify Forms, Web3Forms…) dans `assets/js/configurateur.js`, à l'endroit où `mailto` est construit.

## Modifier les produits
Tout est dans `assets/js/common.js` : `PRODUCTS`, `TABLIERS`, `COLORS`, `MANOEUVRES`, `AXES`, `COMPANY` (téléphone, e-mail, adresse).

## Mettre en ligne
Copier le dossier tel quel sur n'importe quel hébergement (OVH, o2switch, Netlify, GitHub Pages…).

## À compléter avant mise en ligne
- Mentions légales et politique de confidentialité (SIRET, assureur décennal).
- Vérifier avec Qualiferm l'autorisation d'utiliser ses photos produits (`assets/img/p-*.jpg`, 300 px).

## Visuels
- Logo : redessin vectoriel fidèle du logo d'origine (`assets/logo-breizh-innovation.svg`).
- Photos de chantiers : site actuel breizh-innovation.fr (`assets/img/chantier-*.jpg`, `hero.jpg`, `telecommande.jpg`, `volet-toit-solaire.jpg`).
- Photos produits : fabricant Qualiferm (`assets/img/p-*.jpg`).
- Originaux non retouchés dans `assets/img/source/` (non publiés).
