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

    // 眨眼过渡配置
    Blink: {
        duration: 240,  // 单次开/闭时长 ms
        // pic_mask_iris 尺寸 1280×2160（= 3× 屏幕高），scaleY 33% 时图片高度刚好覆盖屏幕
        // 此时镂空椭圆高度缩至 240px，视觉上接近闭合
        minScaleY: 33,
        iris: {
            name: 'img_explore_iris_mask',
            resId: ResMap.pic_mask_iris,    // 1280×2160，中央镂空椭圆 1280×720
        },
        black: {
            name: 'img_explore_black_mask',
            resId: ResMap.img_mask_black,   // 32×32 纯黑，缩放至全屏覆盖残余椭圆区域
            srcSize: 32,
        },
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
            index: ZORDER.BOTTOM_SCENE,
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
        let interacts = viewConfig.interact || {};
        for (const [itemId, interact] of Object.entries(interacts)) {
            let itemConfig = InventorySystem.getItemConfig(itemId);
            // 交互物体位置相对于 view 中心偏移
            const itemX = interact.x - GameConfig.centerX;
            const itemY = interact.y - GameConfig.centerY;
            await ac.createOption({
                name: `img_${itemId}`,
                index: 1,
                inlayer: this.viewName,
                nResId: itemConfig.sprite,
                sResId: itemConfig.sprite,
                content: ``,
                pos: { x: itemX, y: itemY },
                anchor: { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await ExploreSystem.viewItem(sceneId, itemId);
                },
            });
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // View 切换（gotoView 调用）
    // ═══════════════════════════════════════════════════════════════

    /**
     * 眨眼过渡动效：虹膜闭合 → 执行回调（黑屏期间切换内容）→ 虹膜张开
     * @param {Function} onBlackScreen - 完全黑屏时执行的异步回调
     */
    performBlink: async function (onBlackScreen) {
        const { duration, minScaleY, iris, black } = this.Blink;

        // 创建虹膜遮罩（初始张开：scaleY = 100）
        await ac.createImage({
            name: iris.name,
            index: 500,
            inlayer: this.sceneRoot.name,
            resId: iris.resId,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            scale: { x: 100, y: 100 },
        });

        // 闭合：scaleY 100 → minScaleY（X 轴不动）
        await ac.scaleTo({ name: iris.name, x: 100, y: minScaleY, duration: duration });

        // 叠加纯黑遮罩，覆盖残余椭圆区域，实现完全黑屏
        await ac.createImage({
            name: black.name,
            index: 600,
            inlayer: this.sceneRoot.name,
            resId: black.resId,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            scale: {
                x: GameConfig.width * 100 / black.srcSize,
                y: GameConfig.height * 100 / black.srcSize,
            },
        });

        // 黑屏期间执行切换回调
        await onBlackScreen();

        // 移除纯黑遮罩
        ac.remove({
            name: black.name,
            effect: 'fadeout',
            duration: duration,
            canskip: false,
        });

        // 张开：scaleY minScaleY → 100
        ac.scaleTo({ name: iris.name, x: 100, y: 100, duration: duration });

        // 移除虹膜遮罩
        await ac.remove({
            name: iris.name,
            effect: 'fadeout',
            duration: duration,
            canskip: false,
        });
    },

    /**
     * 切换到目标 view（眨眼过渡）
     * @param {string} sceneId - 场景 ID
     * @param {string} viewId  - 目标 view ID
     */
    switchToView: async function (sceneId, viewId) {
        console.log('[LOG] switchToView', viewId);

        // 移除导航按钮（ac.remove 自行处理不存在的控件）
        await this.removeNavButtons();

        // 眨眼过渡：黑屏期间替换 view
        await this.performBlink(async () => {
            await ac.remove({ name: this.viewName });
            await this.createView(sceneId, viewId);
            // 创建导航按钮
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
