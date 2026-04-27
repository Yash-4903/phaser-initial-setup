class Start extends Phaser.Scene {
    constructor() {
        super('Start');

        // ── Portrait layout ──────────────────────────────────────────────────
        this.LAYOUT_PORTRAIT = {
            bg: { x: 540, y: 960, scale: 1 },
            ring: { x: 540, y: 730, scale: 0.8, depth: 2 },
            playBtn: { x: 494, y: 730, scale: 0.731, depth: 3 },
            titleText: { x: 540, y: 422, scale: 2.35, depth: 4 },
};

        // ── Landscape layout ─────────────────────────────────────────────────
        this.LAYOUT_LANDSCAPE = {
            bg: { x: 960, y: 540, scale: 1 },
            ring: { x: 979, y: 555, scale: 1, angle: -35.04, alpha: 0.9, depth: 2 },
            playBtn: { x: 919, y: 550, scale: 1, depth: 3 },
            titleText: { x: 973, y: 221, scale: 2, depth: 4 },
};
    }

    // ─────────────────────────────────────────────────────────────────────────
    preload() {
        this._registerProgressEvents();
        this._loadAllAssets();
    }

    // ─────────────────────────────────────────────────────────────────────────
    create() {
        this._destroyLoadingScreen();
        this._buildUI();
        this._startRingRotation();
        this._attachPlayButton();
        this.onOrientationChange();

        this.uiEditor = new UIEditor(this, {
            enabled: true,
            keys: ['bg', 'ring', 'playBtn', 'titleText'],
            gridSize: 10,
            fileName: 'start.js'
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // RAW-GRAPHICS LOADING SCREEN  (no assets needed)
    // ─────────────────────────────────────────────────────────────────────────
    // ─────────────────────────────────────────────────────────────────────────
    // LOADING SCREEN  ——  "Playable Factory" style
    //
    //  Layout (both orientations, centred):
    //   ┌─────────────────────────────────────────────────────────┐
    //   │  [symbol grid]  full-screen subtle dark navy tile bg    │
    //   │                                                          │
    //   │       [wavy gear]  cx=50%W  cy=44%H  — ROTATES         │
    //   │       [play ▶]     slightly left-of-centre inside gear  │
    //   │                                                          │
    //   │   [PLAYABLE      bottom 78–90%H  white bold two-line   │
    //   │    FACTORY]      centred                                │
    //   │                                                          │
    //   │  [progress bar]  very bottom edge, full width, thin     │
    //   └─────────────────────────────────────────────────────────┘
    // ─────────────────────────────────────────────────────────────────────────
    
    // ── Repeating game-symbol tile grid ──────────────────────────────────────
    _drawSymbolGrid(g, W, H) {
        const symbols  = ['triangle', 'circle', 'square', 'cross', 'dash'];
        const gridSize = Math.round(Math.min(W, H) * 0.072);
        const cols     = Math.ceil(W / gridSize) + 1;
        const rows     = Math.ceil(H / gridSize) + 1;
        const lineW    = Math.max(2, gridSize * 0.07);
        const colHex   = 0x3a5a88;
        const a        = 0.18;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const sx   = col * gridSize + gridSize * 0.5;
                const sy   = row * gridSize + gridSize * 0.5;
                const type = symbols[(row * cols + col) % symbols.length];
                const s    = gridSize * 0.28;
                g.lineStyle(lineW, colHex, a);
                switch (type) {
                    case 'triangle':
                        g.strokeTriangle(sx, sy - s, sx - s * 0.87, sy + s * 0.5, sx + s * 0.87, sy + s * 0.5);
                        break;
                    case 'circle':
                        g.strokeCircle(sx, sy, s);
                        break;
                    case 'square':
                        g.strokeRect(sx - s, sy - s, s * 2, s * 2);
                        break;
                    case 'cross':
                        g.lineBetween(sx - s, sy - s, sx + s, sy + s);
                        g.lineBetween(sx + s, sy - s, sx - s, sy + s);
                        break;
                    case 'dash':
                        g.lineBetween(sx, sy - s, sx, sy + s);
                        break;
                }
            }
        }
    }

    // ── Wavy / scalloped gear ring — angleOffset rotates the wave ────────────
    _drawWavyGear(g, cx, cy, R, angleOffset) {
        const waves     = 14;
        const amplitude = R * 0.135;
        const strokeW   = Math.max(10, R * 0.115);
        const steps     = 512;
        g.clear();
        g.lineStyle(strokeW, 0xffffff, 1);
        g.beginPath();
        for (let i = 0; i <= steps; i++) {
            const theta = (i / steps) * Math.PI * 2 + angleOffset;
            const wave  = Math.sin(theta * waves) * amplitude;
            const r     = R + wave;
            const px    = cx + Math.cos(theta) * r;
            const py    = cy + Math.sin(theta) * r;
            if (i === 0) g.moveTo(px, py);
            else         g.lineTo(px, py);
        }
        g.closePath();
        g.strokePath();
        // Inner dark circle to give hollow ring look
        g.fillStyle(0x0d1b2a, 1);
        g.fillCircle(cx, cy, R - strokeW * 0.55);
    }

    // ── Orange gradient play ▶ triangle ──────────────────────────────────────
    _drawPlayTriangle(g, cx, cy, size) {
        g.clear();
        const h  = size;
        const w  = size * 0.88;
        const x0 = cx - w * 0.35;
        const x1 = cx + w * 0.65;
        const yT = cy - h * 0.5;
        const yB = cy + h * 0.5;
        g.fillStyle(0xff9500, 1);
        g.fillTriangle(x0, yT, x0, yB, x1, cy);
        g.fillStyle(0xffcc00, 0.50);
        g.fillTriangle(x0, yT, x0, cy - h * 0.05, x1 - w * 0.22, cy - h * 0.24);
        g.fillStyle(0xb85500, 0.32);
        g.fillTriangle(x0, cy + h * 0.08, x0, yB, x1, cy);
    }
    _registerProgressEvents() {
        this.load.on('progress', (value) => {
            const { _progressFill: fill, _pBarX: bx, _pBarY: by,
                    _pBarW: bw, _pBarH: bh } = this;
            if (!fill) return;
            fill.clear();
            const fw = Math.max(bh, bw * value);
            fill.fillStyle(0xff9500, 1);
            fill.fillRect(bx, by, fw, bh);
            // Shimmer gleam
            fill.fillStyle(0xffffff, 0.45);
            fill.fillRoundedRect(bx + fw - bh * 0.9, by + bh * 0.1,
                                  bh * 0.7, bh * 0.35, bh * 0.18);
        });
    }

    _destroyLoadingScreen() {
        this._gearRotating = false;
        if (this._loadOverlay)  this._loadOverlay.destroy();
        if (this._patternGfx)   this._patternGfx.destroy();
        if (this._gearGfx)      this._gearGfx.destroy();
        if (this._playGfx)      this._playGfx.destroy();
        if (this._loadTitle)    this._loadTitle.destroy();
        if (this._progressBg)   this._progressBg.destroy();
        if (this._progressFill) this._progressFill.destroy();
    }

    // ── Spin the gear every frame during preload ──────────────────────────────
    update(time, delta) {
        if (!this._gearRotating || !this._gearGfx) return;
        this._gearAngle += delta * 0.0006;  // ~0.6 rad/sec — smooth slow spin
        this._drawWavyGear(
            this._gearGfx,
            this._gearCx, this._gearCy, this._gearR,
            this._gearAngle
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ASSET LOADING  — start assets + all game scene assets
    // ─────────────────────────────────────────────────────────────────────────
    _loadAllAssets() {
        // Start screen
        this.load.image('start_bg', 'assets/start/start_bg.png');
        this.load.image('ring',     'assets/start/ring.svg');
        this.load.image('play_btn', 'assets/start/play.svg');

        // Game screen assets (loaded here so Game scene starts instantly)
        this.load.image('game_bg',     'assets/game/bg.jpeg');
        this.load.image('water',       'assets/game/water.jpeg');
        this.load.image('water_front', 'assets/game/water-front.png');
        this.load.image('ball',        'assets/game/ball.png');
        this.load.image('barrel',      'assets/game/barrel.png');
        this.load.image('bucket',      'assets/game/bucket.png');
        this.load.image('treasure',    'assets/game/treasure.png');

        this.load.atlas('atlas', 'assets/start/atlas.png', 'assets/start/sprites.json');
        
        // Logo animation sprite sheet
        this.load.spritesheet('logo_anim', 'assets/game/i-want-a-animation-s.png', {
            frameWidth: 512,
            frameHeight: 512
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UI ELEMENTS
    // ─────────────────────────────────────────────────────────────────────────
    _buildUI() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Background
        this.bg = this.add.image(W / 2, H / 2, 'start_bg')
            .setDepth(0).setDisplaySize(W, H);

        // Semi-transparent dark overlay for contrast
        const overlay = this.add.graphics().setDepth(1);
        overlay.fillGradientStyle(0x020810, 0x020810, 0x081830, 0x081830, 0.55);
        overlay.fillRect(0, 0, W, H);

        // Floating bubbles decoration
        this._spawnBubbles(W, H);

        // === Title ===
        this.titleText = this.add.image(0, 0, "atlas", "sprite37")
            .setDepth(4)
            .setAlpha(0)
            .setOrigin(0.5)
            .setScale(1);

        

        // === Ring (spins, sits behind/around play button) ===
        this.ring = this.add.image(0, 0, 'ring').setDepth(2).setAlpha(0);

        // === Play button ===
        this.playBtn = this.add.image(0, 0, 'play_btn')
            .setDepth(3).setAlpha(0)
            .setInteractive({ useHandCursor: true });

        // === Tap label ===
        

        // ── Entrance animations ──────────────────────────────────────────────
        this.tweens.add({ targets: this.titleText, alpha: 1, y: `+=${0}`, duration: 550, delay: 100, ease: 'Back.easeOut' });
        this.tweens.add({ targets: this.subTitle,  alpha: 1, duration: 550, delay: 250, ease: 'Power2' });
        this.tweens.add({ targets: this.ring,      alpha: 0.9, duration: 600, delay: 400, ease: 'Power2' });
        this.tweens.add({ targets: this.playBtn,   alpha: 1, duration: 600, delay: 550, ease: 'Back.easeOut',
            onComplete: () => {
                // pulse after appearing
                this.tweens.add({ targets: this.playBtn, scaleX: '+=0.06', scaleY: '+=0.06',
                    duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
                // blink tap label
                this.tweens.add({ targets: this.tapLabel, alpha: 1, duration: 400,
                    onComplete: () => {
                        this.tweens.add({ targets: this.tapLabel, alpha: 0.2, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
                    }
                });
            }
        });
    }

    _spawnBubbles(W, H) {
        for (let i = 0; i < 20; i++) {
            const r  = Phaser.Math.Between(8, 30);
            const bx = Phaser.Math.Between(r, W - r);
            const by = Phaser.Math.Between(H * 0.55, H - r);
            const g  = this.add.graphics().setDepth(1).setAlpha(0.22);
            g.lineStyle(2, 0x87CEEB, 1);
            g.strokeCircle(bx, by, r);
            const dur = Phaser.Math.Between(3500, 7500);
            this.tweens.add({
                targets: g, y: `-=${H * 0.65}`, alpha: 0,
                duration: dur, repeat: -1,
                delay: Phaser.Math.Between(0, dur), ease: 'Linear'
            });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    _startRingRotation() {
        this.tweens.add({
            targets: this.ring, angle: 360,
            duration: 6000, repeat: -1, ease: 'Linear'
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    _attachPlayButton() {
        this.playBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: this.playBtn,
                scaleX: 0.1, scaleY: 0.1,
                duration: 110, ease: 'Power2', yoyo: true,
                onComplete: () => {
                    this.cameras.main.fadeOut(400, 0, 0, 0);
                    this.time.delayedCall(420, () => this.scene.start('Game'));
                }
            });
        });
        this.playBtn.on('pointerover', () => this.playBtn.setTint(0xffe066));
        this.playBtn.on('pointerout',  () => this.playBtn.clearTint());
    }

    onOrientationChange() {
        this._applyLayout();
        this.scale.off('resize', this._applyLayout, this);
        this.scale.on('resize', this._applyLayout, this);
    }

    _applyLayout() {
        const W = this.scale.width;
        const H = this.scale.height;
        const isLandscape = W > H;
        const layout = isLandscape ? this.LAYOUT_LANDSCAPE : this.LAYOUT_PORTRAIT;

        if (this.bg) this.bg.setPosition(W / 2, H / 2).setDisplaySize(W, H);

        for (const key in layout) {
            if (!layout.hasOwnProperty(key) || !this[key]) continue;
            const { x, y, scale, depth } = layout[key];
            this[key].setPosition(x, y);
            if (scale !== undefined) this[key].setScale(scale);
            if (depth !== undefined) this[key].setDepth(depth);
        }

        if (this.subTitle && this.titleText) {
            const tl = isLandscape ? this.LAYOUT_LANDSCAPE.titleText : this.LAYOUT_PORTRAIT.titleText;
            this.subTitle.setPosition(tl.x, tl.y + (isLandscape ? 70 : 120));
        }
        if (this.tapLabel && this.playBtn) {
            const pl = isLandscape ? this.LAYOUT_LANDSCAPE.playBtn : this.LAYOUT_PORTRAIT.playBtn;
            this.tapLabel.setPosition(pl.x, pl.y + (isLandscape ? 90 : 160));
        }
    }

    reflowForResize() { this._applyLayout(); }
}