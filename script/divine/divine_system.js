// 占卜系统
console.log('[LOAD] divine_system');

const DivineSystem = {
    // 运行时状态
    coinResults:   null,    // [[0,1,1], ...] 6 轮 × 3 枚硬币结果，0=阴 1=阳
    hexagram:      null,    // { name, judgment, yaoTexts:[6] }
    onComplete:    null,    // 占卜完成回调
    currentRound:  0,       // 当前轮次（0~5）
    busy:          false,   // 单轮动画进行中标志，防止重复点击
    _done:         false,   // 全流程结束标志

    /**
     * 启动占卜流程
     * @param {Object}  config
     * @param {Array<Array<number>>} config.coinResults - 6 轮 × 3 枚硬币结果，0=阴 1=阳
     * @param {Object}  config.hexagram                 - 卦数据
     * @param {string}  config.hexagram.name            - 卦名（如 "火水未济卦"）
     * @param {string}  config.hexagram.judgment        - 卦辞
     * @param {Array<string>} config.hexagram.yaoTexts  - 6 条爻辞，索引 0=初爻
     * @param {Function} [config.onComplete]            - 全部流程结束后回调
     */
    startDivine: async function (config) {
        console.log('[LOG] startDivine', config);

        const { coinResults, hexagram, onComplete } = config || {};

        if (!Array.isArray(coinResults) || coinResults.length !== 6) {
            console.error('[DivineSystem] coinResults 必须是长度为 6 的数组');
            return;
        }
        if (!hexagram || !hexagram.name || !hexagram.judgment
            || !Array.isArray(hexagram.yaoTexts) || hexagram.yaoTexts.length !== 6) {
            console.error('[DivineSystem] hexagram 必须包含 name/judgment/yaoTexts(长度6)');
            return;
        }

        this.coinResults  = coinResults;
        this.hexagram     = hexagram;
        this.onComplete   = onComplete;
        this.currentRound = 0;
        this.busy         = false;
        this._done        = false;

        await ac.sysDialogOff({});
        await DivineUI.createDivineUI();

        // 等待全流程结束（六轮 + 卦名卦辞 + 爻辞 + 关闭）
        while (!this._done) {
            await ac.delay({ time: 200 });
        }

        if (this.onComplete) await this.onComplete();
    },

    /**
     * 计算单轮爻类型
     * @param {Array<number>} coins - [0/1, 0/1, 0/1]
     * @returns {string} 'yang'（长横线）或 'yin'（双短线）
     */
    calcYaoType: function (coins) {
        const sum = coins[0] + coins[1] + coins[2];
        return sum >= 2 ? 'yang' : 'yin';
    },

    /**
     * 占卜按钮点击处理（每次点击执行一轮）
     */
    onClickDivineButton: async function () {
        if (this.busy) return;
        if (this.currentRound >= 6) return;
        this.busy = true;

        const round = this.currentRound;
        const coins = this.coinResults[round];
        console.log(`[LOG] 第 ${round + 1} 轮占卜，硬币:`, coins);

        // 隐藏按钮 → 显示禁用态按钮（掷硬币期间无点击响应）
        await DivineUI.hideButton();
        await DivineUI.showDisabledButton();

        // 硬币翻转动画
        await DivineUI.playCoinAnimation(coins);

        // 停留 1 秒
        await ac.delay({ time: 1000 });

        // 在对应爻槽淡入显示本轮结果
        const yaoType = this.calcYaoType(coins);
        await DivineUI.showYao(round, yaoType);

        this.currentRound++;

        if (this.currentRound < 6) {
            // 还有下一轮：移除禁用按钮 → 恢复正常按钮
            await DivineUI.hideButton();
            await DivineUI.showButton();
            this.busy = false;
        } else {
            // 6 轮完成：淡出硬币 + 移除禁用按钮
            await DivineUI.fadeOutCoins();
            await DivineUI.hideButton();

            // 爻线区整体下移，腾出顶部空间
            await DivineUI.slideYaoAreaDown();

            await ac.delay({ time: 300 });

            // 卦名顶部淡入 → 爻线逐条擦除+打字机 → 卦辞底部淡入 → 等待点击
            await DivineUI.showDivineResult(
                this.hexagram.name,
                this.hexagram.judgment,
                this.hexagram.yaoTexts
            );

            await DivineUI.closeDivineUI();
            this._done = true;
            this.busy  = false;
        }
    },
};
