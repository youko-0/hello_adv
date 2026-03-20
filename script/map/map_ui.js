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
            index: ZORDER.BOTTOM_SCENE,       // 把全局按钮露出来
            inlayer: 'window',
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            clipMode: false,
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

        // 地块层
        await ac.createLayer({
            name: 'layer_map_area',
            index: 5,
            inlayer: this.map.name,
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            clipMode: false,
        });

        // 创建地块
        let areas = MapSystem.getAreaList();
        for (let area of areas) {
            await this._createMapArea(area);
        }

        // 创建跳过按钮
        await this.createSkipButton();
    },

    // 进入地图的刷新
    onEnterMap: async function () {
        let areaId = MapSystem.getAreaId();
        console.log(`[Map] onEnterMap, areaId: ${areaId}`);
        // 第一次完成的当前区域播放一个切换动效
        if (areaId && MapSystem.getVisitedTimes(areaId) === 1) {
            const areaConfig = MapSystem.getAreaConfig(areaId);
            await ac.createImage({
                name: `img_${areaId}_locked`,
                index: 5,
                inlayer: 'layer_map_area',
                resId: areaConfig.resIdLocked,
                pos: areaConfig.pos,
                anchor: { x: 50, y: 50 },
            });
            // 先隐藏
            await ac.hide({
                name: `img_${areaId}`,
                effect: 'normal',
                duration: 0,
                canskip: false,
            })
            // 等一下剧情切换
            await ac.delay({
                time: 1000,
            });
            // 当前区域(普通态)淡入
            ac.show({
                name: `img_${areaId}`,
                effect: 'fadein',
                duration: 500,
                canskip: false,
            })
            // 锁定态淡出
            await ac.remove({
                name: `img_${areaId}_locked`,
                effect: 'fadeout',
                duration: 1500,
                canskip: false,
            });
        }

        // 全部区域探索完成前往下一章
        if (MapSystem.isClearedAll()) {
            // 全解锁地图
            await ac.createImage({
                name: 'img_map_bg_full',
                index: 2,
                inlayer: this.map.name,
                resId: ResMap.pic_map_bg_full,
                pos: { x: GameConfig.centerX, y: GameConfig.centerY },
                anchor: { x: 50, y: 50 },
                visible: false,
            });
            await ac.show({
                name: 'img_map_bg_full',
                effect: 'fadein',
                duration: 2000,
                canskip: false,
            });
            await ac.delay({
                time: 1000
            });
            await this.onClickBtnSkip();
        }
    },

    // 点击跳过按钮
    onClickBtnSkip: async function () {
        // 隐藏跳过按钮
        await ac.hide({
            name: 'btn_skip',
            effect: 'normal',
            duration: 0,
        })
        // 显示选项组
        let flag = MapSystem.isClearedAll();
        let content = flag ? '全部区域探索完成, 是否前往下一章？' : '还有区域未探索完成, 是否仍然前往下一章？';
        let options = [{
            text: '前往下一章',
            callback: MapSystem.onAllAreaVisited,
        }, {
            text: '继续探索',
            callback: async function () {
                await CommonUI.closeCustomOptionGroup();
                // 显示跳过按钮
                await ac.show({
                    name: 'btn_skip',
                    effect: 'normal',
                    duration: 0,
                })
            },
        }]
        CommonUI.showCustomOptionGroup({
            content: content,
            options: options,
        })

    },

    // 跳过按钮
    createSkipButton: async function () {
        await ac.createOption({
            name: 'btn_skip',
            index: 1,
            inlayer: 'layer_map_area',
            nResId: ResMap.btn_skip_normal,
            sResId: ResMap.btn_skip_highlight,
            pos: { x: GameConfig.width - 60, y: 120 },
            anchor: { x: 50, y: 50 },
            onTouchEnded: this.onClickBtnSkip,
        });
    },

    // 单个地图块
    _createMapArea: async function (areaId) {
        const areaConfig = MapSystem.getAreaConfig(areaId);
        let flag = MapSystem.isCleared(areaId);
        // 地块, 已完成的用普通态 + 普通态, 未完成的用锁定态 + 高亮态
        let nResId = flag ? areaConfig.resIdNormal : areaConfig.resIdLocked;
        let sResId = flag ? areaConfig.resIdNormal : areaConfig.resIdHighlight;
        await ac.createOption({
            name: `img_${areaId}`,
            index: 1,
            inlayer: 'layer_map_area',
            nResId: nResId,
            sResId: sResId,
            pos: areaConfig.pos,
            anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                await MapSystem.onGotoArea(areaId);
            },
        });
    },

}