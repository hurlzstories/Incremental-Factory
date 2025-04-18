// Get references to HTML elements
const creditsDisplay = document.getElementById('credits');
const buyFabricatorButton = document.getElementById('buy-fabricator');
const fastForwardButton = document.getElementById('fast-forward');
const fabricatorList = document.getElementById('fabricator-list');

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
    fastForwardButton.textContent = isFastForwarding ? `Fast Forward (On)` : `Fast Forward (Off)`;

    // Update the visual fabricator list
    fabricatorList.innerHTML = ''; // Clear the previous list
    for (let i = 0; i < fabricatorCount; i++) {
        const bar = document.createElement('div');
        bar.classList.add('fabricator-bar');
        const square = document.createElement('div');
        square.classList.add('fabricator-square');
        bar.appendChild(square);
        fabricatorList.appendChild(bar);
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
    updateUI(); // Update the button text and fabricator list
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
