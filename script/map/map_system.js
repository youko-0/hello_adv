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
                plot: ResMap.plot_undercity,
                plotLoop: ResMap.plot_undercity_loop,
                // 关键道具
                inventory: ['item_pendant'],
            },
            area2: {
                name: "赛车场",
                resIdLocked: ResMap.img_circuit_locked,
                resIdHighlight: ResMap.img_circuit_highlight,
                resIdNormal: ResMap.img_circuit,
                pos: { x: 766, y: 197 },
                plot: ResMap.plot_circuit,
                plotLoop: ResMap.plot_circuit_loop,
                inventory: ['item_armor'],
            },
            area3: {
                name: "哪吒庙",
                resIdLocked: ResMap.img_nezha_temple_locked,
                resIdHighlight: ResMap.img_nezha_temple_highlight,
                resIdNormal: ResMap.img_nezha_temple,
                pos: { x: 629, y: 602 },
                plot: ResMap.plot_nezha_temple,
                plotLoop: ResMap.plot_nezha_temple_loop,
                inventory: ['item_compass'],
            },
            area4: {
                name: "龙王庙",
                resIdLocked: ResMap.img_dragon_temple_locked,
                resIdHighlight: ResMap.img_dragon_temple_highlight,
                resIdNormal: ResMap.img_dragon_temple,
                pos: { x: 514, y: 431 },
                plot: ResMap.plot_dragon_temple,
                plotLoop: ResMap.plot_dragon_temple_loop,
                inventory: ['item_blessing'],
            },
            area5: {
                name: "德兴大厦",
                resIdLocked: ResMap.img_dexing_tower_locked,
                resIdHighlight: ResMap.img_dexing_tower_highlight,
                resIdNormal: ResMap.img_dexing_tower,
                pos: { x: 1098, y: 294 },
                plot: ResMap.plot_dexing_tower,
                plotLoop: ResMap.plot_dexing_tower_loop,
                inventory: ['item_visa'],
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

        // 是不是当前访问区域
        isVisiting: function (areaId) {
            return this.getAreaId() === areaId;
        },

        // 是否访问过该区域
        isVisited: function (areaId) {
            if (!areaId) return false;
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

        // 是否探索完成, 判断是否获得了所有关键道具
        isCleared: function (areaId) {
            if (!areaId) return false;
            const inventory = this.getAreaConfig(areaId).inventory;
            for (let item of inventory) {
                // 这里判断历史获得数量, 因为道具可能被使用
                if (InventorySystem.getHistoryCount(item) <= 0) {
                    return false;
                }
            }
            return true;
        },

        // 全部区域探索完成
        isClearedAll: function () {
            for (let area of Object.keys(this.area)) {
                if (!this.isCleared(area)) {
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
            const areaConfig = this.getAreaConfig(areaId);
            let flag = this.isCleared(areaId);
            let plotId = flag ? areaConfig.plotLoop : areaConfig.plot;
            // 保存当前访问区域
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
        enterMap: async function (areaId = null) {
            if (typeof areaId === 'string') {
                this.saveAreaId(areaId);
            }
            // 保存访问记录(次数 + 1)
            this.saveVisited(this.getAreaId());
            await MapUI.createMapUI();
            await MapUI.onEnterMap();
        },
    }
);