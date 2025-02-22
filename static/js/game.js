const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#1a1a1a',
    scene: MainScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

// Initialize Telegram WebApp
window.Telegram.WebApp.ready();
