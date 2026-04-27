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
        this._applyLayout();
        this.scale.off('resize', this._applyLayout, this);
        this.scale.on('resize', this._applyLayout, this);
    }

    _applyLayout() {
        const isLandscape = this.scale.width > this.scale.height;
        const layout = isLandscape ? this.LAYOUT_LANDSCAPE : this.LAYOUT_PORTRAIT;
        for (const key in layout) {
            if (!layout.hasOwnProperty(key) || !this[key]) continue;
            const { x, y, scale, depth } = layout[key];
            this[key].setPosition(x, y);
            if (scale !== undefined) this[key].setScale(scale);
            if (depth !== undefined) this[key].setDepth(depth);
        }
    }

    reflowForResize() { this._applyLayout(); }
}
