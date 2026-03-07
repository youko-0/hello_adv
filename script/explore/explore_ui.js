// 探索场景 UI
console.log('[LOAD] explore_ui');

const ExploreUI = {

    Nav: {
        up: {
            x: GameConfig.centerX,
            y: GameConfig.height - 40,
            resId: ResMap.btn_explore_arrow_up,
        },
        down: {
            x: GameConfig.centerX,
            y: 40,
            resId: ResMap.btn_explore_arrow_down,
        },
        left: {
            x: 40,
            y: GameConfig.centerY,
            resId: ResMap.btn_explore_arrow_left,
        },
        right: {
            x: GameConfig.width - 40,
            y: GameConfig.centerY,
            resId: ResMap.btn_explore_arrow_right,
        },
    },

    // 创建视图 UI
    createViewUI: async function (sceneId, viewId) {
        async function onClickInteract(itemId) {
            CommonUI.showAlert("你点击了交互物体！itemId " + itemId);
        }
        async function onTouchmask(params = null) {
            console.log('[LOG] onTouchmask', params);
        }

        console.log('[LOG] createViewUI', sceneId, viewId);

        let viewConfig = ExploreSystem.getViewConfig(sceneId, viewId);
        // 场景图
        await ac.createImage({
            name: `img_${sceneId}_${viewId}`,
            index: 0,
            inlayer: 'window',
            resId: viewConfig.bg,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });
        // 交互物体
        for (const [itemId, interact] of Object.entries(viewConfig.interact)) {
            let itemConfig = InventorySystem.getItemConfig(itemId);
            await ac.createOption({
                name: `img_${itemId}`,
                index: 0,
                inlayer: `img_${sceneId}_${viewId}`,
                nResId: itemConfig.illust,
                sResId: itemConfig.illust,
                content: ``,
                pos: { x: interact.x, y: interact.y },
                anchor: { x: 50, y: 50 },
                // onTouchEnded: async function () {
                //     await onClickInteract(itemId);
                // },
            });
            ac.addEventListener({
                type: ac.EVENT_TYPES.onTouchEnded,
                listener: onTouchmask,
                target: `img_${itemId}`,
            });
        }
        // 导航按钮
        for (const [direction, viewName] of Object.entries(viewConfig.nav)) {
            if (viewName == null) {
                continue;
            }
            let navConfig = this.Nav[direction];
            await ac.createOption({
                name: `btn_explore_arrow_${direction}`,
                index: 5,
                inlayer: `img_${sceneId}_${viewId}`,
                nResId: navConfig.resId,
                sResId: navConfig.resId,
                content: ``,
                pos: { x: navConfig.x, y: navConfig.y },
                anchor: { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await ExploreSystem.gotoView(sceneId, viewName);
                },
            });
        }

    },
}