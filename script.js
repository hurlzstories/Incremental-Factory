const buyButton = document.querySelector('.buy-button'); // We might not need this reference anymore
const creditsDisplay = document.getElementById('credits');
const fastForwardButtonFixed = document.getElementById('fast-forward-button-fixed');
const shapeIndicator = document.querySelector('.shape-indicator');
const triangleIcon = document.querySelector('.triangle-icon');
const circleIcon = document.querySelector('.circle-icon');
const topSection = document.querySelector('.top-section');
const purchaseMachineButton = document.getElementById('purchase-machine-button');
const upgradeSpeedPanelButton = document.getElementById('upgrade-speed-panel-button'); // May not be needed
const upgradeProductionPanelButton = document.getElementById('upgrade-production-panel-button'); // May not be needed
const machine1Info = document.getElementById('machine-1-info'); // Reference to machine info in sidebar
const speedUpgradeStatus = document.getElementById('speed-upgrade-status'); // May not be needed
const productionUpgradeStatus = document.getElementById('production-upgrade-status'); // May not be needed
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
// const speedUpgradeCost = 100; // No longer global
// const productionUpgradeCost = 150; // No longer global
let hasSpeedUpgrade = false; // May not be needed
let hasProductionUpgrade = false; // May not be needed
let isFastForwardActive = false;
const fastForwardMultiplier = 500; // How much faster the game runs
const machineUpgrades = {}; // Object to store upgrades for each machine

function updateUI() {
    if (!creditsDisplay) return;
    creditsDisplay.textContent = `Credits: ${credits}`;

    renderMachines(); // This handles both rendering machines and the side panel upgrades
}

function buyFirstMachine() {
    if (credits >= firstMachineCost) {
        credits -= firstMachineCost;
        machineCount++;
        machineUpgrades[1] = { speed: false, production: false, cost: firstMachineCost }; // Store the cost
        additionalMachineCost = firstMachineCost * 3;
        startProduction();
        updateUI();
    }
}

function buyAdditionalMachine() {
    if (credits >= additionalMachineCost) {
        const costOfNewMachine = additionalMachineCost; // Store the cost of the new machine
        credits -= costOfNewMachine;
        machineCount++;
        machineUpgrades[machineCount] = { speed: false, production: false, cost: costOfNewMachine / 3 }; // Store the cost (previous additional cost)
        additionalMachineCost *= 3;
        updateUI();
    }
}

function renderMachines() {
    if (!mainContent || !sidePanel) return;
    mainContent.innerHTML = '';
    const upgradesContainer = sidePanel.querySelector('.upgrades-container');
    if (upgradesContainer) {
        upgradesContainer.innerHTML = '';
    } else {
        const newUpgradesContainer = document.createElement('div');
        newUpgradesContainer.classList.add('upgrades-container');
        sidePanel.appendChild(newUpgradesContainer);
    }

    for (let i = 1; i <= machineCount; i++) {
        const machineContainer = document.createElement('div');
        machineContainer.classList.add('machine-container');
        machineContainer.id = `machine-${i}`;

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
        machineLabel.textContent = `Machine ${i}`;

        machineContainer.appendChild(machineOutline);
        machineContainer.appendChild(machineLabel);
        mainContent.appendChild(machineContainer);

        // Update the side panel with upgrade options for each machine
        const machineUpgradeSection = document.createElement('div');
        machineUpgradeSection.classList.add('machine-upgrade-section');

        const machineNameHeader = document.createElement('h4');
        machineNameHeader.textContent = `Machine ${i} Upgrades`;
        machineUpgradeSection.appendChild(machineNameHeader);

        const speedUpgradeCostForMachine = Math.round(machineUpgrades[i].cost * 1.5);
        const speedUpgradeButton = document.createElement('button');
        speedUpgradeButton.textContent = `Speed Upgrade (Cost: ${speedUpgradeCostForMachine})`;
        speedUpgradeButton.classList.add('speed-upgrade');
        speedUpgradeButton.dataset.machineId = i;
        speedUpgradeButton.disabled = machineUpgrades[i].speed || credits < speedUpgradeCostForMachine;
        speedUpgradeButton.addEventListener('click', handleIndividualSpeedUpgrade);
        machineUpgradeSection.appendChild(speedUpgradeButton);

        const productionUpgradeCostForMachine = Math.round(machineUpgrades[i].cost * 1.5);
        const productionUpgradeButton = document.createElement('button');
        productionUpgradeButton.textContent = `Production Upgrade (Cost: ${productionUpgradeCostForMachine})`;
        productionUpgradeButton.classList.add('production-upgrade');
        productionUpgradeButton.dataset.machineId = i;
        productionUpgradeButton.disabled = machineUpgrades[i].production || credits < productionUpgradeCostForMachine;
        productionUpgradeButton.addEventListener('click', handleIndividualProductionUpgrade);
        machineUpgradeSection.appendChild(productionUpgradeButton);

        sidePanel.querySelector('.upgrades-container').appendChild(machineUpgradeSection);
    }
}

function startProduction() {
    clearInterval(productionLoop); // Clear any existing interval
    if (machineCount > 0) {
        const interval = isFastForwardActive ? productionInterval / fastForwardMultiplier : productionInterval;
        productionLoop = setInterval(() => {
            let totalCreditsEarned = 0;
            for (let i = 1; i <= machineCount; i++) {
                let productionRate = 1;
                if (machineUpgrades[i].production) {
                    productionRate *= 1.25; // Apply production bonus
                }
                totalCreditsEarned += productionRate;
            }
            credits += totalCreditsEarned;
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

function handleIndividualSpeedUpgrade(event) {
    const machineId = parseInt(event.target.dataset.machineId);
    const upgradeCost = Math.round(machineUpgrades[machineId].cost * 1.5);
    if (credits >= upgradeCost && !machineUpgrades[machineId].speed) {
        credits -= upgradeCost;
        machineUpgrades[machineId].speed = true;
        productionInterval *= 0.8; // Global speed increase for all machines
        updateUI();
    }
}

function handleIndividualProductionUpgrade(event) {
    const machineId = parseInt(event.target.dataset.machineId);
    const upgradeCost = Math.round(machineUpgrades[machineId].cost * 1.5);
    if (credits >= upgradeCost && !machineUpgrades[machineId].production) {
        credits -= upgradeCost;
        machineUpgrades[machineId].production = true;
        updateUI();
        startProduction(); // Restart production to apply the bonus immediately
    }
}

// Event listeners
if (fastForwardButtonFixed) fastForwardButtonFixed.addEventListener('click', handleFastForwardButtonClick);
if (purchaseMachineButton) purchaseMachineButton.addEventListener('click', handlePurchaseMachineButtonClick);

// Initial UI update
updateUI();
