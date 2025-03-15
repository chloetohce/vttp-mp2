class Boot extends Phaser.Scene {
    constructor() {
        super({
            key: 'boot'
        })
    }

    preload() {
        this.load.plugin('rexanchorplugin', 
            'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexanchorplugin.min.js', 
            true);
    }
}