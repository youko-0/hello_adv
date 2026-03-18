// 地图配置
console.log('[LOAD] map_system');

const _mapDefault = function () {
    return {
        areaId: "",      // 当前访问区域
        visited: {},       // 已访问区域，{id: true}
    };
};

const MapSystem = createSystem(
    'str_map_data', // 变量名
    _mapDefault,    // 默认数据生成器
    {
        area: {
            area1: {
                name: "下城区",
                resIdLocked: ResMap.img_undercity_locked,
                resIdHighlight: ResMap.img_undercity_highlight,
                resIdNormal: ResMap.img_undercity,
                pos: { x: 874, y: 389 },
                btn: {
                    resIdNormal: ResMap.btn_undercity_normal,
                    resIdHighlight: ResMap.btn_undercity_highlight,
                    pos: { x: -64, y: 20 },
                },
                plot: ResMap.plot_undercity,
            },
            area2: {
                name: "赛车场",
                resIdLocked: ResMap.img_circuit_locked,
                resIdNormal: ResMap.img_circuit,
                pos: { x: 766, y: 197 },
                btn: {
                    resIdNormal: ResMap.btn_circuit_normal,
                    resIdHighlight: ResMap.btn_circuit_highlight,
                    pos: { x: -120, y: 0 },
                },
                plot: ResMap.plot_circuit,
            },
            area3: {
                name: "哪吒庙",
                resIdLocked: ResMap.img_nezha_temple_locked,
                resIdNormal: ResMap.img_nezha_temple,
                pos: { x: 629, y: 602 },
                btn: {
                    resIdNormal: ResMap.btn_nezha_temple_normal,
                    resIdHighlight: ResMap.btn_nezha_temple_highlight,
                    pos: { x: -48, y: 20 },
                },
                plot: ResMap.plot_nezha_temple,
            },
            area4: {
                name: "龙王庙",
                resIdLocked: ResMap.img_dragon_temple_locked,
                resIdNormal: ResMap.img_dragon_temple,
                pos: { x: 514, y: 431 },
                btn: {
                    resIdNormal: ResMap.btn_dragon_temple_normal,
                    resIdHighlight: ResMap.btn_dragon_temple_highlight,
                    pos: { x: -48, y: 0 },
                },
                plot: ResMap.plot_dragon_temple,
            },
            area5: {
                name: "德兴大厦",
                resIdLocked: ResMap.img_dexing_tower_locked,
                resIdNormal: ResMap.img_dexing_tower,
                pos: { x: 1098, y: 294 },
                btn: {
                    resIdNormal: ResMap.btn_dexing_tower_normal,
                    resIdHighlight: ResMap.btn_dexing_tower_highlight,
                    pos: { x: 64, y: 20 },
                },
                plot: ResMap.plot_dexing_tower,
            }
        },

        getAreaConfig: function (areaId) {
            return this.area[areaId];
        },

        // 获取当前访问区域
        getAreaId: function () {
            return this.getData().areaId;
        },

        // 是否访问过该区域
        isVisited: function (areaId) {
            let visited = this.getData().visited;
            return !!visited[areaId];
        },

        // 保存访问记录
        saveVisited: function (areaId) {
            // 以防可以回看
            index = Math.max(ac.var.currentAreaIndex, index);
            ac.var.currentAreaIndex = index;
        },

        getAreaCount: function () {
            return Object.keys(this.area).length;
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

        // 全部区域探索完成
        isAllAreaVisited: function () {
            let currentIndex = this.getCurrentAreaIndex();
            let areaCount = this.getAreaCount();
            return currentIndex >= areaCount;
        },

        // 探索完成
        onAllAreaVisited: async function () {
            async function onConfirm() {
                await ac.jump({
                    plotID: ResMap.plot_map_next,
                    transition: ac.SCENE_TRANSITION_TYPES.normal,
                });
            }
            await CommonUI.showAlert("探索全部完成", onConfirm);
        },

        // 前往区域
        onGotoArea: async function (areaIndex) {
            // 直接在这里记录点击
            MapSystem.setCurrentAreaIndex(areaIndex);
            await ac.jump({
                plotID: ResMap[`plot_area_${areaIndex}`],
                transition: ac.SCENE_TRANSITION_TYPES.normal,
            });
        },

        // 点击地图区域
        // 这里是回调函数, 不用 this 用 MapSystem
        onClickArea: async function (index) {
            if (MapSystem.isAllAreaVisited()) {
                await MapSystem.onAllAreaVisited();
                return;
            }
            let state = MapSystem.getAreaState(index);
            switch (state) {
                case 0:
                    await MapSystem.onGotoArea(index);
                    break;
                case -1:
                    await CommonUI.showAlert("该区域未解锁！");
                    break;
                case 1:
                    await CommonUI.showAlert("该区域已查看！");
                    break;
                default:
                    console.warn(`未知的区域状态: ${state}`);
                    break;
            }
        },

        // 进入地图, MapSystem.enterMap()
        enterMap: async function () {
            await MapUI.createMapUI();
            await MapUI.refreshMap();
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
);