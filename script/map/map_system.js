// 地图配置
console.log('[LOAD] map_system');

const MapSystem = {

    AREA: {
        area1: {
            resIdLocked: ResMap.img_area_1_locked,
            resIdNormal: ResMap.img_area_1,
            pos: { x: 628, y: 370 },
        },
        area2: {
            resIdLocked: ResMap.img_area_2_locked,
            resIdNormal: ResMap.img_area_2,
            pos: { x: 334, y: 142 },
        },
        area3: {
            resIdLocked: ResMap.img_area_3_locked,
            resIdNormal: ResMap.img_area_3,
            pos: { x: 1088, y: 650 },
        },
        area4: {
            resIdLocked: ResMap.img_area_4_locked,
            resIdNormal: ResMap.img_area_4,
            pos: { x: 106, y: 540 },
        },
        area5: {
            resIdLocked: ResMap.img_area_5_locked,
            resIdNormal: ResMap.img_area_5,
            pos: { x: 1096, y: 348 },
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
            index: 0,
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
            resId: ResMap.pic_map_bg,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });
    },

    // 地图区域
    createMapAreas: async function () {
        for (let i = 1; i <= 5; i++) {
            let state = MapSystem.getAreaState(i);
            let config = MapSystem.AREA[`area${i}`];
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
