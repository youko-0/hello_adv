// 地图配置
console.log('[LOAD] map_system');

const MapSystem = {

    area: {
        area1: {
            name: "下城区",
            resIdLocked: ResMap.img_area_undercity_locked,
            resIdNormal: ResMap.img_area_undercity,
            pos: { x: 771, y: 427 },
            btn: {
                resIdNormal: ResMap.btn_area_undercity_normal,
                resIdHighlight: ResMap.btn_area_undercity_highlight,
                pos: { x: 50, y: 50 },
            }
        },
        area2: {
            name: "赛车场",
            resIdLocked: ResMap.img_area_circuit_locked,
            resIdNormal: ResMap.img_area_circuit,
            pos: { x: 719, y: 182 },
            btn: {
                resIdNormal: ResMap.btn_area_circuit_normal,
                resIdHighlight: ResMap.btn_area_circuit_highlight,
                pos: { x: 50, y: 50 },
            }
        },
        area3: {
            name: "哪吒庙",
            resIdLocked: ResMap.img_area_nezha_temple_locked,
            resIdNormal: ResMap.img_area_nezha_temple,
            pos: { x: 566, y: 547 },
            btn: {
                resIdNormal: ResMap.btn_area_nezha_temple_normal,
                resIdHighlight: ResMap.btn_area_nezha_temple_highlight,
                pos: { x: 50, y: 50 },
            }
        },
        area4: {
            name: "龙王庙",
            resIdLocked: ResMap.img_area_dragon_temple_locked,
            resIdNormal: ResMap.img_area_dragon_temple,
            pos: { x: 507, y: 431 },
            btn: {
                resIdNormal: ResMap.btn_area_dragon_temple_normal,
                resIdHighlight: ResMap.btn_area_dragon_temple_highlight,
                pos: { x: 50, y: 50 },
            }
        },
        area5: {
            name: "德兴大厦",
            resIdLocked: ResMap.img_area_dexing_tower_locked,
            resIdNormal: ResMap.img_area_dexing_tower,
            pos: { x: 918, y: 369 },
            btn: {
                resIdNormal: ResMap.btn_area_dexing_tower_normal,
                resIdHighlight: ResMap.btn_area_dexing_tower_highlight,
                pos: { x: 50, y: 50 },
            }
        }
    },

    getCurrentAreaIndex: function () {
        let index = ac.var.currentAreaIndex;
        return index;
    },

    setCurrentAreaIndex: function (index) {
        // 以防可以回看
        index = Math.max(ac.var.currentAreaIndex, index);
        ac.var.currentAreaIndex = index;
    },

    isAreaUnlocked: function (index) {
        let currentIndex = this.getCurrentAreaIndex();
        return index <= currentIndex + 1;
    },

    // 0: 当前开放, -1 : 未解锁, 1: 已完成
    getAreaState: function (index) {
        // 当前开放区域可以点击跳转
        let currentIndex = this.getCurrentAreaIndex();
        if (index === currentIndex + 1) {
            return 0;
        }
        if (index > currentIndex + 1) {
            return -1;
        }
        return 1;
    },

    isAllAreaUnlocked: function () {
        let currentIndex = this.getCurrentAreaIndex();
        return currentIndex >= 5;
    },

    // 地图背景
    createMapStaticBg: async function () {
        await ac.createLayer({
            name: 'layer_full_map',
            index: ZORDER.SCENE,
            inlayer: 'window',
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            clipMode: true,
        });

        await ac.createImage({
            name: 'img_map_bg',
            index: 0,
            inlayer: 'layer_full_map',
            resId: ResMap.pic_map_bg_locked,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });
    },

    // 地图区域
    createMapAreas: async function () {
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

    // 完整地图
    createMapUI: async function () {
        await MapSystem.createMapStaticBg();
        await MapSystem.createMapAreas();
    },

    // 全屏压黑
    createMapMask: async function () {
        let currentIndex = MapSystem.getCurrentAreaIndex();
        await ac.createImage({
            name: `img_mask_area_${currentIndex}`,
            index: 5,
            inlayer: 'img_map_bg',
            resId: ResMap[`pic_mask_area_${currentIndex}`],
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            scale: 100,
            opacity: 90,
        });
    },

    // 解锁表现
    refreshMapMask: async function () {
        let currentIndex = MapSystem.getCurrentAreaIndex();
        let nextIndex = currentIndex + 1;
        console.log('[LOG] refreshMapMask', currentIndex, nextIndex);
        // 创建已解锁区域遮罩(淡出)
        await ac.createImage({
            name: `img_mask_area_${currentIndex}`,
            index: 5,
            inlayer: 'img_map_bg',
            resId: ResMap[`pic_mask_area_${currentIndex}`],
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        // 淡出
        ac.hide({
            name: `img_mask_area_${currentIndex}`,
            effect: 'fadeout',
            duration: 1000,
            canskip: false,
        });

        if (nextIndex <= 5) {
            // 创建待探索区域遮罩(淡入)
            await ac.createImage({
                name: `img_mask_area_${nextIndex}`,
                index: 5,
                inlayer: 'img_map_bg',
                resId: ResMap[`pic_mask_area_${nextIndex}`],
                pos: { x: GameConfig.centerX, y: GameConfig.centerY },
                anchor: { x: 50, y: 50 },
            });

            ac.show({
                name: `img_mask_area_${nextIndex}`,
                effect: 'fadein',
                duration: 1000,
                canskip: false,
            });
        }
    },
}
