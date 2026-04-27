/**
 * GAME SCENE — Match Factory Beach Cleaner
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LAYOUT DESCRIPTION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * PORTRAIT (1080 × 1920)
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │ [barPanel]        x=538,  y=102   — wood panel holding bar + title  │
 *  │ [barTitle]        x=538,  y=82    — "CLEANLINESS" label             │
 *  │ [barLabel]        x=534,  y=143   — "0%" percentage text            │
 *  │ [barPointer]      x=70,   y=120   — sliding pointer image           │
 *  │                                                                      │
 *  │ [counterBox_*]    y=286   — 4 wood boxes, x per type                │
 *  │ [counterIcon_*]   y=260   — item icons inside boxes                 │
 *  │ [counterLabel_*]  y=340   — count labels below icons                │
 *  │                                                                      │
 *  │ [FIELD OBJECTS]   grid-distributed across beach area                │
 *  │                                                                      │
 *  │ [slotRowHandle]   x=542,  y=1776  — 7 wooden planks at bottom      │
 *  └──────────────────────────────────────────────────────────────────────┘
 *
 * LANDSCAPE (1920 × 1080)
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │ [barPanel]        x=419,  y=85                                       │
 *  │ [barTitle]        x=420,  y=70                                       │
 *  │ [barLabel]        x=420,  y=115                                      │
 *  │ [barPointer]      x=68,   y=99                                       │
 *  │ [counterBox_*]    y=234   — 4 boxes                                  │
 *  │ [counterIcon_*]   y=214                                              │
 *  │ [counterLabel_*]  y=281                                              │
 *  │ [slotRowHandle]   x=960,  y=964                                      │
 *  └──────────────────────────────────────────────────────────────────────┘
 *
 * MERGE LOGIC (FIXED)
 *  • Slots nulled IMMEDIATELY on match detection (no double-null race)
 *  • per-type _merging{} lock prevents re-entry
 *  • _compactSlots fires only after ALL 3 destroy tweens complete (done counter)
 *  • inFlight reservation prevents two taps grabbing same slot
 * ═══════════════════════════════════════════════════════════════════════════
 */

class Game extends Phaser.Scene {
    constructor() {
        super('Game');

        // ── Portrait layout (1080 × 1920) ─────────────────────────────────
        this.LAYOUT_PORTRAIT = {
            bg: { x: 541, y: 959, scale: 1.055 },
            barPanel: { x: 538, y: 102, scale: 1.75 },
            barTitle: { x: 538, y: 82, scale: 1.55, depth: 15 },
            barLabel: { x: 534, y: 143, scale: 1.6 },
            barPointer: { x: 60, y: 120, scale: 1.3, depth: 13 },
            counterBox_ball: { x: 118, y: 286, scale: 1.035 },
            counterBox_barrel: { x: 262, y: 286, scale: 1.035 },
            counterBox_bucket: { x: 410, y: 286, scale: 1.035 },
            counterBox_treasure: { x: 556, y: 286, scale: 1.035, depth: 10 },
            counterIcon_ball: { x: 118, y: 260, scale: 0.663 },
            counterIcon_barrel: { x: 264, y: 264, scale: 0.663 },
            counterIcon_bucket: { x: 412, y: 264, scale: 0.663 },
            counterIcon_treasure: { x: 556, y: 266, scale: 0.663 },
            counterLabel_ball: { x: 118, y: 340, scale: 1.15 },
            counterLabel_barrel: { x: 264, y: 340, scale: 1.15 },
            counterLabel_bucket: { x: 412, y: 340, scale: 1.15 },
            counterLabel_treasure: { x: 558, y: 340, scale: 1.15 },
            slotRowHandle: { x: 542, y: 1776 },
            gameLogo: { x: 905, y: 286, scale: 1.1, depth: 9 },
            background: { x: 414, y: 962, scale: 1.8, depth: 1 },
            hand_pointer: { x: 648, y: 340, scale: 1, depth: 1 },
            party_panic_logo: { x: 192, y: 112, scale: 1, depth: 1 },
            face01: { x: 0, y: 0, scale: 1, depth: 1 },
            face02: { x: 0, y: 0, scale: 1, depth: 1 },
            face03: { x: 0, y: 0, scale: 1, depth: 1 },
            face04: { x: 0, y: 0, scale: 1, depth: 1 },
            accessossires_change_01: { x: 0, y: 0, scale: 1, depth: 1 },
            accessossires_change_02: { x: 0, y: 0, scale: 1, depth: 1 },
            accessossires_change_03: { x: 0, y: 0, scale: 1, depth: 1 },
            accessossires_change_04: { x: 0, y: 0, scale: 1, depth: 1 },
            smil_expression: { x: 542, y: 1218, scale: 1.6, depth: 1 },
            accessories01: { x: 0, y: 0, scale: 1, depth: 1 },
            accessories02: { x: 0, y: 0, scale: 1, depth: 1 },
            accessories03: { x: 0, y: 0, scale: 1, depth: 1 },
            accessories04: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_01: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_02: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_03: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_04: { x: 0, y: 0, scale: 1, depth: 1 },
            makeup01: { x: 0, y: 0, scale: 1, depth: 1 },
            makeup02: { x: 0, y: 0, scale: 1, depth: 1 },
            makeup03: { x: 0, y: 0, scale: 1, depth: 1 },
            makeup04: { x: 0, y: 0, scale: 1, depth: 1 },
            bag01: { x: 0, y: 0, scale: 1, depth: 1 },
            bag02: { x: 0, y: 0, scale: 1, depth: 1 },
            bag03: { x: 0, y: 0, scale: 1, depth: 1 },
            bag04: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_01: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_02: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_03: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_04: { x: 0, y: 0, scale: 1, depth: 1 },
            bage_change01: { x: 0, y: 0, scale: 1, depth: 1 },
            bage_change02: { x: 0, y: 0, scale: 1, depth: 1 },
            bage_change03: { x: 0, y: 0, scale: 1, depth: 1 },
            bage_change04: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_change_01: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_change_02: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_change_03: { x: 0, y: 0, scale: 1, depth: 1 },
            shoes_change_04: { x: 0, y: 0, scale: 1, depth: 1 },
            play_now_btn: { x: 0, y: 0, scale: 1, depth: 1 },
            panic_expression: { x: 0, y: 0, scale: 1, depth: 1 },
            mockup_ui: { x: 0, y: 0, scale: 1, depth: 1 },
            touch_to_play_text: { x: 0, y: 0, scale: 1, depth: 1 },
            grow_year: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_change_01: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_change_02: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_change_03: { x: 0, y: 0, scale: 1, depth: 1 },
            dress_change_04: { x: 0, y: 0, scale: 1, depth: 1 },
};

        // ── Landscape layout (1920 × 1080) ────────────────────────────────
        this.LAYOUT_LANDSCAPE = {
            bg: { x: 960, y: 540, scale: 1.875 },
            barPanel: { x: 419, y: 85, scale: 1.3, depth: 10 },
            barTitle: { x: 416, y: 70, scale: 1.15, depth: 15 },
            barLabel: { x: 420, y: 115, scale: 1.4, depth: 16 },
            barPointer: { x: 729, y: 88, scale: 1, depth: 14 },
            counterBox_ball: { x: 123, y: 234, scale: 0.935, depth: 10 },
            counterBox_barrel: { x: 255, y: 234, scale: 0.935, depth: 10 },
            counterBox_bucket: { x: 387, y: 235, scale: 0.945, depth: 10 },
            counterBox_treasure: { x: 518, y: 234, scale: 0.935, depth: 10 },
            counterIcon_ball: { x: 124, y: 214, scale: 0.613, depth: 11 },
            counterIcon_barrel: { x: 257, y: 216, scale: 0.613, depth: 11 },
            counterIcon_bucket: { x: 387, y: 216, scale: 0.613, depth: 11 },
            counterIcon_treasure: { x: 518, y: 217, scale: 0.613, depth: 11 },
            counterLabel_ball: { x: 123, y: 281, scale: 1, depth: 12 },
            counterLabel_barrel: { x: 256, y: 282, scale: 1, depth: 12 },
            counterLabel_bucket: { x: 388, y: 282, scale: 1, depth: 12 },
            counterLabel_treasure: { x: 520, y: 282, scale: 1, depth: 12 },
            slotRowHandle: { x: 960, y: 964 },
            gameLogo: { x: 1683, y: 141, scale: 1.5, depth: 9 },
            background: { x: 954, y: 542, scale: 1, depth: 1 },
            hand_pointer: { x: 1496, y: 361, scale: 1, depth: 1 },
            party_panic_logo: { x: 203, y: 125, scale: 1, depth: 1 },
            face01: { x: 388, y: -10, scale: 1, depth: 1 },
            face02: { x: 401, y: 0, scale: 1, depth: 1 },
            face03: { x: 407, y: 182, scale: 1, depth: 1 },
            face04: { x: 790, y: 50, scale: 1, depth: 1 },
            accessossires_change_01: { x: 366, y: 435, scale: 1, depth: 1 },
            accessossires_change_02: { x: 60, y: 254, scale: 1, depth: 1 },
            accessossires_change_03: { x: 136, y: 420, scale: 1, depth: 1 },
            accessossires_change_04: { x: 1079, y: 661, scale: 1, depth: 1 },
            smil_expression: { x: 1042, y: 642, scale: 1, depth: 1 },
            accessories01: { x: 1185, y: 258, scale: 1, depth: 1 },
            accessories02: { x: 1188, y: 362, scale: 1, depth: 1 },
            accessories03: { x: 1173, y: 154, scale: 1, depth: 1 },
            accessories04: { x: 1189, y: 61, scale: 1, depth: 1 },
            dress_01: { x: 1748, y: 840, scale: 1, depth: 1 },
            dress_02: { x: 1837, y: 883, scale: 1, depth: 1 },
            dress_03: { x: 1815, y: 774, scale: 1, depth: 1 },
            dress_04: { x: 1844, y: 666, scale: 1, depth: 1 },
            makeup01: { x: 1338, y: 475, scale: 1, depth: 1 },
            makeup02: { x: 1353, y: 342, scale: 1, depth: 1 },
            makeup03: { x: 1344, y: 216, scale: 1, depth: 1 },
            makeup04: { x: 1330, y: 87, scale: 1, depth: 1 },
            bag01: { x: 1514, y: 796, scale: 1, depth: 1 },
            bag02: { x: 1498, y: 709, scale: 1, depth: 1 },
            bag03: { x: 1467, y: 617, scale: 1, depth: 1 },
            bag04: { x: 1479, y: 514, scale: 1, depth: 1 },
            shoes_01: { x: 1668, y: 715, scale: 1, depth: 1 },
            shoes_02: { x: 1672, y: 634, scale: 1, depth: 1 },
            shoes_03: { x: 1655, y: 555, scale: 1, depth: 1 },
            shoes_04: { x: 1658, y: 476, scale: 1, depth: 1 },
            bage_change01: { x: 1481, y: 381, scale: 0.6, depth: 1 },
            bage_change02: { x: 1499, y: 289, scale: 0.5, depth: 1 },
            bage_change03: { x: 1486, y: 177, scale: 0.6, depth: 1 },
            bage_change04: { x: 1488, y: 63, scale: 0.55, depth: 1 },
            shoes_change_01: { x: 1652, y: 378, scale: 0.8, depth: 1 },
            shoes_change_02: { x: 1680, y: 273, scale: 0.75, depth: 1 },
            shoes_change_03: { x: 1655, y: 179, scale: 0.7, depth: 1 },
            shoes_change_04: { x: 1648, y: 71, scale: 0.65, depth: 1 },
            mockup_ui: { x: 506, y: 415, scale: 1, depth: 1 },
            play_now_btn: { x: 158, y: 796, scale: 1, depth: 1 },
            touch_to_play_text: { x: 254, y: 802, scale: 1, depth: 1 },
            grow_year: { x: 1246, y: 494, scale: 1, depth: 1 },
            panic_expression: { x: 812, y: 696, scale: 1, depth: 1 },
            dress_change_01: { x: 1823, y: 80, scale: 0.45, depth: 1 },
            dress_change_02: { x: 1827, y: 353, scale: 0.45, depth: 1 },
            dress_change_03: { x: 1825, y: 217, scale: 0.4, depth: 1 },
            dress_change_04: { x: 1834, y: 528, scale: 0.45, depth: 1 },
};

        // Game state
        this._slots        = [];
        this._MAX_SLOTS    = 7;
        this._fieldObjects = [];
        this._cleanliness  = 0;
        this._counts       = { ball: 6, barrel: 6, bucket: 3, treasure: 3 };
        this._TOTAL        = 18;
        this._cleared      = 0;
        this._types        = ['ball', 'barrel', 'bucket', 'treasure'];
        this._activeCounters = []; // Track which counters are still visible
        
        // Combo system
        this._comboCount = 0;
        this._comboTimer = null;
        this._COMBO_WINDOW = 3000; // 3 seconds to maintain combo
        
        // Slot preview
        this._slotGlows = [];
    }

    // ─────────────────────────────────────────────────────────────────────────
    create() {
        // Reset all game state on every create() — handles scene.restart() correctly
        this._slots        = new Array(this._MAX_SLOTS).fill(null);
        this._fieldObjects = [];
        this._merging      = {};
        this._cleanliness  = 0;
        this._cleared      = 0;
        this._counts       = { ball: 6, barrel: 6, bucket: 3, treasure: 3 };
        this._gameover     = false;
        this._overlayDim     = null;
        this._endMainTxt     = null;
        this._endRestartTxt  = null;
        
        // Reset combo system
        this._comboCount = 0;
        this._comboTimer = null;
        this._slotGlows = [];

        this._buildBackground();
        this._buildCleanlinessBar();
        this._buildCounterRow();
        this._buildSlotRow();
        this._spawnFieldObjects();

        this._applyLayout();
        
        // Remove any stale listener before adding — prevents stacking on restart
        this.scale.off('resize', this._onResize, this);
        this.scale.on('resize', this._onResize, this);
        this.cameras.main.fadeIn(350);

        this.uiEditor = new UIEditor(this, {
            enabled: true,
            keys: [
                'bg',
                'gameLogo',
                'barPanel', 'barTitle', 'barLabel', 'barPointer',
                'slotRowHandle',
                'counterBox_ball',    'counterBox_barrel',    'counterBox_bucket',    'counterBox_treasure',
                'counterIcon_ball',   'counterIcon_barrel',   'counterIcon_bucket',   'counterIcon_treasure',
                'counterLabel_ball',  'counterLabel_barrel',  'counterLabel_bucket',  'counterLabel_treasure',
            ],
            gridSize: 10,
            fileName: 'game.js'
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LAYOUT SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    _getLayout() {
        return this.scale.width > this.scale.height
            ? this.LAYOUT_LANDSCAPE
            : this.LAYOUT_PORTRAIT;
    }

    _applyLayout() {
        const W = this.scale.width;
        const H = this.scale.height;
        const L = this._getLayout();

        // Background always fills screen
        if (this.bg) {
            this.bg.setPosition(W / 2, H / 2).setDisplaySize(W, H);
        }

        // All positioned keys
        const keys = [
            'barPanel', 'barTitle', 'barLabel', 'barPointer',
            'gameLogo',
            'counterBox_ball',    'counterBox_barrel',    'counterBox_bucket',    'counterBox_treasure',
            'counterIcon_ball',   'counterIcon_barrel',   'counterIcon_bucket',   'counterIcon_treasure',
            'counterLabel_ball',  'counterLabel_barrel',  'counterLabel_bucket',  'counterLabel_treasure',
        ];

        keys.forEach(key => {
            const obj = this[key];
            const cfg = L[key];
            if (!obj || !cfg) return;
            obj.setPosition(cfg.x, cfg.y);
            if (cfg.scale !== undefined) obj.setScale(cfg.scale);
            if (cfg.depth !== undefined) obj.setDepth(cfg.depth);
        });

        // Slot row — rebuild planks from handle position
        this._applySlotLayout(L);

        // Refresh bar pointer position
        this._updateBar(this._cleanliness);
    }

    _applySlotLayout(L) {
        const cfg = L.slotRowHandle;
        if (!cfg || !this.slotRowHandle) return;
        this.slotRowHandle.setPosition(cfg.x, cfg.y);
        this._redrawSlotRow();
    }

    _onResize() {
        const W = this.scale.width;
        const H = this.scale.height;
        const isLS = W > H;
        this._slotSize    = isLS ? 96  : 118;
        this._slotSpacing = isLS ? 108 : 132;
        this._applyLayout();
        this._reflowFieldObjects();
        if (this.uiEditor) this.uiEditor.setKeys(this.uiEditor.keysList);

        // Reposition win/fail overlay elements if they exist and are active
        if (this._overlayDim    && this._overlayDim.active)    this._overlayDim.setPosition(W / 2, H / 2).setSize(W, H);
        if (this._endMainTxt    && this._endMainTxt.active)    this._endMainTxt.setPosition(W / 2, H / 2 - 80);
        if (this._endRestartTxt && this._endRestartTxt.active) this._endRestartTxt.setPosition(W / 2, H / 2 + 110);
    }

    reflowForResize() { this._onResize(); }

    // Returns safe field bounds for current orientation
    _getFieldBounds() {
        const W = this.scale.width, H = this.scale.height;
        const isLS = W > H;

        if (isLS) {
            // Landscape: right of UI panel, centered in available area
            const x1 = 600, x2 = W - 600;
            const y1 = H * 0.22, y2 = H * 0.80;
            return { x1, x2, y1, y2, isLS };
        } else {
            // Portrait: tight central cluster — like the reference image
            // Center of screen, roughly 70% width and 50% height band
            const cx = W / 2, cy = H * 0.54;
            const hw = W * 0.38;   // half-width of cluster
            const hh = H * 0.26;   // half-height of cluster
            return {
                x1: cx - hw, x2: cx + hw,
                y1: cy - hh, y2: cy + hh,
                isLS
            };
        }
    }

    // Reposition live field objects into the new orientation's bounds — instant, no drag
    _reflowFieldObjects() {
        if (!this._fieldObjects || this._fieldObjects.length === 0) return;

        const { x1, x2, y1, y2, isLS } = this._getFieldBounds();
        const fieldW  = x2 - x1;
        const fieldH  = y2 - y1;
        const total   = this._fieldObjects.length;
        const cols    = isLS ? 6 : 4;
        const rows    = Math.ceil(total / cols);
        const cellW   = fieldW / cols;
        const cellH   = fieldH / rows;
        const jitterX = cellW * (isLS ? 0.25 : 0.40);
        const jitterY = cellH * (isLS ? 0.25 : 0.40);
        const objSize = Math.round(Math.min(fieldW, fieldH) * (isLS ? 0.17 : 0.15)) * 1.25;

        this._fieldObjects.forEach(({ spr, shadow }, idx) => {
            if (!spr || !spr.active) return;

            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const nx  = Phaser.Math.Clamp(
                x1 + col * cellW + cellW / 2 + Phaser.Math.Between(-jitterX, jitterX),
                x1 + objSize / 2, x2 - objSize / 2
            );
            const ny  = Phaser.Math.Clamp(
                y1 + row * cellH + cellH / 2 + Phaser.Math.Between(-jitterY, jitterY),
                y1 + objSize / 2, y2 - objSize / 2
            );

            // Kill all tweens and snap instantly to new position
            this.tweens.killTweensOf(spr);
            spr.setPosition(nx, ny).setDisplaySize(objSize, objSize);

            // Restart idle float from new position
            this.tweens.add({
                targets: spr,
                y: ny + Phaser.Math.Between(5, 10),
                duration: Phaser.Math.Between(1600, 2400),
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 600)
            });

            if (shadow && shadow.active) {
                this.tweens.killTweensOf(shadow);
                shadow.setPosition(nx + objSize * 0.18, ny + objSize * 0.38);
                shadow.setSize(objSize * 0.75, objSize * 0.22);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // BACKGROUND
    // ─────────────────────────────────────────────────────────────────────────
    _buildBackground() {
        const W = this.scale.width;
        const H = this.scale.height;
        this.bg = this.add.image(W / 2, H / 2, 'game_bg')
            .setDepth(0)
            .setDisplaySize(W, H)
            .setTint(0xffe0a0);

        // Water flowing intro animation
        this._createWaterFlowIntro();

        // Game logo — positioned by layout, fades in on start
        this.gameLogo = this.add.image(0, 0, 'atlas', 'sprite37')
            .setDepth(9).setOrigin(0.5).setAlpha(0);
        this.time.delayedCall(200, () => {
            this.tweens.add({ targets: this.gameLogo, alpha: 1, duration: 500, ease: 'Power2' });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WATER FLOW INTRO — Water flows across beach at game start
    // ─────────────────────────────────────────────────────────────────────────
    _createWaterFlowIntro() {
        const W = this.scale.width;
        const H = this.scale.height;
        const isLS = W > H;
        
        // Create multiple water layers for depth
        const numLayers = 3;
        const waterLayers = [];
        const foamLayers = [];
        
        for (let layer = 0; layer < numLayers; layer++) {
            // Increased water height for better interconnection
            const waterHeight = isLS ? H * 0.6 : H * 0.55; // Increased from 0.45/0.42
            const yOffset = layer * (waterHeight / (numLayers * 3)); // Smaller offset for more overlap
            const startY = 0; // Start from very top
            const maxY = isLS ? H * 0.35 : H * 0.38; // Stop at upper portion
            
            // Create water sprite
            const water = this.add.image(W / 2, startY + yOffset, 'water')
                .setDepth(3 + layer)
                .setOrigin(0.5, 0)
                .setAlpha(0.75 - layer * 0.1)
                .setDisplaySize(W * 1.2, waterHeight);
            
            // Create foam front sprite (positioned at water edge)
            const foam = this.add.image(W / 2, startY + yOffset, 'water_front')
                .setDepth(5 + layer)
                .setOrigin(0.5, 0)
                .setAlpha(0.9 - layer * 0.15)
                .setDisplaySize(W * 1.2, waterHeight * 0.55); // Increased from 0.45
            
            // Start both from above screen
            water.setY(-waterHeight - 50);
            foam.setY(-waterHeight - 50);
            
            waterLayers.push(water);
            foamLayers.push(foam);
            
            // Animate water flowing down to upper portion only
            this.tweens.add({
                targets: water,
                y: maxY + yOffset - waterHeight,
                duration: 1200 + layer * 200,
                ease: 'Sine.easeOut',
                delay: layer * 100
            });
            
            // Foam follows water but stays at the front edge
            this.tweens.add({
                targets: foam,
                y: maxY + yOffset - (waterHeight * 0.12),
                duration: 1200 + layer * 200,
                ease: 'Sine.easeOut',
                delay: layer * 100,
                onComplete: () => {
                    // Hold for a moment
                    if (layer === 0) {
                        this.time.delayedCall(400, () => {
                            // Recede all layers smoothly
                            this._recedeWater(waterLayers, foamLayers, waterHeight);
                        });
                    }
                }
            });
            
            // Add horizontal wave motion
            this.tweens.add({
                targets: [water, foam],
                x: W / 2 + Phaser.Math.Between(-15, 15),
                duration: 1000 + layer * 300,
                yoyo: true,
                repeat: 3,
                ease: 'Sine.easeInOut'
            });
            
            // Add foam sparkle particles at water edge
            if (layer === 0) {
                const foamInterval = this.time.addEvent({
                    delay: 60,
                    repeat: 35,
                    callback: () => {
                        if (!foam.active) {
                            foamInterval.remove();
                            return;
                        }
                        
                        const sparkle = this.add.graphics().setDepth(6);
                        sparkle.fillStyle(0xFFFFFF, 0.9);
                        const size = Phaser.Math.Between(3, 8);
                        sparkle.fillCircle(0, 0, size);
                        
                        // Add slight glow
                        sparkle.fillStyle(0xCCFFFF, 0.5);
                        sparkle.fillCircle(0, 0, size * 1.5);
                        
                        sparkle.setPosition(
                            Phaser.Math.Between(W * 0.1, W * 0.9),
                            foam.y + Phaser.Math.Between(-10, 10)
                        );
                        
                        // Foam bubbles pop and fade
                        this.tweens.add({
                            targets: sparkle,
                            scaleX: 1.8,
                            scaleY: 1.8,
                            alpha: 0,
                            duration: 500,
                            ease: 'Power2',
                            onComplete: () => sparkle.destroy()
                        });
                    }
                });
            }
        }
    }

    _recedeWater(waterLayers, foamLayers, waterHeight) {
        const W = this.scale.width;
        
        waterLayers.forEach((water, index) => {
            if (!water || !water.active) return;
            
            const foam = foamLayers[index];
            
            // Smooth recede animation - goes back up off screen
            this.tweens.add({
                targets: water,
                y: -waterHeight - 50,
                alpha: 0,
                duration: 1400 + index * 150,
                ease: 'Sine.easeIn',
                delay: index * 80,
                onComplete: () => water.destroy()
            });
            
            // Foam recedes with water
            if (foam && foam.active) {
                this.tweens.add({
                    targets: foam,
                    y: -waterHeight - 50,
                    alpha: 0,
                    duration: 1400 + index * 150,
                    ease: 'Sine.easeIn',
                    delay: index * 80,
                    onComplete: () => foam.destroy()
                });
            }
            
            // Add slight horizontal movement during recede
            this.tweens.add({
                targets: [water, foam],
                x: W / 2 + Phaser.Math.Between(-10, 10),
                duration: 700,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CLEANLINESS BAR
    // ─────────────────────────────────────────────────────────────────────────
    _buildCleanlinessBar() {
        const isLS = this.scale.width > this.scale.height;
        const cx = 310, cy = 90;

        this.barPanel = this.add.image(cx, cy, 'atlas', 'sprite2')
            .setDepth(10).setOrigin(0.5);

        this.barTitle = this.add.text(cx, cy - 25, 'CLEANLINESS', {
            fontSize:        isLS ? '20px' : '28px',
            fontFamily:      '"Arial Rounded MT Bold", Arial',
            color:           '#ffffff',
            stroke:          '#4a2500',
            strokeThickness: 10
        }).setOrigin(0.5, 1).setDepth(15);

        this.barLabel = this.add.text(cx, cy + 4, '0%', {
            fontSize:        isLS ? '20px' : '24px',
            fontFamily:      '"Arial Rounded MT Bold", Arial',
            color:           '#ffffff',
            stroke:          '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(16);

        this.barPointer = this.add.image(cx, cy, 'atlas', 'sprite11')
            .setOrigin(0, 0).setDepth(14);

        this._barMeta = { bx: cx, barW: 480 };
        this._updateBar(0);
    }

    _updateBar(pct) {
        const clampedPct = Phaser.Math.Clamp(pct, 0, 100);

        if (this.barPanel && this.barPointer) {
            const panelW = this.barPanel.displayWidth;
            const insetL = panelW * 0.01;
            const insetR = panelW * 0.06;
            const bx     = this.barPanel.x - panelW / 2 + insetL;
            const barW   = panelW - insetL - insetR;
            this._barMeta = { bx, barW };

            const halfPtr = (this.barPointer.displayWidth || 30) * 0.5;
            const minX    = bx + halfPtr;
            const maxX    = bx + barW - halfPtr;
            this.barPointer.x = Phaser.Math.Linear(minX, maxX, clampedPct / 100);
        }

        if (this.barLabel) this.barLabel.setText(`${Math.round(clampedPct)}%`);
        this._cleanliness = clampedPct;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ITEM COUNTER ROW
    // ─────────────────────────────────────────────────────────────────────────
    _buildCounterRow() {
        const isLS  = this.scale.width > this.scale.height;
        const boxW  = isLS ? 115 : 140;
        const boxH  = isLS ? 150 : 210;

        this._counterIcons  = {};
        this._counterLabels = {};
        this._activeCounters = [...this._types]; // Initialize with all types

        this._types.forEach((type, index) => {
            // Wood box background
            const box = this.add.image(0, 0, 'atlas', 'sprite14')
                .setDepth(10).setDisplaySize(boxW, boxH).setOrigin(0.5);
            this[`counterBox_${type}`] = box;

            // Item icon
            const img = this.add.image(0, 0, type)
                .setDepth(11).setOrigin(0.5);
            this[`counterIcon_${type}`] = img;
            this._counterIcons[type]    = img;

            // Count label
            const lbl = this.add.text(0, 0, `${this._counts[type]}`, {
                fontSize:        isLS ? '28px' : '36px',
                fontFamily:      '"Arial Rounded MT Bold", Arial',
                color:           '#ffffff',
                stroke:          '#000000',
                strokeThickness: 5
            }).setOrigin(0.5).setDepth(12);
            this[`counterLabel_${type}`] = lbl;
            this._counterLabels[type]    = lbl;
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SLOT ROW  (7 wooden planks at bottom)
    // ─────────────────────────────────────────────────────────────────────────
    _buildSlotRow() {
        const isLS = this.scale.width > this.scale.height;
        this._slotSize    = isLS ? 96  : 118;
        this._slotSpacing = isLS ? 108 : 132;
        this._slotY       = isLS ? 964 : 1776;

        const totalW      = this._MAX_SLOTS * this._slotSpacing;
        this._slotStartX  = (this.scale.width - totalW) / 2 + this._slotSpacing / 2;

        this._slotGfx    = [];
        this._slotSprites = new Array(this._MAX_SLOTS).fill(null);
        this._slotGlows   = [];

        for (let i = 0; i < this._MAX_SLOTS; i++) {
            const sx = this._slotStartX + i * this._slotSpacing;
            const g  = this.add.graphics().setDepth(14);
            this._drawSlotPlank(g, sx, this._slotY, this._slotSize);
            this._slotGfx.push({ g, x: sx, baseY: 0 });
            
            // Create glow effect for empty slots (initially hidden)
            const glow = this.add.graphics().setDepth(13).setAlpha(0);
            this._drawSlotGlow(glow, sx, this._slotY, this._slotSize);
            this._slotGlows.push(glow);
        }

        // Invisible handle used by UIEditor / _applyLayout to reposition row
        const rowCenterX = this._slotStartX + ((this._MAX_SLOTS - 1) / 2) * this._slotSpacing;
        this.slotRowHandle = this.add.rectangle(
            rowCenterX, this._slotY,
            totalW, this._slotSize,
            0xffffff, 0
        ).setDepth(15).setOrigin(0.5);
    }

    _drawSlotPlank(g, cx, cy, size) {
        g.clear();
        const hw = size / 2;
        const hh = size * 0.42;
        g.fillStyle(0xc88a3e, 1);
        g.fillRoundedRect(cx - hw, cy - hh, size, size * 0.84, 10);
        g.lineStyle(3, 0x8B5e2c, 1);
        g.strokeRoundedRect(cx - hw, cy - hh, size, size * 0.84, 10);
        g.fillStyle(0xd9a55a, 0.45);
        g.fillRoundedRect(cx - hw + 4, cy - hh + 4, size - 8, size * 0.22, 5);
    }

    _drawSlotGlow(g, cx, cy, size) {
        g.clear();
        const hw = size / 2;
        const hh = size * 0.42;
        // Outer glow
        g.lineStyle(8, 0x88ff88, 0.6);
        g.strokeRoundedRect(cx - hw - 4, cy - hh - 4, size + 8, size * 0.84 + 8, 12);
        // Inner glow
        g.lineStyle(4, 0xccffcc, 0.8);
        g.strokeRoundedRect(cx - hw - 2, cy - hh - 2, size + 4, size * 0.84 + 4, 11);
    }

    // Redraw slot planks from current slotRowHandle position
    _redrawSlotRow() {
        if (!this.slotRowHandle || !this._slotGfx) return;
        const cx     = this.slotRowHandle.x;
        const cy     = this.slotRowHandle.y;
        const totalW = this._MAX_SLOTS * this._slotSpacing;
        this._slotStartX = cx - totalW / 2 + this._slotSpacing / 2;
        this._slotY      = cy;

        this._slotGfx.forEach((entry, i) => {
            const sx  = this._slotStartX + i * this._slotSpacing;
            entry.x   = sx;
            entry.baseY = 0;
            this._drawSlotPlank(entry.g, sx, cy, this._slotSize);
            
            // Redraw glows at new positions
            if (this._slotGlows[i]) {
                this._drawSlotGlow(this._slotGlows[i], sx, cy, this._slotSize);
            }
        });

        // Reposition any sprites already sitting in slots
        this._slots.forEach((slot, i) => {
            if (!slot || !slot.spr || !slot.spr.active) return;
            slot.spr.setPosition(
                this._slotStartX + i * this._slotSpacing,
                this._slotY
            );
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FIELD OBJECTS  (grid-distributed, tight play area)
    // ─────────────────────────────────────────────────────────────────────────
    _spawnFieldObjects() {
        const { x1, x2, y1, y2, isLS } = this._getFieldBounds();
        const fieldW  = x2 - x1;
        const fieldH  = y2 - y1;
        const objSize = Math.round(Math.min(fieldW, fieldH) * (isLS ? 0.17 : 0.15)) * 1.25;

        const total   = 18;
        const cols    = isLS ? 6 : 4;
        const rows    = Math.ceil(total / cols);
        const cellW   = fieldW / cols;
        const cellH   = fieldH / rows;
        const jitterX = cellW * (isLS ? 0.25 : 0.40);
        const jitterY = cellH * (isLS ? 0.25 : 0.40);

        const objList = [];
        this._types.forEach(type => {
            for (let n = 0; n < this._counts[type]; n++) objList.push(type);
        });
        Phaser.Utils.Array.Shuffle(objList);

        objList.forEach((type, idx) => {
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const ox  = Phaser.Math.Clamp(
                x1 + col * cellW + cellW / 2 + Phaser.Math.Between(-jitterX, jitterX),
                x1 + objSize / 2, x2 - objSize / 2
            );
            const oy  = Phaser.Math.Clamp(
                y1 + row * cellH + cellH / 2 + Phaser.Math.Between(-jitterY, jitterY),
                y1 + objSize / 2, y2 - objSize / 2
            );

            // Drop shadow
            const shadow = this.add.ellipse(
                ox + objSize * 0.18, oy + objSize * 0.38,
                objSize * 0.75, objSize * 0.22,
                0x000000, 0.28
            ).setDepth(4);

            const spr = this.add.image(ox, oy, type)
                .setDisplaySize(objSize, objSize)
                .setAngle(Phaser.Math.Between(-20, 20))
                .setDepth(5 + (idx % 4))
                .setInteractive({ useHandCursor: true });

            // Gentle idle float
            const floatAmt = Phaser.Math.Between(5, 10);
            this.tweens.add({
                targets: [spr, shadow],
                y: `+=${floatAmt}`,
                duration: Phaser.Math.Between(1600, 2400),
                yoyo: true, repeat: -1,
                ease: 'Sine.easeInOut',
                delay: Phaser.Math.Between(0, 800)
            });

            spr.on('pointerdown', () => this._onObjectTap(spr, type, shadow));
            spr.on('pointerover', () => { 
                spr.setTint(0xffe08a); 
                spr.setScale(spr.scaleX * 1.08, spr.scaleY * 1.08);
                this._showSlotPreview();
            });
            spr.on('pointerout',  () => { 
                spr.clearTint();       
                spr.setScale(spr.scaleX / 1.08, spr.scaleY / 1.08);
                this._hideSlotPreview();
            });

            this._fieldObjects.push({ spr, type, shadow });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TAP → SLOT LOGIC
    // ─────────────────────────────────────────────────────────────────────────
    _onObjectTap(spr, type, shadow) {
        const freeIdx = this._slots.findIndex(s => s === null);
        if (freeIdx === -1) return; // all slots reserved

        this._slots[freeIdx] = { spr, type, inFlight: true };
        spr.disableInteractive();
        
        // Hide glow for this slot
        this._hideSlotGlow(freeIdx);
        this.tweens.killTweensOf(spr);

        if (shadow) {
            this.tweens.killTweensOf(shadow);
            this.tweens.add({ targets: shadow, alpha: 0, duration: 150, onComplete: () => shadow.destroy() });
        }

        const targetX    = this._slotStartX + freeIdx * this._slotSpacing;
        const targetY    = this._slotY;
        const startX     = spr.x;
        const startY     = spr.y;
        const origScale  = spr.scaleX;
        const slotFit    = (this._slotSize * 0.80) / spr.displayWidth * origScale;

        // ── Phase 1: Pop up (scale + slight rotate wobble) ────────────────
        this.tweens.add({
            targets: spr,
            scaleX: origScale * 1.45, scaleY: origScale * 1.45,
            angle: spr.angle > 0 ? spr.angle + 15 : spr.angle - 15,
            duration: 110, ease: 'Back.easeOut',
            onComplete: () => {

                // ── Phase 2: Arc flight ───────────────────────────────────
                const arcH  = Math.min(300, Math.abs(startY - targetY) * 0.55 + 100);
                const proxy = { t: 0 };

                this.tweens.add({
                    targets: proxy, t: 1,
                    duration: 400, ease: 'Cubic.easeIn',
                    onUpdate: () => {
                        const t = proxy.t, it = 1 - t;
                        spr.x = startX * it + targetX * t;
                        const midY = Math.min(startY, targetY) - arcH;
                        spr.y = it * it * startY + 2 * it * t * midY + t * t * targetY;
                        // Scale shrinks during flight
                        spr.setScale(origScale * 1.45 * it + slotFit * t);
                    },
                    onComplete: () => this._landInSlot(spr, type, freeIdx, slotFit)
                });

                // Straighten angle during flight
                this.tweens.add({ targets: spr, angle: 0, duration: 400, ease: 'Power2' });
            }
        });

        const fi = this._fieldObjects.findIndex(o => o.spr === spr);
        if (fi !== -1) this._fieldObjects.splice(fi, 1);
    }

    _landInSlot(spr, type, slotIdx, slotFit) {
        const sx = this._slotStartX + slotIdx * this._slotSpacing;
        const sy = this._slotY;
        const sc = slotFit || (this._slotSize * 0.80) / spr.displayWidth * spr.scaleX;

        spr.setPosition(sx, sy).setScale(sc).setDepth(16).setAngle(0);
        this._slots[slotIdx] = { spr, type };

        // ── Plank depress ─────────────────────────────────────────────────
        const plankEntry = this._slotGfx[slotIdx];
        if (plankEntry) {
            const g = plankEntry.g;
            this._drawSlotPlank(g, sx, sy + 8,  this._slotSize * 0.90);
            this.time.delayedCall(90,  () => this._drawSlotPlank(g, sx, sy - 3, this._slotSize * 1.03));
            this.time.delayedCall(170, () => this._drawSlotPlank(g, sx, sy,     this._slotSize));
        }

        // ── Land squish → bounce back ─────────────────────────────────────
        this.tweens.add({
            targets: spr,
            scaleX: sc * 1.35, scaleY: sc * 0.65,
            duration: 90, ease: 'Power3.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: spr, scaleX: sc * 0.9, scaleY: sc * 1.1,
                    duration: 100, ease: 'Power2',
                    onComplete: () => {
                        this.tweens.add({
                            targets: spr, scaleX: sc, scaleY: sc,
                            duration: 120, ease: 'Back.easeOut',
                            onComplete: () => {
                                // ── Gentle idle bob in slot ───────────────
                                this.tweens.add({
                                    targets: spr,
                                    y: sy - 6,
                                    duration: Phaser.Math.Between(700, 1000),
                                    yoyo: true, repeat: -1,
                                    ease: 'Sine.easeInOut',
                                    delay: Phaser.Math.Between(0, 300)
                                });
                            }
                        });
                    }
                });
            }
        });

        this.time.delayedCall(200, () => {
            this._checkForMatch(type);
            // Check failure: all slots confirmed (no nulls, no inFlight) and no match cleared them
            this.time.delayedCall(250, () => {
                if (this._gameover) return;
                const allFull = this._slots.every(s => s !== null && !s.inFlight);
                if (allFull) this._onFail();
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SLOT PREVIEW SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    _showSlotPreview() {
        // Show glow on all empty slots
        this._slots.forEach((slot, i) => {
            if (slot === null && this._slotGlows[i]) {
                this.tweens.add({
                    targets: this._slotGlows[i],
                    alpha: 0.7,
                    duration: 200,
                    ease: 'Power2'
                });
                // Pulse animation
                this.tweens.add({
                    targets: this._slotGlows[i],
                    alpha: 0.4,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    _hideSlotPreview() {
        // Hide all glows
        this._slotGlows.forEach(glow => {
            this.tweens.killTweensOf(glow);
            this.tweens.add({
                targets: glow,
                alpha: 0,
                duration: 200,
                ease: 'Power2'
            });
        });
    }

    _hideSlotGlow(index) {
        if (this._slotGlows[index]) {
            this.tweens.killTweensOf(this._slotGlows[index]);
            this._slotGlows[index].setAlpha(0);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MATCH CHECK — 3 identical → merge & disappear
    //
    // FIXED:
    //  1. Per-type lock (_merging{}) — no double-trigger per type
    //  2. Slots nulled IMMEDIATELY before tweens start — no race condition
    //  3. Sprite refs snapshotted before nulling
    //  4. _compactSlots fires via done-counter AFTER all 3 destroy tweens finish
    // ─────────────────────────────────────────────────────────────────────────
    _checkForMatch(type) {
        // Block if this type is already mid-merge
        if (this._merging[type]) return;

        // Collect confirmed (non-inFlight) slots of this type
        const matching = [];
        this._slots.forEach((slot, i) => {
            if (slot && !slot.inFlight && slot.type === type) matching.push(i);
        });

        if (matching.length < 3) return;

        // ── Lock immediately ──────────────────────────────────────────────────
        this._merging[type] = true;
        const trio = matching.slice(0, 3);

        // Snapshot sprite refs THEN null the slots — prevents any re-entry
        const sprites = trio.map(si => this._slots[si].spr);
        trio.forEach(si => { this._slots[si] = null; });

        // Brief pause so player sees all 3 in slots before merge
        this.time.delayedCall(180, () => {
            const midSlotX = this._slotStartX + trio[1] * this._slotSpacing;
            const midSlotY = this._slotY;

            // ── Step 1: Flash yellow highlight ring on all 3 ─────────────
            sprites.forEach(spr => {
                if (!spr || !spr.active) return;
                this.tweens.killTweensOf(spr);
                // Yellow tint pulse
                spr.setTint(0xffee44);
                this.tweens.add({
                    targets: spr, scaleX: spr.scaleX * 1.2, scaleY: spr.scaleY * 1.2,
                    duration: 120, ease: 'Back.easeOut', yoyo: true,
                    onComplete: () => spr.clearTint()
                });
            });

            // ── Step 2: Converge + spin into center ───────────────────────
            let doneCount = 0;
            sprites.forEach((spr, order) => {
                if (!spr || !spr.active) {
                    if (++doneCount === sprites.length) this._afterMerge(type);
                    return;
                }

                this.time.delayedCall(160, () => {
                    this.tweens.killTweensOf(spr);
                    this.tweens.add({
                        targets: spr,
                        x: midSlotX, y: midSlotY,
                        scaleX: 0, scaleY: 0,
                        angle: spr.angle + 360,
                        alpha: 0,
                        duration: 320,
                        delay: order * 50,
                        ease: 'Power2.easeIn',
                        onComplete: () => {
                            spr.destroy();
                            if (++doneCount === sprites.length) {
                                // ── Step 3: Flash + burst at merge point ──
                                this._mergeFlash(midSlotX, midSlotY, type);
                                this._afterMerge(type);
                            }
                        }
                    });
                });
            });

            // Update counters + bar immediately (state already committed)
            this._cleared += 3;
            this._counts[type] = Math.max(0, this._counts[type] - 3);
            if (this._counterLabels[type]) {
                this._counterLabels[type].setText(`${this._counts[type]}`);
            }

            // Animate counter disappearance when count reaches 0
            if (this._counts[type] === 0) {
                this.time.delayedCall(400, () => this._hideCounter(type));
            }

            const prevPct = ((this._cleared - 3) / this._TOTAL) * 100;
            const newPct  = (this._cleared / this._TOTAL) * 100;
            this.tweens.addCounter({
                from: prevPct, to: newPct, duration: 500,
                onUpdate: (t) => this._updateBar(t.getValue())
            });

            // Increment combo
            this._incrementCombo();

            if (this._cleared >= this._TOTAL) {
                this.time.delayedCall(900, () => this._onWin());
            }
        });
    }

    // Called once all 3 merge sprites are destroyed
    _afterMerge(type) {
        // Compact slots left (safe — all trio slots are already null)
        this._compactSlots();
        // Unlock this type for future merges
        this._merging[type] = false;
    }

    _compactSlots() {
        const filled = this._slots.filter(s => s !== null);
        this._slots  = [...filled, ...new Array(this._MAX_SLOTS - filled.length).fill(null)];

        this._slots.forEach((slot, i) => {
            if (!slot || !slot.spr || !slot.spr.active) return;
            const tx = this._slotStartX + i * this._slotSpacing;
            this.tweens.add({
                targets: slot.spr, x: tx,
                duration: 220, ease: 'Power2'
            });
        });
        
        // Update slot glows after compacting
        this._updateSlotGlows();
    }

    _updateSlotGlows() {
        this._slots.forEach((slot, i) => {
            if (slot === null && this._slotGlows[i]) {
                // Empty slot - glow is available but hidden
                this._slotGlows[i].setAlpha(0);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MERGE FLASH — white ring + star burst at merge point
    // ─────────────────────────────────────────────────────────────────────────
    _mergeFlash(cx, cy, type) {
        // White expanding ring
        const ring = this.add.graphics().setDepth(22);
        ring.lineStyle(6, 0xffffff, 1);
        ring.strokeCircle(0, 0, 10);
        ring.setPosition(cx, cy);
        this.tweens.add({
            targets: ring, scaleX: 8, scaleY: 8, alpha: 0,
            duration: 380, ease: 'Power2',
            onComplete: () => ring.destroy()
        });

        // Bright flash
        const flash = this.add.graphics().setDepth(21);
        flash.fillStyle(0xffffff, 0.9);
        flash.fillCircle(0, 0, 60);
        flash.setPosition(cx, cy);
        this.tweens.add({
            targets: flash, scaleX: 2.5, scaleY: 2.5, alpha: 0,
            duration: 220, ease: 'Power2',
            onComplete: () => flash.destroy()
        });

        // Star particles
        this._burstParticles(cx, cy, type);

        // Score pop text
        const pop = this.add.text(cx, cy - 20, '+3', {
            fontSize: '52px', fontFamily: '"Arial Rounded MT Bold", Arial',
            color: '#FFD700', stroke: '#7a3a00', strokeThickness: 8
        }).setOrigin(0.5).setDepth(23).setScale(0.3);
        this.tweens.add({
            targets: pop, y: cy - 120, scaleX: 1, scaleY: 1, alpha: 0,
            duration: 700, ease: 'Power2',
            onComplete: () => pop.destroy()
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // COMBO SYSTEM
    // ─────────────────────────────────────────────────────────────────────────
    _incrementCombo() {
        this._comboCount++;
        
        // Clear existing timer
        if (this._comboTimer) {
            this._comboTimer.remove();
        }
        
        // Show combo text if 2 or more
        if (this._comboCount >= 2) {
            this._showComboText();
        }
        
        // Reset combo after window expires
        this._comboTimer = this.time.delayedCall(this._COMBO_WINDOW, () => {
            this._comboCount = 0;
        });
    }

    _showComboText() {
        const W = this.scale.width;
        const H = this.scale.height;
        const isLS = W > H;
        
        // Combo multiplier text
        const comboText = `${this._comboCount}x COMBO!`;
        const colors = ['#FFD700', '#FF6B35', '#FF1744', '#D500F9', '#00E5FF'];
        const colorIndex = Math.min(this._comboCount - 2, colors.length - 1);
        
        const txt = this.add.text(W / 2, isLS ? H * 0.35 : H * 0.45, comboText, {
            fontSize: `${Math.round(Math.min(W, H) * 0.08)}px`,
            fontFamily: '"Arial Rounded MT Bold", Arial',
            color: colors[colorIndex],
            stroke: '#000000',
            strokeThickness: 10,
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 15, fill: true }
        }).setOrigin(0.5).setDepth(30).setAlpha(0).setScale(0.3);
        
        // Animate in
        this.tweens.add({
            targets: txt,
            alpha: 1,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Pulse
                this.tweens.add({
                    targets: txt,
                    scaleX: 1.3,
                    scaleY: 1.3,
                    duration: 150,
                    yoyo: true,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // Fade out and move up
                        this.tweens.add({
                            targets: txt,
                            y: txt.y - 80,
                            alpha: 0,
                            duration: 600,
                            ease: 'Power2',
                            onComplete: () => txt.destroy()
                        });
                    }
                });
            }
        });
        
        // Combo particles
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const speed = Phaser.Math.Between(60, 150);
            const size = Phaser.Math.Between(6, 12);
            
            const g = this.add.graphics().setDepth(29);
            g.fillStyle(Phaser.Math.Between(0, 0xffffff), 1);
            
            // Star shape
            const points = [];
            for (let j = 0; j < 5; j++) {
                const a1 = (j / 5) * Math.PI * 2;
                const a2 = ((j + 0.5) / 5) * Math.PI * 2;
                points.push(Math.cos(a1) * size, Math.sin(a1) * size);
                points.push(Math.cos(a2) * size * 0.5, Math.sin(a2) * size * 0.5);
            }
            g.fillPoints(points, true);
            g.setPosition(W / 2, isLS ? H * 0.35 : H * 0.45);
            
            this.tweens.add({
                targets: g,
                x: W / 2 + Math.cos(angle) * speed,
                y: (isLS ? H * 0.35 : H * 0.45) + Math.sin(angle) * speed,
                alpha: 0,
                angle: Phaser.Math.Between(-360, 360),
                duration: 800,
                ease: 'Power2',
                onComplete: () => g.destroy()
            });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HIDE COUNTER — animate out when count reaches 0
    // ─────────────────────────────────────────────────────────────────────────
    _hideCounter(type) {
        const box = this[`counterBox_${type}`];
        const icon = this[`counterIcon_${type}`];
        const label = this[`counterLabel_${type}`];

        const targets = [box, icon, label].filter(obj => obj && obj.active);
        if (targets.length === 0) return;

        // Flash white before disappearing
        targets.forEach(obj => {
            if (obj.setTint) obj.setTint(0xffffff);
        });

        this.time.delayedCall(100, () => {
            targets.forEach(obj => {
                if (obj.clearTint) obj.clearTint();
            });

            // Scale down and fade out (no rotation)
            this.tweens.add({
                targets: targets,
                scaleX: 0,
                scaleY: 0,
                alpha: 0,
                duration: 400,
                ease: 'Back.easeIn',
                onComplete: () => {
                    targets.forEach(obj => {
                        if (obj && obj.active) obj.setVisible(false);
                    });
                    // Shift remaining counters after this one disappears
                    this._shiftCounters(type);
                }
            });

            // Particle burst from counter position
            if (box && box.active) {
                const colours = { ball: 0x88ddff, barrel: 0xd4a055, bucket: 0xff6655, treasure: 0xffd700 };
                const color = colours[type] || 0xffd700;
                
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    const speed = Phaser.Math.Between(40, 100);
                    const size = Phaser.Math.Between(4, 10);
                    
                    const g = this.add.graphics().setDepth(20);
                    g.fillStyle(color, 1);
                    g.fillCircle(0, 0, size);
                    g.setPosition(box.x, box.y);
                    
                    this.tweens.add({
                        targets: g,
                        x: box.x + Math.cos(angle) * speed,
                        y: box.y + Math.sin(angle) * speed,
                        alpha: 0,
                        scaleX: 0.1,
                        scaleY: 0.1,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => g.destroy()
                    });
                }
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SHIFT COUNTERS — move remaining counters left to fill gaps
    // ─────────────────────────────────────────────────────────────────────────
    _shiftCounters(removedType) {
        // Remove the type from active counters
        const removedIndex = this._activeCounters.indexOf(removedType);
        if (removedIndex === -1) return;
        
        this._activeCounters.splice(removedIndex, 1);
        
        const L = this._getLayout();
        
        // Reposition all remaining active counters based on their new index
        this._activeCounters.forEach((type, newIndex) => {
            const box = this[`counterBox_${type}`];
            const icon = this[`counterIcon_${type}`];
            const label = this[`counterLabel_${type}`];
            
            // Get the layout position for this slot index (using original type order)
            const slotType = this._types[newIndex];
            const targetBoxCfg = L[`counterBox_${slotType}`];
            const targetIconCfg = L[`counterIcon_${slotType}`];
            const targetLabelCfg = L[`counterLabel_${slotType}`];
            
            if (!targetBoxCfg) return;
            
            const targets = [
                { obj: box, cfg: targetBoxCfg },
                { obj: icon, cfg: targetIconCfg },
                { obj: label, cfg: targetLabelCfg }
            ];
            
            targets.forEach(({ obj, cfg }) => {
                if (obj && obj.active && obj.visible && cfg) {
                    this.tweens.add({
                        targets: obj,
                        x: cfg.x,
                        y: cfg.y,
                        duration: 350,
                        ease: 'Power2'
                    });
                }
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PARTICLES
    // ─────────────────────────────────────────────────────────────────────────
    _burstParticles(cx, cy, type) {
        const colours = { ball: 0x88ddff, barrel: 0xd4a055, bucket: 0xff6655, treasure: 0xffd700 };
        const color   = colours[type] || 0xffd700;
        const count   = 18;

        for (let i = 0; i < count; i++) {
            const angle  = (i / count) * Math.PI * 2 + Phaser.Math.FloatBetween(-0.2, 0.2);
            const speed  = Phaser.Math.Between(80, 280);
            const size   = Phaser.Math.Between(5, 14);
            const isStar = i % 3 === 0;

            const g = this.add.graphics().setDepth(20);
            if (isStar) {
                // Draw a small 4-point star
                g.fillStyle(0xffffff, 1);
                g.fillTriangle(-size, 0, size, 0, 0, -size * 1.8);
                g.fillTriangle(-size, 0, size, 0, 0,  size * 1.8);
            } else {
                g.fillStyle(color, 1);
                g.fillCircle(0, 0, size);
            }
            g.setPosition(cx, cy);

            this.tweens.add({
                targets: g,
                x: cx + Math.cos(angle) * speed,
                y: cy + Math.sin(angle) * speed,
                alpha: 0, scaleX: 0.1, scaleY: 0.1,
                angle: Phaser.Math.Between(-180, 180),
                duration: Phaser.Math.Between(350, 650),
                ease: 'Power2',
                onComplete: () => g.destroy()
            });
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FAIL
    // ─────────────────────────────────────────────────────────────────────────
    _onFail() {
        this._gameover = true;
        const W = this.scale.width;
        const H = this.scale.height;

        // Full-screen dim — use a rectangle so it can be repositioned on resize
        this._overlayDim = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0)
            .setDepth(25).setOrigin(0.5);
        this.tweens.add({ targets: this._overlayDim, fillAlpha: 0.6, duration: 500 });

        // this.cameras.main.shake(400, 0.012);

        this._endMainTxt = this.add.text(W / 2, H / 2 - 80, 'FAILED TO\nCLEAN BEACH!', {
            fontSize:        `${Math.round(Math.min(W, H) * 0.085)}px`,
            fontFamily:      '"Arial Rounded MT Bold", Arial',
            color:           '#ff4444',
            stroke:          '#7a0000',
            strokeThickness: 10,
            align:           'center',
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 10, fill: true }
        }).setOrigin(0.5).setDepth(26).setAlpha(0).setScale(0.3);

        this.tweens.add({ targets: this._endMainTxt, alpha: 1, scale: 1, duration: 500, ease: 'Back.easeOut' });

        for (let i = 0; i < 40; i++) {
            this.time.delayedCall(i * 50, () => {
                const g = this.add.graphics().setDepth(27);
                g.fillStyle(Phaser.Utils.Array.GetRandom([0xff4444, 0xff8800, 0xcc2200, 0xff6600]), 1);
                g.fillRect(0, 0, Phaser.Math.Between(8, 18), Phaser.Math.Between(8, 18));
                g.setPosition(Phaser.Math.Between(80, W - 80), -20);
                this.tweens.add({ targets: g, y: H + 40, angle: Phaser.Math.Between(-360, 360), duration: Phaser.Math.Between(1200, 2200), ease: 'Linear', onComplete: () => g.destroy() });
            });
        }

        this.time.delayedCall(1000, () => {
            this._endRestartTxt = this.add.text(W / 2, H / 2 + 120, 'Tap to Play Again', {
                fontSize:        `${Math.round(Math.min(W, H) * 0.05)}px`,
                fontFamily:      '"Arial Rounded MT Bold", Arial',
                color:           '#ffffff',
                stroke:          '#1a3a6e',
                strokeThickness: 5
            }).setOrigin(0.5).setDepth(27).setInteractive({ useHandCursor: true });

            this.tweens.add({ targets: this._endRestartTxt, alpha: 0.2, duration: 650, yoyo: true, repeat: -1, ease: 'Sine' });
            this._endRestartTxt.on('pointerdown', () => {
                this.cameras.main.fadeOut(350, 0, 0, 0);
                this.time.delayedCall(380, () => this.scene.restart());
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WIN
    // ─────────────────────────────────────────────────────────────────────────
    _onWin() {
        const W = this.scale.width;
        const H = this.scale.height;

        this._overlayDim = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0)
            .setDepth(25).setOrigin(0.5);
        this.tweens.add({ targets: this._overlayDim, fillAlpha: 0.55, duration: 500 });

        this._endMainTxt = this.add.text(W / 2, H / 2 - 80, 'BEACH CLEAN!', {
            fontSize:        `${Math.round(Math.min(W, H) * 0.09)}px`,
            fontFamily:      '"Arial Rounded MT Bold", Arial',
            color:           '#FFD700',
            stroke:          '#7a3a00',
            strokeThickness: 10,
            shadow: { offsetX: 4, offsetY: 4, color: '#000', blur: 10, fill: true }
        }).setOrigin(0.5).setDepth(26).setAlpha(0).setScale(0.3);

        this.tweens.add({ targets: this._endMainTxt, alpha: 1, scale: 1, duration: 500, ease: 'Back.easeOut' });

        for (let i = 0; i < 40; i++) {
            this.time.delayedCall(i * 50, () => {
                const g = this.add.graphics().setDepth(27);
                g.fillStyle(Phaser.Math.Between(0, 0xffffff), 1);
                g.fillRect(0, 0, Phaser.Math.Between(8, 18), Phaser.Math.Between(8, 18));
                g.setPosition(Phaser.Math.Between(80, W - 80), -20);
                this.tweens.add({ targets: g, y: H + 40, angle: Phaser.Math.Between(-360, 360), duration: Phaser.Math.Between(1200, 2200), ease: 'Linear', onComplete: () => g.destroy() });
            });
        }

        this.time.delayedCall(1000, () => {
            this._endRestartTxt = this.add.text(W / 2, H / 2 + 100, 'Tap to Play Again', {
                fontSize:        `${Math.round(Math.min(W, H) * 0.05)}px`,
                fontFamily:      '"Arial Rounded MT Bold", Arial',
                color:           '#ffffff',
                stroke:          '#1a3a6e',
                strokeThickness: 5
            }).setOrigin(0.5).setDepth(27).setInteractive({ useHandCursor: true });

            this.tweens.add({ targets: this._endRestartTxt, alpha: 0.2, duration: 650, yoyo: true, repeat: -1, ease: 'Sine' });
            this._endRestartTxt.on('pointerdown', () => {
                this.cameras.main.fadeOut(350, 0, 0, 0);
                this.time.delayedCall(380, () => this.scene.restart());
            });
        });
    }
}