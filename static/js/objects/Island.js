class Island extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
        
        this.resources = 0;
        this.resourceTimer = 0;
        this.resourceInterval = 2000; // 2 seconds
        
        this.createVisuals();
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
    }

    createVisuals() {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, 0x00ff00);
        graphics.fillStyle(0x2d572c);
        graphics.fillCircle(0, 0, 30);
        graphics.strokeCircle(0, 0, 30);
        this.add(graphics);

        const resourceText = this.scene.add.text(0, 0, '0', {
            fontSize: '16px',
            fill: '#ffffff'
        });
        resourceText.setOrigin(0.5);
        this.add(resourceText);
        this.resourceText = resourceText;
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
        this.scene.resourceManager.addWood(1);
    }
}
