// 地图 UI 配置
var MapUI = {
    width: 1280,
    height: 720,

    getCurrentAreaIndex: function () {
        let index = ac.var.currentAreaIndex;
        return index;
    },

    setCurrentAreaIndex: function (index) {
        ac.var.currentAreaIndex = index;
    },
}