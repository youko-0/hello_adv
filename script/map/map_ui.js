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
        let areaCount = MapSystem.getAreaCount();
        for (let i = 1; i <= areaCount; i++) {
            await this._createMapArea(i);
        }
    },

    // 刷新地图解锁状态
    refreshMap: async function () {

    },

    // 单个地图块
    _createMapArea: async function (areaIndex) {
        const areaConfig = MapSystem.area[`area${areaIndex}`];
        let areaState = MapSystem.getAreaState(areaIndex);
        const resId = areaState === -1 ? areaConfig.resIdLocked : areaConfig.resIdNormal;
        const btnConfig = areaConfig.btn;
        // 地块
        await ac.createImage({
            name: `img_area_${areaIndex}`,
            index: 2,
            inlayer: this.map.name,
            resId: resId,
            pos: areaConfig.pos,
            anchor: { x: 50, y: 50 },
        });

        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                await MapSystem.onClickArea(areaIndex);
            },
            target: `img_area_${areaIndex}`,
        });

        // 按钮
        await ac.createOption({
            name: `btn_area_${areaIndex}`,
            index: 5,
            inlayer: `img_area_${areaIndex}`,
            nResId: btnConfig.resIdNormal,
            sResId: btnConfig.resIdHighlight,
            content: ``,
            pos: btnConfig.pos,
            anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                await MapSystem.onClickArea(areaIndex);
            },
        });
    },

}