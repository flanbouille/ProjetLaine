document.addEventListener('DOMContentLoaded', function() {
    function afficherPanier() {
        const panier = JSON.parse(localStorage.getItem('panier') || '[]');
        const liste = document.getElementById('panier-list');
        liste.innerHTML = '';
        if (panier.length === 0) {
            liste.innerHTML = '<li>Votre panier est vide.</li>';
            return;
        }
        panier.forEach(item => {
            const li = document.createElement('li');
            const nomDiv = document.createElement('span');
            nomDiv.className = 'nom-produit-panier';
            if(item.img) {
                const img = document.createElement('img');
                img.className = "image-produit";
                img.src = item.img;
                img.alt = item.nom;
                nomDiv.appendChild(img);
            }
            const nomTxt = document.createElement('span');
            nomTxt.textContent = item.nom;
            nomDiv.appendChild(nomTxt);
            li.appendChild(nomDiv);
            liste.appendChild(li);
        });
    }
    afficherPanier();
});