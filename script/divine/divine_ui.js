// 占卜 UI
console.log('[LOAD] divine_ui');

// ════════════════════════════════════════════════════════════════════
// 占卜界面配置（资源 / 样式 / 布局）
// ════════════════════════════════════════════════════════════════════

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
        yaoTextFontSize: 30,
    },

    // ── 布局 ──────────────────────────────────────────────────────
    // 引擎坐标系：y=0 在屏幕底部，y=720 在屏幕顶部
    // 视觉从上到下：爻线区 → 硬币区 → 按钮
    // 传统爻序：初爻在视觉底部（小 engine y），上爻在视觉顶部（大 engine y）
    layout: {
        // ── 爻槽（掷币阶段）──
        // 初爻 engine y = yaoStartY，上爻 = yaoStartY + 5 × yaoSpacingY
        yaoStartY:      330,    // 初爻 engine y
        yaoSpacingY: 60,    // 上爻 = yaoStartY + 5×60 = 630
        // ── 爻槽（结果阶段，卦名顶部出现后整体下移）──
        // 卦名底边 ≈ y=580，留 40px 间距，上爻 = 540，初爻 = 540 - 5×60 = 240
        yaoResultStartY: 240,

        yaoLabelX:       276,   // 标签左边缘 X（anchor x=0），与 yaoTextX 对齐
        yaoLineWidth:    628,   // 爻线图片宽度（用于 clip layer 计算）
        yaoClipHeight:    40,   // clip layer 高度（略大于爻线图片高度 24px）
        // 爻线区 clip layer 左边缘 X = yaoImageRightX - yaoLineWidth
        yaoImageRightX: 1004,   // 爻线右边缘世界坐标 X
        // 爻辞打字机起点（anchor x=0，左对齐，与标签左边缘对齐）
        yaoTextX:        276,
        yaoTextWidth:     728,  // 与爻线区整体同宽

        // ── 卦名大标题（结果阶段，视觉顶部 = 大 engine y）──
        hexNamePos:  { x: GameConfig.centerX, y: 630 },
        hexNameSize: { width: 800, height: 100 },

        // ── 卦辞（结果阶段，视觉底部 = 小 engine y；硬币按钮已消失，可上移）──
        judgmentPos:  { x: GameConfig.centerX, y: 160 },
        judgmentSize: { width: 1100, height: 60 },

        // ── 硬币（点击触发投掷，3 枚展开后位置；初始叠在中心）──
        coinY:        160,
        coinSpacingX: 200,
    },

    anim: {
        flipHalfDuration:     120,
        flipCount:              5,
        coinFadeDuration:      400,
        yaoFadeDuration:       400,
        yaoEraseDuration:      350,   // 爻线左→右擦除时长
        typewriterDelay:        40,   // 打字机每字间隔 ms
        typewriterFloatOffset:  4,   // 字符浮现时向上移动量（engine y 增大 = 视觉上移）
        typewriterFloatDuration:180,  // 浮现动画时长 ms
        coinSpreadDuration:    600,   // 硬币展开动画时长 ms
        yaoSlideDuration:      500,   // 爻线区下移动画时长
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
        scene: 'layer_divine_scene',
        mask:  'layer_divine_mask',   // 全程唯一蒙层，mode 决定行为
    },
    coin: {
        front: idx => `img_divine_coin_front_${idx}`,
        back:  idx => `img_divine_coin_back_${idx}`,
    },
    yao: {
        label: idx => `txt_divine_yao_label_${idx}`,
        clip:  idx => `layer_divine_yao_clip_${idx}`,   // clip layer 容器
        image: idx => `img_divine_yao_${idx}`,
        char:  (yaoIdx, charIdx) => `txt_divine_yao_char_${yaoIdx}_${charIdx}`,
    },
    hex: {
        name:     'txt_divine_hex_name',
        judgment: 'txt_divine_hex_judgment',
    },

    _state: {
        waitingForClick:  false,
        maskCreated:      false,
        maskMode:         null,   // 'swipe' | 'click' | null
        coinFace:         [1, 1, 1],
        // 爻线区当前起始 Y（掷币阶段=yaoStartY，结果阶段=yaoResultStartY）
        currentYaoStartY: 0,
    },

    // 计算第 idx 爻的 engine Y（使用运行时 currentYaoStartY）
    _yaoY: function (idx) {
        return this._state.currentYaoStartY + idx * DivineConfig.layout.yaoSpacingY;
    },

    // ───────────────────────────────────────────────────────────────
    // 场景创建 / 关闭
    // ───────────────────────────────────────────────────────────────

    createDivineUI: async function () {
        console.log('[LOG] createDivineUI');

        await ac.createLayer({
            name: this.layer.scene, index: ZORDER.UI, inlayer: 'window',
        });

        // 初始化运行时爻线起始 Y
        this._state.currentYaoStartY = DivineConfig.layout.yaoStartY;

        // 全屏背景
        await ac.createImage({
            name: 'img_divine_scene_bg', index: 0, inlayer: this.layer.scene,
            resId: DivineConfig.res.background,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        this._state.waitingForClick = false;
        this._state.maskCreated     = false;
    },

    /** 创建 6 个爻名称标签（在提示对话关闭后、硬币出现前调用）*/
    createYaoLabels: async function () {
        for (let i = 0; i < 6; i++) {
            await ac.createText({
                name:    this.yao.label(i),
                index:   1, inlayer: this.layer.scene,
                content: DivineConfig.yaoLabels[i],
                pos:     { x: DivineConfig.layout.yaoLabelX, y: this._yaoY(i) },
                anchor:  { x: 0, y: 50 },
                size:    { width: 80, height: 40 },
                style:   DivineConfig.style.yaoLabel,
                halign:  ac.HALIGN_TYPES.left,
                valign:  ac.VALIGN_TYPES.center,
            });
            await ac.hide({ name: this.yao.label(i) });
        }
    },

    closeDivineUI: async function () {
        await ac.remove({
            name: this.layer.scene, effect: 'fadeout',
            duration: DivineConfig.anim.sceneFadeDuration,
        });
        this._state.maskCreated = false;
    },

    // ───────────────────────────────────────────────────────────────
    // 硬币创建与展开
    // ───────────────────────────────────────────────────────────────

    /**
     * 创建硬币并淡入中间那枚（提示对话关闭后调用）
     * 左右两枚隐藏，等第一轮点击时由 spreadCoins 展开
     */
    showCoins: async function () {
        const cx = GameConfig.centerX;
        const cy = DivineConfig.layout.coinY;

        for (let i = 0; i < 3; i++) {
            await ac.createImage({
                name: this.coin.front(i), index: 100, inlayer: this.layer.scene,
                resId: DivineConfig.res.coin.front,
                pos: { x: cx, y: cy }, anchor: { x: 50, y: 50 },
            });
            await ac.createImage({
                name: this.coin.back(i), index: 100, inlayer: this.layer.scene,
                resId: DivineConfig.res.coin.back,
                pos: { x: cx, y: cy }, anchor: { x: 50, y: 50 },
            });
            // 所有正面和背面全部隐藏，由入场动效统一显示
            await ac.hide({ name: this.coin.back(i) });
            await ac.hide({ name: this.coin.front(i) });
        }
        this._state.coinFace = [1, 1, 1];

        // 蒙层与交互绑定延迟到提示对话关闭后创建，避免拦截对话框触摸
    },

    /**
     * 交互方式 A：点击任意硬币触发投掷
     * 蒙层 mode='swipe'，但 onTouchEnded 无论有没有移动都触发
     */
    _bindCoinTap: function () {
        this._state.maskMode = 'swipe';
        this._state.maskMoveFlag = true;   // tap 模式忽略 move flag，始终触发
    },

    /**
     * 交互方式 B：在屏幕上原地滑动触发投掷
     * 蒙层统一捕获手势，onTouchMoved 设 flag，onTouchEnded 检查 flag
     */
    _bindCoinSwipe: function () {
        this._state.maskMode = 'swipe';
        this._state.maskMoveFlag = false;
    },

    /**
     * 左右两枚硬币从中心飞向各自位置，同时旋转一圈
     * easeExponentialOut：快速弹出后减速，带有弹性感
     */
    spreadCoins: async function () {
        const cx  = GameConfig.centerX;
        const cy  = DivineConfig.layout.coinY;
        const sx  = DivineConfig.layout.coinSpacingX;
        const dur = DivineConfig.anim.coinSpreadDuration;

        // 先显示左右两枚（原本叠在中心隐藏）
        await ac.show({ name: this.coin.front(0) });
        await ac.show({ name: this.coin.front(2) });

        // 展开 + 旋转（所有动画并行）
        // 正面和背面一起移动，确保翻面时位置正确
        ac.moveTo({ name: this.coin.front(0), x: cx - sx, y: cy, duration: dur, ease: 'easeExponentialOut' });
        ac.moveTo({ name: this.coin.back(0),  x: cx - sx, y: cy, duration: dur, ease: 'easeExponentialOut' });
        ac.moveTo({ name: this.coin.front(2), x: cx + sx, y: cy, duration: dur, ease: 'easeExponentialOut' });
        ac.moveTo({ name: this.coin.back(2),  x: cx + sx, y: cy, duration: dur, ease: 'easeExponentialOut' });
        ac.rotateTo({ name: this.coin.front(0), rotation: 720,  duration: dur });
        ac.rotateTo({ name: this.coin.front(2), rotation: -720, duration: dur });
        await ac.delay({ time: dur });
    },

    // ───────────────────────────────────────────────────────────────
    // 爻线区下移动画（结果阶段：腾出顶部空间给卦名）
    // ───────────────────────────────────────────────────────────────

    /**
     * 将所有爻标签 + 爻图同步平移到结果阶段位置
     * 调用后 _state.currentYaoStartY 更新为 yaoResultStartY
     */
    slideYaoAreaDown: async function () {
        const L         = DivineConfig.layout;
        const newStartY = L.yaoResultStartY;
        const dur       = DivineConfig.anim.yaoSlideDuration;
        const leftEdgeX = L.yaoImageRightX - L.yaoLineWidth;

        for (let i = 0; i < 6; i++) {
            const newY = newStartY + i * L.yaoSpacingY;
            // 标签 + clip layer 并行移动，图片随 clip layer 一起移动无需单独处理
            ac.moveTo({ name: this.yao.label(i), x: L.yaoLabelX,  y: newY, duration: dur });
            ac.moveTo({ name: this.yao.clip(i),  x: leftEdgeX,    y: newY, duration: dur });
        }
        await ac.delay({ time: dur });

        this._state.currentYaoStartY = newStartY;
    },

    // ───────────────────────────────────────────────────────────────
    // 硬币翻转动画（复用 createDivineUI 时已创建的硬币控件）
    // ───────────────────────────────────────────────────────────────

    /**
     * 对常驻硬币执行翻转动画，结束后停在 coins[] 指定的面
     * @param {Array<number>} coins  [0/1, 0/1, 0/1]，1=正面/yang，0=背面/yin
     */
    playCoinAnimation: async function (coins) {
        const half      = DivineConfig.anim.flipHalfDuration;
        const flipCount = DivineConfig.anim.flipCount;

        // currentFace 从上次状态继承（常驻硬币）
        const currentFace = this._state.coinFace;

        for (let f = 0; f < flipCount; f++) {
            const isLast = f === flipCount - 1;

            // 压扁阶段
            for (let i = 0; i < 3; i++) {
                const vis = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: vis, x: 0, y: 100, duration: half });
            }
            await ac.delay({ time: half });

            // 换面
            for (let i = 0; i < 3; i++) {
                const oldVis  = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                const newFace = isLast ? coins[i] : (1 - currentFace[i]);
                currentFace[i] = newFace;
                const newVis  = newFace === 1 ? this.coin.front(i) : this.coin.back(i);
                if (oldVis !== newVis) {
                    ac.scaleTo({ name: newVis, x: 0, y: 100, duration: 0 });
                    await ac.hide({ name: oldVis });
                    await ac.show({ name: newVis });
                }
            }

            // 还原阶段
            for (let i = 0; i < 3; i++) {
                const vis = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: vis, x: 100, y: 100, duration: half });
            }
            await ac.delay({ time: half });
        }

        // 更新持久状态
        this._state.coinFace = currentFace.slice();
    },

    /** 6 轮结束后淡出并移除所有硬币 */
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
    // 爻线显示
    // ───────────────────────────────────────────────────────────────

    /**
     * 淡入显示爻图（clip layer 包裹，为后续无变形擦除做准备）
     * @param {number} roundIdx  0~5（0=初爻）
     * @param {string} yaoType   'yang' / 'yin'
     */
    showYao: async function (roundIdx, yaoType) {
        const L         = DivineConfig.layout;
        const dur       = DivineConfig.anim.yaoFadeDuration;
        const clipName  = this.yao.clip(roundIdx);
        const imgName   = this.yao.image(roundIdx);
        const leftEdgeX = L.yaoImageRightX - L.yaoLineWidth;
        const yaoY      = this._yaoY(roundIdx);

        // clip layer：宽度 = 爻线宽，clipMode=true，anchor 左边缘中心
        await ac.createLayer({
            name: clipName, index: 1, inlayer: this.layer.scene,
            pos:    { x: leftEdgeX, y: yaoY },
            anchor: { x: 0, y: 50 },
            size:   { width: L.yaoLineWidth, height: L.yaoClipHeight },
            clipMode: true,
        });

        // 爻图放在 clip layer 内，局部坐标左边缘对齐，初始透明
        await ac.createImage({
            name: imgName, index: 0, inlayer: clipName,
            resId:   DivineConfig.res.yao[yaoType],
            pos:     { x: 0, y: L.yaoClipHeight / 2 },
            anchor:  { x: 0, y: 50 },
            opacity: 0,
        });

        // 淡入爻图（clip layer 本身不设透明，对图片淡入）
        await ac.fadeTo({ name: imgName, opacity: 100, duration: dur });
    },

    // ───────────────────────────────────────────────────────────────
    // 结果展示（卦名 → 爻辞逐条 → 卦辞 → 等待点击）
    // ───────────────────────────────────────────────────────────────

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
        await ac.fadeTo({ name: this.hex.name, opacity: 100, duration: A.hexNameFadeDuration });

        // ② 逐条处理（初爻 i=0 → 上爻 i=5）
        for (let i = 0; i < 6; i++) {
            const clipName = this.yao.clip(i);
            const imgName  = this.yao.image(i);

            // 隐藏本行爻名标签
            ac.hide({ name: this.yao.label(i) });

            // 无变形擦除：clip layer 右移 + 图片左移（等量抵消，图片世界坐标不变）
            // clip layer x：leftEdgeX → yaoImageRightX（向右移动一个爻线宽）
            // 图片局部 x：0 → -yaoLineWidth（向左移动同等距离）
            ac.moveTo({ name: clipName, x: L.yaoImageRightX,  y: this._yaoY(i), duration: A.yaoEraseDuration });
            ac.moveTo({ name: imgName,  x: -L.yaoLineWidth,   y: L.yaoClipHeight / 2, duration: A.yaoEraseDuration });
            await ac.delay({ time: A.yaoEraseDuration });
            await ac.remove({ name: clipName });  // 同时移除子节点 imgName

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
        await ac.fadeTo({ name: this.hex.judgment, opacity: 100, duration: A.judgmentFadeDuration });

        // ④ 等待点击关闭
        await this._waitForClick();
    },

    /**
     * 打字机效果：逐字创建独立文本控件
     * @param {string} text     本行爻辞文本
     * @param {number} yaoIdx   爻索引 0~5
     */
    _typewriterLine: async function (text, yaoIdx) {
        const y           = this._yaoY(yaoIdx);
        const startX      = DivineConfig.layout.yaoTextX;
        const fontSize    = DivineConfig.style.yaoTextFontSize;
        const delay       = DivineConfig.anim.typewriterDelay;
        const floatOffset = DivineConfig.anim.typewriterFloatOffset;
        const floatDur    = DivineConfig.anim.typewriterFloatDuration;

        let xOffset = 0;
        for (let ci = 0; ci < text.length; ci++) {
            const char     = text[ci];
            const charW    = Utils.measureCharWidth(char, fontSize);
            const charName = this.yao.char(yaoIdx, ci);

            // 在目标位置下方 floatOffset 处创建，透明
            await ac.createText({
                name:    charName,
                index:   2, inlayer: this.layer.scene,
                content: char,
                pos:     { x: startX + xOffset, y: y - floatOffset },
                anchor:  { x: 0, y: 50 },
                size:    { width: Math.ceil(charW) + 4, height: 50 },
                style:   DivineConfig.style.yaoText,
                halign:  ac.HALIGN_TYPES.left,
                valign:  ac.VALIGN_TYPES.center,
                opacity: 100,
            });

            // 淡入 + 向上浮动（并行，不 await）
            ac.show({ name: charName });
            ac.moveBy({ name: charName, x: 0, y: floatOffset, duration: floatDur });

            xOffset += charW;
            await ac.delay({ time: delay });
        }
    },

    // ───────────────────────────────────────────────────────────────
    // 全程唯一蒙层（投掷阶段=swipe，结果阶段=click）
    // ───────────────────────────────────────────────────────────────

    /**
     * 创建全程蒙层并注册统一事件处理。
     * 根据 _state.maskMode 的当前值决定行为：
     *   'swipe'  → onTouchMoved 置 flag，onTouchEnded 有 flag 才触发投掷
     *   'click'  → onTouchEnded 直接通知等待
     * mode 在运行时可改（_state.maskMode = 'click'）无需重新注册。
     */
    _setupMask: async function () {
        if (this._state.maskCreated) return;
        await ac.createLayer({
            name:   this.layer.mask, index: 150, inlayer: this.layer.scene,
            pos:    { x: 0, y: 0 },
            size:   { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 0, y: 0 }, clipMode: false,
        });

        const self = this;
        let swipeMoved = false;

        ac.addEventListener({
            type:     ac.EVENT_TYPES.onTouchBegan,
            listener: function () { swipeMoved = false; },
            target:   self.layer.mask,
        });
        ac.addEventListener({
            type:     ac.EVENT_TYPES.onTouchMoved,
            listener: function () { swipeMoved = true; },
            target:   self.layer.mask,
        });
        ac.addEventListener({
            type:     ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                if (self._state.maskMode === 'swipe') {
                    // tap 模式：maskMoveFlag=true 表示忽略 move 检查（点击即触发）
                    if (self._state.maskMoveFlag || swipeMoved) {
                        swipeMoved = false;
                        await DivineSystem.onClickDivineButton();
                    }
                } else if (self._state.maskMode === 'click') {
                    self._state.waitingForClick = false;
                }
            },
            target:   self.layer.mask,
        });

        this._state.maskCreated = true;
    },

    _waitForClick: async function () {
        this._state.maskMode = 'click';
        this._state.waitingForClick = true;
        while (this._state.waitingForClick) {
            await ac.delay({ time: 100 });
        }
    },
};
