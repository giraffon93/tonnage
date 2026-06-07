// Version globale
const APP_VERSION = "1.2.9.3";

// Affichage version dans toutes les pages
window.addEventListener("DOMContentLoaded", () => {
    const v = document.getElementById("app-version");
    if (v) v.textContent = APP_VERSION;
});

// Fonction mise à jour PWA
function updateApp(){
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) {
                reg.update();
                alert("Mise à jour demandée.\nRouvrez l’app dans 2 secondes.");
            }
        });
    }
}

// Auto‑reload après mise à jour
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
        location.reload();
    });
}
