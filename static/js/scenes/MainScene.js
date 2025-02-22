class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.islands = [];
        this.bridges = [];
        this.resourceManager = null;
        this.selectedIsland = null;
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
        graphics.fillStyle(0x4444ff, 0.3); // Светло-синий цвет для воды
        graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

        // Добавляем волны
        for (let i = 0; i < 10; i++) {
            const wave = this.add.graphics();
            wave.lineStyle(2, 0x6666ff, 0.2);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            wave.beginPath();
            wave.moveTo(0, y);
            for (let x = 0; x < this.cameras.main.width; x += 30) {
                wave.lineTo(x, y + Math.sin(x * 0.05) * 5);
            }
            wave.strokePath();
        }
    }

    generateIslands() {
        const numIslands = 5;
        for (let i = 0; i < numIslands; i++) {
            const x = Phaser.Math.Between(100, 700);
            const y = Phaser.Math.Between(100, 500);
            const island = new Island(this, x, y);
            this.islands.push(island);
        }
    }

    setupInput() {
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject instanceof Island) {
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
                resources: island.resources
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
            // Restore islands and bridges state
        }
    }

    update() {
        this.islands.forEach(island => island.update());
        this.resourceManager.update();
    }
}