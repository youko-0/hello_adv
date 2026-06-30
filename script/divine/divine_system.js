// 占卜系统
console.log('[LOAD] divine_system');

const DivineSystem = {
    coinResults:  null,
    hexagram:     null,
    currentRound: 0,
    busy:         false,
    _done:        false,

    /**
     * 第一步：验证参数、存储数据、创建占卜场景（背景 + 爻标签，不含硬币）
     * 调用方可在此之后插入对话框、选项等内容
     * @param {Object} config
     * @param {Array<Array<number>>} config.coinResults
     * @param {Object}  config.hexagram  { name, judgment, yaoTexts:[6] }
     */
    prepareDivine: async function (config) {
        console.log('[LOG] prepareDivine', config);

        const { coinResults, hexagram } = config || {};

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
        this.currentRound = 0;
        this.busy         = false;
        this._done        = false;

        await DivineUI.createDivineUI();
    },

    /**
     * 第二步：显示提示对话 → 硬币淡入 → 等待玩家完成六轮 + 结果展示
     * 函数返回时整个占卜流程结束，调用方可继续后续剧情
     */
    runDivine: async function () {
        // 创建爻标签和硬币（全部隐藏）
        await DivineUI.createYaoLabels();
        await DivineUI.showCoins();

        // 入场：从上爻到初爻逐条淡入，再是中间硬币
        for (let i = 5; i >= 0; i--) {
            ac.show({ name: DivineUI.yao.label(i), effect: 'fadein', duration: 500, canskip: false });
            await ac.delay({ time: 100 });
        }
        // 等硬币淡入完成后再弹提示
        await ac.show({ name: DivineUI.coin.front(1), effect: 'fadein', duration: 500, canskip: false });

        // 提示对话（元素已全部显示后弹出）
        await ac.sysDialogOn({ content: '点击硬币进行占卜' });
        await ac.sysDialogOff({});

        // 对话框关闭后再创建蒙层并绑定硬币点击，避免蒙层拦截对话框触摸
        await DivineUI._setupMask();
        DivineUI._bindCoinTap();
        // DivineUI._bindCoinSwipe();

        // 等待全流程结束
        while (!this._done) {
            await ac.delay({ time: 200 });
        }
    },

    calcYaoType: function (coins) {
        const sum = coins[0] + coins[1] + coins[2];
        return sum >= 2 ? 'yang' : 'yin';
    },

    onClickDivineButton: async function () {
        if (this.busy) return;
        if (this.currentRound >= 6) return;
        this.busy = true;

        const round = this.currentRound;
        const coins = this.coinResults[round];
        console.log(`[LOG] 第 ${round + 1} 轮占卜，硬币:`, coins);

        if (round === 0) {
            await DivineUI.spreadCoins();
        }

        await DivineUI.playCoinAnimation(coins);
        await ac.delay({ time: 1000 });

        const yaoType = this.calcYaoType(coins);
        await DivineUI.showYao(round, yaoType);

        this.currentRound++;

        if (this.currentRound < 6) {
            this.busy = false;
        } else {
            await DivineUI.fadeOutCoins();
            await DivineUI.slideYaoAreaDown();
            await ac.delay({ time: 300 });
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
