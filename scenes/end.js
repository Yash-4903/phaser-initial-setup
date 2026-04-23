class End extends Phaser.Scene {
    constructor() {
        super('End');

        this.LAYOUT_PORTRAIT = {
            // No image assets
        };

        this.LAYOUT_LANDSCAPE = {
            // No image assets
        };
    }

    create() {
        this.createEndUI();
        this.onOrientationChange();
        this.uiEditor = new UIEditor(this, {
            enabled: true,
            keys: this.getEditorKeys(),
            gridSize: 10,
            fileName: 'end.js'
        });
    }

    getEditorKeys() {
        return [
            // No image assets
        ];
    }

    createEndUI() {
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
}
