// ===============================
// PARAMÈTRES DU CALENDRIER
// ===============================

const donnees = {
    // Dates réservées : YYYY-MM-DD
    blocked: [
        // "2026-10-03",
        // "2026-10-04",
        // "2026-10-05"
    ],

    // Prix par mois
    tarifs: {
        "2026-01": 90,
        "2026-02": 90,
        "2026-03": 90,
        "2026-04": 90,
        "2026-05": 100,
        "2026-06": 100,
        "2026-07": 120,
        "2026-08": 120,
        "2026-09": 100,
        "2026-10": 90,
        "2026-11": 90,
        "2026-12": 100
    },

    frais_menage: 60,
    devise: "€"
};


// ===============================
// VARIABLES
// ===============================

let moisCourant = new Date();
moisCourant.setDate(1);

let dateDebut = null;
let dateFin = null;


// ===============================
// ÉLÉMENTS HTML
// ===============================

const calendrier = document.getElementById("calendrier");
const titreMois = document.getElementById("mois-annee");
const messageErreur = document.getElementById("message-erreur");
const selection = document.getElementById("selection");


// ===============================
// OUTILS DATES
// ===============================

function pad(n) {
    return String(n).padStart(2, "0");
}

function dateISO(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function depuisISO(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function formatDate(iso) {
    return depuisISO(iso).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}


// ===============================
// PRIX
// ===============================

function prixPour(date) {

    const cle =
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

    return donnees.tarifs[cle] ?? null;
}


// ===============================
// RÉSERVATIONS
// ===============================

function estReservee(iso) {
    return donnees.blocked.includes(iso);
}


// ===============================
// SÉLECTION
// ===============================

function intervalleContient(iso) {

    if (!dateDebut) return false;

    if (!dateFin) {
        return iso === dateDebut;
    }

    return iso >= dateDebut && iso <= dateFin;
}


// ===============================
// CALCUL NUITS
// ===============================

function calculNuits(debut, fin) {

    const a = depuisISO(debut);
    const b = depuisISO(fin);

    return Math.round((b - a) / 86400000);
}


// ===============================
// VÉRIFICATION DISPONIBILITÉ
// ===============================

function intervalleLibre(debut, fin) {

    let d = depuisISO(debut);
    const end = depuisISO(fin);

    while (d < end) {

        if (estReservee(dateISO(d))) {
            return false;
        }

        d.setDate(d.getDate() + 1);
    }

    return true;
}


// ===============================
// CALCUL TOTAL
// ===============================

function calculTotal(debut, fin) {

    let total = 0;

    let d = depuisISO(debut);
    const end = depuisISO(fin);

    while (d < end) {

        const prix = prixPour(d);

        if (prix === null) {
            return null;
        }

        total += Number(prix);

        d.setDate(d.getDate() + 1);
    }

    return total + Number(donnees.frais_menage || 0);
}


// ===============================
// AFFICHAGE DU CALENDRIER
// ===============================

function afficherCalendrier() {

    if (!calendrier) {
        console.error("Élément #calendrier introuvable.");
        return;
    }

    calendrier.innerHTML = "";

    const y = moisCourant.getFullYear();
    const m = moisCourant.getMonth();

    if (titreMois) {
        titreMois.textContent =
            moisCourant.toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric"
            });
    }


    // Premier jour du mois
    const premierJour = new Date(y, m, 1).getDay();

    // Conversion dimanche = 0 → lundi = 0
    const decalage = (premierJour + 6) % 7;

    // Nombre de jours dans le mois
    const nbJours = new Date(y, m + 1, 0).getDate();


    // Cases vides avant le 1er
    for (let i = 0; i < decalage; i++) {

        const vide = document.createElement("div");

        vide.className = "case-jour vide";

        calendrier.appendChild(vide);
    }


    // Jours du mois
    for (let jour = 1; jour <= nbJours; jour++) {

        const date = new Date(y, m, jour);

        const iso = dateISO(date);

        const reservee = estReservee(iso);

        const prix = prixPour(date);


        const cellule = document.createElement("div");

        cellule.className = "case-jour";


        // Réservation
        if (reservee) {
            cellule.classList.add("reserve");
        }


        // Sélection
        if (intervalleContient(iso)) {

            if (iso === dateDebut) {
                cellule.classList.add("selection-debut");

            } else if (iso === dateFin) {
                cellule.classList.add("selection-fin");

            } else {
                cellule.classList.add("selection-dans");
            }
        }


        // Contenu
        cellule.innerHTML = `
            <span class="numero">${jour}</span>

            <span class="prix">
                ${
                    reservee
                    ? "Réservé"
                    : prix !== null
                        ? `${prix} ${donnees.devise}`
                        : "—"
                }
            </span>
        `;


        // Cliquable si disponible
        if (!reservee) {

            cellule.addEventListener("click", () => {
                choisirDate(iso);
            });
        }


        calendrier.appendChild(cellule);
    }
}


// ===============================
// CHOIX D'UNE DATE
// ===============================

function choisirDate(iso) {

    // Nouvelle sélection
    if (!dateDebut || dateFin) {

        dateDebut = iso;
        dateFin = null;

        afficherSelection();
        afficherCalendrier();

        return;
    }


    // Nouvelle date avant l'arrivée
    if (iso === dateDebut || iso < dateDebut) {

        dateDebut = iso;
        dateFin = null;

        afficherSelection();
        afficherCalendrier();

        return;
    }


    // Vérification des réservations
    if (!intervalleLibre(dateDebut, iso)) {

        alert(
            "Cette période contient au moins une date déjà réservée."
        );

        return;
    }


    // Départ
    dateFin = iso;

    afficherSelection();
    afficherCalendrier();
}


// ===============================
// AFFICHAGE DE LA SÉLECTION
// ===============================

function afficherSelection() {

    if (!selection) return;


    if (!dateDebut) {

        selection.hidden = true;

        return;
    }


    selection.hidden = false;


    const dates =
        document.getElementById("dates-selection");

    const details =
        document.getElementById("details-selection");

    const total =
        document.getElementById("total-selection");


    if (!dateFin) {

        dates.textContent =
            "Choisissez votre date de départ";

        details.textContent =
            `Arrivée : ${formatDate(dateDebut)}`;

        total.textContent = "";

        return;
    }


    const nuits =
        calculNuits(dateDebut, dateFin);

    const montant =
        calculTotal(dateDebut, dateFin);


    dates.textContent =
        `${formatDate(dateDebut)} → ${formatDate(dateFin)}`;


    details.textContent =
        `${nuits} nuit${nuits > 1 ? "s" : ""} · ménage inclus`;


    total.textContent =
        montant === null
            ? "Tarif à confirmer"
            : `${montant.toFixed(0)} ${donnees.devise}`;
}


// ===============================
// BOUTON MOIS PRÉCÉDENT
// ===============================

const boutonPrecedent =
    document.getElementById("precedent");

if (boutonPrecedent) {

    boutonPrecedent.addEventListener("click", () => {

        moisCourant.setMonth(
            moisCourant.getMonth() - 1
        );

        afficherCalendrier();
    });
}


// ===============================
// BOUTON MOIS SUIVANT
// ===============================

const boutonSuivant =
    document.getElementById("suivant");

if (boutonSuivant) {

    boutonSuivant.addEventListener("click", () => {

        moisCourant.setMonth(
            moisCourant.getMonth() + 1
        );

        afficherCalendrier();
    });
}


// ===============================
// BOUTON RESET
// ===============================

const boutonReset =
    document.getElementById("reset-selection");

if (boutonReset) {

    boutonReset.addEventListener("click", () => {

        dateDebut = null;
        dateFin = null;

        afficherSelection();
        afficherCalendrier();
    });
}


// ===============================
// DÉMARRAGE
// ===============================

afficherCalendrier();
afficherSelection();