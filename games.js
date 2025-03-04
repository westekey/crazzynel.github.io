document.addEventListener('DOMContentLoaded', () => {
    class MathGame {
        constructor(type) {
            console.log(`Initializing ${type} game`);
            this.type = type;
            this.score = 0;
            this.isPlaying = false;
            this.currentQuestion = null;
            this.timer = null;
            this.setupGame();
            // Afficher le message initial
            if (this.elements.questionDisplay) {
                this.elements.questionDisplay.textContent = 'Appuyez sur Démarrer';
            }
        }

        setupGame() {
            this.elements = {
                startButton: document.getElementById(`${this.type}-start`),
                restartButton: document.getElementById(`${this.type}-restart`),
                input: document.getElementById(`${this.type}-input`),
                questionDisplay: document.getElementById(`${this.type}-question`) || 
                               document.getElementById(`${this.type}-numbers`),
                timerDisplay: document.getElementById(`${this.type}-timer`),
                scoreDisplay: document.getElementById(`${this.type}-score`),
                canvas: this.type === 'geometry' ? document.getElementById('geometry-canvas') : null
            };

            console.log(`Elements for ${this.type}:`, this.elements);

            if (!this.elements.startButton || !this.elements.input) {
                console.log(`Missing required elements for ${this.type}`);
                return;
            }

            // Désactiver l'input au début
            this.elements.input.disabled = true;

            // Configuration des événements
            this.elements.startButton.addEventListener('click', () => {
                console.log(`${this.type} start button clicked`);
                this.startGame();
            });
            
            this.elements.restartButton.addEventListener('click', () => {
                console.log(`${this.type} restart button clicked`);
                this.resetGame();
            });
            
            this.elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.isPlaying) {
                    this.checkAnswer();
                }
            });
        }

        startGame() {
            if (this.isPlaying) return;
            
            this.isPlaying = true;
            this.score = 0;
            
            // Activer l'input et réinitialiser l'affichage
            this.elements.input.disabled = false;
            this.elements.input.value = '';
            this.elements.input.focus();
            this.elements.scoreDisplay.textContent = '0';
            
            // Afficher/masquer les boutons
            this.elements.startButton.style.display = 'none';
            this.elements.restartButton.style.display = 'block';
            
            this.startTimer();
            this.generateQuestion();
        }

        resetGame() {
            this.isPlaying = false;
            clearInterval(this.timer);
            
            // Réinitialiser le score et le timer
            this.score = 0;
            this.elements.scoreDisplay.textContent = '0';
            this.elements.timerDisplay.textContent = `Temps: ${this.getGameTime()}s`;
            
            // Réinitialiser l'input
            this.elements.input.disabled = true;
            this.elements.input.value = '';
            
            // Réinitialiser les boutons
            this.elements.startButton.style.display = 'block';
            this.elements.restartButton.style.display = 'none';
            
            // Réinitialiser la zone de question
            this.elements.questionDisplay.textContent = 'Appuyez sur Démarrer';
            
            if (this.type === 'geometry' && this.elements.canvas) {
                this.clearCanvas();
            }
        }

        checkAnswer() {
            if (!this.isPlaying || !this.currentQuestion) return;

            const userAnswer = parseInt(this.elements.input.value);
            if (isNaN(userAnswer)) return;

            if (userAnswer === this.currentQuestion.answer) {
                this.score += 10;
                this.elements.scoreDisplay.textContent = this.score;
                this.elements.input.value = '';
                this.generateQuestion();
            } else {
                this.elements.input.value = '';
                this.generateQuestion();
            }
        }

        startTimer() {
            let timeLeft = this.getGameTime();
            this.elements.timerDisplay.textContent = `Temps: ${timeLeft}s`;
            
            if (this.timer) clearInterval(this.timer);
            
            this.timer = setInterval(() => {
                timeLeft--;
                this.elements.timerDisplay.textContent = `Temps: ${timeLeft}s`;
                if (timeLeft <= 0) {
                    this.endGame();
                }
            }, 1000);
        }

        getGameTime() {
            return 60; // 60 secondes pour tous les jeux
        }

        endGame() {
            this.isPlaying = false;
            clearInterval(this.timer);
            this.elements.input.disabled = true;
            alert(`Jeu terminé ! Votre score : ${this.score}`);
            this.resetGame();
        }

        generateQuestion() {
            switch (this.type) {
                case 'mental':
                    this.generateMentalMathQuestion();
                    break;
                case 'sequence':
                    this.generateSequenceQuestion();
                    break;
                case 'geometry':
                    this.generateGeometryQuestion();
                    break;
            }
        }

        generateMentalMathQuestion() {
            const num1 = Math.floor(Math.random() * 12) + 1;
            const num2 = Math.floor(Math.random() * 12) + 1;
            const operators = ['+', '-', '×'];
            const operator = operators[Math.floor(Math.random() * operators.length)];

            let answer;
            switch (operator) {
                case '+': answer = num1 + num2; break;
                case '-': answer = num1 - num2; break;
                case '×': answer = num1 * num2; break;
            }

            const question = `${num1} ${operator} ${num2} = ?`;
            this.elements.questionDisplay.textContent = question;
            this.currentQuestion = { question, answer };
        }

        generateSequenceQuestion() {
            const patterns = [
                {
                    generator: (n) => n * 2,
                    length: 5,
                    description: "Double"
                },
                {
                    generator: (n) => n * 3,
                    length: 5,
                    description: "Triple"
                },
                {
                    generator: (n) => n + 3,
                    length: 6,
                    description: "+3"
                }
            ];

            const pattern = patterns[Math.floor(Math.random() * patterns.length)];
            const start = Math.floor(Math.random() * 5) + 1;
            const sequence = [];

            for (let i = 0; i < pattern.length; i++) {
                sequence.push(pattern.generator(start + i));
            }

            const question = sequence.slice(0, -1).join(', ') + ', ?';
            this.elements.questionDisplay.textContent = question;
            this.currentQuestion = {
                question,
                answer: pattern.generator(start + pattern.length - 1)
            };
        }

        generateGeometryQuestion() {
            if (!this.elements.canvas) return;
            
            const ctx = this.elements.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);
            
            // Configurations de base
            ctx.strokeStyle = 'white';
            ctx.fillStyle = 'white';
            ctx.lineWidth = 2;
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            
            const centerX = this.elements.canvas.width / 2;
            const centerY = this.elements.canvas.height / 2;
            
            // Choisir une figure aléatoire
            const figures = ['carré', 'rectangle', 'triangle'];
            const figure = figures[Math.floor(Math.random() * figures.length)];
            
            switch(figure) {
                case 'carré':
                    const tailleCarre = Math.floor(Math.random() * 50) + 30;
                    
                    // Dessiner le carré
                    ctx.beginPath();
                    ctx.rect(centerX - tailleCarre/2, centerY - tailleCarre/2, tailleCarre, tailleCarre);
                    ctx.stroke();
                    
                    // Afficher la dimension
                    ctx.fillText(tailleCarre.toString(), centerX, centerY - tailleCarre/2 - 10);
                    
                    this.elements.questionDisplay.textContent = "Quel est le périmètre de ce carré ?";
                    this.currentQuestion = {
                        answer: tailleCarre * 4
                    };
                    break;
                    
                case 'rectangle':
                    const largeur = Math.floor(Math.random() * 40) + 40;
                    const hauteur = Math.floor(Math.random() * 30) + 30;
                    
                    // Dessiner le rectangle
                    ctx.beginPath();
                    ctx.rect(centerX - largeur/2, centerY - hauteur/2, largeur, hauteur);
                    ctx.stroke();
                    
                    // Afficher les dimensions
                    ctx.fillText(largeur.toString(), centerX, centerY - hauteur/2 - 10);
                    ctx.fillText(hauteur.toString(), centerX - largeur/2 - 10, centerY);
                    
                    this.elements.questionDisplay.textContent = "Quel est le périmètre de ce rectangle ?";
                    this.currentQuestion = {
                        answer: (largeur + hauteur) * 2
                    };
                    break;
                    
                case 'triangle':
                    const base = Math.floor(Math.random() * 40) + 40;
                    const cote = Math.floor(Math.random() * 30) + 40;
                    
                    // Calculer la hauteur du triangle isocèle
                    const hauteurTriangle = Math.sqrt(cote * cote - (base/2) * (base/2));
                    
                    // Dessiner le triangle
                    ctx.beginPath();
                    ctx.moveTo(centerX - base/2, centerY + hauteurTriangle/2);
                    ctx.lineTo(centerX + base/2, centerY + hauteurTriangle/2);
                    ctx.lineTo(centerX, centerY - hauteurTriangle/2);
                    ctx.closePath();
                    ctx.stroke();
                    
                    // Afficher les dimensions
                    ctx.fillText(base.toString(), centerX, centerY + hauteurTriangle/2 + 20);
                    ctx.fillText(cote.toString(), centerX - base/2 - 10, centerY);
                    ctx.fillText(cote.toString(), centerX + base/2 + 10, centerY);
                    
                    this.elements.questionDisplay.textContent = "Quel est le périmètre de ce triangle isocèle ?";
                    this.currentQuestion = {
                        answer: base + (cote * 2)
                    };
                    break;
            }
        }

        clearCanvas() {
            if (this.elements.canvas) {
                const ctx = this.elements.canvas.getContext('2d');
                ctx.clearRect(0, 0, this.elements.canvas.width, this.elements.canvas.height);
            }
        }
    }

    // Initialiser le jeu approprié selon la page
    if (document.getElementById('geometry-section')) {
        console.log('Geometry page detected, initializing game');
        new MathGame('geometry');
    } else if (document.getElementById('sequence-section')) {
        console.log('Sequence page detected, initializing game');
        new MathGame('sequence');
    } else if (document.getElementById('mental-section')) {
        console.log('Mental calculation page detected, initializing game');
        new MathGame('mental');
    }
});

document
  .getElementById("sudoku-board")
  .addEventListener("keyup", function (event) {
    if (event.target && event.target.nodeName == "TD") {
      var validNum = /[1-9]/;
      var tdEl = event.target;
      if (tdEl.innerText.length > 0 && validNum.test(tdEl.innerText[0])) {
        tdEl.innerText = tdEl.innerText[0];
      } else {
        tdEl.innerText = "";
      }
    }
  });

document
  .getElementById("solve-button")
  .addEventListener("click", function (event) {
    var boardString = boardToString();
    var solution = SudokuSolver.solve(boardString);
    if (solution) {
      stringToBoard(solution);
    } else {
      alert("Invalid board!");
    }
  });

document.getElementById("clear-button").addEventListener("click", clearBoard);

function clearBoard() {
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    tds[i].innerText = "";
  }
}

function boardToString() {
  var string = "";
  var validNum = /[1-9]/;
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    if (validNum.test(tds[i].innerText[0])) {
      string += tds[i].innerText;
    } else {
      string += "-";
    }
  }
  return string;
}

function stringToBoard(string) {
  var currentCell;
  var validNum = /[1-9]/;
  var cells = string.split("");
  var tds = document.getElementsByTagName("td");
  for (var i = 0; i < tds.length; i++) {
    currentCell = cells.shift();
    if (validNum.test(currentCell)) {
      tds[i].innerText = currentCell;
    }
  }
}

