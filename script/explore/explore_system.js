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

        // 已查看全部线索
        onInspectedAll: async function (sceneId) {
            await CommonUI.showCustomDialog({
                content: '场景里似乎没有什么可探索的了。',
            });
            // 跳去下一个剧情(用于独立剧情跳转)
            let nextPlot = SceneConfig[sceneId].nextPlot;
            if (nextPlot) {
                await ac.jump({
                    plotID: nextPlot,
                    transition: ac.SCENE_TRANSITION_TYPES.fade,
                    duration: 1000,
                });
            } else {
                // 关闭场景 UI
                await ExploreUI.closeSceneUI();
            }
        },

        /**
         * 进入场景的 defaultView 进行探索（外部调用接口）
         * @param {string} sceneId - 场景 ID
         */
        enterScene: async function (sceneId) {
            console.log('[LOG] enterScene', sceneId);
            
            // 关闭系统对话框
            await ac.sysDialogOff({});
            const viewId = this.getDefaultView(sceneId);
            // 初始化场景，显示初始视图
            await this.gotoView(sceneId, viewId);

            // 等待直到所有线索都被查看完毕
            while (!this.isInspectedAll(sceneId)) {
                await ac.delay({ time: 500 });
            }

            // 探索完成
            await this.onInspectedAll(sceneId);
        },

        /**
         * 跳转去场景视图（内部调用，不等待完成）
         * @param {string} sceneId  - 场景 ID
         * @param {string} viewId   - 视图 ID
         */
        gotoView: async function (sceneId, viewId) {
            console.log('[LOG] gotoView', sceneId, viewId);
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
            // 如果是 KEY 类型，需要获得道具
            let itemConfig = InventorySystem.getItemConfig(itemId);
            if (itemConfig.type === ItemType.KEY) {
                await InventorySystem.gainItem(itemId, 1, `img_${itemId}`);
            }
        },
    }
);