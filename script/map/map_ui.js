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
        await MapSystem.createMapStaticBg();
        await MapSystem.createMapAreas();
    },

    // 地图区域
    createMapArea: async function (areaIndex, config, areaState) {
        for (let i = 1; i <= 5; i++) {
            let state = MapSystem.getAreaState(i);
            let config = MapSystem.area[`area${i}`];
            let resId = state === -1 ? config.resIdLocked : config.resIdNormal;
            await ac.createImage({
                name: `img_area_${i}`,
                index: 1,
                inlayer: 'img_map_bg',
                resId: resId,
                pos: config.pos,
                anchor: { x: 50, y: 50 },
            });
        }
    },

}