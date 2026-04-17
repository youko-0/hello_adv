// 探索场景 UI
console.log('[LOAD] explore_ui');

// 过渡效果配置
const ViewTransition = {
    duration: 500,          // 总时长 ms
    scale: {
        peak: 1.05,         // 放大峰值
        normal: 1.00,       // 正常大小
    },
};

const ExploreUI = {

    // 层级结构
    //  scene_root
    //    └── view_root (原点容器，移动它来切换视角)
    //    │     └── view_xxx (各个 view)
    //    └── nav buttons
    
    sceneRoot: {
        name: 'layer_explore_scene_root',
    },
    
    viewRoot: {
        name: 'layer_explore_view_root',
    },
    
    // 当前状态
    sceneId: null,
    currentViewId: null,

    // 导航按钮配置（包含方向偏移量）
    Nav: {
        up: {
            name: 'btn_explore_nav_up',
            x: GameConfig.centerX,
            y: GameConfig.height - 40,
            resId: ResMap.btn_explore_arrow_up,
            offset: { x: 0, y: 1 },  // 上方 view 在 y+height
        },
        down: {
            name: 'btn_explore_nav_down',
            x: GameConfig.centerX,
            y: 40,
            resId: ResMap.btn_explore_arrow_down,
            offset: { x: 0, y: -1 },  // 下方 view 在 y-height
        },
        left: {
            name: 'btn_explore_nav_left',
            x: 40,
            y: GameConfig.centerY,
            resId: ResMap.btn_explore_arrow_left,
            offset: { x: -1, y: 0 },  // 左边 view 在 x-width
        },
        right: {
            name: 'btn_explore_nav_right',
            x: GameConfig.width - 40,
            y: GameConfig.centerY,
            resId: ResMap.btn_explore_arrow_right,
            offset: { x: 1, y: 0 },  // 右边 view 在 x+width
        },
    },

    // 获取 view 的控件名称
    getViewName: function (viewId) {
        return `layer_explore_view_${viewId}`;
    },

    // 检查 view 是否已创建
    isViewCreated: async function (viewId) {
        return await CommonUI.isWidgetExist(this.getViewName(viewId));
    },

    // ═══════════════════════════════════════════════════════════════
    // 场景初始化（enterScene 调用）
    // ═══════════════════════════════════════════════════════════════
    
    /**
     * 创建场景 UI 容器（sceneRoot + viewRoot）
     * 由 enterScene 唯一入口调用，无需判断是否已创建
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
        
        this.sceneId = sceneId;
    },

    // ═══════════════════════════════════════════════════════════════
    // 导航按钮
    // ═══════════════════════════════════════════════════════════════

    removeNavButtons: async function () {
        for (const [direction, navConfig] of Object.entries(this.Nav)) {
            await ac.remove({ name: navConfig.name });
        }
    },

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
                    await ExploreSystem.gotoView(sceneId, targetViewId, direction);
                },
            });
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // View 创建
    // ═══════════════════════════════════════════════════════════════

    /**
     * 创建单个 view（背景 + 交互物体）
     */
    createView: async function (sceneId, viewId, posX, posY) {
        console.log('[LOG] createView', viewId, 'at', posX, posY);
        
        const viewConfig = ExploreSystem.getViewConfig(sceneId, viewId);
        const viewName = this.getViewName(viewId);
        
        // 创建 view 容器层
        await ac.createLayer({
            name: viewName,
            index: 0,
            inlayer: this.viewRoot.name,
            pos: { x: posX, y: posY },
            anchor: { x: 50, y: 50 },
        });
        
        // 创建背景
        await ac.createImage({
            name: `${viewName}_bg`,
            index: 0,
            inlayer: viewName,
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
                inlayer: viewName,
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
     * 切换到目标 view（创建 view + 过渡动画）
     * @param {string} sceneId - 场景 ID
     * @param {string} viewId - 目标 view ID
     * @param {string} direction - 导航方向（首次进入时为 null）
     */
    switchToView: async function (sceneId, viewId, direction) {
        console.log('[LOG] switchToView', viewId, direction);
        
        const cfg = ViewTransition;
        
        // 首次进入（无方向）：直接创建 view 在屏幕中心
        if (!direction) {
            await this.createView(sceneId, viewId, GameConfig.centerX, GameConfig.centerY);
            this.currentViewId = viewId;
            await this.createNavButtons(sceneId, viewId);
            return;
        }
        
        // 切换 view（有方向）
        if (this.currentViewId !== viewId) {
            // 移除导航按钮
            await this.removeNavButtons();
            
            // 获取当前 view 的位置
            const currentViewName = this.getViewName(this.currentViewId);
            const currentPos = await ac.getPos({ name: currentViewName });
            
            // 计算目标 view 的位置
            const offset = this.Nav[direction].offset;
            const targetPosX = currentPos.x + offset.x * GameConfig.width;
            const targetPosY = currentPos.y + offset.y * GameConfig.height;
            
            // 如果目标 view 还没创建，先创建它
            if (!(await this.isViewCreated(viewId))) {
                await this.createView(sceneId, viewId, targetPosX, targetPosY);
            }
            
            // 计算 view_root 需要移动的偏移量
            const viewRootPos = await ac.getPos({ name: this.viewRoot.name });
            const deltaX = GameConfig.centerX - targetPosX;
            const deltaY = GameConfig.centerY - targetPosY;
            const newViewRootX = viewRootPos.x + deltaX;
            const newViewRootY = viewRootPos.y + deltaY;
            
            // 动画：移动 view_root + 先放大后缩小
            const halfDuration = cfg.duration / 2;
            
            // 移动 view_root
            ac.moveTo({
                name: this.viewRoot.name,
                x: newViewRootX,
                y: newViewRootY,
                duration: cfg.duration,
            });
            
            // 放大阶段
            ac.scaleTo({
                name: this.viewRoot.name,
                scale: { x: cfg.scale.peak * 100, y: cfg.scale.peak * 100 },
                duration: halfDuration,
            });
            await ac.delay({ time: halfDuration });
            
            // 缩小阶段
            ac.scaleTo({
                name: this.viewRoot.name,
                scale: { x: cfg.scale.normal * 100, y: cfg.scale.normal * 100 },
                duration: halfDuration,
            });
            await ac.delay({ time: halfDuration });
            
            this.currentViewId = viewId;
        }
        
        // 创建导航按钮
        await this.createNavButtons(sceneId, viewId);
    },

    // ═══════════════════════════════════════════════════════════════
    // 场景关闭
    // ═══════════════════════════════════════════════════════════════

    closeSceneUI: async function () {
        // 移除导航按钮
        await this.removeNavButtons();
        // 移除 scene_root（会一起移除所有子层）
        if (await CommonUI.isWidgetExist(this.sceneRoot.name)) {
            await ac.remove({
                name: this.sceneRoot.name,
                effect: 'fadeout',
                duration: 500,
            });
        }
        // 重置状态
        this.sceneId = null;
        this.currentViewId = null;
    }
}