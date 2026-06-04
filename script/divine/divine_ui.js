// 占卜 UI
console.log('[LOAD] divine_ui');

// ════════════════════════════════════════════════════════════════════
// 占卜界面配置（资源 / 样式 / 布局）
// ════════════════════════════════════════════════════════════════════

ac.createStyle({
    name: 'style_divine_yao_label',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 28,
    color: '#f0eeff',
});

ac.createStyle({
    name: 'style_divine_hex_name',
    font: '汉仪小隶书简',
    bold: true,
    italic: false,
    fontSize: 60,
    color: '#f5e6a3',
});

ac.createStyle({
    name: 'style_divine_judgment',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 28,
    color: '#f0eeff',
});

ac.createStyle({
    name: 'style_divine_yao_text',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
    color: '#f0eeff',
});

const DivineConfig = {

    // 爻名称（索引 0~5：初爻 → 上爻）
    yaoLabels: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'],

    // 资源
    res: {
        // 占卜玩法全屏背景
        background: ResMap.pic_divine_bg,
        // 三枚硬币的正反面
        coin: {
            front: ResMap.img_divine_coin_yang,   // 阳面（1）
            back: ResMap.img_divine_coin_yin,     // 阴面（0）
        },
        // 单轮爻的两种结果图
        yao: {
            yang: ResMap.img_divine_yao_yang,   // 长横线（阳爻）
            yin: ResMap.img_divine_yao_yin,     // 双短线（阴爻）
        },
        // 占卜按钮
        button: {
            normal: ResMap.btn_divine_normal,
            pressed: ResMap.btn_divine_pressed,
        },
    },

    // 文本样式
    style: {
        yaoLabel: 'style_divine_yao_label',
        hexName:  'style_divine_hex_name',
        judgment: 'style_divine_judgment',
        yaoText:  'style_divine_yao_text',
    },

    // 布局
    layout: {
        // 爻槽（初爻 y 最大=底部，上爻 y 最小=顶部，自下而上）
        yaoBottomY:    580,        // 初爻 Y（屏幕下方）
        yaoSpacingY:   50,         // 爻间距（向上递减）
        yaoLabelX:     200,        // "X爻" 文字 X 坐标
        yaoImageX:     340,        // 爻图 X 坐标
        yaoTextX:      240,        // 爻辞 X 起点（anchor 0 左对齐）
        yaoTextWidth:  950,        // 爻辞最大宽度

        // 卦名大标题（page 3 顶部）
        hexNamePos:    { x: GameConfig.centerX, y: 100 },
        hexNameSize:   { width: 800, height: 100 },

        // 卦辞（page 3 底部）
        judgmentPos:   { x: GameConfig.centerX, y: 660 },
        judgmentSize:  { width: 1100, height: 60 },

        // 占卜按钮
        button: {
            x: GameConfig.centerX,
            y: 200,
            width: 200,
            height: 60,
        },

        // 硬币动画位置
        coinY:         130,
        coinSpacingX:  200,
    },

    // 动画时长（ms）
    anim: {
        flipHalfDuration:    120,   // 硬币翻转单段时长
        flipCount:           5,     // 翻转次数
        coinFadeDuration:    400,   // 硬币淡出
        yaoFadeDuration:     400,   // 爻图淡入
        yaoEraseDuration:    350,   // 爻图擦除（scaleX 100→0）
        yaoTextFadeDuration: 500,   // 爻辞淡入
        hexNameFadeDuration: 800,   // 卦名/卦辞淡入
        sceneFadeDuration:   500,   // 占卜界面淡出
    },
};

// ════════════════════════════════════════════════════════════════════
// 占卜 UI 实现
// ════════════════════════════════════════════════════════════════════

const DivineUI = {

    // 控件名
    layer: {
        scene: 'layer_divine_scene',
        clickMask: 'layer_divine_click_mask',
    },
    bg:     { name: 'img_divine_bg' },
    button: { name: 'btn_divine_start' },
    coin: {
        front: idx => `img_divine_coin_front_${idx}`,
        back:  idx => `img_divine_coin_back_${idx}`,
    },
    yao: {
        label: idx => `txt_divine_yao_label_${idx}`,
        image: idx => `img_divine_yao_${idx}`,
        text:  idx => `txt_divine_yao_text_${idx}`,
    },
    hex: {
        name:     'txt_divine_hex_name',
        judgment: 'txt_divine_hex_judgment',
    },

    // 点击拦截状态
    _state: {
        waitingForClick: false,
        maskCreated:     false,
    },

    // 计算第 idx 爻的 Y 坐标（初爻在底，上爻在顶）
    _yaoY: function (idx) {
        return DivineConfig.layout.yaoBottomY - idx * DivineConfig.layout.yaoSpacingY;
    },

    // ───────────────────────────────────────────────────────────────
    // 占卜界面：创建 / 关闭
    // ───────────────────────────────────────────────────────────────

    createDivineUI: async function () {
        console.log('[LOG] createDivineUI');

        // 场景层（全屏）
        await ac.createLayer({
            name:    this.layer.scene,
            index:   ZORDER.UI,
            inlayer: 'window',
        });

        // 全屏背景
        await ac.createImage({
            name:    this.bg.name,
            index:   0,
            inlayer: this.layer.scene,
            resId:   DivineConfig.res.background,
            pos:     { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor:  { x: 50, y: 50 },
        });

        // 6 个爻名称标签
        for (let i = 0; i < 6; i++) {
            await ac.createText({
                name:    this.yao.label(i),
                index:   1,
                inlayer: this.layer.scene,
                content: DivineConfig.yaoLabels[i],
                pos:     { x: DivineConfig.layout.yaoLabelX, y: this._yaoY(i) },
                anchor:  { x: 50, y: 50 },
                size:    { width: 80, height: 40 },
                style:   DivineConfig.style.yaoLabel,
                halign:  ac.HALIGN_TYPES.middle,
                valign:  ac.VALIGN_TYPES.center,
            });
        }

        // 占卜按钮
        await this.showButton();

        // 重置状态
        this._state.waitingForClick = false;
        this._state.maskCreated     = false;
    },

    closeDivineUI: async function () {
        await ac.remove({
            name:     this.layer.scene,
            effect:   'fadeout',
            duration: DivineConfig.anim.sceneFadeDuration,
        });
        await ac.delay({ time: DivineConfig.anim.sceneFadeDuration });
        this._state.maskCreated = false;
    },

    // ───────────────────────────────────────────────────────────────
    // 占卜按钮
    // ───────────────────────────────────────────────────────────────

    showButton: async function () {
        const cfg = DivineConfig.layout.button;
        await ac.createOption({
            name:    this.button.name,
            index:   10,
            inlayer: this.layer.scene,
            nResId:  DivineConfig.res.button.normal,
            sResId:  DivineConfig.res.button.pressed,
            content: '占卜',
            pos:     { x: cfg.x, y: cfg.y },
            anchor:  { x: 50, y: 50 },
            size:    { width: cfg.width, height: cfg.height },
            onTouchEnded: async function () {
                await DivineSystem.onClickDivineButton();
            },
        });
    },

    hideButton: async function () {
        await ac.remove({ name: this.button.name });
    },

    // ───────────────────────────────────────────────────────────────
    // 硬币翻转动画
    // ───────────────────────────────────────────────────────────────

    /**
     * 三枚硬币翻转动画，最终停在 coins 指定面
     * @param {Array<number>} coins - [0/1, 0/1, 0/1]，0=阴 1=阳
     */
    playCoinAnimation: async function (coins) {
        const cx = GameConfig.centerX;
        const cy = DivineConfig.layout.coinY;
        const sx = DivineConfig.layout.coinSpacingX;
        const half = DivineConfig.anim.flipHalfDuration;
        const flipCount = DivineConfig.anim.flipCount;

        // 创建三枚硬币正反面（叠在同一位置）
        for (let i = 0; i < 3; i++) {
            const x = cx + (i - 1) * sx;

            await ac.createImage({
                name:    this.coin.front(i),
                index:   100,
                inlayer: this.layer.scene,
                resId:   DivineConfig.res.coin.front,
                pos:     { x: x, y: cy },
                anchor:  { x: 50, y: 50 },
            });

            await ac.createImage({
                name:    this.coin.back(i),
                index:   100,
                inlayer: this.layer.scene,
                resId:   DivineConfig.res.coin.back,
                pos:     { x: x, y: cy },
                anchor:  { x: 50, y: 50 },
            });
            await ac.hide({ name: this.coin.back(i) });
        }

        const currentFace = [1, 1, 1];

        for (let f = 0; f < flipCount; f++) {
            const isLast = f === flipCount - 1;

            // 阶段 1：当前面 scaleX 100 → 0
            for (let i = 0; i < 3; i++) {
                const visible = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: visible, x: 0, y: 100, duration: half });
            }
            await ac.delay({ time: half });

            // 切换面
            for (let i = 0; i < 3; i++) {
                const oldVisible = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                const newFace    = isLast ? coins[i] : (1 - currentFace[i]);
                currentFace[i]   = newFace;
                const newVisible = newFace === 1 ? this.coin.front(i) : this.coin.back(i);

                if (oldVisible !== newVisible) {
                    ac.scaleTo({ name: newVisible, x: 0, y: 100, duration: 0 });
                    await ac.hide({ name: oldVisible });
                    await ac.show({ name: newVisible });
                }
            }

            // 阶段 2：新面 scaleX 0 → 100
            for (let i = 0; i < 3; i++) {
                const visible = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: visible, x: 100, y: 100, duration: half });
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
    // 爻显示（page 2）
    // ───────────────────────────────────────────────────────────────

    /**
     * 在指定爻槽淡入显示爻图
     * @param {number} roundIdx - 0~5（0=初爻，5=上爻）
     * @param {string} yaoType  - 'yang' / 'yin'
     */
    showYao: async function (roundIdx, yaoType) {
        const name = this.yao.image(roundIdx);
        const dur  = DivineConfig.anim.yaoFadeDuration;

        await ac.createImage({
            name:    name,
            index:   1,
            inlayer: this.layer.scene,
            resId:   DivineConfig.res.yao[yaoType],
            pos:     { x: DivineConfig.layout.yaoImageX, y: this._yaoY(roundIdx) },
            anchor:  { x: 50, y: 50 },
            opacity: 0,
        });

        ac.fadeTo({ name: name, opacity: 100, duration: dur });
        await ac.delay({ time: dur });
    },

    // ───────────────────────────────────────────────────────────────
    // 卦名 + 卦辞（page 3）
    // ───────────────────────────────────────────────────────────────

    /**
     * 卦名顶部大标题 + 卦辞底部，浮现完后等待点击进入下一阶段
     */
    showHexagramReveal: async function (name, judgment) {
        const dur = DivineConfig.anim.hexNameFadeDuration;
        const L   = DivineConfig.layout;

        // 卦名（顶部大标题）
        await ac.createText({
            name:    this.hex.name,
            index:   5,
            inlayer: this.layer.scene,
            content: name,
            pos:     L.hexNamePos,
            anchor:  { x: 50, y: 50 },
            size:    L.hexNameSize,
            style:   DivineConfig.style.hexName,
            halign:  ac.HALIGN_TYPES.middle,
            valign:  ac.VALIGN_TYPES.center,
            opacity: 0,
        });
        ac.fadeTo({ name: this.hex.name, opacity: 100, duration: dur });
        await ac.delay({ time: dur / 2 });

        // 卦辞（底部）
        await ac.createText({
            name:    this.hex.judgment,
            index:   5,
            inlayer: this.layer.scene,
            content: '卦辞：' + judgment,
            pos:     L.judgmentPos,
            anchor:  { x: 50, y: 50 },
            size:    L.judgmentSize,
            style:   DivineConfig.style.judgment,
            halign:  ac.HALIGN_TYPES.middle,
            valign:  ac.VALIGN_TYPES.center,
            opacity: 0,
        });
        ac.fadeTo({ name: this.hex.judgment, opacity: 100, duration: dur });
        await ac.delay({ time: dur });

        // 等待点击进入 page 4
        await this._waitForClick();
    },

    // ───────────────────────────────────────────────────────────────
    // 爻辞逐条擦除浮现（page 4）
    // ───────────────────────────────────────────────────────────────

    /**
     * 自下而上：擦除爻线 + 原位浮现爻辞（初爻 → 上爻）
     * @param {Array<string>} yaoTexts - 长度 6，索引 0=初爻
     */
    playYaoTextReveal: async function (yaoTexts) {
        const eraseDur = DivineConfig.anim.yaoEraseDuration;
        const fadeDur  = DivineConfig.anim.yaoTextFadeDuration;
        const L        = DivineConfig.layout;

        for (let i = 0; i < 6; i++) {
            const y           = this._yaoY(i);
            const yaoImgName  = this.yao.image(i);
            const yaoTextName = this.yao.text(i);

            // 擦除爻线（scaleX 100 → 0）
            ac.scaleTo({ name: yaoImgName, x: 0, y: 100, duration: eraseDur });
            await ac.delay({ time: eraseDur });
            await ac.remove({ name: yaoImgName });

            // 原位浮现爻辞
            await ac.createText({
                name:    yaoTextName,
                index:   2,
                inlayer: this.layer.scene,
                content: yaoTexts[i],
                pos:     { x: L.yaoTextX, y: y },
                anchor:  { x: 0, y: 50 },
                size:    { width: L.yaoTextWidth, height: 40 },
                style:   DivineConfig.style.yaoText,
                halign:  ac.HALIGN_TYPES.left,
                valign:  ac.VALIGN_TYPES.center,
                opacity: 0,
            });
            ac.fadeTo({ name: yaoTextName, opacity: 100, duration: fadeDur });
            await ac.delay({ time: fadeDur });
        }

        // 全部完成等待点击关闭
        await this._waitForClick();
    },

    // ───────────────────────────────────────────────────────────────
    // 全屏点击拦截（page 3 之后启用）
    // ───────────────────────────────────────────────────────────────

    _setupClickMask: async function () {
        if (this._state.maskCreated) return;

        await ac.createLayer({
            name:     this.layer.clickMask,
            index:    100,
            inlayer:  this.layer.scene,
            pos:      { x: 0, y: 0 },
            size:     { width: GameConfig.width, height: GameConfig.height },
            anchor:   { x: 0, y: 0 },
            clipMode: false,
        });

        const self = this;
        ac.addEventListener({
            type:     ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                self._state.waitingForClick = false;
            },
            target:   this.layer.clickMask,
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
