// Get references to HTML elements
const creditsDisplay = document.getElementById('credits');
const buyFabricatorButton = document.getElementById('buy-fabricator');
const fastForwardButton = document.getElementById('fast-forward');
const factoryContainer = document.getElementById('factory-container');
const upgradeContainerTop = document.querySelector('#upgrade-container .upgrade-icon-top'); // Target the top half
const upgradeChoiceModal = document.getElementById('upgrade-choice-modal');
const chooseSpeedUpgradeButton = document.getElementById('choose-speed-upgrade');
const chooseProductionUpgradeButton = document.getElementById('choose-production-upgrade');
const upgradeMenuButton = document.getElementById('upgrade-menu-button');

// Game state variables
let credits = 100;
let fabricatorCount = 0; // We'll likely only have one visual representation for now
let fabricatorBaseCost = 75;
let fabricatorCost = fabricatorBaseCost;
let productionInterval = 1000; // Normal production interval (1 second)
let fastForwardMultiplier = 25; // How much faster the game runs when fast forward is active
let isFastForwarding = false;
let productionLoop; // Variable to hold the interval
let hasFirstFabricator = false;
let firstUpgradeChosen = null; // 'speed' or 'production'
let upgradeMenuVisible = false; // Track if the upgrade menu is open (will be used later)
let upgradeCost = 25; // Initial cost of the first upgrade

// Function to update the UI
function updateUI() {
    creditsDisplay.textContent = `Credits: ${credits}`;
    buyFabricatorButton.textContent = `Buy Shape Fabricator (Cost: ${fabricatorCost})`;
    fastForwardButton.textContent = isFastForwarding ? `Fast Forward (On)` : `Fast Forward (Off)`;
    upgradeMenuButton.classList.toggle('hidden', fabricatorCount === 0 || firstUpgradeChosen === null);
    upgradeMenuButton.textContent = `Upgrades (Cost: ${upgradeCost})`; // Update button text

    // Update the visual representation
    const factoryIcon = factoryContainer.querySelector('.factory-icon');
    if (fabricatorCount > 0) {
        if (!factoryIcon) {
            const newFactoryIcon = document.createElement('div');
            newFactoryIcon.classList.add('factory-icon');
            factoryContainer.appendChild(newFactoryIcon);
        }
    } else {
        factoryContainer.innerHTML = '<div class="factory-icon"></div>'; // Ensure a default is present or clear if no factories
    }

    upgradeContainerTop.innerHTML = ''; // Clear previous upgrade icon
    if (firstUpgradeChosen === 'speed' && fabricatorCount > 0) {
        const triangle = document.createElement('div');
        triangle.classList.add('upgrade-icon', 'triangle-icon');
        upgradeContainerTop.appendChild(triangle);
    } else if (firstUpgradeChosen === 'production' && fabricatorCount > 0) {
        const circle = document.createElement('div');
        circle.classList.add('upgrade-icon', 'circle-icon');
        upgradeContainerTop.appendChild(circle);
    }

    // Show the upgrade choice modal after the first fabricator is bought
    if (fabricatorCount > 0 && !hasFirstFabricator && firstUpgradeChosen === null) {
        upgradeChoiceModal.style.display = 'block';
        hasFirstFabricator = true;
    } else {
        upgradeChoiceModal.style.display = 'none';
    }
}

// Function to handle buying a Shape Fabricator
function buyFabricator() {
    if (credits >= fabricatorCost) {
        credits -= fabricatorCost;
        fabricatorCount++;
        fabricatorCost *= 2; // Double the cost for the next one
        updateUI();
    }
}

// Function to handle choosing the speed upgrade
function chooseSpeedUpgrade() {
    firstUpgradeChosen = 'speed';
    updateUI(); // Hide the modal and show the upgrade button
}

// Function to handle choosing the production upgrade
function chooseProductionUpgrade() {
    firstUpgradeChosen = 'production';
    updateUI(); // Hide the modal and show the upgrade button
}

// Function to handle buying the first upgrade
function buyFirstUpgrade() {
    if (firstUpgradeChosen && credits >= upgradeCost) {
        credits -= upgradeCost;
        // We'll apply the upgrade effect in the production loop later
        updateUI();
        // Disable the upgrade menu button after purchase for this initial phase
        upgradeMenuButton.disabled = true;
    }
}

// Function to toggle fast forward
function toggleFastForward() {
    isFastForwarding = !isFastForwarding;
    clearInterval(productionLoop); // Clear the existing interval

    if (isFastForwarding) {
        productionLoop = setInterval(() => {
            let currentProduction = fabricatorCount;
            if (firstUpgradeChosen === 'production') {
                currentProduction *= 1.5; // Apply 0.5x quantity buff
            } else if (firstUpgradeChosen === 'speed') {
                // We'll implement the speed increase by reducing the interval
            }
            credits += currentProduction * fastForwardMultiplier;
            updateUI();
        }, productionInterval / fastForwardMultiplier); // Run much faster
    } else {
        productionLoop = setInterval(() => {
            let currentProduction = fabricatorCount;
            if (firstUpgradeChosen === 'production') {
                currentProduction *= 1.5; // Apply 0.5x quantity buff
            } else if (firstUpgradeChosen === 'speed') {
                // We'll implement the speed increase by reducing the interval
            }
            credits += currentProduction;
            updateUI();
        }, productionInterval); // Resume normal speed
    }
    updateUI(); // Update the button text
}

// Event listeners
buyFabricatorButton.addEventListener('click', buyFabricator);
fastForwardButton.addEventListener('click', toggleFastForward);
chooseSpeedUpgradeButton.addEventListener('click', chooseSpeedUpgrade);
chooseProductionUpgradeButton.addEventListener('click', chooseProductionUpgrade);
upgradeMenuButton.addEventListener('click', buyFirstUpgrade);

// Initial UI update
updateUI();

// Initial production loop
productionLoop = setInterval(() => {
    let currentProduction = fabricatorCount;
    if (firstUpgradeChosen === 'production') {
        currentProduction *= 1.5; // Apply 0.5x quantity buff
    } else if (firstUpgradeChosen === 'speed') {
        // We'll implement the speed increase by reducing the interval
    }
    credits += currentProduction;
    updateUI();
}, productionInterval);
