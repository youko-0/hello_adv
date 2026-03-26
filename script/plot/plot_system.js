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
        await CommonUI.showCustomOptionGroup({
            options: [
                {
                    content: optionText1,
                    onTouchEnded: callback1,
                    enabled: hasItem,
                },
                {
                    content: optionText2,
                    onTouchEnded: callback2,
                    enabled: !hasItem,
                },
            ]
        });
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
        await this.showItemCheckOption({
            itemId: 'item_spirit_eye',
            optionText1: '进入回溯',
            callback1: async () => {
                await CommonUI.closeCustomOptionGroup();
                // 然后会走后续剧情
            },
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