class Bridge extends Phaser.GameObjects.Container {
    constructor(scene, island1, island2) {
        super(scene, 0, 0);
        scene.add.existing(this);
        
        this.island1 = island1;
        this.island2 = island2;
        this.createBridge();
    }

    createBridge() {
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(4, 0x8b4513);
        
        const line = new Phaser.Geom.Line(
            this.island1.x,
            this.island1.y,
            this.island2.x,
            this.island2.y
        );
        
        graphics.strokeLineShape(line);
        this.add(graphics);
    }
}
