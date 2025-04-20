const buyButton = document.querySelector('.buy-button'); // We might not need this reference anymore
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
const mainContent = document.querySelector('.main-content'); // Get the main content area

let credits = 100;
let machineCount = 0; // Track the number of machines
let machinePurchased = false; // For the first machine
let productionInterval = 1000; // Default: 1 credit per second per machine
let productionLoop;
let firstMachineCost = 100; // Price of the first machine
let additionalMachineCost = 300; // Initial value for the second machine
const speedUpgradeCost = 100; // Example cost
const productionUpgradeCost = 150; // Example cost
let hasSpeedUpgrade = false;
let hasProductionUpgrade = false;
let isFastForwardActive = false;
const fastForwardMultiplier = 100; // How much faster the game runs

function updateUI() {
    if (!creditsDisplay) return;
    creditsDisplay.textContent = `Credits: ${credits}`;

    if (machineCount > 0) {
        if (shapeIndicator) shapeIndicator.style.display = 'block';
        if (machine1Info) machine1Info.style.display = 'block'; // Show machine info in sidebar after purchase
        if (purchaseMachineButton) {
            purchaseMachineButton.textContent = `Buy Another Machine (Cost: ${additionalMachineCost})`;
            purchaseMachineButton.style.display = 'block';
        }
    } else {
        if (shapeIndicator) shapeIndicator.style.display = 'none';
        if (machine1Info) machine1Info.style.display = 'none'; // Hide initially
        if (purchaseMachineButton) {
            purchaseMachineButton.textContent = `Buy First Machine (Cost: ${firstMachineCost})`;
            purchaseMachineButton.style.display = 'block';
        }
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
            upgradeSpeedPanelButton.disabled = machineCount === 0 || credits < speedUpgradeCost;
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
            upgradeProductionPanelButton.disabled = machineCount === 0 || credits < productionUpgradeCost;
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

    // Render the machines in the main content area
    renderMachines();
}

function buyFirstMachine() {
    if (credits >= firstMachineCost) {
        credits -= firstMachineCost;
        machineCount++;
        additionalMachineCost = firstMachineCost * 3; // Set the price for the next machine
        startProduction();
        updateUI();
    }
}

function buyAdditionalMachine() {
    if (credits >= additionalMachineCost) {
        credits -= additionalMachineCost;
        machineCount++;
        additionalMachineCost *= 3; // Increase the price for the next machine
        updateUI(); // Re-render the machines
    }
}

function renderMachines() {
    if (!mainContent) return;
    mainContent.innerHTML = ''; // Clear existing machines
    for (let i = 0; i < machineCount; i++) {
        const machineContainer = document.createElement('div');
        machineContainer.classList.add('machine-container');
        machineContainer.id = `machine-${i + 1}`; // Unique ID for each machine

        const machineOutline = document.createElement('div');
        machineOutline.classList.add('machine-outline');

        const topSectionDiv = document.createElement('div');
        topSectionDiv.classList.add('top-section');

        const shapeDiv = document.createElement('div');
        shapeDiv.classList.add('shape-indicator');

        topSectionDiv.appendChild(shapeDiv);
        machineOutline.appendChild(topSectionDiv);

        const machineLabel = document.createElement('div');
        machineLabel.classList.add('machine-label');
        machineLabel.textContent = `Machine ${i + 1}`;

        machineContainer.appendChild(machineOutline);
        machineContainer.appendChild(machineLabel);
        mainContent.appendChild(machineContainer);

        // Directly hide the shape indicator for the first machine
        if (i === 0 && shapeIndicator) {
            shapeIndicator.style.display = 'none';
        }
    }
}

function startProduction() {
    clearInterval(productionLoop); // Clear any existing interval
    if (machineCount > 0) {
        const baseProductionRate = 1; // Default credits per machine per interval
        let currentProductionRate = baseProductionRate;

        if (hasProductionUpgrade) {
            currentProductionRate *= 1.25; // Apply 25% increase
        }

        const interval = isFastForwardActive ? productionInterval / fastForwardMultiplier : productionInterval;
        productionLoop = setInterval(() => {
            credits += machineCount * currentProductionRate;
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
    if (machineCount === 0) {
        buyFirstMachine();
    } else {
        buyAdditionalMachine();
    }
}

function handleUpgradeSpeedPanelButtonClick() {
    if (machineCount > 0 && credits >= speedUpgradeCost && !hasSpeedUpgrade && upgradeSpeedPanelButton) {
        credits -= speedUpgradeCost;
        hasSpeedUpgrade = true;
        productionInterval *= 0.8; // Example speed increase from upgrade
        startProduction();
        updateUI();
    }
}

function handleUpgradeProductionPanelButtonClick() {
    if (machineCount > 0 && credits >= productionUpgradeCost && !hasProductionUpgrade && upgradeProductionPanelButton) {
        credits -= productionUpgradeCost;
        hasProductionUpgrade = true;
        startProduction(); // Re-start production to apply the bonus
        updateUI();
    }
}

// Event listeners
// We no longer need the buyButton event listener
if (fastForwardButtonFixed) fastForwardButtonFixed.addEventListener('click', handleFastForwardButtonClick);
if (purchaseMachineButton) purchaseMachineButton.addEventListener('click', handlePurchaseMachineButtonClick);
if (upgradeSpeedPanelButton) upgradeSpeedPanelButton.addEventListener('click', handleUpgradeSpeedPanelButtonClick);
if (upgradeProductionPanelButton) upgradeProductionPanelButton.addEventListener('click', handleUpgradeProductionPanelButtonClick);

// Initial UI update
updateUI();
