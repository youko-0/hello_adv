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