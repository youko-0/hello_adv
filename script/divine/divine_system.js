// 占卜系统
console.log('[LOAD] divine_system');

const DivineSystem = {
    // 运行时状态
    coinResults: null,    // [[0,1,1], ...] 6 轮 × 3 枚硬币结果，0=阴 1=阳
    resultText: null,     // 占卜完成后显示的结果文本
    onComplete: null,     // 占卜完成回调
    currentRound: 0,      // 当前轮次（0~5）
    busy: false,          // 单轮动画进行中标志，防止重复点击

    /**
     * 启动占卜流程
     * @param {Array<Array<number>>} coinResults - 6 轮 × 3 枚硬币结果，0=阴 1=阳
     * @param {string} resultText - 占卜结束后的结果文本
     * @param {Function} [onComplete] - 全部流程结束后的回调
     */
    startDivine: async function (coinResults, resultText, onComplete) {
        console.log('[LOG] startDivine', coinResults);

        if (!Array.isArray(coinResults) || coinResults.length !== 6) {
            console.error('[DivineSystem] coinResults 必须是长度为 6 的数组');
            return;
        }

        this.coinResults = coinResults;
        this.resultText = resultText;
        this.onComplete = onComplete;
        this.currentRound = 0;
        this.busy = false;

        // 关闭系统对话框
        await ac.sysDialogOff({});

        // 创建占卜界面
        await DivineUI.createDivineUI();
    },

    /**
     * 计算单轮爻类型
     * @param {Array<number>} coins - [0/1, 0/1, 0/1]
     * @returns {string} 爻类型 key（对应 DivineConfig.res.yao）
     */
    calcYaoType: function (coins) {
        const sum = coins[0] + coins[1] + coins[2];
        if (sum === 3) return 'yang_change';   // 老阳：红色长横线（变爻）
        if (sum === 2) return 'yang_static';   // 少阳：白色长横线
        if (sum === 1) return 'yin_static';    // 少阴：白色双短横线
        return 'yin_change';                    // 老阴：红色双短横线（变爻）
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

        // 隐藏按钮
        await DivineUI.hideButton();

        // 硬币翻转动画（最终停在 coins）
        await DivineUI.playCoinAnimation(coins);

        // 停留 1 秒
        await ac.delay({ time: 1000 });

        // 硬币淡出移除
        await DivineUI.fadeOutCoins();

        // 在对应爻槽淡入显示本轮结果
        const yaoType = this.calcYaoType(coins);
        await DivineUI.showYao(round, yaoType);

        this.currentRound++;

        if (this.currentRound < 6) {
            // 还有下一轮，恢复按钮等待点击
            await DivineUI.showButton();
            this.busy = false;
        } else {
            // 6 轮完成，过渡到结果界面
            await ac.delay({ time: 600 });
            await DivineUI.closeDivineUI();
            await DivineUI.showResultUI(this.resultText);

            this.busy = false;
            if (this.onComplete) await this.onComplete();
        }
    },

    /**
     * 关闭结果界面（外部调用）
     */
    closeResult: async function () {
        await DivineUI.closeResultUI();
    },
};
