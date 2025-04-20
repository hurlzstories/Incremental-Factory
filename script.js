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
const machine1Info = document.getElementById('machine-1-info'); // Reference to machine info in sidebar
const speedUpgradeStatus = document.getElementById('speed-upgrade-status');
const productionUpgradeStatus = document.getElementById('production-upgrade-status');

let credits = 100;
let machineCount = 0; // Track the number of machines
let machinePurchased = false; // For the first machine
let productionInterval = 1000; // 1 credit per second per machine
let productionLoop;
const firstMachineCost = 50;
const speedUpgradeCost = 100; // Example cost
const productionUpgradeCost = 150; // Example cost
let hasSpeedUpgrade = false;
let hasProductionUpgrade = false;

function updateUI() {
    creditsDisplay.textContent = `Credits: ${credits}`;

    if (machinePurchased) {
        buyButton.style.display = 'none';
        shapeIndicator.style.display = 'block';
        machine1Info.style.display = 'block'; // Show machine info in sidebar after purchase
    } else {
        buyButton.style.display = 'block';
        buyButton.textContent = `BUY (Cost: ${firstMachineCost})`;
        shapeIndicator.style.display = 'none';
        machine1Info.style.display = 'none'; // Hide initially
    }

    triangleIcon.style.display = hasSpeedUpgrade ? 'block' : 'none';
    circleIcon.style.display = hasProductionUpgrade ? 'block' : 'none';
    topSection.justifyContent = (hasSpeedUpgrade || hasProductionUpgrade) ? 'flex-start' : 'center';

    if (hasSpeedUpgrade) {
        speedUpgradeStatus.textContent = 'Speed Upgraded';
        upgradeSpeedPanelButton.className = 'speed-upgraded'; // Set class directly
        upgradeSpeedPanelButton.textContent = ''; // Clear button text
        upgradeSpeedPanelButton.disabled = true;
    } else {
        speedUpgradeStatus.textContent = '';
        upgradeSpeedPanelButton.className = ''; // Clear class
        upgradeSpeedPanelButton.textContent = `Speed Upgrade (Cost: ${speedUpgradeCost})`;
        upgradeSpeedPanelButton.disabled = !machinePurchased || credits < speedUpgradeCost;
    }

    if (hasProductionUpgrade) {
        productionUpgradeStatus.textContent = 'Production Upgraded';
        upgradeProductionPanelButton.className = 'production-upgraded'; // Set class directly
        upgradeProductionPanelButton.textContent = ''; // Clear button text
        upgradeProductionPanelButton.disabled = true;
    } else {
        productionUpgradeStatus.textContent = '';
        upgradeProductionPanelButton.className = ''; // Clear class
        upgradeProductionPanelButton.textContent = `Production Upgrade (Cost: ${productionUpgradeCost})`;
        upgradeProductionPanelButton.disabled = !machinePurchased || credits < productionUpgradeCost;
    }
}

function buyFirstMachine() {
    if (credits >= firstMachineCost && !machinePurchased) {
        credits -= firstMachineCost;
        machinePurchased = true;
        machineCount++;
        startProduction();
        updateUI();
    }
}

function startProduction() {
    if (machinePurchased) {
        productionLoop = setInterval(() => {
            credits += machineCount; // Credits per second per machine
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
    if (machinePurchased && credits >= speedUpgradeCost && !hasSpeedUpgrade) {
        credits -= speedUpgradeCost;
        hasSpeedUpgrade = true;
        productionInterval *= 0.8; // Example speed increase
        clearInterval(productionLoop);
        startProduction();
        updateUI();
    }
}

function handleUpgradeProductionPanelButtonClick() {
    if (machinePurchased && credits >= productionUpgradeCost && !hasProductionUpgrade) {
        credits -= productionUpgradeCost;
        hasProductionUpgrade = true;
        // Example production increase - for now, just visual
        updateUI();
    }
}

// Event listeners
buyButton.addEventListener('click', buyFirstMachine);
fastForwardButtonFixed.addEventListener('click', handleFastForwardButtonClick);
purchaseMachineButton.addEventListener('click', handlePurchaseMachineButtonClick);
upgradeSpeedPanelButton.addEventListener('click', handleUpgradeSpeedPanelButtonClick);
upgradeProductionPanelButton.addEventListener('click', handleUpgradeProductionPanelButtonClick);

// Initial UI update
updateUI();
