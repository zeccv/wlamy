// Game variables
let score = 0;
let timeLeft = 30; // Each level lasts 30 seconds
let level = 1;
let gameActive = false;
let timer;
let activeCells = [];

// DOM elements
const introScreen = document.getElementById('intro-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const levelDisplay = document.getElementById('level');
const messageDisplay = document.getElementById('message');
const gridContainer = document.getElementById('grid-container');
const timeBar = document.getElementById('time-bar');

// Game start
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

function startGame() {
    // Reset game state
    score = 0;
    timeLeft = 30; // Reset time for new level
    level = 1;
    gameActive = true;
    activeCells = [];
    
    // Update displays
    levelDisplay.textContent = level;
    messageDisplay.textContent = '';
    timeBar.style.width = '100%'; // Reset time bar
    
    // Switch screens
    introScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    restartBtn.classList.add('hidden');
    
    // Start timer
    timer = setInterval(() => {
        timeLeft--;
        timeBar.style.width = (timeLeft / 30) * 100 + '%'; // Update time bar
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Start generating cells
    generateCells();
}

function generateCells() {
    // Clear grid
    gridContainer.innerHTML = '';
    
    // Create cells
    const cells = [];
    for (let i = 0; i < 24 * 24; i++) { // 24x24 grid
        const cell = document.createElement('div');
        cell.className = 'grid-cell bg-black border border-green-800 flex items-center justify-center cursor-pointer';
        cell.dataset.active = 'false';
        
        cell.addEventListener('click', () => {
            if (!gameActive || cell.dataset.active !== 'true') return;
            
            // Mark as clicked
            cell.dataset.active = 'false';
            cell.classList.remove('active');
            cell.classList.add('clicked', 'bg-green-900');
            
            // Update score
            score += level;
            
            // Remove from active cells
            activeCells = activeCells.filter(c => c !== cell);
        });
        
        gridContainer.appendChild(cell);
        cells.push(cell);
    }
    
    // Activate random cells
    const activateCount = Math.min(3, Math.floor(Math.random() * 3) + 1);
    for (let i = 0; i < activateCount; i++) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        const cell = cells[randomIndex];
        
        if (cell.dataset.active === 'false') {
            cell.dataset.active = 'true';
            cell.classList.add('active', 'bg-green-700');
            activeCells.push(cell);
            
            // Start shrinking and disappearing
            setTimeout(() => {
                if (cell.dataset.active === 'true') {
                    cell.dataset.active = 'false';
                    cell.classList.remove('active');
                    cell.classList.add('bg-red-900');
                }
            }, 3000); // Increased time before cell disappears
        }
    }
    
    // Set timeout for next cell generation
    setTimeout(() => {
        if (gameActive) generateCells();
    }, 3000); // Increased delay before generating next cell
}

function endGame() {
    gameActive = false;
    clearInterval(timer);
    
    messageDisplay.textContent = `Koniec gry! Twój wynik: ${score}`;
    restartBtn.classList.remove('hidden');
    
    // Clear grid
    gridContainer.innerHTML = '';
}
