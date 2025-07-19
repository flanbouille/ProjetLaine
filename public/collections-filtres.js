// Ajouter dans le <script> déjà présent, après les autres sélecteurs :
const filtreNouveaute = document.getElementById('filtre-nouveaute');
const filtrePersonnalisable = document.getElementById('filtre-personnalisable');
const triSelect = document.getElementById('tri-produits');

// Exemples de données produits à stocker en data-* sur les cartes (à adapter à ton back) :
// data-prix, data-nouveaute, data-personnalisable, data-populaire, etc.

// Exemples sur .card-prod :
    // <div class="card-prod" data-cat="peluches" data-prix="29.99" data-nouveaute="true" data-personnalisable="false" data-populaire="3">
// Les valeurs doivent correspondre à tes produits !

function filtrerEtTrierProduits() {
  let cardsArray = Array.from(document.querySelectorAll('.card-prod'));

  // Filtres
  if (filtreNouveaute.checked) {
    cardsArray = cardsArray.filter(card => card.dataset.nouveaute === "true");
  }
  if (filtrePersonnalisable.checked) {
    cardsArray = cardsArray.filter(card => card.dataset.personnalisable === "true");
  }

  // Tri
  const tri = triSelect.value;
  if (tri === "prix-asc") {
    cardsArray.sort((a, b) => parseFloat(a.dataset.prix) - parseFloat(b.dataset.prix));
  } else if (tri === "prix-desc") {
    cardsArray.sort((a, b) => parseFloat(b.dataset.prix) - parseFloat(a.dataset.prix));
  } else if (tri === "nouveaute") {
    cardsArray.sort((a, b) => (b.dataset.nouveaute === "true") - (a.dataset.nouveaute === "true"));
  } else if (tri === "populaire") {
    // Suppose que data-populaire = nombre de likes ou ventes
    cardsArray.sort((a, b) => parseInt(b.dataset.populaire || 0) - parseInt(a.dataset.populaire || 0));
  }
  // Sinon, laisse l'ordre d'origine

  // Affichage :
  const conteneur = document.getElementById('collection-cards');
  // Cache tout par défaut
  document.querySelectorAll('.card-prod').forEach(card => card.style.display = "none");
  // Puis affiche dans l'ordre les cards filtrées/triées
  cardsArray.forEach(card => {
    card.style.display = "flex";
    conteneur.appendChild(card);
  });
}

// Écouteurs
filtreNouveaute.addEventListener('change', filtrerEtTrierProduits);
filtrePersonnalisable.addEventListener('change', filtrerEtTrierProduits);
triSelect.addEventListener('change', filtrerEtTrierProduits);

// Appel initial (optionnel, pour tri/filtres par défaut)
filtrerEtTrierProduits();