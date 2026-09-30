document.querySelector('.menu-btn').addEventListener('click', () => {
  document.querySelector('.site-header nav').classList.toggle('open');
});
document.querySelectorAll('.site-header nav a').forEach(link => {
  link.addEventListener('click', () => document.querySelector('.site-header nav').classList.remove('open'));
});
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================
   GALERIE PHOTO
========================= */

const photos = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
  "images/photo5.jpg",
  "images/photo6.jpg",
  "images/photo7.jpg",
  "images/photo8.png",
  "images/photo9.jpg",
  "images/photo10.jpg",
  "images/photo11.jpg",
  "images/photo12.jpg",
  "images/photo13.jpg",
  "images/photo14.jpg",
  "images/photo15.jpg"
];


let photoActuelle = 0;


/* =========================
   OUVRIR LA GALERIE
========================= */

function ouvrirGalerie(index) {

  photoActuelle = index;

  document.getElementById("photoGrande").src =
    photos[photoActuelle];

  document.getElementById("visionneuse")
    .classList.add("active");

  // Empêche le défilement de la page derrière la photo
  document.body.style.overflow = "hidden";
}


/* =========================
   FERMER LA GALERIE
========================= */

function fermerGalerie() {

  document.getElementById("visionneuse")
    .classList.remove("active");

  document.body.style.overflow = "";
}


/* =========================
   PHOTO SUIVANTE
========================= */

function photoSuivante() {

  photoActuelle++;

  // Retour à la première photo
  if (photoActuelle >= photos.length) {
    photoActuelle = 0;
  }

  document.getElementById("photoGrande").src =
    photos[photoActuelle];
}


/* =========================
   PHOTO PRECEDENTE
========================= */

function photoPrecedente() {

  photoActuelle--;

  // Retour à la dernière photo
  if (photoActuelle < 0) {
    photoActuelle = photos.length - 1;
  }

  document.getElementById("photoGrande").src =
    photos[photoActuelle];
}


/* =========================
   NAVIGATION AU CLAVIER
========================= */

document.addEventListener("keydown", function(event) {

  const visionneuse =
    document.getElementById("visionneuse");

  // On ne fait rien si la galerie est fermée
  if (!visionneuse.classList.contains("active")) {
    return;
  }

  // Échap = fermer
  if (event.key === "Escape") {
    fermerGalerie();
  }

  // Flèche droite = suivante
  if (event.key === "ArrowRight") {
    photoSuivante();
  }

  // Flèche gauche = précédente
  if (event.key === "ArrowLeft") {
    photoPrecedente();
  }

});


/* =========================
   CLIC SUR LE FOND NOIR
========================= */

document.getElementById("visionneuse")
  .addEventListener("click", function(event) {

    // Ferme uniquement si on clique sur le fond
    // et pas sur la photo ou les boutons
    if (event.target === this) {
      fermerGalerie();
    }

  });


/* =========================
   NAVIGATION PAR SWIPE
   POUR SMARTPHONE
========================= */

let touchStartX = 0;
let touchEndX = 0;

const visionneuse =
  document.getElementById("visionneuse");


visionneuse.addEventListener("touchstart", function(event) {

  touchStartX =
    event.changedTouches[0].screenX;

});


visionneuse.addEventListener("touchend", function(event) {

  touchEndX =
    event.changedTouches[0].screenX;

  const distance =
    touchEndX - touchStartX;

  // On considère qu'il s'agit d'un swipe
  // au-delà de 50 pixels
  if (Math.abs(distance) > 50) {

    if (distance < 0) {

      // Swipe vers la gauche
      photoSuivante();

    } else {

      // Swipe vers la droite
      photoPrecedente();

    }

  }

});