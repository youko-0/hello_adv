// 地图配置
var MapSystem = {
    width: 1280,
    height: 720,

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

    // 0: 当前开放, -1 : 未解锁, 1: 已解锁但不可跳转
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
    }
}

async function createMapUI() {
    console.log('[LOAD] createMapUI');
    await ac.createLayer({
        name: 'layer_full_map',
        index: 0,
        inlayer: 'window',
        pos: { x: 0, y: 0 },
        anchor: { x: 0, y: 0 },
        size: { width: MapSystem.width, height: MapSystem.height },
        clipMode: true,
    });

    await ac.createImage({
        name: 'img_map_bg',
        index: 0,
        inlayer: 'layer_full_map',
        resId: ResMap.pic_map_bg,
        pos: { x: MapSystem.width / 2, y: MapSystem.height / 2 },
        anchor: { x: 50, y: 50 },
    });

    await ac.createImage({
        name: 'img_area_1',
        index: 1,
        inlayer: 'img_map_bg',
        resId: ResMap.img_area_1,
        pos: { x: 628, y: 370 },
        anchor: { x: 50, y: 50 },
    });

    await ac.createImage({
        name: 'img_area_2',
        index: 1,
        inlayer: 'img_map_bg',
        resId: ResMap.img_area_2,
        pos: { x: 334, y: 142 },
        anchor: { x: 50, y: 50 },
    });

    await ac.createImage({
        name: 'img_area_3',
        index: 1,
        inlayer: 'img_map_bg',
        resId: ResMap.img_area_3,
        pos: { x: 1088, y: 650 },
        anchor: { x: 50, y: 50 },
    });

    await ac.createImage({
        name: 'img_area_4',
        index: 1,
        inlayer: 'img_map_bg',
        resId: ResMap.img_area_4,
        pos: { x: 106, y: 540 },
        anchor: { x: 50, y: 50 },
    });

    await ac.createImage({
        name: 'img_area_5',
        index: 1,
        inlayer: 'img_map_bg',
        resId: ResMap.img_area_5,
        pos: { x: 1096, y: 348 },
        anchor: { x: 50, y: 50 },
    });

}