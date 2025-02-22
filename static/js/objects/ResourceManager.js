class ResourceManager {
    constructor(scene) {
        this.scene = scene;
        this.wood = 0;
        this.woodDisplay = document.getElementById('wood-count');
        this.updateDisplay();
    }

    addWood(amount) {
        this.wood += amount;
        this.updateDisplay();
    }

    spendWood(amount) {
        if (this.wood >= amount) {
            this.wood -= amount;
            this.updateDisplay();
            return true;
        }
        return false;
    }

    updateDisplay() {
        this.woodDisplay.textContent = `Wood: ${this.wood}`;
    }

    update() {
        // Additional resource management logic can be added here
    }
}
