// 探索场景 UI
console.log('[LOAD] explore_ui');

// 过渡效果配置
const ViewTransition = {
    duration: 500,          // 总时长 ms
    scale: {
        min: 0.92,          // 最小缩放（新层起始/旧层结束）
        max: 1.00,          // 正常大小
    },
};

const ExploreUI = {

    // 层级结构
    root: {
        name: 'layer_explore_root',
        created: false,
    },
    
    // 当前层信息（递减模式：新层在旧层下面）
    currentLayer: null,     // 当前层名称
    layerIndex: 999,        // 层索引，每次切换递减

    // 生成下一个层名称
    getNextLayerName: function () {
        return `layer_explore_view_${this.layerIndex}`;
    },

    // 初始化 root 层
    initRoot: async function () {
        if (this.root.created) return;
        await ac.createLayer({
            name: this.root.name,
            index: ZORDER.BOTTOM_SCENE,
            inlayer: 'window',
        });
        this.root.created = true;
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

    // 方向对应的位移配置（旧层滑出方向）
    getDirectionConfig: function (direction) {
        const center = { x: GameConfig.centerX, y: GameConfig.centerY };
        const offsetX = GameConfig.centerX + 50;  // 稍微多一点确保完全离开屏幕
        const offsetY = GameConfig.centerY + 50;
        
        const configs = {
            up: {
                oldEnd: { x: center.x, y: -offsetY },
            },
            down: {
                oldEnd: { x: center.x, y: GameConfig.height + offsetY },
            },
            left: {
                oldEnd: { x: GameConfig.width + offsetX, y: center.y },
            },
            right: {
                oldEnd: { x: -offsetX, y: center.y },
            },
        };
        return configs[direction] || null;
    },

    // 创建场景UI（带过渡效果）
    createSceneUI: async function (sceneId, viewId, direction) {
        console.log('[LOG] createSceneUI', sceneId, viewId, direction);
        
        // 确保 root 层存在
        await this.initRoot();
        
        let viewConfig = ExploreSystem.getViewConfig(sceneId, viewId);
        const center = { x: GameConfig.centerX, y: GameConfig.centerY };
        const cfg = ViewTransition;
        
        // 判断是否需要过渡
        const dirConfig = direction ? this.getDirectionConfig(direction) : null;
        const needTransition = dirConfig !== null && this.currentLayer !== null;
        
        // 保存旧层名称
        const oldLayerName = this.currentLayer;
        
        // 创建新层（index 递减，确保新层在旧层之下）
        this.layerIndex--;
        const newLayerName = this.getNextLayerName();
        this.currentLayer = newLayerName;
        
        // ═══════════════════════════════════════════
        // 创建新层（在 root 下，位于旧层下方）
        // ═══════════════════════════════════════════
        const newLayerConfig = {
            name: newLayerName,
            index: this.layerIndex,  // 递减的 index，新层在下
            inlayer: this.root.name,
            resId: viewConfig.bg,
            anchor: { x: 50, y: 50 },
            pos: center,  // 新层直接在屏幕中心
        };
        
        if (needTransition) {
            // 过渡模式：缩小状态，等待旧层揭开
            newLayerConfig.scale = { x: cfg.scale.min * 100, y: cfg.scale.min * 100 };
        }
        
        await ac.createImage(newLayerConfig);
        
        // ═══════════════════════════════════════════
        // 创建交互物体（跟着新层）
        // ═══════════════════════════════════════════
        let interacts = viewConfig.interact || {};
        for (const [itemId, interact] of Object.entries(interacts)) {
            let itemConfig = InventorySystem.getItemConfig(itemId);
            await ac.createOption({
                name: `img_${itemId}`,
                index: 0,
                inlayer: newLayerName,
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
        
        // ═══════════════════════════════════════════
        // 执行过渡动画（揭开效果）
        // ═══════════════════════════════════════════
        if (needTransition) {
            // 旧层动画：滑出 + 缩小 + 淡出（揭开效果）
            ac.moveTo({
                name: oldLayerName,
                x: dirConfig.oldEnd.x,
                y: dirConfig.oldEnd.y,
                duration: cfg.duration,
            });
            ac.scaleTo({
                name: oldLayerName,
                scale: { x: cfg.scale.min * 100, y: cfg.scale.min * 100 },
                duration: cfg.duration,
            });
            ac.fadeTo({
                name: oldLayerName,
                opacity: 0,
                duration: cfg.duration * 0.8,
            });
            
            // 新层动画：从缩小状态放大到正常
            ac.scaleTo({
                name: newLayerName,
                scale: { x: cfg.scale.max * 100, y: cfg.scale.max * 100 },
                duration: cfg.duration,
            });
            
            // 等待动画完成
            await ac.delay({ time: cfg.duration });
            
            // 移除旧层
            await ac.remove({ name: oldLayerName });
        }
        
        // ═══════════════════════════════════════════
        // 创建导航按钮（切换完成后出现）
        // ═══════════════════════════════════════════
        let navs = viewConfig.nav || {};
        for (const [navDirection, viewName] of Object.entries(navs)) {
            if (viewName == null) {
                continue;
            }
            const navConfig = this.Nav[navDirection];
            await ac.createOption({
                name: `btn_explore_arrow_${navDirection}`,
                index: 5,
                inlayer: newLayerName,
                nResId: navConfig.resId,
                sResId: navConfig.resId,
                content: ``,
                pos: { x: navConfig.x, y: navConfig.y },
                anchor: { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await ExploreSystem.gotoView(sceneId, viewName, navDirection);
                },
            });
        }
    },

    closeSceneUI: async function () {
        // 关闭当前层
        if (this.currentLayer) {
            await ac.remove({
                name: this.currentLayer,
                effect: 'fadeout',
                duration: 500,
            });
        }
        // 移除 root 层
        if (this.root.created) {
            await ac.remove({ name: this.root.name });
        }
        // 重置状态
        this.currentLayer = null;
        this.layerIndex = 999;
        this.root.created = false;
    }
}