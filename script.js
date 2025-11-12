// Configuración del juego
const CONFIG = {
    gridSize: 25,
    tileSize: 20,
    initialSpeed: 150,
    cameraSpeed: 300,
    canvasWidth: 800,
    canvasHeight: 800
};

// Clase Snake
class Snake {
    constructor() {
        this.reset();
    }

    reset() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
    }

    move() {
        this.direction = this.nextDirection;
        const head = { 
            x: this.body[0].x + this.direction.x, 
            y: this.body[0].y + this.direction.y 
        };
        this.body.unshift(head);
        this.body.pop();
    }

    grow() {
        const tail = this.body[this.body.length - 1];
        this.body.push({ ...tail });
    }

    changeDirection(newDirection) {
        // Prevenir reversión y cambios múltiples en el mismo frame
        if (newDirection.x === -this.direction.x && newDirection.y === -this.direction.y) {
            return;
        }
        // Prevenir cambios si ya hay uno pendiente diferente al actual
        if (this.nextDirection.x !== this.direction.x || this.nextDirection.y !== this.direction.y) {
            return;
        }
        this.nextDirection = newDirection;
    }

    checkCollision() {
        const head = this.body[0];
        
        // Colisión con paredes
        if (head.x < 0 || head.x >= CONFIG.gridSize || 
            head.y < 0 || head.y >= CONFIG.gridSize) {
            return true;
        }
        
        // Colisión con el cuerpo
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        
        return false;
    }

    draw(ctx) {
        this.body.forEach((segment, index) => {
            const x = segment.x * CONFIG.tileSize;
            const y = segment.y * CONFIG.tileSize;
            const size = CONFIG.tileSize;
            
            if (index === 0) {
                // Cabeza de anaconda
                const gradient = ctx.createRadialGradient(
                    x + size / 2, y + size / 2, 2,
                    x + size / 2, y + size / 2, size / 2
                );
                gradient.addColorStop(0, '#7cb342');
                gradient.addColorStop(0.5, '#558b2f');
                gradient.addColorStop(1, '#33691e');
                
                ctx.fillStyle = gradient;
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#7cb342';
                
                // Forma redondeada de la cabeza
                ctx.beginPath();
                ctx.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2);
                ctx.fill();
                
                // Ojos
                ctx.fillStyle = '#ffeb3b';
                ctx.shadowBlur = 3;
                ctx.shadowColor = '#ffeb3b';
                ctx.beginPath();
                ctx.arc(x + size * 0.35, y + size * 0.35, size * 0.12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + size * 0.65, y + size * 0.35, size * 0.12, 0, Math.PI * 2);
                ctx.fill();
                
                // Pupilas
                ctx.fillStyle = '#000';
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(x + size * 0.35, y + size * 0.35, size * 0.06, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x + size * 0.65, y + size * 0.35, size * 0.06, 0, Math.PI * 2);
                ctx.fill();
                
            } else {
                // Cuerpo de anaconda con patrón de escamas
                const bodyGradient = ctx.createLinearGradient(x, y, x + size, y + size);
                bodyGradient.addColorStop(0, '#689f38');
                bodyGradient.addColorStop(0.5, '#558b2f');
                bodyGradient.addColorStop(1, '#33691e');
                
                ctx.fillStyle = bodyGradient;
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#558b2f';
                
                // Segmento redondeado
                ctx.beginPath();
                ctx.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2);
                ctx.fill();
                
                // Manchas oscuras (patrón de anaconda)
                if (index % 2 === 0) {
                    ctx.fillStyle = 'rgba(51, 105, 30, 0.6)';
                    ctx.shadowBlur = 0;
                    ctx.beginPath();
                    ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            ctx.shadowBlur = 0;
        });
    }
}

// Clase Fruit
class Fruit {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.spawn();
    }

    spawn(snakeBody = []) {
        do {
            this.position = {
                x: Math.floor(Math.random() * CONFIG.gridSize),
                y: Math.floor(Math.random() * CONFIG.gridSize)
            };
        } while (this.isOnSnake(snakeBody));
    }

    isOnSnake(snakeBody) {
        return snakeBody.some(segment => 
            segment.x === this.position.x && segment.y === this.position.y
        );
    }

    draw(ctx) {
        const x = this.position.x * CONFIG.tileSize;
        const y = this.position.y * CONFIG.tileSize;
        const size = CONFIG.tileSize;
        
        // Cuerpo del ratón (gris)
        const bodyGradient = ctx.createRadialGradient(
            x + size / 2, y + size * 0.6, 2,
            x + size / 2, y + size * 0.6, size / 2
        );
        bodyGradient.addColorStop(0, '#9e9e9e');
        bodyGradient.addColorStop(0.7, '#757575');
        bodyGradient.addColorStop(1, '#616161');
        
        ctx.fillStyle = bodyGradient;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#616161';
        
        // Cuerpo principal
        ctx.beginPath();
        ctx.ellipse(x + size / 2, y + size * 0.6, size * 0.35, size * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Cabeza del ratón
        ctx.fillStyle = '#9e9e9e';
        ctx.beginPath();
        ctx.arc(x + size * 0.4, y + size * 0.4, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        // Orejas
        ctx.fillStyle = '#e0e0e0';
        ctx.shadowBlur = 3;
        ctx.shadowColor = '#9e9e9e';
        
        // Oreja izquierda
        ctx.beginPath();
        ctx.arc(x + size * 0.25, y + size * 0.25, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // Oreja derecha
        ctx.beginPath();
        ctx.arc(x + size * 0.55, y + size * 0.25, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // Ojos
        ctx.fillStyle = '#000';
        ctx.shadowBlur = 2;
        ctx.shadowColor = '#000';
        ctx.beginPath();
        ctx.arc(x + size * 0.35, y + size * 0.38, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + size * 0.48, y + size * 0.38, size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        
        // Nariz
        ctx.fillStyle = '#ff4081';
        ctx.shadowBlur = 1;
        ctx.shadowColor = '#ff4081';
        ctx.beginPath();
        ctx.arc(x + size * 0.42, y + size * 0.48, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // Cola
        ctx.strokeStyle = '#757575';
        ctx.lineWidth = size * 0.08;
        ctx.shadowBlur = 2;
        ctx.shadowColor = '#616161';
        ctx.beginPath();
        ctx.moveTo(x + size * 0.7, y + size * 0.7);
        ctx.quadraticCurveTo(x + size * 0.85, y + size * 0.6, x + size * 0.9, y + size * 0.8);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
    }
}

// Clase Game
class Game {
    constructor(useCameraMode = false) {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake();
        this.fruit = new Fruit();
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.gameLoop = null;
        this.soundEnabled = true;
        this.cameraMode = useCameraMode;
        
        this.setupCanvas();
        this.setupControls();
        this.setupSounds();
        this.updateScoreDisplay();
    }

    setupCanvas() {
        const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 200, CONFIG.canvasWidth);
        const size = Math.floor(maxSize / CONFIG.gridSize) * CONFIG.gridSize;
        this.canvas.width = size;
        this.canvas.height = size;
        CONFIG.tileSize = size / CONFIG.gridSize;
    }

    setupControls() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            if (!this.gameLoop) return;
            
            const directions = {
                'ArrowUp': { x: 0, y: -1 },
                'ArrowDown': { x: 0, y: 1 },
                'ArrowLeft': { x: -1, y: 0 },
                'ArrowRight': { x: 1, y: 0 },
                'w': { x: 0, y: -1 },
                's': { x: 0, y: 1 },
                'a': { x: -1, y: 0 },
                'd': { x: 1, y: 0 }
            };
            
            const direction = directions[e.key] || directions[e.key.toLowerCase()];
            if (direction) {
                e.preventDefault();
                this.snake.changeDirection(direction);
            }
        });

        // Controles táctiles
        document.querySelectorAll('.touch-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const directions = {
                    'up': { x: 0, y: -1 },
                    'down': { x: 0, y: 1 },
                    'left': { x: -1, y: 0 },
                    'right': { x: 1, y: 0 }
                };
                const dir = btn.dataset.direction;
                this.snake.changeDirection(directions[dir]);
            });
        });
    }

    setupSounds() {
        // Crear contexto de audio
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio no disponible');
            this.soundEnabled = false;
        }
        
        // Toggle de sonido
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('click', () => {
                this.soundEnabled = !this.soundEnabled;
                soundToggle.textContent = this.soundEnabled ? '🔊' : '🔇';
            });
        }
    }

    playSound(frequency, duration, type = 'sine') {
        if (!this.soundEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    start() {
        this.snake.reset();
        this.fruit.spawn(this.snake.body);
        this.score = 0;
        this.updateScoreDisplay();
        this.playSound(400, 0.2);
        
        // Usar velocidad más lenta en modo cámara
        const speed = this.cameraMode ? CONFIG.cameraSpeed : CONFIG.initialSpeed;
        
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), speed);
    }

    update() {
        this.snake.move();
        
        // Verificar colisión
        if (this.snake.checkCollision()) {
            this.gameOver();
            return;
        }
        
        // Verificar si comió fruta
        const head = this.snake.body[0];
        if (head.x === this.fruit.position.x && head.y === this.fruit.position.y) {
            this.snake.grow();
            this.fruit.spawn(this.snake.body);
            this.score++;
            this.updateScoreDisplay();
            this.playSound(600, 0.1);
        }
        
        this.draw();
    }

    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = 'rgba(26, 77, 46, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar cuadrícula sutil
        this.ctx.strokeStyle = 'rgba(74, 124, 58, 0.2)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= CONFIG.gridSize; i++) {
            const pos = i * CONFIG.tileSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
        
        // Dibujar fruta y serpiente
        this.fruit.draw(this.ctx);
        this.snake.draw(this.ctx);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        this.playSound(200, 0.5, 'sawtooth');
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore();
        }
        
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('best-score').textContent = this.highScore;
        
        showScreen('gameover-screen');
    }

    updateScoreDisplay() {
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('high-score').textContent = this.highScore;
    }

    loadHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore')) || 0;
    }

    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore);
    }
}

// Gestión de pantallas
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    setTimeout(() => {
        document.getElementById(screenId).classList.add('active');
    }, 100);
}

// Teachable Machine
let model, webcam, labelContainer, maxPredictions;
let isUsingCamera = false;
let lastDetectedClass = "";
let lastDetectionTime = 0;
const DETECTION_COOLDOWN = 200; // ms entre detecciones
const URL = "https://teachablemachine.withgoogle.com/models/C_flZ7Vci/";

async function initCamera() {
    try {
        // Verificar si tmImage está disponible
        if (typeof tmImage === 'undefined') {
            throw new Error('Teachable Machine no está cargado. Asegúrate de tener conexión a internet.');
        }

        // Primero solicitar permisos de cámara explícitamente
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' },
            audio: false 
        });
        
        // Detener el stream temporal (solo era para obtener permisos)
        stream.getTracks().forEach(track => track.stop());

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        // Cargar el modelo
        console.log('Cargando modelo de Teachable Machine...');
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log('Modelo cargado con', maxPredictions, 'clases');

        // Configurar webcam
        const flip = true;
        webcam = new tmImage.Webcam(200, 150, flip);
        await webcam.setup({ facingMode: 'user' });
        await webcam.play();
        
        console.log('Webcam iniciada correctamente');
        
        const webcamElement = document.getElementById('webcam');
        if (webcamElement && webcam.webcam) {
            webcamElement.srcObject = webcam.webcam.srcObject;
        }
        
        const webcamContainer = document.getElementById('webcam-container');
        if (webcamContainer) {
            webcamContainer.style.display = 'block';
        }
        
        labelContainer = document.getElementById("label-container");
        if (labelContainer) {
            labelContainer.innerHTML = '';
            for (let i = 0; i < maxPredictions; i++) {
                labelContainer.appendChild(document.createElement("div"));
            }
        }
        
        isUsingCamera = true;
        window.requestAnimationFrame(loopCamera);
        
        return true;
    } catch (error) {
        console.error("Error al inicializar la cámara:", error);
        
        let errorMsg = "No se pudo acceder a la cámara";
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
            errorMsg = "Permiso de cámara denegado. Por favor, permite el acceso a la cámara en tu navegador";
        } else if (error.name === 'NotFoundError') {
            errorMsg = "No se encontró ninguna cámara en tu dispositivo";
        } else if (error.name === 'NotReadableError') {
            errorMsg = "La cámara está siendo usada por otra aplicación";
        } else if (error.message) {
            errorMsg = error.message;
        }
        
        alert(`${errorMsg}.\n\nEl juego continuará con controles de teclado.`);
        return false;
    }
}

async function loopCamera() {
    if (!isUsingCamera || !webcam) return;
    
    try {
        webcam.update();
        await predict();
    } catch (error) {
        console.error("Error en loop de cámara:", error);
    }
    
    window.requestAnimationFrame(loopCamera);
}

async function predict() {
    if (!game || !game.gameLoop || !model || !webcam) return;
    
    try {
        const prediction = await model.predict(webcam.canvas);
        const currentTime = Date.now();
        
        // Encontrar la predicción con mayor probabilidad
        let maxProb = 0;
        let detectedClass = "";
        
        for (let i = 0; i < maxPredictions; i++) {
            const prob = (prediction[i].probability * 100).toFixed(0);
            const classPrediction = prediction[i].className + ": " + prob + "%";
            
            if (labelContainer && labelContainer.childNodes[i]) {
                labelContainer.childNodes[i].innerHTML = classPrediction;
                
                // Resaltar la clase detectada
                if (prediction[i].probability > 0.75) {
                    labelContainer.childNodes[i].style.color = '#8bc34a';
                    labelContainer.childNodes[i].style.fontWeight = 'bold';
                } else {
                    labelContainer.childNodes[i].style.color = '#c8e6c9';
                    labelContainer.childNodes[i].style.fontWeight = 'normal';
                }
            }
            
            // Umbral más alto para mejor precisión
            if (prediction[i].probability > maxProb && prediction[i].probability > 0.75) {
                maxProb = prediction[i].probability;
                detectedClass = prediction[i].className.toLowerCase();
            }
        }
        
        // Mapear las clases a direcciones (normalizar nombres)
        const directions = {
            'up': { x: 0, y: -1 },
            'arriba': { x: 0, y: -1 },
            'down': { x: 0, y: 1 },
            'abajo': { x: 0, y: 1 },
            'left': { x: -1, y: 0 },
            'izquierda': { x: -1, y: 0 },
            'right': { x: 1, y: 0 },
            'derecha': { x: 1, y: 0 }
        };
        
        // Aplicar cooldown y evitar detecciones repetidas
        if (directions[detectedClass] && 
            (currentTime - lastDetectionTime > DETECTION_COOLDOWN) &&
            detectedClass !== lastDetectedClass) {
            
            game.snake.changeDirection(directions[detectedClass]);
            lastDetectedClass = detectedClass;
            lastDetectionTime = currentTime;
        }
    } catch (error) {
        console.error("Error en predicción:", error);
    }
}

function stopCamera() {
    isUsingCamera = false;
    if (webcam) {
        try {
            webcam.stop();
        } catch (e) {
            console.warn('Error al detener webcam:', e);
        }
    }
    const webcamContainer = document.getElementById('webcam-container');
    if (webcamContainer) {
        webcamContainer.style.display = 'none';
    }
}

// Inicialización
let game;

// Esperar a que el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
    const startKeyboardBtn = document.getElementById('start-keyboard-btn');
    const startCameraBtn = document.getElementById('start-camera-btn');
    const retryBtn = document.getElementById('retry-btn');
    const homeBtn = document.getElementById('home-btn');

    if (startKeyboardBtn) {
        startKeyboardBtn.addEventListener('click', () => {
            showScreen('game-screen');
            if (!game) {
                game = new Game(false);
            }
            setTimeout(() => game.start(), 500);
        });
    }

    if (startCameraBtn) {
        startCameraBtn.addEventListener('click', async () => {
            showScreen('game-screen');
            if (!game) {
                game = new Game(true);
            }
            
            await initCamera();
            setTimeout(() => game.start(), 500);
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            showScreen('game-screen');
            setTimeout(() => game.start(), 500);
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            stopCamera();
            showScreen('intro-screen');
        });
    }

    // Ajustar canvas al redimensionar
    window.addEventListener('resize', () => {
        if (game) {
            game.setupCanvas();
            game.draw();
        }
    });
});
