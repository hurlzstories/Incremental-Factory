const buyButton = document.querySelector('.buy-button');
const upgradeChoiceModal = document.getElementById('upgrade-choice-modal');
const creditsDisplay = document.getElementById('credits');
const upgradeMenuButton = document.getElementById('upgrade-menu-button');
const fastForwardButton = document.getElementById('fast-forward');

let machineCount = 0; // Using machineCount instead of fabricatorCount
let hasFirstMachine = false;

function updateVisuals() {
    if (machineCount > 0 && !hasFirstMachine) {
        upgradeChoiceModal.style.display = 'block';
        creditsDisplay.classList.remove('hidden');
        upgradeMenuButton.classList.remove('hidden');
        fastForwardButton.classList.remove('hidden');
        hasFirstMachine = true;
    } else {
        upgradeChoiceModal.style.display = 'none';
    }
}

function buyMachine() {
    machineCount++;
    updateVisuals();
    // For now, we're just tracking the first purchase for the modal
    // Actual cost and credit logic will come later
}

buyButton.addEventListener('click', buyMachine);

// Initial call
updateVisuals();
