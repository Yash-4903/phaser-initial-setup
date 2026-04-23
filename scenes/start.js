class Start extends Phaser.Scene {
    constructor() {
        super('Start');

        this.LAYOUT_PORTRAIT = {
            // No image assets
        };

        this.LAYOUT_LANDSCAPE = {
            // No image assets
        };
    }

    preload() {
        this.loadAllTheAssets();
    }

    create() {
        this.createUI();
        this.onOrientationChange();
        this.uiEditor = new UIEditor(this, {
            enabled: true,
            keys: this.getEditorKeys(),
            gridSize: 10,
            fileName: 'start.js'
        });
    }

    getEditorKeys() {
        return [
            // No image assets
        ];
    }

    createUI() {
        // No image assets to add
    }

    onOrientationChange() {
        this.reflowForResize({ width: this.scale.width, height: this.scale.height });
        this.scale.on('resize', this.reflowForResize, this);
    }

    reflowForResize(gameSize = { width: this.scale.width, height: this.scale.height }) {
        const isLandscape = gameSize.width > gameSize.height;
        const layout = isLandscape ? this.LAYOUT_LANDSCAPE : this.LAYOUT_PORTRAIT;

        for (const key in layout) {
            if (this[key] && layout.hasOwnProperty(key)) {
                const { x, y, scale, alpha, depth, r } = layout[key];
                this[key].setPosition(x, y).setRotation(r || 0);
                if (scale) this[key].setScale(scale);
                if (alpha !== undefined) this[key].setAlpha(alpha);
                if (depth) this[key].setDepth(depth);
            }
        }
    }

    loadAllTheAssets() {
        const assets = [
            // No image assets found
        ];

        const sfxs = [
            // No audio assets found
        ];

        for (const asset of assets) {
            this.load.image(asset.key, asset.path);
        }

        for (const sfx of sfxs) {
            this.load.audio(sfx.key, sfx.path);
        }
    }
}
