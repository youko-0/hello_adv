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
     * 灵视道具专属判断接口：显示回溯选项，拥有灵视继续剧情，否则执行失败剧情
     * @param {Function} successBranch 拥有灵视时的剧情回调（继续剧情）
     */
    showSpiritEyeOption: async function () {
        await ac.sysDialogOff({});
        await CommonUI.showCustomDialog({
            content: '是否进入回溯？',
            closeType: 2,
        })
        let flag = await this.showItemCheckOption({
            itemId: 'item_spirit_eye',
            optionText1: '进入回溯',
            callback1: null,    // 然后会走后续剧情
            optionText2: '不进入回溯',
            callback2: async () => {
                await ac.jump({
                    plotID: ResMap.plot_bad_end_without_spirit_eye,
                    transition: ac.SCENE_TRANSITION_TYPES.fade,
                    duration: 1000,
                });
            },
        });
        await CommonUI.closeCustomDialog();
        // if (flag == 0) {
        //     // 走后续剧情
        // }
        // else {
        //     // 跳去失败剧情
        // }
    },

    // 进入地图剧情, await PlotSystem.enterPlotMap()
    enterPlotMap: async function () {
        await ac.jump({
            plotID: ResMap.plot_map,
            transition: ac.SCENE_TRANSITION_TYPES.fade,
            duration: 1000,
        });
    },

    /**
     * 章节开篇占卜流程：对话框提问 → 选项 → 完整占卜
     * await PlotSystem.playChapterDivine({...})
     * @param {Object} config
     * @param {string} [config.prompt='你想占卜什么？'] 提问对话框文本
     * @param {string} config.question 玩家选择的占卜内容（选项文本）
     * @param {Array<Array<number>>} config.coinResults 6 轮 × 3 枚硬币结果
     * @param {Object} config.hexagram 卦数据
     * @param {string} config.hexagram.name      卦名（如 '火水未济卦'）
     * @param {string} config.hexagram.judgment  卦辞
     * @param {Array<string>} config.hexagram.yaoTexts 6 条爻辞，索引 0=初爻
     * @param {Function} [config.onComplete] 全部结束后回调
     */
    playChapterDivine: async function (config) {
        const {
            prompt = '你想占卜什么？',
            question,
            coinResults,
            hexagram,
            onComplete,
        } = config;

        await ac.sysDialogOff({});

        // 1. 加载全屏占卜背景（在对话框出现之前）
        await ac.createImage({
            name:    'img_chapter_divine_bg',
            index:   ZORDER.BOTTOM_SCENE,
            inlayer: 'window',
            resId:   ResMap.pic_divine_bg,
            pos:     { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor:  { x: 50, y: 50 },
        });

        // 2. 提问对话框（closeType:3 = 等待玩家点击后保留，不自动关闭）
        await CommonUI.showCustomDialog({ content: prompt, closeType: 3 });

        // 3. 单选项（对话框保持显示，等待玩家选择）
        await CommonUI.showCustomOptionGroup({
            options: [
                { content: question, callback: null, enabled: true },
            ],
        });

        // 4. 选项关闭后手动关闭对话框
        await CommonUI.closeCustomDialog();

        // 4. 完整占卜流程
        await DivineSystem.startDivine({ coinResults, hexagram, onComplete });

        // 5. 淡出移除全屏占卜背景
        await ac.remove({ name: 'img_chapter_divine_bg', effect: 'fadeout', duration: 500, canskip: false });
    },
};