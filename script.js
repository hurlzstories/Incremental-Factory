// Get references to HTML elements
const creditsDisplay = document.getElementById('credits');
const buyFabricatorButton = document.getElementById('buy-fabricator');
const fastForwardButton = document.getElementById('fast-forward');
const fabricatorsDisplay = document.getElementById('fabricators');

// Game state variables
let credits = 100;
let fabricatorCount = 0;
let fabricatorBaseCost = 75;
let fabricatorCost = fabricatorBaseCost;
let productionInterval = 1000; // Normal production interval (1 second)
let fastForwardMultiplier = 25; // How much faster the game runs when fast forward is active
let isFastForwarding = false;
let productionLoop; // Variable to hold the interval

// Function to update the UI
function updateUI() {
    creditsDisplay.textContent = `Credits: ${credits}`;
    buyFabricatorButton.textContent = `Buy Shape Fabricator (Cost: ${fabricatorCost})`;
    fabricatorsDisplay.textContent = `Shape Fabricators: ${fabricatorCount}`;
    fastForwardButton.textContent = isFastForwarding ? `Fast Forward (On)` : `Fast Forward (Off)`;
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

// Function to toggle fast forward
function toggleFastForward() {
    isFastForwarding = !isFastForwarding;
    clearInterval(productionLoop); // Clear the existing interval

    if (isFastForwarding) {
        productionLoop = setInterval(() => {
            credits += fabricatorCount * fastForwardMultiplier;
            updateUI();
        }, productionInterval / fastForwardMultiplier); // Run much faster
    } else {
        productionLoop = setInterval(() => {
            credits += fabricatorCount;
            updateUI();
        }, productionInterval); // Resume normal speed
    }
    updateUI(); // Update the button text
}

// Event listener for the buy button
buyFabricatorButton.addEventListener('click', buyFabricator);

// Event listener for the Fast Forward button (now a toggle)
fastForwardButton.addEventListener('click', toggleFastForward);

// Initial UI update
updateUI();

// Initial production loop
productionLoop = setInterval(() => {
    credits += fabricatorCount;
    updateUI();
}, productionInterval);
