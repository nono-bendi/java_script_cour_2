import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis } from "./avis.js";

// Autres parties de votre fichier

ajoutListenersAvis();


let pieces = [];

// Récupération des pièces via l'API
async function recupererPieces() {
    const response = await fetch("https://api-pieces-autos.onrender.com/pieces");
    pieces = await response.json();
    genererPieces(pieces);
    await afficherGraphiqueAvis(); // Affiche le graphique initialement
}


// Génération des pièces dans le DOM
function genererPieces(pieces) {
    const sectionFiches = document.querySelector(".fiches");
    sectionFiches.innerHTML = ""; // Vider la section avant de la remplir

    pieces.forEach(piece => {
        const pieceElement = document.createElement("article");

        const imageElement = document.createElement("img");
        imageElement.src = piece.image;

        const nomElement = document.createElement("h2");
        nomElement.textContent = piece.nom;

        const prixElement = document.createElement("p");
        prixElement.textContent = `Prix : ${piece.prix} €`;

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = piece.description ?? "Pas de description.";

        const stockElement = document.createElement("p");
        stockElement.textContent = piece.disponibilite ? "En stock" : "Rupture de stock";

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = piece.id;
        avisBouton.textContent = "Afficher les avis";

        pieceElement.append(imageElement, nomElement, prixElement, descriptionElement, stockElement, avisBouton);
        sectionFiches.appendChild(pieceElement);
    });

    ajoutListenersAvis(); // Réactiver les boutons d'avis après chaque modification
}

// Gestion des boutons
function ajouterEcouteursBoutons() {
    const boutonTrier = document.querySelector(".btn-trier");
    const boutonTrierDecroissant = document.querySelector(".btn-decroissant");
    const boutonFiltrer = document.querySelector(".btn-filtrer");
    const boutonNoDescription = document.querySelector(".btn-nodesc");
    const rangePrix = document.querySelector("#prix-max");

    // Tri croissant
    boutonTrier.addEventListener("click", function () {
        const piecesTriees = [...pieces].sort((a, b) => a.prix - b.prix);
        genererPieces(piecesTriees);
    });

    // Tri décroissant
    boutonTrierDecroissant.addEventListener("click", function () {
        const piecesTriees = [...pieces].sort((a, b) => b.prix - a.prix);
        genererPieces(piecesTriees);
    });

    // Filtrer les pièces non abordables
    boutonFiltrer.addEventListener("click", function () {
        const piecesFiltrees = pieces.filter(piece => piece.prix > 35);
        genererPieces(piecesFiltrees);
    });

    // Filtrer les pièces sans description
    boutonNoDescription.addEventListener("click", function () {
        const piecesFiltrees = pieces.filter(piece => !piece.description);
        genererPieces(piecesFiltrees);
    });

    // Filtre par prix avec range
    rangePrix.addEventListener("input", function () {
        const maxPrix = rangePrix.value;
        const piecesFiltrees = pieces.filter(piece => piece.prix <= maxPrix);
        genererPieces(piecesFiltrees);
    });
}

// Initialisation
await recupererPieces();
ajouterEcouteursBoutons();
ajoutListenerEnvoyerAvis();
