const buyFabricatorButton = document.getElementById('buy-fabricator');
const factoryContainer = document.getElementById('factory-container');
const upgradeChoiceModal = document.getElementById('upgrade-choice-modal');

let fabricatorCount = 0;
let hasFirstFabricator = false;

function updateVisuals() {
    if (fabricatorCount > 0) {
        const factoryIcon = factoryContainer.querySelector('.factory-icon');
        if (!factoryIcon) {
            const newFactoryIcon = document.createElement('div');
            newFactoryIcon.classList.add('factory-icon');
            factoryContainer.appendChild(newFactoryIcon);
        }
        if (!hasFirstFabricator) {
            upgradeChoiceModal.style.display = 'block';
            hasFirstFabricator = true;
        }
    } else {
        factoryContainer.innerHTML = '<div class="factory-icon"></div>';
        upgradeChoiceModal.style.display = 'none';
        hasFirstFabricator = false;
    }
}

function buyFabricator() {
    fabricatorCount++;
    updateVisuals();
}

buyFabricatorButton.addEventListener('click', buyFabricator);

// Initial call to ensure the default state is set
updateVisuals();
