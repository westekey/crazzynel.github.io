document.addEventListener('DOMContentLoaded', () => {
    const countdownDate = new Date('March 22, 2025 10:00:00').getTime();
    const endDate = new Date('March 22, 2025 18:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        // Si l'événement est terminé
        if (now > endDate) {
            document.getElementById('countdown').innerHTML = '<h3>L\'événement est terminé</h3>';
            return;
        }

        // Si l'événement est en cours
        if (distance < 0 && now < endDate) {
            document.getElementById('countdown').innerHTML = '<h3>L\'événement est en cours !</h3>';
            return;
        }

        // Calcul du temps restant
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Mise à jour de l'affichage
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Mise à jour toutes les secondes
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Première mise à jour immédiate
});
