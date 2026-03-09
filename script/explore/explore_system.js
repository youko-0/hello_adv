// 探索场景
console.log('[LOAD] explore_system');

const ExploreSystem = {

    // 内存缓存, 初始化为 null，以此判断是否需要加载
    // {inspected: {}} 记录已查看的线索
    _cache: null,

    // 存入 ac.var 的变量名
    VAR_NAME: 'str_explore_data',

    /**
     * 【核心方法】获取数据的唯一入口
     * 自动处理“懒加载”逻辑
     * @returns {Object} 返回完整的数据对象
     */
    getData: function () {
        // 如果缓存是 null，说明是第一次访问，或者脚本被重置了
        if (this._cache == null) {
            console.log("【ExploreSystem】缓存未命中，正在从存档加载...");
            this._loadFromVar();
        }
        return this._cache;
    },

    /**
     * 系统初始化：从存档读取数据, 确保数据已加载
     * 切换剧情会重新加载脚本, 这个方法应该在每次读取/修改 _cache 前调用以确保数据是同步的
     */
    _loadFromVar: function () {
        // 读取易次元变量
        let jsonStr = ac.var[this.VAR_NAME];
        let data = null;
        if (jsonStr && jsonStr.length > 0) {
            try {
                data = JSON.parse(jsonStr);
            } catch (e) {
                console.error("【ExploreSystem】存档损坏:", e);
            }
        }

        // 确保数据结构完整（如果没读到，或者读到的数据缺字段）
        if (!data) data = {};
        if (!data.inspected) data.inspected = {};

        // 写入缓存
        this._cache = data;
        console.log("【ExploreSystem】数据加载完毕");
    },

    /**
     * 保存数据到易次元变量
     * 每次修改数据后调用
     */
    save: function () {
        // 如果 _cache 是 null，说明没有读取过数据, 为避免覆盖存档，不保存
        if (this._cache == null) {
            console.warn("【ExploreSystem】警告：试图在未初始化的情况下保存数据，已拦截！");
            return;
        }
        // 序列化为字符串
        let jsonStr = JSON.stringify(this._cache);
        // 存入易次元变量
        ac.var[this.VAR_NAME] = jsonStr;

        console.log("【ExploreSystem】已保存:", jsonStr);
    },

    /**
 * 检查某个线索是否已经查看过
 * @param {string} itemId - 物品/线索 ID
 * @returns {boolean}
 */
    hasInspected: function (itemId) {
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

    // 是否已查看场景中的全部线索
    hasInspectedAll: function (sceneId) {
        let sceneConfig = SceneConfig[sceneId];
        for (const [viewId, viewConfig] of Object.entries(sceneConfig.views)) {
            if (!viewConfig.interact) continue;
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