class Island extends Phaser.GameObjects.Container {
    constructor(scene, x, y, type = 'forest') {
        super(scene, x, y);
        scene.add.existing(this);

        this.resources = 0;
        this.selected = false;
        this.isActive = false;
        this.type = type;

        this.createVisuals();
        this.setInteractive(new Phaser.Geom.Rectangle(-30, -30, 60, 60), Phaser.Geom.Rectangle.Contains);
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
            this.graphics.strokeRect(-35, -35, 70, 70);
        }

        // Draw island base (земля)
        this.graphics.lineStyle(1, 0xd4b483);
        this.graphics.fillStyle(0xd4b483);
        this.graphics.fillRect(-30, -30, 60, 60);

        // Draw vegetation (деревья и трава)
        const color = this.isActive ? 0x2d572c : 0x1a3d1c;
        const darkColor = this.isActive ? 0x1a3d1c : 0x122d14;

        this.graphics.lineStyle(1, color);
        this.graphics.fillStyle(color);
        this.graphics.fillRect(-25, -25, 50, 50);

        // Добавляем детали в зависимости от типа острова
        switch (this.type) {
            case 'forest':
                // Деревья (маленькие зеленые квадраты)
                this.graphics.fillStyle(darkColor);
                for (let i = 0; i < 4; i++) {
                    const x = (i % 2) * 20 - 15;
                    const y = Math.floor(i / 2) * 20 - 15;
                    this.graphics.fillRect(x, y, 10, 10);
                }
                break;
            case 'mountain':
                // Горы (треугольники)
                this.graphics.fillStyle(0x808080);
                for (let i = 0; i < 2; i++) {
                    const x = i * 20 - 15;
                    this.graphics.beginPath();
                    this.graphics.moveTo(x, 10);
                    this.graphics.lineTo(x + 15, -15);
                    this.graphics.lineTo(x + 30, 10);
                    this.graphics.closePath();
                    this.graphics.fill();
                }
                break;
            case 'mine':
                // Шахта (темные круги)
                this.graphics.fillStyle(0x4a4a4a);
                for (let i = 0; i < 3; i++) {
                    const x = (i % 2) * 20 - 10;
                    const y = Math.floor(i / 2) * 20 - 10;
                    this.graphics.fillCircle(x, y, 8);
                }
                break;
        }

        // Добавляем графику в контейнер
        this.add(this.graphics);
    }

    setSelected(selected) {
        this.selected = selected;
        this.updateVisuals();
    }

    setActive(active) {
        console.log('Setting island active:', active); // Debug log
        this.isActive = active;
        this.updateVisuals();
    }

    update() {
        // Removed automatic resource generation
    }

    generateResource() {
        console.log('Generating resource for island'); // Debug log
        this.resources++;
        this.resourceText.setText(this.resources.toString());
        this.scene.resourceManager.addWood(1);
    }
}