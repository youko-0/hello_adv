// 探索场景 UI
console.log('[LOAD] explore_ui');

const ExploreUI = {

    // 创建视图 UI
    createViewUI: async function (sceneId, viewId) {
        let config = ExploreSystem.getViewConfig(sceneId, viewId);
        // 场景图
        await ac.createImage({
            name: `img_${sceneId}_${viewId}`,
            index: 0,
            inlayer: 'window',
            resId: config.bg,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });
    }
}