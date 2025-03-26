function genererEtoilesHTML(nbEtoiles) {
    let etoiles = "";
    for (let i = 0; i < 5; i++) {
        if (i < nbEtoiles) {
            etoiles += `<span class="etoile pleine">★</span>`;
        } else {
            etoiles += `<span class="etoile vide">☆</span>`;
        }
    }
    return etoiles;
}

export async function afficherAvis(idPiece, pieceElement) {
    try {
        const response = await fetch("https://api-pieces-autos.onrender.com/avis");
        const tousLesAvis = await response.json();
        const avisFiltres = tousLesAvis.filter(avis => avis.pieceId === parseInt(idPiece));

        const avisSection = document.createElement("div");
        avisSection.classList.add("avis-section");

        avisFiltres.forEach(avis => {
            const etoilesHTML = genererEtoilesHTML(avis.nbEtoiles);
            const avisElement = document.createElement("p");
            avisElement.innerHTML = `<strong>${avis.utilisateur}</strong> : ${avis.commentaire} ${etoilesHTML}`;
            avisSection.appendChild(avisElement);
        });

        // Supprimer les avis existants avant d'ajouter les nouveaux
        const ancienneSection = pieceElement.querySelector(".avis-section");
        if (ancienneSection) ancienneSection.remove();

        pieceElement.appendChild(avisSection);
    } catch (error) {
        console.error("Erreur lors de la récupération des avis :", error);
    }
}


export function ajoutListenersAvis() {
    const boutonsAvis = document.querySelectorAll(".fiches article button[data-id]");
    boutonsAvis.forEach(button => {
        button.addEventListener("click", async () => {
            const idPiece = button.dataset.id;
            const pieceElement = button.closest("article");
            await afficherAvis(idPiece, pieceElement);
        });
    });
}

// Fonction pour ajouter un avis via le formulaire
export function ajoutListenerEnvoyerAvis() {
    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", async function (event) {
        event.preventDefault();

        const avis = {
            pieceId: parseInt(formulaireAvis.querySelector("[name=piece-id]").value),
            utilisateur: formulaireAvis.querySelector("[name=utilisateur]").value,
            commentaire: formulaireAvis.querySelector("[name=commentaire]").value,
            nbEtoiles: parseInt(formulaireAvis.querySelector("[name=nbEtoiles]").value),
        };

        try {
            const response = await fetch("https://api-pieces-autos.onrender.com/avis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(avis),
            });

            if (response.ok) {
                alert("Avis ajouté avec succès !");
                formulaireAvis.reset();
            } else {
                throw new Error("Erreur lors de l'ajout de l'avis.");
            }
        } catch (error) {
            alert(error.message);
        }
    });
}

// Fonction pour afficher le graphique des avis
export async function afficherGraphiqueAvis() {
    const avis = await fetch("http://localhost:8081/avis").then(response => response.json());
    const labels = ["1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"];
    const nbCommentaires = [0, 0, 0, 0, 0];

    avis.forEach(a => {
        nbCommentaires[a.nbEtoiles - 1]++;
    });

    const data = {
        labels: labels,
        datasets: [{
            label: "Répartition des avis",
            data: nbCommentaires,
            backgroundColor: "rgba(255, 206, 86, 0.8)",
        }]
    };

    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "y",
        }
    };

    const ctx = document.querySelector("#graphique-avis").getContext("2d");
    new Chart(ctx, config);
}


