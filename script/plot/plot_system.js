// 剧情通用系统
console.log('[LOAD] plot_system');

const PlotSystem = {
    /**
     * 快捷接口：显示带有道具检查逻辑的单个选项, 有道具时执行 successBranch，无道具时执行 failBranch
     * @param {Object} config 配置项
     * @param {string} config.itemId 需要检查的道具ID (例如："item_spirit_vision")
     * @param {string} config.optionText 选项的文本 (例如："尝试回溯")
     * @param {Function} config.successBranch 拥有道具时的剧情回调
     * @param {Function} config.failBranch 未拥有道具时的剧情回调
     */
    showItemCheckOption: async function (config) {
        const {
            itemId,
            optionText,
            successBranch,
            failBranch,
        } = config;
        await CommonUI.showCustomOptionGroup({
            options: [
                {
                    text: optionText,
                    callback: async () => {
                        await CommonUI.closeCustomOptionGroup();
                        const hasItem = InventorySystem.getItemCount(itemId) > 0;
                        console.log(`[Plot] 检查道具 ${itemId}, 是否拥有: ${hasItem}`);
                        if (hasItem) {
                            if (successBranch) await successBranch();
                        } else {
                            if (failBranch) await failBranch();
                        }
                    }
                },
            ]
        });
    },

    /**
     * 灵视道具专属判断接口：显示回溯选项，拥有灵视继续剧情，否则执行失败剧情
     * @param {Function} successBranch 拥有灵视时的剧情回调（继续剧情）
     */
    showSpiritEyeOption: async function () {
        await CommonUI.showCustomDialog({
            content: '是否进入回溯？',
            closeType: 2,
        })
        await this.showItemCheckOption({
            itemId: 'item_spirit_eye',
            optionText: '进入回溯',
            successBranch: null,        // 直接继续剧情
            failBranch: async () => {
                await ac.jump({
                    plotID: ResMap.plot_bad_end_without_spirit_eye,
                    transition: ac.SCENE_TRANSITION_TYPES.fade,
                    duration: 1000,
                });
            },
        });
        await CommonUI.closeCustomDialog();
    },

    // 进入地图剧情, await PlotSystem.enterPlotMap()
    enterPlotMap: async function () {
        await ac.jump({
            plotID: ResMap.plot_map,
            transition: ac.SCENE_TRANSITION_TYPES.fade,
            duration: 1000,
        });
    },
};