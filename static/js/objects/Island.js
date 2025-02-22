class Island extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        this.resources = 0;
        this.resourceTimer = 0;
        this.resourceInterval = 5000; // Changed to 5 seconds
        this.selected = false;

        this.createVisuals();
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
    }

    createVisuals() {
        // Base graphics for the island
        this.graphics = this.scene.add.graphics();
        this.updateVisuals();

        // Resource counter
        this.resourceText = this.scene.add.text(0, 0, '0', {
            fontSize: '16px',
            fill: '#ffffff'
        });
        this.resourceText.setOrigin(0.5);
        this.add(this.resourceText);
    }

    updateVisuals() {
        this.graphics.clear();

        // Draw selection highlight if selected
        if (this.selected) {
            this.graphics.lineStyle(3, 0xffff00);
            this.graphics.strokeCircle(0, 0, 35);
        }

        // Draw island
        this.graphics.lineStyle(2, 0x00ff00);
        this.graphics.fillStyle(0x2d572c);
        this.graphics.fillCircle(0, 0, 30);
        this.graphics.strokeCircle(0, 0, 30);
    }

    setSelected(selected) {
        this.selected = selected;
        this.updateVisuals();
    }

    update() {
        const time = this.scene.time.now;
        if (time > this.resourceTimer) {
            this.generateResource();
            this.resourceTimer = time + this.resourceInterval;
        }
    }

    generateResource() {
        this.resources++;
        this.resourceText.setText(this.resources.toString());
        this.scene.resourceManager.addWood(1); // Changed to add only 1 wood
    }
}