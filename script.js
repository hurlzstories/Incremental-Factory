const buyButton = document.querySelector('.buy-button');
const creditsDisplay = document.getElementById('credits');
const fastForwardButtonFixed = document.getElementById('fast-forward-button-fixed');
const shapeIndicator = document.querySelector('.shape-indicator');
const triangleIcon = document.querySelector('.triangle-icon');
const circleIcon = document.querySelector('.circle-icon');
const topSection = document.querySelector('.top-section');
const purchaseMachineButton = document.getElementById('purchase-machine-button');
const upgradeSpeedPanelButton = document.getElementById('upgrade-speed-panel-button');
const upgradeProductionPanelButton = document.getElementById('upgrade-production-panel-button');

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
        buyButton.style.display = 'block';
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

function handleFastForwardButtonClick() {
    console.log("Fast Forward button clicked!");
    // We'll add the fast forward logic here later
}

function handlePurchaseMachineButtonClick() {
    console.log("Purchase Machine button clicked!");
    // Logic to purchase additional machines will go here
}

function handleUpgradeSpeedPanelButtonClick() {
    console.log("Speed Upgrade button (panel) clicked!");
    // Logic to purchase speed upgrade
}

function handleUpgradeProductionPanelButtonClick() {
    console.log("Production Upgrade button (panel) clicked!");
    // Logic to purchase production upgrade
}

// Event listeners
buyButton.addEventListener('click', buyFirstMachine);
fastForwardButtonFixed.addEventListener('click', handleFastForwardButtonClick);
purchaseMachineButton.addEventListener('click', handlePurchaseMachineButtonClick);
upgradeSpeedPanelButton.addEventListener('click', handleUpgradeSpeedPanelButtonClick);
upgradeProductionPanelButton.addEventListener('click', handleUpgradeProductionPanelButtonClick);

// Initial UI update
updateUI();
