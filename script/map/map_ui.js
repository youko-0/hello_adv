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

        // 背景图
        await ac.createImage({
            name: 'img_map_bg',
            index: 0,
            inlayer: this.map.name,
            resId: ResMap.pic_map_bg_locked,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });
        await MapSystem.createMapStaticBg();
        await MapSystem.createMapAreas();
    },
}