const buyButton = document.querySelector('.buy-button');
const upgradePanel = document.getElementById('upgrade-panel');
const chooseSpeedUpgradeButton = document.getElementById('choose-speed-upgrade');
const chooseProductionUpgradeButton = document.getElementById('choose-production-upgrade');
const creditsDisplay = document.getElementById('credits');
const upgradeMenuButton = document.getElementById('upgrade-menu-button');
const fastForwardButton = document.getElementById('fast-forward');
const shapeIndicator = document.querySelector('.shape-indicator');
const triangleIcon = document.querySelector('.triangle-icon');
const circleIcon = document.querySelector('.circle-icon');
const topSection = document.querySelector('.top-section');

let credits = 100;
let machinePurchased = false;
let firstUpgradeChosen = null;
const firstMachineCost = 50; // Example cost

function updateUI() {
    creditsDisplay.textContent = `Credits: ${credits}`;

    if (machinePurchased) {
        buyButton.style.display = 'none'; // Hide buy button after purchase
        shapeIndicator.style.display = 'block'; // Show shape indicator
        upgradePanel.classList.remove('hidden'); // Show upgrade panel
    } else {
        buyButton.textContent = `BUY (Cost: ${firstMachineCost})`;
        shapeIndicator.style.display = 'none'; // Hide initially
        upgradePanel.classList.add('hidden'); // Hide upgrade panel
    }

    if (firstUpgradeChosen === 'speed') {
        triangleIcon.style.display = 'block';
        topSection.justifyContent = 'flex-start';
    } else if (firstUpgradeChosen === 'production') {
        circleIcon.style.display = 'block';
        topSection.justifyContent = 'flex-start';
    }

    creditsDisplay.classList.toggle('hidden', !machinePurchased);
    upgradeMenuButton.classList.toggle('hidden', !machinePurchased || firstUpgradeChosen === null);
    fastForwardButton.classList.toggle('hidden', !machinePurchased);
}

function buyFirstMachine() {
    if (credits >= firstMachineCost && !machinePurchased) {
        credits -= firstMachineCost;
        machinePurchased = true;
        updateUI();
    }
}

function chooseSpeedUpgrade() {
    firstUpgradeChosen = 'speed';
    upgradePanel.classList.add('hidden'); // Hide panel after choice
    updateUI();
}

function chooseProductionUpgrade() {
    firstUpgradeChosen = 'production';
    upgradePanel.classList.add('hidden'); // Hide panel after choice
    updateUI();
}

// Event listeners
buyButton.addEventListener('click', buyFirstMachine);
chooseSpeedUpgradeButton.addEventListener('click', chooseSpeedUpgrade);
chooseProductionUpgradeButton.addEventListener('click', chooseProductionUpgrade);

// Initial UI update
updateUI();
