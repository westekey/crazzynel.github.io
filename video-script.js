document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.video-player');
    
    videos.forEach((video, index) => {
        const wrapper = video.parentElement;
        
        // Créer l'overlay avec le bouton play
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        const playBtn = document.createElement('div');
        playBtn.className = 'play-btn';
        playBtn.innerHTML = '▶';
        overlay.appendChild(playBtn);
        wrapper.appendChild(overlay);

        // Créer le bouton plein écran
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = 'Plein écran';
        wrapper.appendChild(fullscreenBtn);

        // Animation d'entrée avec délai
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(50px) rotateX(-10deg)';
        setTimeout(() => {
            wrapper.style.transition = 'all 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0) rotateX(0)';
        }, index * 300);

        // Gestion des événements
        playBtn.addEventListener('click', () => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        // Ajouter l'événement de clic pour le plein écran
        fullscreenBtn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
        });

        // Mouvement automatique des vidéos dans la section
        let position = 0;
        const speed = 1; // Ajustez cette valeur pour changer la vitesse
        const maxDistance = window.innerWidth * 0.05; // 5% de la largeur de la fenêtre
        function moveVideos() {
            position += speed;
            if (position >= maxDistance) {
                position = -maxDistance; // Réinitialiser la position vers la gauche
            }
            wrapper.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(moveVideos);
        }
        moveVideos(); // Démarre le mouvement automatique
    });
});