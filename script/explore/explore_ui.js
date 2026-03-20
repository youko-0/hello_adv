// 探索场景 UI
console.log('[LOAD] explore_ui');

const ExploreUI = {

    scene: {
        name: 'layer_explore_ui',
    },

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

    // 创建场景UI
    createSceneUI: async function (sceneId, viewId) {
        console.log('[LOG] createSceneUI', sceneId, viewId);
        let viewConfig = ExploreSystem.getViewConfig(sceneId, viewId);
        // 场景图
        await ac.createImage({
            name: this.scene.name,
            index: ZORDER.BOTTOM_SCENE,
            inlayer: 'window',
            resId: viewConfig.bg,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });
        // 交互物体
        let interacts = viewConfig.interact || {};
        for (const [itemId, interact] of Object.entries(interacts)) {
            let itemConfig = InventorySystem.getItemConfig(itemId);
            await ac.createOption({
                name: `img_${itemId}`,
                index: 0,
                inlayer: this.scene.name,
                nResId: itemConfig.sprite,
                sResId: itemConfig.sprite,
                content: ``,
                pos: { x: interact.x, y: interact.y },
                anchor: { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await ExploreSystem.viewItem(sceneId, itemId);
                },
            });
        }
        // 导航按钮
        let navs = viewConfig.nav || {};
        for (const [direction, viewName] of Object.entries(navs)) {
            if (viewName == null) {
                continue;
            }
            const navConfig = this.Nav[direction];
            await ac.createOption({
                name: `btn_explore_arrow_${direction}`,
                index: 5,
                inlayer: this.scene.name,
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

    closeSceneUI: async function () {
        await ac.remove({
            name: this.scene.name,
            effect: 'fadeout',
            duration: 500,
        })
    }
}