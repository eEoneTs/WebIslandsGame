class Island extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        this.resources = 0;
        this.selected = false;
        this.isActive = false;

        this.createVisuals();
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
    }

    createVisuals() {
        // Base graphics for the island
        this.graphics = this.scene.add.graphics();
        this.updateVisuals();

        // Resource counter
        this.resourceText = this.scene.add.text(0, -40, '0', {
            fontSize: '16px',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 4, y: 4 },
            borderRadius: 5
        });
        this.resourceText.setOrigin(0.5);
        this.add(this.resourceText);
    }

    updateVisuals() {
        this.graphics.clear();

        // Draw selection highlight if selected
        if (this.selected) {
            this.graphics.lineStyle(3, 0xffff00);
            this.graphics.strokeCircle(0, 0, 45);
        }

        // Draw island base (песок)
        this.graphics.lineStyle(1, 0xd4b483);
        this.graphics.fillStyle(0xd4b483);
        this.graphics.fillCircle(0, 0, 40);

        // Draw vegetation (трава и деревья)
        this.graphics.lineStyle(1, this.isActive ? 0x2d572c : 0x1a3d1c);
        this.graphics.fillStyle(this.isActive ? 0x2d572c : 0x1a3d1c);

        // Основная растительность
        this.graphics.fillCircle(0, 0, 35);

        // Маленькие деревья
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2;
            const x = Math.cos(angle) * 20;
            const y = Math.sin(angle) * 20;

            this.graphics.fillStyle(this.isActive ? 0x1a3d1c : 0x122d14);
            this.graphics.fillTriangle(
                x, y - 10,
                x - 8, y + 5,
                x + 8, y + 5
            );
        }

        // Добавляем графику в контейнер
        this.add(this.graphics);
    }

    setSelected(selected) {
        this.selected = selected;
        this.updateVisuals();
    }

    setActive(active) {
        this.isActive = active;
        this.updateVisuals();
    }

    update() {
        // Removed automatic resource generation
    }

    generateResource() {
        this.resources++;
        this.resourceText.setText(this.resources.toString());
        this.scene.resourceManager.addWood(1);
    }
}