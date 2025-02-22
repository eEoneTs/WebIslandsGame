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
        this.resourceManager = new ResourceManager(this);
        this.generateIslands();
        this.setupInput();
        this.loadGameState();
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