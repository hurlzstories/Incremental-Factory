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
const sidePanel = document.getElementById('side-panel');
const speedIndicator = document.querySelector('.speed-indicator');
const productionIndicator = document.querySelector('.production-indicator');

let credits = 100;
let machineCount = 0; // Track the number of machines
let machinePurchased = false; // For the first machine
let productionInterval = 1000; // Default: 1 credit per second per machine
let productionLoop;
const firstMachineCost = 100; // Updated initial cost
const speedUpgradeCost = 100; // Example cost
const productionUpgradeCost = 150; // Example cost
let hasSpeedUpgrade = false;
let hasProductionUpgrade = false;
let isFastForwardActive = false;
const fastForwardMultiplier = 2; // How much faster the game runs

function updateUI() {
    if (!creditsDisplay) return;
    creditsDisplay.textContent = `Credits: ${credits}`;

    if (machinePurchased) {
        if (buyButton) buyButton.style.display = 'none';
        if (shapeIndicator) shapeIndicator.style.display = 'block';
        if (machine1Info) machine1Info.style.display = 'block'; // Show machine info in sidebar after purchase
    } else {
        if (buyButton) {
            buyButton.style.display = 'block';
            buyButton.textContent = `BUY (Cost: ${firstMachineCost})`;
        }
        if (shapeIndicator) shapeIndicator.style.display = 'none';
        if (machine1Info) machine1Info.style.display = 'none'; // Hide initially
    }

    // Show upgrade icons in the machine info ONLY if the upgrade is purchased
    if (speedIndicator) speedIndicator.style.display = hasSpeedUpgrade ? 'inline-block' : 'none';
    if (productionIndicator) productionIndicator.style.display = hasProductionUpgrade ? 'inline-block' : 'none';

    if (topSection) topSection.justifyContent = (hasSpeedUpgrade || hasProductionUpgrade) ? 'flex-start' : 'center';

    if (upgradeSpeedPanelButton) {
        upgradeSpeedPanelButton.className = 'speed-upgrade'; // Apply class for shape
        if (hasSpeedUpgrade) {
            upgradeSpeedPanelButton.style.display = 'none'; // Hide the button
            if (speedUpgradeStatus) speedUpgradeStatus.textContent = 'Speed Upgraded';
        } else {
            upgradeSpeedPanelButton.textContent = `Speed Upgrade (Cost: ${speedUpgradeCost})`;
            upgradeSpeedPanelButton.disabled = !machinePurchased || credits < speedUpgradeCost;
            upgradeSpeedPanelButton.style.display = 'block';
            if (speedUpgradeStatus) speedUpgradeStatus.textContent = '';
        }
    }

    if (upgradeProductionPanelButton) {
        upgradeProductionPanelButton.className = 'production-upgrade'; // Apply class for shape
        if (hasProductionUpgrade) {
            upgradeProductionPanelButton.style.display = 'none'; // Hide the button
            if (productionUpgradeStatus) productionUpgradeStatus.textContent = 'Production Upgraded';
        } else {
            upgradeProductionPanelButton.textContent = `Production Upgrade (Cost: ${productionUpgradeCost})`;
            upgradeProductionPanelButton.disabled = !machinePurchased || credits < productionUpgradeCost;
            upgradeProductionPanelButton.style.display = 'block';
            if (productionUpgradeStatus) productionUpgradeStatus.textContent = '';
        }
    }

    // Hide upgrade section if both are bought
    if (hasSpeedUpgrade && hasProductionUpgrade && sidePanel) {
        sidePanel.classList.add('upgrades-complete');
    } else if (sidePanel) {
        sidePanel.classList.remove('upgrades-complete');
    }

    if (fastForwardButtonFixed) fastForwardButtonFixed.textContent = `Fast Forward (${isFastForwardActive ? 'On' : 'Off'})`;
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
    clearInterval(productionLoop); // Clear any existing interval
    if (machinePurchased) {
        const interval = isFastForwardActive ? productionInterval / fastForwardMultiplier : productionInterval;
        productionLoop = setInterval(() => {
            credits += machineCount; // Credits per second per machine
            updateUI();
        }, interval);
    }
}

function handleFastForwardButtonClick() {
    isFastForwardActive = !isFastForwardActive;
    startProduction(); // Restart production with the new interval
    updateUI();
}

function handlePurchaseMachineButtonClick() {
    console.log("Purchase Machine button clicked!");
    // Logic to purchase additional machines will go here
}

function handleUpgradeSpeedPanelButtonClick() {
    if (machinePurchased && credits >= speedUpgradeCost && !hasSpeedUpgrade && upgradeSpeedPanelButton) {
        credits -= speedUpgradeCost;
        hasSpeedUpgrade = true;
        productionInterval *= 0.8; // Example speed increase from upgrade
        startProduction();
        updateUI();
    }
}

function handleUpgradeProductionPanelButtonClick() {
    if (machinePurchased && credits >= productionUpgradeCost && !hasProductionUpgrade && upgradeProductionPanelButton) {
        credits -= productionUpgradeCost;
        hasProductionUpgrade = true;
        // Example production increase - for now, just visual
        updateUI();
    }
}

// Event listeners
if (buyButton) buyButton.addEventListener('click', buyFirstMachine);
if (fastForwardButtonFixed) fastForwardButtonFixed.addEventListener('click', handleFastForwardButtonClick);
if (purchaseMachineButton) purchaseMachineButton.addEventListener('click', handlePurchaseMachineButtonClick);
if (upgradeSpeedPanelButton) upgradeSpeedPanelButton.addEventListener('click', handleUpgradeSpeedPanelButtonClick);
if (upgradeProductionPanelButton) upgradeProductionPanelButton.addEventListener('click', handleUpgradeProductionPanelButtonClick);

// Initial UI update
updateUI();
