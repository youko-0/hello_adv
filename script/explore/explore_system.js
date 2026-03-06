// 探索场景
console.log('[LOAD] explore_system');

const ExploreSystem = {

    getViewConfig: function (sceneId, viewId) {
        return SceneConfig[sceneId].views[viewId];
    }
}