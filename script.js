const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let islands = [];
let bridges = [];
let resources = { wood: 0 };
let selectedIsland = null;
let graphics;
let resourceText;

function create() {
    graphics = this.add.graphics();

    // Интерфейс: ресурсы
    resourceText = this.add.text(10, 10, 'Wood: 0', { fontSize: '20px', fill: '#fff' });

    createIsland(400, 300); // Стартовый остров

    this.input.on('pointerdown', (pointer) => {
        let clickedIsland = islands.find(island =>
            Phaser.Math.Distance.Between(island.x, island.y, pointer.x, pointer.y) < 30
        );

        if (clickedIsland) {
            selectedIsland = clickedIsland;
        } else if (selectedIsland && resources.wood >= 10) {
            let newIsland = createIsland(pointer.x, pointer.y);
            createBridge(selectedIsland, newIsland);
            resources.wood -= 10;
        }
    });

    // Таймер для генерации ресурсов (каждые 3 секунды)
    this.time.addEvent({
        delay: 3000,
        callback: generateResources,
        callbackScope: this,
        loop: true
    });
}

function update() {
    drawGame();
    updateUI();
}

function createIsland(x, y) {
    let island = { x, y, woodProduction: 2 };
    islands.push(island);
    return island;
}

function createBridge(island1, island2) {
    bridges.push({ x1: island1.x, y1: island1.y, x2: island2.x, y2: island2.y });
}

function generateResources() {
    islands.forEach(island => {
        resources.wood += island.woodProduction;
    });
}

function updateUI() {
    resourceText.setText(`Wood: ${resources.wood}`);
}

function drawGame() {
    graphics.clear();

    // Рисуем мосты
    graphics.lineStyle(4, 0x8B4513);
    bridges.forEach(bridge => {
        graphics.strokeLineShape(new Phaser.Geom.Line(bridge.x1, bridge.y1, bridge.x2, bridge.y2));
    });

    // Рисуем острова
    islands.forEach(island => {
        graphics.fillStyle(0x228B22, 1);
        graphics.fillCircle(island.x, island.y, 30);
    });
}
