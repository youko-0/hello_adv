// 探索场景
console.log('[LOAD] explore_system');

const ExploreSystem = {

    gotoView: async function (sceneId, viewId=null) {
        console.log('[LOG] gotoView', sceneId, viewId);
        if (viewId == null) {
            viewId = this.getDefaultView(sceneId);
        }
        await ExploreUI.createViewUI(sceneId, viewId);
    },

    getDefaultView: function (sceneId) {
        return SceneConfig[sceneId].defaultViewId;
    },

    getViewConfig: function (sceneId, viewId) {
        return SceneConfig[sceneId].views[viewId];
    }
}