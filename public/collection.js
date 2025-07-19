document.addEventListener('DOMContentLoaded', function() {

// === 1. BADGES (promo, nouveau, limite, etc) ===
document.querySelectorAll('.card-prod').forEach(card => {
  const badgeType = card.dataset.badge;
  if (badgeType && !card.querySelector('.card-badge')) {
    const badge = document.createElement('div');
    badge.className = 'card-badge ' + badgeType;
    if (badgeType === "nouveau") badge.textContent = "Nouveau";
    else if (badgeType === "promo") badge.textContent = "Promo";
    else if (badgeType === "limite") badge.textContent = "Édition limitée";
    else badge.textContent = badgeType.charAt(0).toUpperCase() + badgeType.slice(1);
    card.prepend(badge);
  }
  if (card.dataset.nouveaute === "true" && !card.querySelector('.card-badge.nouveau')) {
    const badge = document.createElement('div');
    badge.className = 'card-badge nouveau';
    badge.textContent = 'Nouveau';
    card.prepend(badge);
  }
});

// === 2. PRIX (prix promo + prix barré si promo) ===
document.querySelectorAll('.card-prod').forEach(card => {
  const prixPromo = card.dataset.prix;
  const prixAvant = card.dataset.prixAvant;
  const prixDiv = card.querySelector('.card-prix');
  if (prixAvant && card.dataset.badge === "promo") {
    prixDiv.innerHTML =
      `<span class="prix-barre">${Number(prixAvant).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
       <span class="prix-promo">${Number(prixPromo).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>`;
  } else if (prixPromo && prixDiv) {
    prixDiv.textContent = Number(prixPromo).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
});

// === 3. FAVORIS ===
const favCount = document.getElementById('fav-count');
function updateFavCount() {
  favCount.textContent = document.querySelectorAll('.btn-favori.favori').length;
}
document.querySelectorAll('.btn-favori').forEach(btn => {
  btn.addEventListener('click', function() {
    btn.classList.toggle('favori');
    updateFavCount();
    const favBtn = document.getElementById('cat-favoris');
    if (favBtn && favBtn.classList.contains('active')) favBtn.click();
  });
});
updateFavCount();

// === 4. DESCRIPTIONS DE CATÉGORIE ===
const descriptions = {
  'tous': "Chaque collection est pensée pour apporter douceur, originalité et réconfort. Explorez notre univers et trouvez la création qui vous correspond !",
  'peluches': "Nos peluches sont confectionnées en laine ultra douce pour offrir tendresse et réconfort aux petits comme aux grands rêveurs. Laissez-vous séduire par leur douceur unique !",
  'loisirs': "Découvrez un univers créatif et ludique autour de la laine : activités, kits et accessoires pour partager des moments de détente et d’imagination en famille ou entre amis.",
  'plaids': "Nos plaids en laine invitent à la douceur et aux instants cocooning : parfaits pour s’envelopper de chaleur et d’amour lors de vos moments de détente à la maison.",
  'naissance': "Pour célébrer les premiers instants de vie, nos créations en laine apportent douceur, délicatesse et personnalisation à chaque cadeau de naissance, pour des souvenirs inoubliables.",
  'favoris': "Retrouvez ici toutes vos créations coup de cœur, sélectionnées avec amour parmi nos collections en laine."
};
const descElem = document.getElementById('categorie-description');
function getDescKey(cat) {
  if (!cat) return 'tous';
  if (cat === 'favoris') return 'favoris';
  if (cat === 'tous') return 'tous';
  if (cat.startsWith('peluche')) return 'peluches';
  if (cat.startsWith('loisir')) return 'loisirs';
  if (cat.startsWith('plaid')) return 'plaids';
  if (cat.startsWith('naissance')) return 'naissance';
  return 'tous';
}

// === 5. CATÉGORIES & AFFICHAGE ===
const catBtns = document.querySelectorAll('.cat-btn');
const cards = document.querySelectorAll('.card-prod');
catBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    catBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    let i = 0;
    cards.forEach(card => {
      const heart = card.querySelector('.btn-favori');
      if (cat === 'favoris') {
        if (heart && heart.classList.contains('favori')) {
          card.style.display = "flex";
          card.style.animationDelay = (i*0.07) + "s";
          card.classList.remove('fadeout');
          card.classList.add('fadein');
          i++;
        } else {
          card.classList.add('fadeout');
          setTimeout(() => { card.style.display = "none"; }, 300);
        }
      } else if (cat === 'tous' || card.dataset.cat === cat) {
        card.style.display = "flex";
        card.style.animationDelay = (i*0.07) + "s";
        card.classList.remove('fadeout');
        card.classList.add('fadein');
        i++;
      } else {
        card.classList.add('fadeout');
        setTimeout(() => { card.style.display = "none"; }, 300);
      }
    });
    if(descElem) descElem.textContent = descriptions[getDescKey(cat)] || descriptions['tous'];
  });
});

// === 6. FILTRES & TRI ===
const filtreNouveaute = document.getElementById('filtre-nouveaute');
const triSelect = document.getElementById('tri-produits');
function filtrerEtTrierProduits() {
  let cardsArray = Array.from(document.querySelectorAll('.card-prod'));
  if (filtreNouveaute.checked) {
    cardsArray = cardsArray.filter(card => card.dataset.nouveaute === "true");
  }
  const tri = triSelect.value;
  if (tri === "prix-asc") {
    cardsArray.sort((a, b) => parseFloat(a.dataset.prix) - parseFloat(b.dataset.prix));
  } else if (tri === "prix-desc") {
    cardsArray.sort((a, b) => parseFloat(b.dataset.prix) - parseFloat(a.dataset.prix));
  } else if (tri === "nouveaute") {
    cardsArray.sort((a, b) => (b.dataset.nouveaute === "true") - (a.dataset.nouveaute === "true"));
  } else if (tri === "populaire") {
    cardsArray.sort((a, b) => parseInt(b.dataset.populaire || 0) - parseInt(a.dataset.populaire || 0));
  }
  const conteneur = document.getElementById('collection-cards');
  document.querySelectorAll('.card-prod').forEach(card => card.style.display = "none");
  cardsArray.forEach(card => {
    card.style.display = "flex";
    conteneur.appendChild(card);
  });
}
filtreNouveaute.addEventListener('change', filtrerEtTrierProduits);
triSelect.addEventListener('change', filtrerEtTrierProduits);
filtrerEtTrierProduits();

// === 7. PANIER partagé accueil/collections ===
let panier = JSON.parse(localStorage.getItem('panier') || '[]');
function majBadgePanier() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = panier.length;
        badge.style.display = panier.length > 0 ? 'flex' : 'none';
    }
}

function ajouterAuPanier(nom, id, img) {
    panier.push({ id, nom, img }); // Ajoute img ici !
    localStorage.setItem('panier', JSON.stringify(panier));
    majBadgePanier();
}

// === MODIFIE CETTE PARTIE ===
document.querySelectorAll('.card-prod .btn-acheter').forEach((btn, idx) => {
    btn.addEventListener('click', function(event) {
        event.preventDefault();
        const card = this.closest('.card-prod');
        const nom = card.querySelector('.card-nom').textContent.trim();
        const id = card.dataset.id || nom.replace(/\s+/g, '-').toLowerCase() + '-' + idx;
        // Récupère l'image du produit
        const img = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : "";
        ajouterAuPanier(nom, id, img); // Passe img ici !
    });
});
majBadgePanier();
});