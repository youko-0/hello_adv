console.log('[LOAD] map_ui');

// 地图 UI

const MapUI = {
    map: {
        name: 'layer_map',
    },

    // 创建地图 UI
    createMapUI: async function () {
        await ac.createLayer({
            name: this.map.name,
            index: ZORDER.SCENE,
            inlayer: 'window',
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            clipMode: false,
        });

        // 拦截点击
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchBegan,
            listener: CommonUI.onTouchMask,
            target: this.map.name,
        });

        // 没有地块的背景图
        await ac.createImage({
            name: 'img_map_bg',
            index: 0,
            inlayer: this.map.name,
            resId: ResMap.pic_map_bg,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        // 创建地块
        let areas = MapSystem.getAreaList();
        for (let area of areas) {
            await this._createMapArea(area);
        }
    },

    // 进入地图的刷新
    onEnterMap: async function () {
        let currentIndex = MapSystem.getAreaId();
        let nextIndex = currentIndex + 1;

        // 全部区域探索完成前往下一章
        if (MapSystem.isAllAreaVisited()) {
            await ac.delay({
                time: 2000
            });
            await MapSystem.onAllAreaVisited();
        }
    },

    // 单个地图块
    _createMapArea: async function (aredId) {
        const areaConfig = MapSystem.getAreaConfig(aredId);
        let isVisiting = MapSystem.isVisiting(aredId);
        let isVisited = MapSystem.isVisited(aredId);
        // 地块, 已访问的用普通态 + 普通态, 未访问的用锁定态 + 高亮态
        let nResId = isVisited ? areaConfig.resIdNormal : areaConfig.resIdLocked;
        let sResId = isVisited ? areaConfig.resIdNormal : areaConfig.resIdHighlight;
        await ac.createOption({
            name: `img_${aredId}`,
            index: 2,
            inlayer: 'img_map_bg',
            nResId: nResId,
            sResId: sResId,
            pos: areaConfig.pos,
            anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                await MapSystem.onClickArea(aredId);
            },
        });
    },

}