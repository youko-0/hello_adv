// 占卜 UI
console.log('[LOAD] divine_ui');

// ════════════════════════════════════════════════════════════════════
// 占卜界面配置（资源 / 样式 / 布局）
// ════════════════════════════════════════════════════════════════════

ac.createStyle({
    name: 'style_divine_yao_label',
    font: '汉仪小隶书简',
    bold: false, italic: false,
    fontSize: 28, color: '#f0eeff',
});
ac.createStyle({
    name: 'style_divine_hex_name',
    font: '汉仪小隶书简',
    bold: true, italic: false,
    fontSize: 60, color: '#f5e6a3',
});
ac.createStyle({
    name: 'style_divine_judgment',
    font: '汉仪小隶书简',
    bold: false, italic: false,
    fontSize: 28, color: '#f0eeff',
});
ac.createStyle({
    name: 'style_divine_yao_text',
    font: '汉仪小隶书简',
    bold: false, italic: false,
    fontSize: 24, color: '#f0eeff',
});

const DivineConfig = {

    yaoLabels: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'],

    res: {
        background: ResMap.pic_divine_bg,
        coin: {
            front: ResMap.img_divine_coin_yang,
            back:  ResMap.img_divine_coin_yin,
        },
        yao: {
            yang: ResMap.img_divine_yao_yang,
            yin:  ResMap.img_divine_yao_yin,
        },
        button: {
            normal:   ResMap.btn_divine_normal,
            pressed:  ResMap.btn_divine_pressed,
            disabled: ResMap.btn_divine_disabled,
        },
    },

    style: {
        yaoLabel:        'style_divine_yao_label',
        hexName:         'style_divine_hex_name',
        judgment:        'style_divine_judgment',
        yaoText:         'style_divine_yao_text',
        yaoTextFontSize: 24,
    },

    // ── 布局 ──────────────────────────────────────────────────────
    // 引擎坐标系：y=0 在屏幕底部，y=720 在屏幕顶部
    // 传统爻序：初爻在视觉底部（小 engine y），上爻在视觉顶部（大 engine y）
    layout: {
        // 爻槽（初爻 y 最小=视觉底，上爻 y 最大=视觉顶）
        yaoStartY:      140,    // 初爻 engine y
        yaoSpacingY:    70,     // 上爻 = 140 + 5×70 = 490
        yaoLabelX:      120,    // "X爻" 标签中心 X
        // 爻图右边缘 X（anchor x=100，scaleTo x:0 → 从左至右擦除）
        yaoImageRightX: 480,
        // 爻辞打字机起点（anchor x=0，左对齐，覆盖标签位置）
        yaoTextX:        80,
        yaoTextWidth:   1100,

        // 卦名大标题（视觉顶部 = 大 engine y）
        hexNamePos:  { x: GameConfig.centerX, y: 630 },
        hexNameSize: { width: 800, height: 100 },

        // 卦辞（视觉底部 = 小 engine y）
        judgmentPos:  { x: GameConfig.centerX, y: 90 },
        judgmentSize: { width: 1100, height: 60 },

        // 占卜按钮（视觉底部）
        button: {
            x: GameConfig.centerX,
            y: 70,
            width: 200,
            height: 60,
        },

        // 硬币动画（视觉上方，不同 X，不与爻槽重叠）
        coinY:       380,
        coinSpacingX:200,
    },

    anim: {
        flipHalfDuration:     120,
        flipCount:              5,
        coinFadeDuration:      400,
        yaoFadeDuration:       400,
        yaoEraseDuration:      350,   // 爻线左→右擦除时长
        typewriterDelay:        40,   // 打字机每字间隔 ms
        hexNameFadeDuration:   800,
        judgmentFadeDuration:  600,
        sceneFadeDuration:     500,
    },
};

// ════════════════════════════════════════════════════════════════════
// 占卜 UI 实现
// ════════════════════════════════════════════════════════════════════

const DivineUI = {

    layer: {
        scene:     'layer_divine_scene',
        clickMask: 'layer_divine_click_mask',
    },
    button: { name: 'btn_divine_start' },
    coin: {
        front: idx => `img_divine_coin_front_${idx}`,
        back:  idx => `img_divine_coin_back_${idx}`,
    },
    yao: {
        label: idx => `txt_divine_yao_label_${idx}`,
        image: idx => `img_divine_yao_${idx}`,
        // 打字机字符名：txt_divine_yao_char_<yaoIdx>_<charIdx>
        char:  (yaoIdx, charIdx) => `txt_divine_yao_char_${yaoIdx}_${charIdx}`,
    },
    hex: {
        name:     'txt_divine_hex_name',
        judgment: 'txt_divine_hex_judgment',
    },

    _state: {
        waitingForClick: false,
        maskCreated:     false,
    },

    // 计算第 idx 爻的 engine Y（初爻在底，上爻在顶）
    _yaoY: function (idx) {
        return DivineConfig.layout.yaoStartY + idx * DivineConfig.layout.yaoSpacingY;
    },

    // ───────────────────────────────────────────────────────────────
    // 场景创建 / 关闭
    // ───────────────────────────────────────────────────────────────

    createDivineUI: async function () {
        console.log('[LOG] createDivineUI');

        await ac.createLayer({
            name: this.layer.scene, index: ZORDER.UI, inlayer: 'window',
        });

        // 全屏背景
        await ac.createImage({
            name: 'img_divine_scene_bg', index: 0, inlayer: this.layer.scene,
            resId: DivineConfig.res.background,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        // 6 个爻名称标签
        for (let i = 0; i < 6; i++) {
            await ac.createText({
                name:    this.yao.label(i),
                index:   1, inlayer: this.layer.scene,
                content: DivineConfig.yaoLabels[i],
                pos:     { x: DivineConfig.layout.yaoLabelX, y: this._yaoY(i) },
                anchor:  { x: 50, y: 50 },
                size:    { width: 80, height: 40 },
                style:   DivineConfig.style.yaoLabel,
                halign:  ac.HALIGN_TYPES.middle,
                valign:  ac.VALIGN_TYPES.center,
            });
        }

        await this.showButton();

        this._state.waitingForClick = false;
        this._state.maskCreated     = false;
    },

    closeDivineUI: async function () {
        await ac.remove({
            name: this.layer.scene, effect: 'fadeout',
            duration: DivineConfig.anim.sceneFadeDuration,
        });
        await ac.delay({ time: DivineConfig.anim.sceneFadeDuration });
        this._state.maskCreated = false;
    },

    // ───────────────────────────────────────────────────────────────
    // 占卜按钮（正常 / 禁用 / 隐藏）
    // ───────────────────────────────────────────────────────────────

    showButton: async function () {
        const cfg = DivineConfig.layout.button;
        await ac.createOption({
            name: this.button.name, index: 10, inlayer: this.layer.scene,
            nResId: DivineConfig.res.button.normal,
            sResId: DivineConfig.res.button.pressed,
            content: '占卜',
            pos: { x: cfg.x, y: cfg.y }, anchor: { x: 50, y: 50 },
            size: { width: cfg.width, height: cfg.height },
            onTouchEnded: async function () {
                await DivineSystem.onClickDivineButton();
            },
        });
    },

    /** 显示禁用态按钮（掷硬币期间，点击无反馈） */
    showDisabledButton: async function () {
        const cfg = DivineConfig.layout.button;
        await ac.createOption({
            name: this.button.name, index: 10, inlayer: this.layer.scene,
            nResId: DivineConfig.res.button.disabled,
            sResId: DivineConfig.res.button.disabled,
            content: '占卜',
            pos: { x: cfg.x, y: cfg.y }, anchor: { x: 50, y: 50 },
            size: { width: cfg.width, height: cfg.height },
            // 无 onTouchEnded → 点击无响应
        });
    },

    hideButton: async function () {
        await ac.remove({ name: this.button.name });
    },

    // ───────────────────────────────────────────────────────────────
    // 硬币翻转动画
    // ───────────────────────────────────────────────────────────────

    playCoinAnimation: async function (coins) {
        const cx        = GameConfig.centerX;
        const cy        = DivineConfig.layout.coinY;
        const sx        = DivineConfig.layout.coinSpacingX;
        const half      = DivineConfig.anim.flipHalfDuration;
        const flipCount = DivineConfig.anim.flipCount;

        for (let i = 0; i < 3; i++) {
            const x = cx + (i - 1) * sx;
            await ac.createImage({
                name: this.coin.front(i), index: 100, inlayer: this.layer.scene,
                resId: DivineConfig.res.coin.front,
                pos: { x, y: cy }, anchor: { x: 50, y: 50 },
            });
            await ac.createImage({
                name: this.coin.back(i), index: 100, inlayer: this.layer.scene,
                resId: DivineConfig.res.coin.back,
                pos: { x, y: cy }, anchor: { x: 50, y: 50 },
            });
            await ac.hide({ name: this.coin.back(i) });
        }

        const currentFace = [1, 1, 1];
        for (let f = 0; f < flipCount; f++) {
            const isLast = f === flipCount - 1;

            for (let i = 0; i < 3; i++) {
                const vis = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: vis, x: 0, y: 100, duration: half });
            }
            await ac.delay({ time: half });

            for (let i = 0; i < 3; i++) {
                const oldVis = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                const newFace = isLast ? coins[i] : (1 - currentFace[i]);
                currentFace[i] = newFace;
                const newVis = newFace === 1 ? this.coin.front(i) : this.coin.back(i);
                if (oldVis !== newVis) {
                    ac.scaleTo({ name: newVis, x: 0, y: 100, duration: 0 });
                    await ac.hide({ name: oldVis });
                    await ac.show({ name: newVis });
                }
            }

            for (let i = 0; i < 3; i++) {
                const vis = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: vis, x: 100, y: 100, duration: half });
            }
            await ac.delay({ time: half });
        }
    },

    fadeOutCoins: async function () {
        const dur = DivineConfig.anim.coinFadeDuration;
        for (let i = 0; i < 3; i++) {
            ac.fadeTo({ name: this.coin.front(i), opacity: 0, duration: dur });
            ac.fadeTo({ name: this.coin.back(i),  opacity: 0, duration: dur });
        }
        await ac.delay({ time: dur });
        for (let i = 0; i < 3; i++) {
            await ac.remove({ name: this.coin.front(i) });
            await ac.remove({ name: this.coin.back(i) });
        }
    },

    // ───────────────────────────────────────────────────────────────
    // 爻线显示（page 2）
    // ───────────────────────────────────────────────────────────────

    /**
     * 淡入显示爻图（右边缘锚定，为后续左→右擦除做准备）
     * @param {number} roundIdx  0~5（0=初爻）
     * @param {string} yaoType   'yang' / 'yin'
     */
    showYao: async function (roundIdx, yaoType) {
        const name = this.yao.image(roundIdx);
        const dur  = DivineConfig.anim.yaoFadeDuration;

        // anchor x=100（右边缘固定）→ scaleTo x:0 时从左向右缩进
        await ac.createImage({
            name, index: 1, inlayer: this.layer.scene,
            resId:   DivineConfig.res.yao[yaoType],
            pos:     { x: DivineConfig.layout.yaoImageRightX, y: this._yaoY(roundIdx) },
            anchor:  { x: 100, y: 50 },
            opacity: 0,
        });
        ac.fadeTo({ name, opacity: 100, duration: dur });
        await ac.delay({ time: dur });
    },

    // ───────────────────────────────────────────────────────────────
    // 结果展示（page 3+4 合并）
    // ───────────────────────────────────────────────────────────────

    /**
     * 完整结果展示流程：
     *   1. 卦名顶部淡入
     *   2. 逐条擦除爻线（左→右）+ 打字机浮现爻辞
     *   3. 卦辞底部淡入
     *   4. 等待点击关闭
     */
    showDivineResult: async function (hexagramName, judgment, yaoTexts) {
        const L = DivineConfig.layout;
        const A = DivineConfig.anim;

        // ① 卦名顶部淡入
        await ac.createText({
            name: this.hex.name, index: 5, inlayer: this.layer.scene,
            content: hexagramName,
            pos:    L.hexNamePos, anchor: { x: 50, y: 50 },
            size:   L.hexNameSize,
            style:  DivineConfig.style.hexName,
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
            opacity: 0,
        });
        ac.fadeTo({ name: this.hex.name, opacity: 100, duration: A.hexNameFadeDuration });
        await ac.delay({ time: A.hexNameFadeDuration });

        // ② 逐条处理（初爻 i=0 → 上爻 i=5）
        for (let i = 0; i < 6; i++) {
            const yaoImgName = this.yao.image(i);

            // 隐藏本行爻名标签（爻辞会从同一起点打出）
            ac.hide({ name: this.yao.label(i) });

            // 爻线从左至右擦除（anchor x=100，scaleX 100→0）
            ac.scaleTo({
                name: yaoImgName,
                x: 0, y: 100,
                duration: A.yaoEraseDuration,
            });
            await ac.delay({ time: A.yaoEraseDuration });
            await ac.remove({ name: yaoImgName });

            // 打字机效果浮现爻辞
            await this._typewriterLine(yaoTexts[i], i);
        }

        // ③ 卦辞底部淡入
        await ac.createText({
            name: this.hex.judgment, index: 5, inlayer: this.layer.scene,
            content: '卦辞：' + judgment,
            pos:    L.judgmentPos, anchor: { x: 50, y: 50 },
            size:   L.judgmentSize,
            style:  DivineConfig.style.judgment,
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
            opacity: 0,
        });
        ac.fadeTo({ name: this.hex.judgment, opacity: 100, duration: A.judgmentFadeDuration });
        await ac.delay({ time: A.judgmentFadeDuration });

        // ④ 等待点击关闭
        await this._waitForClick();
    },

    /**
     * 打字机效果：逐字创建独立文本控件
     * @param {string} text     本行爻辞文本
     * @param {number} yaoIdx   爻索引 0~5
     */
    _typewriterLine: async function (text, yaoIdx) {
        const y        = this._yaoY(yaoIdx);
        const startX   = DivineConfig.layout.yaoTextX;
        const fontSize = DivineConfig.style.yaoTextFontSize;
        const delay    = DivineConfig.anim.typewriterDelay;

        let xOffset = 0;
        for (let ci = 0; ci < text.length; ci++) {
            const char      = text[ci];
            const charW     = Utils.measureCharWidth(char, fontSize);
            const charName  = this.yao.char(yaoIdx, ci);  // 唯一名称

            await ac.createText({
                name:    charName,
                index:   2, inlayer: this.layer.scene,
                content: char,
                pos:     { x: startX + xOffset, y },
                anchor:  { x: 0, y: 50 },
                size:    { width: Math.ceil(charW) + 4, height: 50 },
                style:   DivineConfig.style.yaoText,
                halign:  ac.HALIGN_TYPES.left,
                valign:  ac.VALIGN_TYPES.center,
            });

            xOffset += charW;
            await ac.delay({ time: delay });
        }
    },

    // ───────────────────────────────────────────────────────────────
    // 全屏点击拦截（result 阶段启用）
    // ───────────────────────────────────────────────────────────────

    _setupClickMask: async function () {
        if (this._state.maskCreated) return;
        await ac.createLayer({
            name: this.layer.clickMask, index: 100, inlayer: this.layer.scene,
            pos:  { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 0, y: 0 }, clipMode: false,
        });
        const self = this;
        ac.addEventListener({
            type:    ac.EVENT_TYPES.onTouchEnded,
            listener: async function () { self._state.waitingForClick = false; },
            target:  this.layer.clickMask,
        });
        this._state.maskCreated = true;
    },

    _waitForClick: async function () {
        await this._setupClickMask();
        this._state.waitingForClick = true;
        while (this._state.waitingForClick) {
            await ac.delay({ time: 100 });
        }
    },
};
