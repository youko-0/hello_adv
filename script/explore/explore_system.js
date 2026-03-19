// 探索场景
console.log('[LOAD] explore_system');

// 默认数据结构
const _exploreDefault = function () {
    return {
        inspected: {},      // 记录已查看的线索
    };
};

const ExploreSystem = createSystem(
    'str_explore_data', // 变量名
    _exploreDefault,    // 默认数据生成器
    {
        getDefaultView: function (sceneId) {
            return SceneConfig[sceneId].defaultViewId;
        },

        getViewConfig: function (sceneId, viewId) {
            return SceneConfig[sceneId].views[viewId];
        },

        /**
         * 检查某个线索是否已经查看过
         * @param {string} itemId - 物品/线索 ID
         * @returns {boolean}
         */
        isInspected: function (itemId) {
            // 确保数据已加载
            const data = this.getData();
            // !! 是为了确保返回的是布尔值 true/false，而不是 undefined
            return !!data.inspected[itemId];
        },

        /**
         * 记录某个线索为“已查看”
         * @param {string} itemId 
         */
        recordInspected: function (itemId) {
            if (!itemId) return;
            const data = this.getData();
            // 如果还没看过，才进行记录和保存，避免重复写入消耗性能
            if (!data.inspected[itemId]) {
                data.inspected[itemId] = true;
                this.save(); // 立即存盘
                console.log(`【ExploreSystem】记录新线索: ${itemId}`);
            }
        },

        /**
         * 是否已查看场景中的全部线索
         * @param {string} sceneId  - 场景 ID
         */
        isInspectedAll: function (sceneId) {
            let sceneConfig = SceneConfig[sceneId];
            for (const [viewId, viewConfig] of Object.entries(sceneConfig.views)) {
                if (!viewConfig.interact) continue;
                for (const [itemId, interact] of Object.entries(viewConfig.interact)) {
                    if (!this.isInspected(itemId)) {
                        return false;
                    }
                }
            }
            return true;
        },

        /**
         * 跳转去场景
         * @param {string} sceneId  - 场景 ID
         * @param {string} viewId   - 视图 ID（可选），如果不指定则使用场景配置中的默认视图
         */
        gotoView: async function (sceneId, viewId = null) {
            console.log('[LOG] gotoView', sceneId, viewId);
            if (viewId == null) {
                viewId = this.getDefaultView(sceneId);
            }
            await ExploreUI.createSceneUI(sceneId, viewId);
        },

        /**
         * 查看场景中的线索物品
         * @param {string} sceneId  - 场景 ID
         * @param {string} itemId   - 线索物品 ID
         */
        viewItem: async function (sceneId, itemId) {
            console.log('[LOG] viewItem', sceneId, itemId);
            await InventoryUI.showItemDetail(itemId);
            // 记录为已查看
            this.recordInspected(itemId);
            let flag = this.isInspectedAll(sceneId);
            console.log('[LOG] isInspectedAll', flag);
            if (flag) {
                let config = {
                    content: '场景里似乎没有什么可探索的了。',
                }
                await CommonUI.showCustomDialog(config);
                let nextPlot = SceneConfig[sceneId].nextPlot;
                if (nextPlot) {
                    await ac.jump({
                        plotID: nextPlot,
                        transition: ac.SCENE_TRANSITION_TYPES.fade,
                        duration: 1000,
                    });
                }
            }
        },
    }
);