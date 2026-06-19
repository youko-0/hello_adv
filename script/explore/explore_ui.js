// 探索场景 UI
console.log('[LOAD] explore_ui');

const ExploreUI = {

    // 层级结构
    //  scene_root
    //    └── view_root
    //    │     └── view（当前 view，固定控件名，原地替换）
    //    └── nav buttons

    sceneRoot: {
        name: 'layer_explore_scene_root',
    },

    viewRoot: {
        name: 'layer_explore_view_root',
    },

    viewName: 'layer_explore_view', // 固定 view 控件名，同一时刻只存在一个

    /**
     * 获取场景内交互物体的控件名
     * @param {string} itemId - 物品 ID
     * @returns {string}
     */
    getItemControlName: function (itemId) {
        return `img_${itemId}`;
    },

    // 导航按钮配置
    Nav: {
        up: {
            name: 'btn_explore_nav_up',
            x: GameConfig.centerX,
            y: GameConfig.height - 40,
            resId: ResMap.btn_explore_arrow_up,
        },
        down: {
            name: 'btn_explore_nav_down',
            x: GameConfig.centerX,
            y: 40,
            resId: ResMap.btn_explore_arrow_down,
        },
        left: {
            name: 'btn_explore_nav_left',
            x: 40,
            y: GameConfig.centerY,
            resId: ResMap.btn_explore_arrow_left,
        },
        right: {
            name: 'btn_explore_nav_right',
            x: GameConfig.width - 40,
            y: GameConfig.centerY,
            resId: ResMap.btn_explore_arrow_right,
        },
    },

    // ═══════════════════════════════════════════════════════════════
    // 场景初始化（enterScene 调用）
    // ═══════════════════════════════════════════════════════════════

    /**
     * 创建场景 UI 容器（sceneRoot + viewRoot）
     * 由 enterScene 唯一入口调用，无需判断是否已创建
     * @param {string} sceneId - 场景 ID
     */
    createSceneUI: async function (sceneId) {
        console.log('[LOG] createSceneUI', sceneId);

        // 创建 scene_root
        await ac.createLayer({
            name: this.sceneRoot.name,
            index: ZORDER.SCENE,
            inlayer: 'window',
        });

        // 创建 view_root（原点容器）
        await ac.createLayer({
            name: this.viewRoot.name,
            index: 0,
            inlayer: this.sceneRoot.name,
            pos: { x: 0, y: 0 },
        });
    },

    // ═══════════════════════════════════════════════════════════════
    // 导航按钮
    // ═══════════════════════════════════════════════════════════════

    /**
     * 移除所有导航按钮
     */
    removeNavButtons: async function () {
        for (const [direction, navConfig] of Object.entries(this.Nav)) {
            await ac.remove({ name: navConfig.name });
        }
    },

    /**
     * 创建导航按钮
     * @param {string} sceneId - 场景 ID
     * @param {string} viewId  - 当前视图 ID
     */
    createNavButtons: async function (sceneId, viewId) {
        let viewConfig = ExploreSystem.getViewConfig(sceneId, viewId);
        let navs = viewConfig.nav || {};
        for (const [direction, targetViewId] of Object.entries(navs)) {
            if (targetViewId == null) continue;
            const navConfig = this.Nav[direction];
            await ac.createOption({
                name: navConfig.name,
                index: 1000,
                inlayer: this.sceneRoot.name,
                nResId: navConfig.resId,
                sResId: navConfig.resId,
                content: ``,
                pos: { x: navConfig.x, y: navConfig.y },
                anchor: { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await ExploreSystem.gotoView(sceneId, targetViewId);
                },
            });
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // View 创建
    // ═══════════════════════════════════════════════════════════════

    /**
     * 创建已查看物体（静态图片，不可点击）
     * @param {string} itemId           - 物品 ID
     * @param {{x: number, y: number}} pos - 相对于 view 中心的偏移坐标
     * @param {boolean} [visible=true]  - 初始是否可见（过渡动画时传 false）
     */
    createInspectedItem: async function (itemId, pos, visible = true) {
        const itemConfig = ItemConfig[itemId];
        await ac.createImage({
            name:    `${this.getItemControlName(itemId)}_inspected`,
            index:   1,
            inlayer: this.viewName,
            resId:   itemConfig.spriteInspected || itemConfig.sprite,
            pos:     pos,
            anchor:  { x: 50, y: 50 },
            visible: visible,
        });
    },

    /**
     * 创建可交互物体（可点击按钮）
     * @param {string} itemId  - 物品 ID
     * @param {{x: number, y: number}} pos - 相对于 view 中心的偏移坐标
     * @param {string} sceneId - 场景 ID（用于点击回调）
     */
    createInteractableItem: async function (itemId, pos, sceneId) {
        const itemConfig = ItemConfig[itemId];
        const nResId = itemConfig.sprite;
        const sResId = itemConfig.spriteHighlighted || nResId;
        await ac.createOption({
            name:    this.getItemControlName(itemId),
            index:   2,     // 按钮层级高于已查看物体, 用来做切换
            inlayer: this.viewName,
            nResId:  nResId,
            sResId:  sResId,
            content: ``,
            pos:     pos,
            anchor:  { x: 50, y: 50 },
            onTouchEnded: async function () {
                await ExploreSystem.viewItem(sceneId, itemId);
            },
        });
    },

    /**
     * 创建 view（背景 + 交互物体），固定放置于屏幕中心
     * @param {string} sceneId - 场景 ID
     * @param {string} viewId  - 视图 ID
     */
    createView: async function (sceneId, viewId) {
        console.log('[LOG] createView', viewId);

        const viewConfig = ExploreSystem.getViewConfig(sceneId, viewId);

        // 创建 view 容器层（固定名，固定位置）
        await ac.createLayer({
            name: this.viewName,
            index: 0,
            inlayer: this.viewRoot.name,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        // 创建背景
        await ac.createImage({
            name: `${this.viewName}_bg`,
            index: 0,
            inlayer: this.viewName,
            resId: viewConfig.bg,
            pos: { x: 0, y: 0 },
            anchor: { x: 50, y: 50 },
        });

        // 创建交互物体
        const interacts = viewConfig.interact || {};
        for (const [itemId, interact] of Object.entries(interacts)) {
            // 交互物体位置相对于 view 中心偏移
            const pos = { x: interact.x - GameConfig.centerX, y: interact.y - GameConfig.centerY };
            if (ExploreSystem.isInspected(itemId)) {
                await this.createInspectedItem(itemId, pos);
            } else {
                await this.createInteractableItem(itemId, pos, sceneId);
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // View 切换（gotoView 调用）
    // ═══════════════════════════════════════════════════════════════

    /**
     * 播放"已查看"过渡：原控件淡出，已查看静态控件（img_${itemId}_inspected）在同位置淡入
     * @param {string} itemId - 物品 ID
     * @returns {Promise<string>} 已查看控件名（供后续 gainItem 拖尾使用）
     */
    playInspectedTransition: async function (itemId) {
        const originalName  = this.getItemControlName(itemId);
        const inspectedName = `${originalName}_inspected`;
        const pos = await ac.getPos({ name: originalName });
        await this.createInspectedItem(itemId, pos, false);
        ac.show({ name: inspectedName, effect: 'fadein', duration: 500 });
        await ac.remove({ name: originalName, effect: 'fadeout', duration: 500 });
        return inspectedName;
    },

    /**
     * 切换到目标 view（眨眼过渡）
     * @param {string} sceneId - 场景 ID
     * @param {string} viewId  - 目标 view ID
     */
    switchToView: async function (sceneId, viewId) {
        console.log('[LOG] switchToView', viewId);

        await this.removeNavButtons();

        await UIEffect.playBlinkTransition(async () => {
            await ac.remove({ name: this.viewName });
            await this.createView(sceneId, viewId);
            await this.createNavButtons(sceneId, viewId);
        });
    },

    // ═══════════════════════════════════════════════════════════════
    // 场景关闭
    // ═══════════════════════════════════════════════════════════════

    /**
     * 关闭场景 UI
     */
    closeSceneUI: async function () {
        // 移除 scene_root（含所有子层：view_root、view、导航按钮）
        await ac.remove({
            name: this.sceneRoot.name,
            effect: 'fadeout',
            duration: 500,
        });
    }
}
