// 地图配置
console.log('[LOAD] map_system');

const _mapDefault = function () {
    return {
        areaId: "",      // 当前访问区域
        visited: {},       // 已访问区域，{id: times}
    };
};

const MapSystem = createSystem(
    'str_map_data', // 变量名
    _mapDefault,    // 默认数据生成器
    {
        NEXT_PLOT: ResMap.plot_map_next,
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
                resIdHighlight: ResMap.img_circuit_highlight,
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
                resIdHighlight: ResMap.img_nezha_temple_highlight,
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
                resIdHighlight: ResMap.img_dragon_temple_highlight,
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
                resIdHighlight: ResMap.img_dexing_tower_highlight,
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

        getAreaList: function () {
            return Object.keys(this.area);
        },

        getAreaConfig: function (areaId) {
            return this.area[areaId];
        },

        // 获取当前访问区域
        getAreaId: function () {
            return this.getData().areaId;
        },

        // 保存当前访问区域
        saveAreaId: function (areaId) {
            let data = this.getData();
            if (data.areaId !== areaId) {
                console.log(`[Map] 切换区域: ${data.areaId} -> ${areaId}`);
                data.areaId = areaId;
                this.save();
            }
        },

        // 是不是当前区域
        isVisiting: function (areaId) {
            return this.getAreaId() === areaId;
        },

        // 是否访问过该区域
        isVisited: function (areaId) {
            let visited = this.getData().visited;
            return visited[areaId] && visited[areaId] > 0;
        },

        // 保存访问记录
        saveVisited: function (areaId) {
            if (!areaId) return;
            let data = this.getData();
            // 增加访问次数
            if (!data.visited[areaId]) {
                data.visited[areaId] = 1;
            } else {
                data.visited[areaId]++;
            }
            this.save();
            console.log(`[Map] 保存访问记录: ${areaId}, 访问次数: ${data.visited[areaId]}`);
        },

        // 获取区域访问次数
        getVisitedTimes: function (areaId) {
            let visited = this.getData().visited;
            return visited[areaId] || 0;
        },

        // 全部区域探索完成
        isAllAreaVisited: function () {
            for (let area of Object.keys(this.area)) {
                if (!this.isVisited(area)) {
                    return false;
                }
            }
            return true;
        },

        // 探索完成
        onAllAreaVisited: async function () {
            await ac.jump({
                plotID: MapSystem.NEXT_PLOT,
                transition: ac.SCENE_TRANSITION_TYPES.fade,
                duration: 1000,
            });
        },

        // 前往区域
        onGotoArea: async function (areaId) {
            let plotId = this.getAreaConfig(areaId).plot;
            this.saveAreaId(areaId);
            await ac.jump({
            // TODO: 这里看下能不能用插入剧情实现
            // await ac.display({
                plotID: plotId,
                transition: ac.SCENE_TRANSITION_TYPES.fade,
                duration: 1000,
            });
            console.log(`[Map] after displayPlot: ${areaId}`);
            // // 保存访问记录, 用 ac.jump 走不到这里来
            // this.saveVisited(areaId);
        },

        // 进入地图, MapSystem.enterMap()
        enterMap: async function () {
            // 这里再保存一下
            // 如果已经全部访问过，清空当前访问区域(不需要再播放动效)
            if (this.isAllAreaVisited()) {
                this.saveAreaId("");
            }
            await this.saveVisited(this.getAreaId());
            await MapUI.createMapUI();
            await MapUI.onEnterMap();
        },
    }
);