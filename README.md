# Pneus Mobiles Laval — site web

Site vitrine bilingue (FR/EN) pour **Pneus Mobiles Laval**, service mobile de
changement de pneus et d'entreposage saisonnier à Laval, Montréal, Rive-Nord,
Terrebonne, Mirabel et Deux-Montagnes...

Site statique : **aucun serveur ni build requis**. HTML / CSS / JS pur.

## Structure du projet

```
pneus-mobiles-laval/
├── index.html          # page unique (FR par défaut, bascule EN en JS)
├── css/
│   └── style.css
├── js/
│   └── main.js          # langue, menu mobile, onglets, formulaires
├── assets/
│   ├── logo-full.png     # logo complet "Pneus Mobiles Laval"
│   ├── mascotte.png       # mascotte "Bien chaussé!!" (icône, header, footer)
│   ├── camion-remorque-1.jpg
│   └── camion-remorque-2.jpg
├── .gitignore
└── README.md
```

## Fonctionnalités

- **Bilingue FR/EN** : bouton "FR / EN" en haut à droite. La langue du
  navigateur est détectée au premier chargement, puis le choix est mémorisé
  (`localStorage`). Tout le contenu utilise des attributs `data-fr` / `data-en`
  traduits par `js/main.js` — aucune page dupliquée à maintenir.
- **Section Particuliers / Entreprises** avec onglets.
- **Grille tarifaire complète** (changement + balancement, extras, entreposage,
  rabais 10 % dès 4 véhicules) reprise du visuel fourni.
- **Formulaire de rendez-vous** avec sélection Particulier/Entreprise, service,
  nombre de véhicules, adresse, et case à cocher rabais 4+.
- **Clics-pour-appeler** (`tel:+15146252007`) partout, incluant un bouton
  flottant sur mobile.
- **Optimisé mobile** : menu hamburger, tableaux avec défilement horizontal,
  grilles qui s'empilent, bouton d'appel fixe en bas d'écran.
- Données structurées `schema.org` (AutomotiveBusiness) pour le SEO local.

## ⚠️ À faire avant la mise en ligne

1. **Formulaire de réservation** — le formulaire pointe vers
   `https://formspree.io/f/mzeblbjk` dans `index.html` (élément
   `#bookingForm`). Créez un compte gratuit sur [formspree.io](https://formspree.io),
   créez un formulaire relié à `contact@pneusmobileslaval.ca`, puis remplacez
   `mzeblbjk` par l'identifiant fourni. Tant que ce n'est pas fait,
   le site bascule automatiquement sur un envoi par courriel (`mailto:`).
2. **Réseaux sociaux** — remplacez les liens `https://facebook.com/` et
   `https://instagram.com/` dans le pied de page par vos vraies pages.
3. **Témoignages** — remplacez les 3 témoignages d'exemple par de vrais avis
   clients dès que possible (section `#temoignages`).
4. **Adresse Google** — si vous avez un point de service fixe (garage,
   entreposage), pensez à créer/relier une fiche Google Business Profile pour
   le SEO local (Laval, Montréal, Rive-Nord…).
5. Vérifiez le prix affiché (`#tarifs`) après chaque changement de votre
   grille tarifaire — les valeurs sont codées en dur dans `index.html`.

## Déploiement sur GitHub Pages

```bash
# 1. Initialiser le dépôt (si ce n'est pas déjà fait)
cd pneus-mobiles-laval
git init
git add .
git commit -m "Site web Pneus Mobiles Laval"

# 2. Créer le dépôt sur GitHub, puis relier le remote
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/pneus-mobiles-laval.git
git push -u origin main

# 3. Activer GitHub Pages
# Sur github.com : Settings → Pages → Source: "Deploy from a branch"
# → Branch: main, dossier: / (root) → Save
```

Le site sera en ligne à `https://VOTRE-USERNAME.github.io/pneus-mobiles-laval/`
après quelques minutes.

### Domaine personnalisé (pneusmobileslaval.ca)

1. Dans **Settings → Pages**, ajoutez `www.pneusmobileslaval.ca` (ou
   `pneusmobileslaval.ca`) comme "Custom domain".
2. Chez votre registraire de domaine, ajoutez :
   - un enregistrement `CNAME` pointant `www` vers `VOTRE-USERNAME.github.io`
   - ou des enregistrements `A` pointant la racine du domaine vers les IP de
     GitHub Pages (185.199.108.153, .109.153, .110.153, .111.153)
3. Cochez "Enforce HTTPS" une fois le certificat généré (peut prendre jusqu'à
   24 h).

## Développement local

Aucune dépendance requise. Ouvrez simplement `index.html` dans un navigateur,
ou lancez un petit serveur local pour éviter les soucis de chemins relatifs :

```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```

## Prochaines améliorations suggérées

- Brancher un vrai calendrier de disponibilités (Calendly, ou un connecteur
  Google Calendar) pour la prise de rendez-vous en ligne.
- Ajouter Google Analytics / Meta Pixel pour suivre les conversions
  (appels et formulaires).
- Ajouter des avis Google réels via l'API Google Places une fois la fiche
  d'entreprise créée.
