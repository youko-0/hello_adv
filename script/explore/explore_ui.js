// 探索场景 UI
console.log('[LOAD] explore_ui');

// 过渡效果配置
const ViewTransition = {
    duration: 500,          // 总时长 ms
    scale: {
        min: 0.90,          // 最小缩放
        max: 1.00,          // 正常大小
    },
    offset: 100,            // 屏幕外偏移
};

const ExploreUI = {

    // 双缓冲层名称
    layers: ['layer_explore_ui_0', 'layer_explore_ui_1'],
    currentLayerIndex: 0,   // 当前使用的层索引

    // 获取当前层名称
    getCurrentLayer: function () {
        return this.layers[this.currentLayerIndex];
    },

    // 获取下一层名称并切换索引
    getNextLayer: function () {
        this.currentLayerIndex = 1 - this.currentLayerIndex;
        return this.layers[this.currentLayerIndex];
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

    // 方向对应的位移配置
    getDirectionConfig: function (direction) {
        const cfg = ViewTransition;
        const center = { x: GameConfig.centerX, y: GameConfig.centerY };
        
        const configs = {
            up: {
                newStart: { x: center.x, y: GameConfig.height + cfg.offset },
                oldEnd: { x: center.x, y: -cfg.offset },
            },
            down: {
                newStart: { x: center.x, y: -cfg.offset },
                oldEnd: { x: center.x, y: GameConfig.height + cfg.offset },
            },
            left: {
                newStart: { x: -cfg.offset, y: center.y },
                oldEnd: { x: GameConfig.width + cfg.offset, y: center.y },
            },
            right: {
                newStart: { x: GameConfig.width + cfg.offset, y: center.y },
                oldEnd: { x: -cfg.offset, y: center.y },
            },
        };
        return configs[direction] || null;
    },

    // 创建场景UI（带过渡效果）
    createSceneUI: async function (sceneId, viewId, direction) {
        console.log('[LOG] createSceneUI', sceneId, viewId, direction);
        
        let viewConfig = ExploreSystem.getViewConfig(sceneId, viewId);
        const center = { x: GameConfig.centerX, y: GameConfig.centerY };
        const cfg = ViewTransition;
        
        // 判断是否需要过渡（有方向参数且有旧层存在）
        const dirConfig = direction ? this.getDirectionConfig(direction) : null;
        const needTransition = dirConfig !== null;
        
        // 获取旧层名称（过渡时需要）
        const oldLayerName = needTransition ? this.getCurrentLayer() : null;
        // 获取新层名称
        const newLayerName = needTransition ? this.getNextLayer() : this.getCurrentLayer();
        
        // ═══════════════════════════════════════════
        // 创建新层
        // ═══════════════════════════════════════════
        const newLayerConfig = {
            name: newLayerName,
            index: ZORDER.BOTTOM_SCENE,
            inlayer: 'window',
            resId: viewConfig.bg,
            anchor: { x: 50, y: 50 },
        };
        
        if (needTransition) {
            // 过渡模式：在屏幕外创建，缩小+透明
            newLayerConfig.pos = dirConfig.newStart;
            newLayerConfig.scale = { x: cfg.scale.min * 100, y: cfg.scale.min * 100 };
            newLayerConfig.opacity = 0;
        } else {
            // 首次进入：直接在中心创建
            newLayerConfig.pos = center;
        }
        
        await ac.createImage(newLayerConfig);
        
        // ═══════════════════════════════════════════
        // 创建交互物体（在动画前创建，跟着新层一起移动）
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
        // 执行过渡动画
        // ═══════════════════════════════════════════
        if (needTransition) {
            // 新旧层同时开始动画，增加重叠时间避免黑屏
            
            // 旧层动画：滑出 + 缩小 + 淡出
            ac.moveTo({
                name: oldLayerName,
                x: dirConfig.oldEnd.x,
                y: dirConfig.oldEnd.y,
                duration: cfg.duration,
            });
            ac.scaleTo({
                name: oldLayerName,
                scale: { x: cfg.scale.min * 100, y: cfg.scale.min * 100 },
                duration: cfg.duration * 0.7,
            });
            // 旧层淡出延后开始，增加重叠时间
            ac.fadeTo({
                name: oldLayerName,
                opacity: 0,
                duration: cfg.duration * 0.6,
            });
            
            // 新层动画：滑入 + 放大 + 淡入（同时开始）
            ac.moveTo({
                name: newLayerName,
                x: center.x,
                y: center.y,
                duration: cfg.duration,
            });
            ac.scaleTo({
                name: newLayerName,
                scale: { x: cfg.scale.max * 100, y: cfg.scale.max * 100 },
                duration: cfg.duration,
            });
            // 新层快速淡入，尽早可见
            ac.fadeTo({
                name: newLayerName,
                opacity: 255,
                duration: cfg.duration * 0.3,
            });
            
            // 等待最长的动画完成（moveTo 是最长的）
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
                    // 传递导航方向给 gotoView
                    await ExploreSystem.gotoView(sceneId, viewName, navDirection);
                },
            });
        }
    },

    closeSceneUI: async function () {
        // 关闭当前层
        await ac.remove({
            name: this.getCurrentLayer(),
            effect: 'fadeout',
            duration: 500,
        });
        // 重置层索引
        this.currentLayerIndex = 0;
    }
}