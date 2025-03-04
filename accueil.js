document.addEventListener('DOMContentLoaded', () => {
    // Classe pour gérer les jeux mathématiques
    class MathGame {
        constructor(type) {
            this.type = type;
            this.score = 0;
            this.isPlaying = false;
            this.currentQuestion = null;
            this.timer = null;
            this.setupGame();
        }

        setupGame() {
            const startButton = document.getElementById(`${this.type}-start`);
            const restartButton = document.getElementById(`${this.type}-restart`);
            const input = document.getElementById(`${this.type}-answer`);
            const submitButton = document.getElementById(`${this.type}-submit`);

            if (!startButton || !input) return;

            startButton.addEventListener('click', () => this.startGame());
            restartButton?.addEventListener('click', () => this.resetGame());

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.isPlaying) {
                    this.checkAnswer();
                }
            });

            // Ajout de l'écouteur pour le bouton de soumission
            if (submitButton) {
                submitButton.addEventListener('click', () => {
                    if (this.isPlaying) {
                        this.checkAnswer();
                    }
                });
            }
        }

        startGame() {
            if (this.isPlaying) return;
            
            this.isPlaying = true;
            this.score = 0;
            
            const input = document.getElementById(`${this.type}-answer`);
            const scoreDisplay = document.getElementById(`${this.type}-score`);
            
            input.disabled = false;
            input.value = '';
            input.focus();
            scoreDisplay.textContent = '0';
            
            this.startTimer();
            this.generateQuestion();
        }

        resetGame() {
            this.isPlaying = false;
            this.score = 0;
            if (this.timer) clearInterval(this.timer);

            const elements = {
                input: document.getElementById(`${this.type}-answer`),
                score: document.getElementById(`${this.type}-score`),
                timer: document.getElementById(`${this.type}-timer`),
                start: document.getElementById(`${this.type}-start`),
                restart: document.getElementById(`${this.type}-restart`)
            };

            elements.input.disabled = true;
            elements.input.value = '';
            elements.score.textContent = '0';
            elements.timer.textContent = this.getGameTime();
            elements.start.style.display = 'block';
            elements.restart.style.display = 'none';

            if (this.type === 'mental') {
                document.getElementById('mental-question').textContent = 'Appuyez sur Démarrer';
            } else if (this.type === 'sequence') {
                document.getElementById('sequence-numbers').textContent = 'Appuyez sur Démarrer';
            } else if (this.type === 'geometry') {
                document.getElementById('geometry-question').textContent = 'Appuyez sur Démarrer';
                this.clearCanvas();
            }
        }

        startTimer() {
            const timerDisplay = document.getElementById(`${this.type}-timer`);
            const startBtn = document.getElementById(`${this.type}-start`);
            const restartBtn = document.getElementById(`${this.type}-restart`);
            let timeLeft = this.getGameTime();

            if (startBtn && restartBtn) {
                startBtn.style.display = 'none';
                restartBtn.style.display = 'block';
            }

            if (this.timer) clearInterval(this.timer);
            
            this.timer = setInterval(() => {
                timeLeft--;
                if (timerDisplay) timerDisplay.textContent = timeLeft;
                if (timeLeft <= 0) {
                    this.endGame();
                }
            }, 1000);
        }

        getGameTime() {
            return this.type === 'mental' ? 30 : 120;
        }

        endGame() {
            this.isPlaying = false;
            clearInterval(this.timer);
            const input = document.getElementById(`${this.type}-answer`);
            if (input) input.disabled = true;
            alert(`Jeu terminé ! Votre score : ${this.score}`);
        }

        generateQuestion() {
            switch (this.type) {
                case 'mental':
                    this.generateMentalMathQuestion();
                    break;
                case 'sequence':
                    this.generateSequence();
                    break;
                case 'geometry':
                    this.generateGeometryQuestion();
                    break;
            }
        }

        checkAnswer() {
            switch (this.type) {
                case 'mental':
                    this.checkMentalMathAnswer();
                    break;
                case 'sequence':
                    this.checkSequenceAnswer();
                    break;
                case 'geometry':
                    this.checkGeometryAnswer();
                    break;
            }
        }

        generateMentalMathQuestion() {
            // Générer des calculs simples d'addition et de multiplication
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            const operators = ['+', '×'];
            const operator = operators[Math.floor(Math.random() * operators.length)];

            let question, answer;
            if (operator === '+') {
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
            } else {
                question = `${num1} × ${num2}`;
                answer = num1 * num2;
            }

            // Mettre à jour l'affichage de la question
            const questionDisplay = document.getElementById('mental-question');
            if (questionDisplay) {
                questionDisplay.textContent = question;
            }

            // Stocker la réponse pour vérification
            this.currentQuestion = {
                question: question,
                answer: answer
            };
        }

        checkMentalMathAnswer() {
            const input = document.getElementById('mental-answer');
            const scoreDisplay = document.getElementById('mental-score');
            const userAnswer = parseInt(input.value);

            if (userAnswer === this.currentQuestion.answer) {
                this.score += 10;
                if (scoreDisplay) scoreDisplay.textContent = this.score;
                input.style.borderColor = '#00ff00';
            } else {
                input.style.borderColor = '#ff0000';
            }

            // Générer une nouvelle question
            setTimeout(() => {
                input.style.borderColor = '';
                input.value = '';
                this.generateMentalMathQuestion();
            }, 1000);
        }

        // Suite Logique
        generateSequence() {
            // Définition des types de suites avec leurs règles mathématiques
            const suiteTypes = [
                {
                    name: 'arithmétique',
                    generator: (start, raison) => {
                        return {
                            sequence: Array.from({length: 4}, (_, i) => start + i * raison),
                            next: start + 4 * raison,
                            description: `Suite arithmétique de premier terme ${start} et de raison ${raison}`
                        };
                    }
                },
                {
                    name: 'géométrique',
                    generator: (start, raison) => {
                        return {
                            sequence: Array.from({length: 4}, (_, i) => start * Math.pow(raison, i)),
                            next: start * Math.pow(raison, 4),
                            description: `Suite géométrique de premier terme ${start} et de raison ${raison}`
                        };
                    }
                }
            ];

            // Sélection aléatoire du type de suite
            const selectedType = suiteTypes[Math.floor(Math.random() * suiteTypes.length)];
            
            // Génération des paramètres selon le type
            let start, raison;
            if (selectedType.name === 'arithmétique') {
                start = Math.floor(Math.random() * 10) + 1; // Premier terme entre 1 et 10
                raison = Math.floor(Math.random() * 5) + 1; // Raison entre 1 et 5
            } else {
                start = Math.floor(Math.random() * 5) + 1; // Premier terme entre 1 et 5
                raison = Math.floor(Math.random() * 2) + 2; // Raison entre 2 et 3
            }

            // Génération de la suite
            const result = selectedType.generator(start, raison);
            this.currentQuestion = {
                sequence: result.sequence,
                next: result.next,
                description: result.description
            };

            // Affichage
            const display = document.getElementById('sequence-numbers');
            if (display) {
                display.innerHTML = `${result.description}<br>${result.sequence.join(', ')}, ?`;
            }
        }

        checkSequenceAnswer() {
            const input = document.getElementById('sequence-answer');
            const scoreDisplay = document.getElementById('sequence-score');
            const userAnswer = parseInt(input.value);

            if (userAnswer === this.currentQuestion.next) {
                this.score += 10;
                if (scoreDisplay) scoreDisplay.textContent = this.score;
                input.style.borderColor = '#00ff00';
                setTimeout(() => input.style.borderColor = '', 500);
            } else {
                input.style.borderColor = '#ff0000';
                setTimeout(() => input.style.borderColor = '', 500);
            }

            input.value = '';
            this.generateSequence();
        }

        // Géométrie
        generateGeometryQuestion() {
            const canvas = document.getElementById('geometry-canvas');
            if (!canvas) return;

            // Définir une taille fixe pour le canvas
            canvas.width = 400;  // Largeur fixe
            canvas.height = 300; // Hauteur fixe
            canvas.style.border = '1px solid #00a8ff';

            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Définir les marges pour s'assurer que les figures sont bien visibles
            const margin = 40; // Marge de 40px sur tous les côtés
            const drawingWidth = canvas.width - (2 * margin);
            const drawingHeight = canvas.height - (2 * margin);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.strokeStyle = '#00a8ff';
            ctx.fillStyle = '#00a8ff';
            ctx.lineWidth = 2;

            const shapes = [
                {
                    name: 'rectangle',
                    generator: () => {
                        const width = Math.floor(Math.random() * 6) + 5;  // Largeur entre 5 et 10 cm
                        const height = Math.floor(Math.random() * 6) + 5; // Hauteur entre 5 et 10 cm
                        
                        // Calculer l'échelle pour que la figure rentre dans le canvas
                        const scale = Math.min(
                            (drawingWidth) / (width * 20),
                            (drawingHeight) / (height * 20)
                        ) * 0.8; // 80% de la taille maximale pour avoir une marge

                        return {
                            dimensions: { width, height },
                            draw: () => {
                                const pixelWidth = width * 20 * scale;
                                const pixelHeight = height * 20 * scale;
                                
                                // Dessiner le rectangle
                                ctx.strokeRect(
                                    centerX - pixelWidth/2,
                                    centerY - pixelHeight/2,
                                    pixelWidth,
                                    pixelHeight
                                );

                                // Dessiner les dimensions
                                ctx.font = '16px Arial';
                                ctx.textAlign = 'center';
                                
                                // Largeur (en bas)
                                ctx.fillText(
                                    `${width} cm`,
                                    centerX,
                                    centerY + pixelHeight/2 + 25
                                );
                                
                                // Hauteur (à droite)
                                ctx.save();
                                ctx.translate(centerX + pixelWidth/2 + 25, centerY);
                                ctx.rotate(Math.PI/2);
                                ctx.fillText(`${height} cm`, 0, 0);
                                ctx.restore();
                            },
                            area: width * height,
                            formula: `Aire = largeur × hauteur = ${width} × ${height} = ${width * height} cm²`
                        };
                    }
                },
                {
                    name: 'triangle',
                    generator: () => {
                        const base = Math.floor(Math.random() * 6) + 5;   // Base entre 5 et 10 cm
                        const height = Math.floor(Math.random() * 6) + 5; // Hauteur entre 5 et 10 cm
                        
                        // Calculer l'échelle pour que la figure rentre dans le canvas
                        const scale = Math.min(
                            (drawingWidth) / (base * 20),
                            (drawingHeight) / (height * 20)
                        ) * 0.8;

                        return {
                            dimensions: { base, height },
                            draw: () => {
                                const pixelBase = base * 20 * scale;
                                const pixelHeight = height * 20 * scale;
                                
                                // Dessiner le triangle
                                ctx.beginPath();
                                ctx.moveTo(centerX - pixelBase/2, centerY + pixelHeight/2);
                                ctx.lineTo(centerX + pixelBase/2, centerY + pixelHeight/2);
                                ctx.lineTo(centerX, centerY - pixelHeight/2);
                                ctx.closePath();
                                ctx.stroke();

                                // Dessiner la hauteur (ligne pointillée)
                                ctx.setLineDash([5, 5]);
                                ctx.beginPath();
                                ctx.moveTo(centerX, centerY + pixelHeight/2);
                                ctx.lineTo(centerX, centerY - pixelHeight/2);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // Dessiner les dimensions
                                ctx.font = '16px Arial';
                                ctx.textAlign = 'center';
                                
                                // Base (en bas)
                                ctx.fillText(
                                    `${base} cm`,
                                    centerX,
                                    centerY + pixelHeight/2 + 25
                                );
                                
                                // Hauteur (à droite)
                                ctx.save();
                                ctx.translate(centerX + 25, centerY);
                                ctx.rotate(Math.PI/2);
                                ctx.fillText(`${height} cm`, 0, 0);
                                ctx.restore();
                            },
                            area: (base * height) / 2,
                            formula: `Aire = (base × hauteur) ÷ 2 = (${base} × ${height}) ÷ 2 = ${(base * height) / 2} cm²`
                        };
                    }
                },
                {
                    name: 'cercle',
                    generator: () => {
                        const radius = Math.floor(Math.random() * 4) + 3; // Rayon entre 3 et 6 cm
                        
                        // Calculer l'échelle pour que la figure rentre dans le canvas
                        const scale = Math.min(
                            drawingWidth / (radius * 40),
                            drawingHeight / (radius * 40)
                        ) * 0.8;

                        return {
                            dimensions: { radius },
                            draw: () => {
                                const pixelRadius = radius * 20 * scale;
                                
                                // Dessiner le cercle
                                ctx.beginPath();
                                ctx.arc(centerX, centerY, pixelRadius, 0, Math.PI * 2);
                                ctx.stroke();
                                
                                // Dessiner le rayon
                                ctx.beginPath();
                                ctx.moveTo(centerX, centerY);
                                ctx.lineTo(centerX + pixelRadius, centerY);
                                ctx.stroke();
                                
                                // Dessiner un petit arc pour indiquer l'angle droit
                                ctx.beginPath();
                                ctx.arc(centerX, centerY, 10, 0, Math.PI/2);
                                ctx.stroke();
                                
                                // Afficher le rayon
                                ctx.font = '16px Arial';
                                ctx.textAlign = 'center';
                                ctx.fillText(
                                    `${radius} cm`,
                                    centerX + pixelRadius/2,
                                    centerY - 10
                                );
                            },
                            area: Math.round(Math.PI * radius * radius * 100) / 100,
                            formula: `Aire = π × rayon² = π × ${radius}² ≈ ${Math.round(Math.PI * radius * radius * 100) / 100} cm²`
                        };
                    }
                }
            ];

            // Sélection et génération de la forme
            const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
            const shape = selectedShape.generator();
            
            // Dessin de la forme
            shape.draw();

            // Stockage des informations pour la vérification
            this.currentQuestion = {
                type: selectedShape.name,
                answer: shape.area,
                formula: shape.formula
            };

            // Mise à jour de l'affichage
            const questionDisplay = document.getElementById('geometry-question');
            if (questionDisplay) {
                questionDisplay.innerHTML = `Calculez l'aire de ce ${selectedShape.name} en cm².<br>
                    <small>Utilisez π ≈ 3.14 pour le cercle. Arrondissez à 2 décimales si nécessaire.</small>`;
            }
        }

        checkGeometryAnswer() {
            const input = document.getElementById('geometry-answer');
            const scoreDisplay = document.getElementById('geometry-score');
            const userAnswer = parseFloat(input.value);
            const tolerance = 0.1; // Tolérance de 0.1 cm² pour les arrondis

            const isCorrect = Math.abs(userAnswer - this.currentQuestion.answer) <= tolerance;

            if (isCorrect) {
                this.score += 10;
                if (scoreDisplay) scoreDisplay.textContent = this.score;
                input.style.borderColor = '#00ff00';
                
                // Afficher la formule utilisée
                document.getElementById('geometry-question').innerHTML += `<br><span style="color: #00ff00">Correct ! ${this.currentQuestion.formula}</span>`;
            } else {
                input.style.borderColor = '#ff0000';
                // Afficher la formule après une mauvaise réponse
                document.getElementById('geometry-question').innerHTML += `<br><span style="color: #ff0000">Incorrect. ${this.currentQuestion.formula}</span>`;
            }

            setTimeout(() => {
                input.style.borderColor = '';
                input.value = '';
                this.generateGeometryQuestion();
            }, 2000);
        }

        clearCanvas() {
            const canvas = document.getElementById('geometry-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    const scene = document.querySelector('.scene');
    const screensGroup = document.querySelector('.screens-group');
    const fragments = document.querySelectorAll('.screen-fragment');
    const soundToggle = document.getElementById('soundToggle');
    const shuffleBtn = document.getElementById('shuffle');
    let isMouseDown = false;
    let activeFragment = null;

    // Liste des vidéos disponibles
    const videoUrls = [
        'https://tube-action-educative.apps.education.fr/videos/watch/5c4e7d7f-4f8a-4f9e-9c0d-b7d7b0c1e9a1',
        'https://tube-action-educative.apps.education.fr/videos/watch/124d8990-d801-4013-8981-3eb076d221cd',
        'https://tube-action-educative.apps.education.fr/videos/watch/a57786a2-33a1-4d88-a0f4-4252283cfd78',
        'https://tube-action-educative.apps.education.fr/videos/watch/4c60d319-0cd2-45f3-b7d2-b094b335fa13',
        'https://tube-action-educative.apps.education.fr/videos/watch/f5d76a98-e4d1-4b04-a3fc-b481e993fcce'
    ];

    // Création des particules
    function createParticles() {
        const particles = document.querySelector('.particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + 'vw';
            particle.style.top = Math.random() * 100 + 'vh';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particles.appendChild(particle);
        }
    }

    // Gestion des effets de survol
    fragments.forEach(fragment => {
        fragment.addEventListener('mouseenter', () => {
            if (!isMouseDown) {
                fragment.style.transform = getHoverTransform(fragment);
                fragment.querySelector('.video-overlay').style.opacity = '0';
            }
        });

        fragment.addEventListener('mouseleave', () => {
            if (!isMouseDown) {
                fragment.style.transform = getDefaultTransform(fragment);
                fragment.querySelector('.video-overlay').style.opacity = '0.5';
            }
        });

        // Click pour agrandir
        fragment.addEventListener('click', () => {
            if (activeFragment === fragment) {
                // Réduire
                fragment.style.transform = getDefaultTransform(fragment);
                activeFragment = null;
            } else {
                // Agrandir
                if (activeFragment) {
                    activeFragment.style.transform = getDefaultTransform(activeFragment);
                }
                fragment.style.transform = 'translate(-50%, -50%) scale(2) rotate3d(0, 0, 0, 0deg)';
                activeFragment = fragment;
            }
        });
    });

    function getHoverTransform(fragment) {
        const baseTransform = getDefaultTransform(fragment);
        if (fragment.classList.contains('center')) {
            return baseTransform.replace('scale(1.4)', 'scale(1.6)');
        }
        return baseTransform.replace('30deg', '20deg');
    }

    function getDefaultTransform(fragment) {
        if (fragment.classList.contains('center')) {
            return 'translate(-50%, -50%) scale(1.4) rotate3d(1, 0, 0, 5deg)';
        } else if (fragment.classList.contains('top-left')) {
            return 'translate(-150%, -150%) rotate3d(1, 1, 0, 30deg)';
        } else if (fragment.classList.contains('top-right')) {
            return 'translate(50%, -150%) rotate3d(1, -1, 0, 30deg)';
        } else if (fragment.classList.contains('bottom-left')) {
            return 'translate(-150%, 50%) rotate3d(-1, 1, 0, 30deg)';
        } else {
            return 'translate(50%, 50%) rotate3d(-1, -1, 0, 30deg)';
        }
    }

    // Gestion du mouvement 3D
    function handleMove(e) {
        if (!isMouseDown) return;
        
        const rect = screensGroup.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const angleX = (mouseY - centerY) / 30;
        const angleY = (mouseX - centerX) / 30;

        fragments.forEach(fragment => {
            if (fragment === activeFragment) return;

            let baseTransform = getDefaultTransform(fragment);
            
            if (fragment.classList.contains('center')) {
                fragment.style.transform = `translate(-50%, -50%) scale(1.4) rotateX(${-angleX * 1.2}deg) rotateY(${angleY * 1.2}deg)`;
            } else {
                fragment.style.transform = baseTransform + ` rotateX(${-angleX}deg) rotateY(${angleY}deg)`;
            }

            // Effet de brillance
            const glare = fragment.querySelector('.screen-glare');
            const fragmentRect = fragment.getBoundingClientRect();
            const glareX = ((mouseX - fragmentRect.left) / fragmentRect.width) * 100;
            const glareY = ((mouseY - fragmentRect.top) / fragmentRect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
        });
    }

    // Initialisation
    createParticles();
    
    // Event Listeners
    document.addEventListener('mousemove', handleMove);
    
    document.addEventListener('mousedown', () => {
        if (activeFragment) return;
        isMouseDown = true;
        scene.style.cursor = 'grabbing';
        screensGroup.style.transition = 'none';
        fragments.forEach(fragment => {
            fragment.style.transition = 'none';
        });
    });

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        scene.style.cursor = 'grab';
        screensGroup.style.transition = 'transform 0.5s ease';
        
        fragments.forEach(fragment => {
            if (fragment === activeFragment) return;
            
            fragment.style.transition = 'transform 0.5s ease';
            fragment.style.transform = getDefaultTransform(fragment);
            setTimeout(() => fragment.style.transition = '', 500);
        });
    });

    // Fonction de shuffle
    shuffleBtn.addEventListener('click', () => {
        if (activeFragment) {
            activeFragment.style.transform = getDefaultTransform(activeFragment);
            activeFragment = null;
        }

        const positions = ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'];
        const currentPositions = Array.from(fragments).map(f => {
            return positions.find(p => f.classList.contains(p));
        });
        
        fragments.forEach(fragment => {
            fragment.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            fragment.style.transform = 'scale(0.8) rotate3d(1, 1, 1, 360deg)';
            
            setTimeout(() => {
                const newPos = positions.splice(Math.floor(Math.random() * positions.length), 1)[0];
                fragment.className = 'screen-fragment ' + newPos;
                
                // Change la vidéo en même temps que la position
                const videoContainer = fragment.querySelector('.video-container');
                const iframe = videoContainer.querySelector('iframe');
                const randomVideo = videoUrls[Math.floor(Math.random() * videoUrls.length)];
                iframe.src = randomVideo;
            }, 400);
            
            setTimeout(() => {
                fragment.style.transform = getDefaultTransform(fragment);
                fragment.style.transition = '';
            }, 800);
        });
    });

    // Contrôle du son
    soundToggle.addEventListener('change', () => {
        fragments.forEach(fragment => {
            const iframe = fragment.querySelector('iframe');
            const currentSrc = iframe.src;
            if (soundToggle.checked) {
                iframe.src = currentSrc.includes('&muted=1') 
                    ? currentSrc.replace('&muted=1', '') 
                    : currentSrc;
            } else {
                iframe.src = currentSrc.includes('&muted=1') 
                    ? currentSrc 
                    : currentSrc + '&muted=1';
            }
        });
    });

    // Initialisation des jeux
    new MathGame('mental');
    new MathGame('sequence');
    new MathGame('geometry');
});
 const numFish = 50; // Number of fish
  const fishArray = [];
  const svg = document.getElementById('underwater-scene');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Track mouse movement
  document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
  });

  // Create fish and append them to the SVG as dots
  for (let i = 0; i < numFish; i++) {
      const fish = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      fish.setAttribute('fill', 'lightblue');
      fish.setAttribute('r', '5');
      fish.style.filter = 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.8))';
      svg.appendChild(fish);

      // Initial random positions and speeds for each fish
      fishArray.push({
          element: fish,
          x: Math.random() * window.innerWidth, // Random x position
          y: Math.random() * window.innerHeight, // Random y position
          speedX: Math.random() * 2 + 0.5, // Random horizontal speed
          speedY: Math.random() * 2 + 0.5, // Random vertical speed
          sway: Math.random() * 0.02 - 0.01, // Sway effect for more natural motion
          direction: Math.random() * Math.PI * 2, // Random direction
      });
  }

  function animateFish() {
      fishArray.forEach(fish => {
          // Move the fish in the direction of its speed
          fish.x += fish.speedX * Math.cos(fish.direction);
          fish.y += fish.speedY * Math.sin(fish.direction);

          // Apply some sway to create a more fluid movement
          fish.x += Math.sin(fish.direction) * fish.sway * 30;
          fish.y += Math.cos(fish.direction) * fish.sway * 20;

          // Change the direction slightly to mimic a more realistic motion
          fish.direction += fish.sway;

          // Make the fish "bounce" when hitting the screen edges
          if (fish.x > window.innerWidth || fish.x < 0) {
              fish.speedX = -fish.speedX;
          }
          if (fish.y > window.innerHeight || fish.y < 0) {
              fish.speedY = -fish.speedY;
          }

          // Fish will move slightly towards the mouse for interaction
          fish.x += (mouseX - fish.x) * 0.01;
          fish.y += (mouseY - fish.y) * 0.01;

          // Update the position of the fish on the screen
          fish.element.setAttribute('cx', fish.x);
          fish.element.setAttribute('cy', fish.y);
      });

      requestAnimationFrame(animateFish);
  }

  // Start the animation loop
  animateFish();

  document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const items = Array.from(track.children);
    let index = 0;

    function moveCarousel() {
        index++;
        if (index >= items.length) {
            index = 0;
        }
        const itemWidth = items[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${index * itemWidth}px)`;
    }

    setInterval(moveCarousel, 3000);
});