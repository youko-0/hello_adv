// 探索场景
console.log('[LOAD] explore_system');

const ExploreSystem = {
    // 数据缓存
    _data: {
        inspected: {}, // 记录已查看的物品 ID
        // unlockedScenes: {} // 以后如果要扩展已解锁场景，也可以放这里
    },
    // 存入 ac.var 的变量名
    VAR_NAME: 'str_explore_data',

    /**
     * 系统初始化：从存档读取数据
     * 建议在游戏开始或进入探索模式前调用一次
     */
    init: function () {
        // 1. 获取易次元变量
        // 注意：第一次玩的时候，这个变量可能是 null, undefined 或者 空字符串 ""
        let jsonStr = ac.var[this.VAR_NAME];

        // 2. 尝试解析
        if (jsonStr && jsonStr.length > 0) {
            try {
                this._data = JSON.parse(jsonStr);
                console.log("【ExploreSystem】数据读取成功:", this._data);
            } catch (e) {
                console.error("【ExploreSystem】存档数据损坏，重置为默认值", e);
                this._resetData();
            }
        } else {
            console.log("【ExploreSystem】无存档数据，初始化新数据");
            this._resetData();
        }
    },

    /**
     * 保存数据到易次元变量
     * 每次修改数据后调用
     */
    save: function () {
        // 序列化为字符串
        let jsonStr = JSON.stringify(this._data);
        // 存入易次元变量
        ac.var[this.VAR_NAME] = jsonStr;

        console.log("【ExploreSystem】已保存:", jsonStr);
    },

    /**
     * 内部方法：重置数据
     */
    _resetData: function () {
        this._data = {
            inspected: {}
        };
        this.save();
    },

    /**
 * 检查某个线索是否已经查看过
 * @param {string} itemId - 物品/线索 ID
 * @returns {boolean}
 */
    hasInspected: function (itemId) {
        // 检查内存中的数据
        // !! 是为了确保返回的是布尔值 true/false，而不是 undefined
        return !!this._data.inspected[itemId];
    },

    /**
     * 记录某个线索为“已查看”
     * @param {string} itemId 
     */
    recordInspected: function (itemId) {
        if (!itemId) return;

        // 如果还没看过，才进行记录和保存，避免重复写入消耗性能
        if (!this._data.inspected[itemId]) {
            this._data.inspected[itemId] = true;
            this.save(); // 立即存盘
            console.log(`【ExploreSystem】记录新线索: ${itemId}`);
        }
    },

    // 是否已查看场景中的全部线索
    hasInspectedAll: function (sceneId) {
        let sceneConfig = SceneConfig[sceneId];
        for( const [viewId, viewConfig] of Object.entries(sceneConfig.views)) {
            for (const [itemId, interact] of Object.entries(viewConfig.interact)) {
                if (!this.hasInspected(itemId)) {
                    return false;
                }
            }
        }
        return true;
    },

    // 跳去场景
    gotoView: async function (sceneId, viewId = null) {
        console.log('[LOG] gotoView', sceneId, viewId);
        if (await CommonUI.isInterrupted()) {
            return;
        }
        if (viewId == null) {
            viewId = this.getDefaultView(sceneId);
        }
        await ExploreUI.createSceneUI(sceneId, viewId);
    },

    // 查看线索
    viewItem: async function (sceneId, itemId) {
        console.log('[LOG] viewItem', sceneId, itemId);
        await CommonUI.showItemDetail(itemId);
        // 记录为已查看
        this.recordInspected(itemId);
        let flag = this.hasInspectedAll(sceneId);
        console.log('[LOG] hasInspectedAll', flag);
        if (flag) {
            await CommonUI.showSysDialog('场景里似乎没有什么可探索的了。');
            await ac.delay({
                time: 1000,
            })
            let nextPlot = SceneConfig[sceneId].nextPlot;
            if (nextPlot) {
                await ac.jump({
                    plotID: nextPlot,
                    transition: ac.SCENE_TRANSITION_TYPES.normal,
                });
            }
        }
    },

    getDefaultView: function (sceneId) {
        return SceneConfig[sceneId].defaultViewId;
    },

    getViewConfig: function (sceneId, viewId) {
        return SceneConfig[sceneId].views[viewId];
    }
}