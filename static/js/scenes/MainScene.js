class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.islands = [];
        this.bridges = [];
        this.resourceManager = null;
        this.selectedIsland = null;
        this.waves = [];
    }

    preload() {
        // Load SVG assets directly as shapes will be drawn programmatically
    }

    create() {
        // Add water background
        this.createWaterBackground();
        this.resourceManager = new ResourceManager(this);
        this.generateIslands();
        this.setupInput();
        this.loadGameState();
    }

    createWaterBackground() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x2389da, 0.6); // Более реалистичный голубой цвет для воды
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Создаем волны с анимацией
        for (let i = 0; i < 15; i++) {
            const wave = this.add.graphics();
            wave.lineStyle(2, 0x3399ff, 0.3);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const wave_obj = {
                graphics: wave,
                y: y,
                offset: Phaser.Math.Between(0, Math.PI * 2),
                speed: 0.02 + Math.random() * 0.02
            };
            this.waves.push(wave_obj);
        }
    }

    generateIslands() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        const spacing = 200; // Расстояние между островами

        // Создаем острова в форме креста
        const positions = [
            { x: centerX, y: centerY }, // Центр
            { x: centerX - spacing, y: centerY }, // Левый
            { x: centerX + spacing, y: centerY }, // Правый
            { x: centerX, y: centerY - spacing }, // Верхний
            { x: centerX, y: centerY + spacing }  // Нижний
        ];

        positions.forEach((pos, index) => {
            const island = new Island(this, pos.x, pos.y);
            if (index === 0) {
                island.setActive(true); // Активируем только центральный остров
            }
            this.islands.push(island);
        });
    }

    setupInput() {
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject instanceof Island && gameObject.isActive) {
                if (this.selectedIsland) {
                    this.selectedIsland.setSelected(false);
                    if (this.selectedIsland !== gameObject) {
                        this.tryBuildBridge(this.selectedIsland, gameObject);
                    }
                    this.selectedIsland = null;
                } else {
                    this.selectedIsland = gameObject;
                    gameObject.setSelected(true);
                    // Generate resource on click
                    gameObject.generateResource();
                }
            }
        });
    }

    tryBuildBridge(island1, island2) {
        if (this.resourceManager.wood >= 10 && !this.bridgeExists(island1, island2)) {
            const bridge = new Bridge(this, island1, island2);
            this.bridges.push(bridge);
            this.resourceManager.spendWood(10);
            island2.setActive(true); // Активируем остров после постройки моста
            this.saveGameState();
        }
    }

    bridgeExists(island1, island2) {
        return this.bridges.some(bridge => 
            (bridge.island1 === island1 && bridge.island2 === island2) ||
            (bridge.island1 === island2 && bridge.island2 === island1)
        );
    }

    saveGameState() {
        const gameState = {
            wood: this.resourceManager.wood,
            islands: this.islands.map(island => ({
                x: island.x,
                y: island.y,
                resources: island.resources,
                isActive: island.isActive
            })),
            bridges: this.bridges.map(bridge => ({
                island1Index: this.islands.indexOf(bridge.island1),
                island2Index: this.islands.indexOf(bridge.island2)
            }))
        };
        localStorage.setItem('islandGameState', JSON.stringify(gameState));
    }

    loadGameState() {
        const savedState = localStorage.getItem('islandGameState');
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.resourceManager.wood = gameState.wood;
            gameState.islands.forEach((islandData, index) => {
                this.islands[index].setActive(islandData.isActive);
            });
        }
    }

    update() {
        // Анимация волн
        this.waves.forEach(wave => {
            wave.graphics.clear();
            wave.graphics.lineStyle(2, 0x3399ff, 0.3);
            wave.graphics.beginPath();
            wave.graphics.moveTo(0, wave.y);

            for (let x = 0; x < this.cameras.main.width; x += 30) {
                const y = wave.y + Math.sin(x * 0.02 + wave.offset + this.time.now * 0.0001) * 5;
                if (x === 0) {
                    wave.graphics.moveTo(x, y);
                } else {
                    wave.graphics.lineTo(x, y);
                }
            }
            wave.graphics.strokePath();
        });

        this.islands.forEach(island => island.update());
        this.resourceManager.update();
    }
}