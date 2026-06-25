// 剧情通用系统
console.log('[LOAD] plot_system');

const PlotSystem = {
    /**
     * 快捷接口：显示带有道具检查逻辑的选项组, 有道具启用第一个选项, 否则启用第二个选项
     * @param {Object} config 配置项
     * @param {string} config.itemId 需要检查的道具ID (例如："item_spirit_vision")
     * @param {string} config.optionText1 拥有道具的选项文本
     * @param {string} config.optionText2 未拥有道具的选项文本
     * @param {Function} config.callback1 拥有道具的回调
     * @param {Function} config.callback2 未拥有道具的回调
     */
    showItemCheckOption: async function (config) {
        const {
            itemId,
            optionText1,
            optionText2,
            callback1,
            callback2,
        } = config;
        const hasItem = InventorySystem.getItemCount(itemId) > 0;
        console.log(`[Plot] 检查道具 ${itemId}, 是否拥有: ${hasItem}`);
        let flag = await CommonUI.showCustomOptionGroup({
            options: [
                {
                    content: optionText1,
                    callback: callback1,
                    enabled: hasItem,
                },
                {
                    content: optionText2,
                    callback: callback2,
                    enabled: !hasItem,
                },
            ]
        });
        return flag
    },

    /**
     * 灵视道具专属判断接口：显示回溯选项，点击后检查是否拥有灵视，有则继续剧情，否则提示并跳转失败剧情
     * @param {number} [failPlot] 失败剧情ID（数字），不传则默认取 ResMap.plot_bad_end_without_spirit_eye
     */
    showSpiritEyeOption: async function (failPlot) {
        await ac.sysDialogOff({});
        await CommonUI.showCustomDialog({
            content: '是否进入回溯？',
            closeType: 2,
        });
        await CommonUI.showCustomOptionGroup({
            options: [
                {
                    content: '进入回溯',
                    callback: null,
                    enabled: true,
                },
            ],
        });
        const hasItem = InventorySystem.getItemCount('item_spirit_eye') > 0;
        console.log(`[Plot] 检查道具 item_spirit_eye, 是否拥有: ${hasItem}`);
        if (!hasItem) {
            await CommonUI.showCustomDialog({
                content: '缺少关键道具【灵视】，回溯失败',
                // closeType: 2,
            });
            await ac.jump({
                plotID: failPlot || ResMap.plot_bad_end_without_spirit_eye,
                transition: ac.SCENE_TRANSITION_TYPES.fade,
                duration: 1000,
            });
        } else {
            await CommonUI.closeCustomDialog();
        }
    },

    enterPlotMap: async function () {
        await ac.jump({
            plotID: ResMap.plot_map,
            transition: ac.SCENE_TRANSITION_TYPES.fade,
            duration: 1000,
        });
    },

    /**
     * 章节开篇占卜流程：创建占卜场景 → 对话框提问 → 选项 → 占卜
     * await PlotSystem.playChapterDivine({...})
     * @param {Object} config
     * @param {string} [config.prompt='你想占卜什么？'] 提问对话框文本
     * @param {string} config.question 玩家选择的占卜内容（选项文本）
     * @param {Array<Array<number>>} config.coinResults 6 轮 × 3 枚硬币结果
     * @param {Object} config.hexagram 卦数据
     * @param {string} config.hexagram.name      卦名（如 '火水未济卦'）
     * @param {string} config.hexagram.judgment  卦辞
     * @param {Array<string>} config.hexagram.yaoTexts 6 条爻辞，索引 0=初爻
     */
    playChapterDivine: async function (config) {
        const {
            prompt = '你想占卜什么？',
            question,
            coinResults,
            hexagram,
        } = config;

        await ac.sysDialogOff({});

        // 1. 创建占卜场景（背景），不含硬币
        await DivineSystem.prepareDivine({ coinResults, hexagram });

        // 2. 提问对话框（closeType:3 = 等待点击后保留不关闭）
        await CommonUI.showCustomDialog({ content: prompt, closeType: 3 });

        // 3. 单选项
        await CommonUI.showCustomOptionGroup({
            options: [
                { content: question, callback: null, enabled: true },
            ],
        });

        // 4. 关闭提问对话框
        await CommonUI.closeCustomDialog();

        // 5. 提示"点击硬币"→ 硬币淡入 → 等待六轮完成 + 结果展示
        await DivineSystem.runDivine();
    },
};