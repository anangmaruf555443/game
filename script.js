const games = ['Tetris', 'Chess', 'Snake', 'Pong', 'Pac-Man', 'Flappy Bird', '2048', 'Sudoku'];
const gameLinks = {
    'Tetris': 'https://tetris.com',
    'Chess': 'https://chess.com',
    'Snake': 'https://snake-game.org',
    'Pong': 'https://pong.dev',
    'Pac-Man': 'https://pacman.com',
    'Flappy Bird': 'https://flappybird.io',
    '2048': 'https://play2048.co',
    'Sudoku': 'https://sudoku.com'
};

let stats = {};
let isSpinning = false;

// Initialize stats
games.forEach(game => {
    stats[game] = 0;
});

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('rouletteStats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('rouletteStats', JSON.stringify(stats));
}

// Update statistics display
function updateStatsDisplay() {
    const statsContainer = document.getElementById('stats');
    statsContainer.innerHTML = '';
    
    const sortedGames = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .map(([game, count]) => `
            <div class="stat-item">
                <span>${game}</span>
                <span>${count} times</span>
            </div>
        `)
        .join('');
    
    statsContainer.innerHTML = sortedGames;
}

// Spin the wheel
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinBtn = document.getElementById('spinBtn');
    const resultContainer = document.getElementById('resultContainer');
    const rouletteWheel = document.getElementById('rouletteWheel');
    
    spinBtn.disabled = true;
    resultContainer.style.display = 'none';
    
    // Random rotation between 0 and 360 degrees + 720 base rotation
    const randomRotation = Math.floor(Math.random() * 360) + 720;
    rouletteWheel.style.transform = `rotate(${randomRotation}deg)`;
    
    // Calculate which segment won
    setTimeout(() => {
        const normalizedRotation = randomRotation % 360;
        const segmentIndex = Math.floor((normalizedRotation + 22.5) / 45) % 8;
        const selectedGame = games[segmentIndex];
        
        // Update stats
        stats[selectedGame]++;
        saveStats();
        updateStatsDisplay();
        
        // Show result
        document.getElementById('resultGame').textContent = selectedGame;
        document.getElementById('playBtn').onclick = () => {
            window.open(gameLinks[selectedGame], '_blank');
        };
        resultContainer.style.display = 'block';
        
        spinBtn.disabled = false;
        isSpinning = false;
    }, 4000);
}

// Event listeners
document.getElementById('spinBtn').addEventListener('click', spinWheel);

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadStats();
    updateStatsDisplay();
});
