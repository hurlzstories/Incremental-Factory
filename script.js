const buyButton = document.querySelector('.buy-button');
const creditsDisplay = document.getElementById('credits');
const upgradeButtonFixed = document.getElementById('upgrade-button-fixed');
const fastForwardButtonFixed = document.getElementById('fast-forward-button-fixed');
const shapeIndicator = document.querySelector('.shape-indicator');
const triangleIcon = document.querySelector('.triangle-icon');
const circleIcon = document.querySelector('.circle-icon');
const topSection = document.querySelector('.top-section');

let credits = 100;
let machinePurchased = false;
let productionInterval = 1000; // 1 credit per second per machine
let productionLoop;
const firstMachineCost = 50;

function updateUI() {
    creditsDisplay.textContent = `Credits: ${credits}`;

    if (machinePurchased) {
        buyButton.style.display = 'none';
        shapeIndicator.style.display = 'block';
    } else {
        buyButton.textContent = `BUY (Cost: ${firstMachineCost})`;
        shapeIndicator.style.display = 'none';
    }

    // Upgrade icon visibility will be handled later
}

function buyFirstMachine() {
    if (credits >= firstMachineCost && !machinePurchased) {
        credits -= firstMachineCost;
        machinePurchased = true;
        startProduction();
        updateUI();
    }
}

function startProduction() {
    if (machinePurchased) {
        productionLoop = setInterval(() => {
            credits++;
            updateUI();
        }, productionInterval);
    }
}

// Event listeners
buyButton.addEventListener('click', buyFirstMachine);
// We'll add event listeners for the fixed upgrade and fast forward buttons later

// Initial UI update
updateUI();
