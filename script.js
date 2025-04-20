const buyButton = document.querySelector('.buy-button'); // We might not need this reference anymore
const creditsDisplay = document.getElementById('credits');
const timeWarpButton = document.getElementById('time-warp-button'); // Renamed button reference
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
// let isFastForwardActive = false; // No longer needed
const fastForwardMultiplier = 2; // No longer directly used
const machineUpgrades = {}; // Object to store upgrades for each machine

function updateUI() {
    if (!creditsDisplay) return;
    creditsDisplay.textContent = `Credits: ${credits}`;

    // Update the purchase button text based on whether the first machine is bought
    if (purchaseMachineButton) {
        if (machineCount === 0) {
            purchaseMachineButton.textContent = `Buy First Machine (Cost: ${firstMachineCost})`;
        } else {
            purchaseMachineButton.textContent = `Buy Another Machine (Cost: ${additionalMachineCost})`;
        }
    }

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

        // Add upgrade icons to the machine outline
        if (machineUpgrades[i].speed) {
            const speedIcon = document.createElement('div');
            speedIcon.classList.add('upgrade-icon', 'speed-icon');
            topSectionDiv.appendChild(speedIcon);
        }
        if (machineUpgrades[i].production) {
            const productionIcon = document.createElement('div');
            productionIcon.classList.add('upgrade-icon', 'production-icon');
            topSectionDiv.appendChild(productionIcon);
        }

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
        if (!machineUpgrades[i].speed) { // Only append if not purchased
            machineUpgradeSection.appendChild(speedUpgradeButton);
        }

        const productionUpgradeCostForMachine = Math.round(machineUpgrades[i].cost * 1.5);
        const productionUpgradeButton = document.createElement('button');
        productionUpgradeButton.textContent = `Production Upgrade (Cost: ${productionUpgradeCostForMachine})`;
        productionUpgradeButton.classList.add('production-upgrade');
        productionUpgradeButton.dataset.machineId = i;
        productionUpgradeButton.disabled = machineUpgrades[i].production || credits < productionUpgradeCostForMachine;
        if (!machineUpgrades[i].production) { // Only append if not purchased
            machineUpgradeSection.appendChild(productionUpgradeButton);
        }

        sidePanel.querySelector('.upgrades-container').appendChild(machineUpgradeSection);
    }
}

function startProduction() {
    clearInterval(productionLoop); // Clear any existing interval
    if (machineCount > 0) {
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
        }, productionInterval); // Keep the regular production interval
    }
}

function handleTimeWarpButtonClick() {
    if (machineCount > 0) {
        const fourHoursInMilliseconds = 4 * 60 * 60 * 1000;
        const productionRatePerInterval = 1; // Base production per machine per interval
        let totalCreditsEarned = 0;

        for (let i = 1; i <= machineCount; i++) {
            let productionMultiplier = 1;
            if (machineUpgrades[i].production) {
                productionMultiplier = 1.25;
            }
            const creditsPerMachine = (fourHoursInMilliseconds / productionInterval) * productionRatePerInterval * productionMultiplier;
            totalCreditsEarned += creditsPerMachine;
        }
        credits += Math.floor(totalCreditsEarned); // Add the accumulated credits
        updateUI();
    }
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
        updateUI();
        startProduction(); // Restart to apply new interval (even though speed is global)
    }
}

function handleIndividualProductionUpgrade(event) {
    const machineId = parseInt(event.target.dataset.machineId);
    const upgradeCost = Math.round(machineUpgrades[machineId].cost * 1.5);
    if (credits >= upgradeCost && !machineUpgrades[machineId].production) {
        credits -= upgradeCost;
        machineUpgrades[machineId].production = true;
        updateUI();
        startProduction(); // Restart to apply bonus
    }
}

// Event listeners
if (timeWarpButton) timeWarpButton.addEventListener('click', handleTimeWarpButtonClick); // Changed listener
if (purchaseMachineButton) purchaseMachineButton.addEventListener('click', handlePurchaseMachineButtonClick);

// Initial UI update
updateUI();
startProduction(); // Ensure production starts automatically
