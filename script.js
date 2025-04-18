// Get references to HTML elements
const creditsDisplay = document.getElementById('credits');
const buyFabricatorButton = document.getElementById('buy-fabricator');
const fabricatorsDisplay = document.getElementById('fabricators');

// Game state variables
let credits = 100;
let fabricatorCount = 0;
let fabricatorBaseCost = 75;
let fabricatorCost = fabricatorBaseCost;
let productionInterval = 1000; // Milliseconds (1 second)

// Function to update the UI
function updateUI() {
    creditsDisplay.textContent = `Credits: ${credits}`;
    buyFabricatorButton.textContent = `Buy Shape Fabricator (Cost: ${fabricatorCost})`;
    fabricatorsDisplay.textContent = `Shape Fabricators: ${fabricatorCount}`;
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

// Event listener for the buy button
buyFabricatorButton.addEventListener('click', buyFabricator);

// Initial UI update
updateUI();

// Production loop (initially producing 1 credit per fabricator per second)
setInterval(() => {
    credits += fabricatorCount;
    updateUI();
}, productionInterval);
