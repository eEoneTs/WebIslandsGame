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
        // Создаем спрайт острова
        const spriteKey = `${this.type}-island`;
        this.sprite = this.scene.add.sprite(0, 0, spriteKey);
        this.sprite.setScale(0.5); // Настройте масштаб под ваши спрайты
        this.add(this.sprite);

        // Добавляем выделение
        this.selectionGraphics = this.scene.add.graphics();
        this.add(this.selectionGraphics);

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
        this.selectionGraphics.clear();
        
        // Рисуем выделение если остров выбран
        if (this.selected) {
            this.selectionGraphics.lineStyle(3, 0xffff00);
            this.selectionGraphics.strokeRect(-35, -35, 70, 70);
        }

        // Настраиваем прозрачность в зависимости от активности
        this.sprite.alpha = this.isActive ? 1 : 0.6;
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