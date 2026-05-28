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
    fontSize: 32,
    color: '#d1d3df',
});

ac.createStyle({
    name: 'style_divine_result_text',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 28,
    color: '#d1d3df',
});

const DivineConfig = {

    // 爻名称（索引 0~5：初爻 → 上爻，从下往上）
    yaoLabels: ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'],

    // 资源
    res: {
        // 三枚硬币的正反面
        coin: {
            front: ResMap.img_divine_coin_yang,   // 阳面（1）
            back: ResMap.img_divine_coin_yin,     // 阴面（0）
        },
        // 单轮爻的四种结果图
        yao: {
            yang_static: ResMap.img_divine_yao_yang_white,   // 少阳：白色长横线
            yang_change: ResMap.img_divine_yao_yang_red,     // 老阳：红色长横线（变爻）
            yin_static: ResMap.img_divine_yao_yin_white,     // 少阴：白色双短横线
            yin_change: ResMap.img_divine_yao_yin_red,       // 老阴：红色双短横线（变爻）
        },
        // 占卜按钮
        button: {
            normal: ResMap.btn_divine_normal,
            pressed: ResMap.btn_divine_pressed,
        },
        // 结果界面文本框背景（32×32 纯色小图，缩放铺满）
        resultBg: {
            resId: ResMap.img_divine_result_bg,
            srcWidth: 32,
            srcHeight: 32,
        },
    },

    // 文本样式（需在易次元工程中预定义）
    style: {
        yaoLabel: 'style_divine_yao_label',       // 爻名称样式
        resultText: 'style_divine_result_text',   // 结果文本样式
        resultFontSize: 28,                       // 结果文本字号（用于分页计算）
    },

    // 布局
    layout: {
        // 6 个爻槽（初爻 y 最低，上爻 y 最高）
        yaoStartY: 360,        // 初爻 Y 坐标
        yaoSpacingY: 50,       // 爻间距
        yaoLabelX: 480,        // "X爻" 文字 X 坐标
        yaoImageX: 700,        // 爻图 X 坐标

        // 占卜按钮
        button: {
            x: GameConfig.centerX,
            y: 100,
            width: 200,
            height: 60,
        },

        // 硬币动画位置
        coinY: GameConfig.centerY,
        coinSpacingX: 200,     // 三枚硬币的横向间距

        // 结果界面文本框
        result: {
            x: GameConfig.centerX,
            y: GameConfig.centerY,
            width: 900,
            height: 540,
            textPadding: { top: 60, bottom: 60, left: 80, right: 80 },
        },
    },

    // 动画时长（ms）
    anim: {
        flipHalfDuration: 120,  // 硬币翻转单段时长，全程 = halfDuration × 2 × flipCount
        flipCount: 5,           // 翻转次数
        coinFadeDuration: 400,  // 硬币淡出
        yaoFadeDuration: 400,   // 爻图淡入
        resultFadeDuration: 600,// 结果界面淡入
        sceneFadeDuration: 500, // 占卜界面淡出
    },
};

// ════════════════════════════════════════════════════════════════════
// 占卜 UI 实现
// ════════════════════════════════════════════════════════════════════

const DivineUI = {

    // 控件名
    layer: {
        scene: 'layer_divine_scene',
        result: 'layer_divine_result',
    },
    button: {
        name: 'btn_divine_start',
    },
    coin: {
        // 每枚硬币创建两张图叠在一起（正反面），用 show/hide 切换显示
        front: idx => `img_divine_coin_front_${idx}`,
        back: idx => `img_divine_coin_back_${idx}`,
    },
    yao: {
        label: idx => `txt_divine_yao_label_${idx}`,
        image: idx => `img_divine_yao_${idx}`,
    },

    // 结果界面点击状态（供 _waitForResultClick 轮询）
    _resultState: {
        waitingForClick: false,
    },

    // ───────────────────────────────────────────────────────────────
    // 占卜界面：创建 / 关闭
    // ───────────────────────────────────────────────────────────────

    /**
     * 创建占卜界面（场景层 + 6 个爻标签 + 占卜按钮）
     */
    createDivineUI: async function () {
        console.log('[LOG] createDivineUI');

        // 场景层（全屏）
        await ac.createLayer({
            name: this.layer.scene,
            index: ZORDER.UI,
            inlayer: 'window',
        });

        // 6 个爻名称标签
        for (let i = 0; i < 6; i++) {
            const y = DivineConfig.layout.yaoStartY + i * DivineConfig.layout.yaoSpacingY;
            await ac.createText({
                name: this.yao.label(i),
                index: 1,
                inlayer: this.layer.scene,
                content: DivineConfig.yaoLabels[i],
                pos: { x: DivineConfig.layout.yaoLabelX, y: y },
                anchor: { x: 50, y: 50 },
                size: { width: 80, height: 40 },
                style: DivineConfig.style.yaoLabel,
                halign: ac.HALIGN_TYPES.middle,
                valign: ac.VALIGN_TYPES.center,
            });
        }

        // 占卜按钮
        await this.showButton();
    },

    /**
     * 关闭占卜界面（淡出后移除）
     */
    closeDivineUI: async function () {
        await ac.remove({
            name: this.layer.scene,
            effect: 'fadeout',
            duration: DivineConfig.anim.sceneFadeDuration,
        });
        await ac.delay({ time: DivineConfig.anim.sceneFadeDuration });
    },

    // ───────────────────────────────────────────────────────────────
    // 占卜按钮
    // ───────────────────────────────────────────────────────────────

    showButton: async function () {
        const cfg = DivineConfig.layout.button;
        await ac.createOption({
            name: this.button.name,
            index: 10,
            inlayer: this.layer.scene,
            nResId: DivineConfig.res.button.normal,
            sResId: DivineConfig.res.button.pressed,
            content: '占卜',
            pos: { x: cfg.x, y: cfg.y },
            anchor: { x: 50, y: 50 },
            size: { width: cfg.width, height: cfg.height },
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
     * 播放三枚硬币翻转动画，最终停留在 coins 指定的面
     * 每枚硬币创建正反两张图叠在同一位置，通过 scaleX 收缩→切换显示面→展开模拟翻转
     * @param {Array<number>} coins - [0/1, 0/1, 0/1]，0=阴 1=阳
     */
    playCoinAnimation: async function (coins) {
        const cx = GameConfig.centerX;
        const cy = DivineConfig.layout.coinY;
        const sx = DivineConfig.layout.coinSpacingX;
        const half = DivineConfig.anim.flipHalfDuration;
        const flipCount = DivineConfig.anim.flipCount;

        // 创建三枚硬币的正反面
        for (let i = 0; i < 3; i++) {
            const x = cx + (i - 1) * sx;

            // 阳面（front），初始可见
            await ac.createImage({
                name: this.coin.front(i),
                index: 100,
                inlayer: this.layer.scene,
                resId: DivineConfig.res.coin.front,
                pos: { x: x, y: cy },
                anchor: { x: 50, y: 50 },
            });

            // 阴面（back），初始隐藏
            await ac.createImage({
                name: this.coin.back(i),
                index: 100,
                inlayer: this.layer.scene,
                resId: DivineConfig.res.coin.back,
                pos: { x: x, y: cy },
                anchor: { x: 50, y: 50 },
            });
            await ac.hide({ name: this.coin.back(i) });
        }

        // 当前显示的面（初始都是阳面 1）
        const currentFace = [1, 1, 1];

        for (let f = 0; f < flipCount; f++) {
            const isLast = f === flipCount - 1;

            // 阶段 1：当前可见面 scaleX 100 → 0（缩成边缘）
            for (let i = 0; i < 3; i++) {
                const visible = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: visible, x: 0, y: 100, duration: half });
            }
            await ac.delay({ time: half });

            // 切换显示面
            for (let i = 0; i < 3; i++) {
                const oldVisible = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);

                // 最后一次翻转锁定为目标结果，否则继续翻
                const newFace = isLast ? coins[i] : (1 - currentFace[i]);
                currentFace[i] = newFace;

                const newVisible = newFace === 1 ? this.coin.front(i) : this.coin.back(i);

                if (oldVisible !== newVisible) {
                    // 将新面预设为 scaleX=0 再显示，避免切换瞬间出现 scaleX=100 的跳变
                    ac.scaleTo({ name: newVisible, x: 0, y: 100, duration: 0 });
                    await ac.hide({ name: oldVisible });
                    await ac.show({ name: newVisible });
                }
            }

            // 阶段 2：新面 scaleX 0 → 100（展开）
            for (let i = 0; i < 3; i++) {
                const visible = currentFace[i] === 1 ? this.coin.front(i) : this.coin.back(i);
                ac.scaleTo({ name: visible, x: 100, y: 100, duration: half });
            }
            await ac.delay({ time: half });
        }
    },

    /**
     * 硬币淡出并移除
     */
    fadeOutCoins: async function () {
        const dur = DivineConfig.anim.coinFadeDuration;

        for (let i = 0; i < 3; i++) {
            ac.fadeTo({ name: this.coin.front(i), opacity: 0, duration: dur });
            ac.fadeTo({ name: this.coin.back(i), opacity: 0, duration: dur });
        }
        await ac.delay({ time: dur });

        for (let i = 0; i < 3; i++) {
            await ac.remove({ name: this.coin.front(i) });
            await ac.remove({ name: this.coin.back(i) });
        }
    },

    // ───────────────────────────────────────────────────────────────
    // 爻显示
    // ───────────────────────────────────────────────────────────────

    /**
     * 在指定爻槽淡入显示爻图
     * @param {number} roundIdx - 0~5（0=初爻，5=上爻）
     * @param {string} yaoType  - yang_static / yang_change / yin_static / yin_change
     */
    showYao: async function (roundIdx, yaoType) {
        const y = DivineConfig.layout.yaoStartY + roundIdx * DivineConfig.layout.yaoSpacingY;
        const name = this.yao.image(roundIdx);
        const dur = DivineConfig.anim.yaoFadeDuration;

        // 创建爻图（初始透明）
        await ac.createImage({
            name: name,
            index: 1,
            inlayer: this.layer.scene,
            resId: DivineConfig.res.yao[yaoType],
            pos: { x: DivineConfig.layout.yaoImageX, y: y },
            anchor: { x: 50, y: 50 },
            opacity: 0,
        });

        // 淡入
        ac.fadeTo({ name: name, opacity: 100, duration: dur });
        await ac.delay({ time: dur });
    },

    // ───────────────────────────────────────────────────────────────
    // 结果界面（分页翻页 + 点击关闭）
    // ───────────────────────────────────────────────────────────────

    /**
     * 显示结果界面，支持分页翻页，全部页面浏览完并点击关闭后才返回
     * 流程：淡入背景 → 逐页显示文本 → 每页等待点击翻页 → 最后一页点击后关闭
     * @param {string} text - 结果文本
     */
    showResultUI: async function (text) {
        const cfg = DivineConfig.layout.result;
        const fadeDur = DivineConfig.anim.resultFadeDuration;
        const fontSize = DivineConfig.style.resultFontSize;
        const bg = DivineConfig.res.resultBg;

        // ── 创建结果界面容器 ──
        await ac.createLayer({
            name: this.layer.result,
            index: ZORDER.UI,
            inlayer: 'window',
            pos: { x: cfg.x, y: cfg.y },
            anchor: { x: 50, y: 50 },
            size: { width: cfg.width, height: cfg.height },
            clipMode: false,
        });

        // 背景（初始透明，稍后淡入）
        await ac.createImage({
            name: 'img_divine_result_bg',
            index: 0,
            inlayer: this.layer.result,
            resId: bg.resId,
            pos: { x: cfg.width / 2, y: cfg.height / 2 },
            anchor: { x: 50, y: 50 },
            scale: {
                x: cfg.width * 100 / bg.srcWidth,
                y: cfg.height * 100 / bg.srcHeight,
            },
            opacity: 0,
        });

        // 全屏点击拦截层（index 高于内容层，捕获所有翻页点击）
        await ac.createLayer({
            name: 'layer_divine_result_mask',
            index: 100,
            inlayer: this.layer.result,
            pos: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 0, y: 0 },
            clipMode: false,
        });

        // 绑定点击处理（点击 → 清除等待标志）
        const self = this;
        this._resultState.waitingForClick = false;
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                self._resultState.waitingForClick = false;
            },
            target: 'layer_divine_result_mask',
        });

        // ── 分页计算 ──
        const textWidth = cfg.width - cfg.textPadding.left - cfg.textPadding.right;
        const textHeight = cfg.height - cfg.textPadding.top - cfg.textPadding.bottom;
        const maxLines = Math.floor(textHeight / (fontSize * 1.5));
        const pages = Utils.paginateText(text, fontSize, textWidth, maxLines);

        // ── 背景淡入 ──
        ac.fadeTo({ name: 'img_divine_result_bg', opacity: 100, duration: fadeDur });
        await ac.delay({ time: fadeDur });

        // ── 逐页显示，每页等待点击 ──
        for (let i = 0; i < pages.length; i++) {
            console.log(`[DivineUI] 显示结果第 ${i + 1}/${pages.length} 页`);
            await this._updateResultText(pages[i]);
            await this._waitForResultClick();
        }

        // ── 关闭结果界面 ──
        await this.closeResultUI();
    },

    /**
     * 创建或更新结果文本控件（同名 createText 即覆盖更新）
     * @param {string} content - 当前页文本
     */
    _updateResultText: async function (content) {
        const cfg = DivineConfig.layout.result;
        await ac.createText({
            name: 'txt_divine_result',
            index: 1,
            inlayer: this.layer.result,
            content: content,
            pos: {
                x: cfg.textPadding.left,
                y: cfg.height - cfg.textPadding.top,
            },
            anchor: { x: 0, y: 100 },
            size: {
                width: cfg.width - cfg.textPadding.left - cfg.textPadding.right,
                height: cfg.height - cfg.textPadding.top - cfg.textPadding.bottom,
            },
            style: DivineConfig.style.resultText,
            halign: ac.HALIGN_TYPES.left,
            valign: ac.VALIGN_TYPES.top,
            opacity: 100,
        });
    },

    /**
     * 等待用户点击结果界面（轮询 _resultState.waitingForClick 标志）
     */
    _waitForResultClick: async function () {
        this._resultState.waitingForClick = true;
        while (this._resultState.waitingForClick) {
            await ac.delay({ time: 100 });
        }
    },

    /**
     * 关闭结果界面（淡出移除）
     */
    closeResultUI: async function () {
        await ac.remove({
            name: this.layer.result,
            effect: 'fadeout',
            duration: DivineConfig.anim.sceneFadeDuration,
        });
        await ac.delay({ time: DivineConfig.anim.sceneFadeDuration });
    },
};
