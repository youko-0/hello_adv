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
            index: 1,
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
        let areaId = MapSystem.getAreaId();
        console.log(`[Map] onEnterMap, areaId: ${areaId}`);
        // 正在探索的区域做一个切换动效
        if (areaId) {
            const areaConfig = MapSystem.getAreaConfig(areaId);
            await ac.createImage({
                name: `img_${areaId}_locked`,
                index: 5,
                inlayer: 'img_map_bg',
                resId: areaConfig.resIdLocked,
                pos: areaConfig.pos,
                anchor: { x: 50, y: 50 },
            });
            // 等一下剧情切换
            await ac.delay({
                time: 1000,
            });
            await ac.remove({
                name: `img_${areaId}_locked`,
                effect: 'fadeout',
                duration: 1500,
                canskip: false,
            });
        }

        // 全部区域探索完成前往下一章
        if (MapSystem.isAllAreaVisited()) {
            // 全解锁地图
            await ac.createImage({
                name: 'img_map_bg_full',
                index: 0,
                inlayer: this.map.name,
                resId: ResMap.pic_map_bg_full,
                pos: { x: GameConfig.centerX, y: GameConfig.centerY },
                anchor: { x: 50, y: 50 },
                visible: false,
            });
            ac.hide({
                name: 'img_map_bg',
                effect: 'fadeout',
                duration: 1200,
                canskip: false,
            });
            await ac.show({
                name: 'img_map_bg_full',
                effect: 'fadein',
                duration: 2000,
                canskip: false,
            });
            await ac.delay({
                time: 2000
            });
            await MapSystem.onAllAreaVisited();
        }
    },

    // 单个地图块
    _createMapArea: async function (areaId) {
        const areaConfig = MapSystem.getAreaConfig(areaId);
        // let isVisiting = MapSystem.isVisiting(areaId);
        let isVisited = MapSystem.isVisited(areaId);
        // 地块, 已访问的用普通态 + 普通态, 未访问的用锁定态 + 高亮态
        let nResId = isVisited ? areaConfig.resIdNormal : areaConfig.resIdLocked;
        let sResId = isVisited ? areaConfig.resIdNormal : areaConfig.resIdHighlight;
        await ac.createOption({
            name: `img_${areaId}`,
            index: 1,
            inlayer: 'img_map_bg',
            nResId: nResId,
            sResId: sResId,
            pos: areaConfig.pos,
            anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                await MapSystem.onClickArea(areaId);
            },
        });
    },

}