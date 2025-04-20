const buyFabricatorButton = document.getElementById('buy-fabricator');
const factoryRepresentation = document.getElementById('factory-representation');
const factoryOutline = document.querySelector('#factory-representation .factory-outline');
const upgradeChoiceModal = document.getElementById('upgrade-choice-modal');
const creditsDisplay = document.getElementById('credits'); // Get the credits display
const upgradeMenuButton = document.getElementById('upgrade-menu-button'); // Get the upgrade button
const fastForwardButton = document.getElementById('fast-forward'); // Get the fast forward button

let fabricatorCount = 0;
let hasFirstFabricator = false;

function updateVisuals() {
    if (fabricatorCount > 0) {
        const factoryIcon = factoryOutline.querySelector('.factory-icon');
        if (!factoryIcon) {
            const newFactoryIcon = document.createElement('div');
            newFactoryIcon.classList.add('factory-icon');
            factoryOutline.appendChild(newFactoryIcon);
            creditsDisplay.classList.remove('hidden'); // Show credits after first purchase
            upgradeMenuButton.classList.remove('hidden'); // Show upgrade button
            fastForwardButton.classList.remove('hidden'); // Show fast forward button
        }
        if (!hasFirstFabricator) {
            upgradeChoiceModal.style.display = 'block';
            hasFirstFabricator = true;
        }
    } else {
        factoryOutline.innerHTML = '<div class="factory-icon"></div>';
        upgradeChoiceModal.style.display = 'none';
        hasFirstFabricator = false;
        creditsDisplay.classList.add('hidden'); // Hide credits initially
        upgradeMenuButton.classList.add('hidden'); // Hide upgrade button initially
        fastForwardButton.classList.add('hidden'); // Hide fast forward button initially
    }
}

function buyFabricator() {
    fabricatorCount++;
    updateVisuals();
}

buyFabricatorButton.addEventListener('click', buyFabricator);

// Initial call to ensure the default state is set
updateVisuals();
