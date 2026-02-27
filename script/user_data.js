// 用户数据
var UserSystem = {
    database: {
        "user_001": {
            id: "user_001",
            name: "匿名用户001",
            icon: "img_ficon_01",
        },
        "user_002": {
            id: "user_002",
            name: "匿名用户002",
            icon: "img_ficon_02",
        },
        "user_003": {
            id: "user_003",
            name: "匿名用户003",
            icon: "img_ficon_03",
        },
        "user_004": {
            id: "user_004",
            name: "匿名用户004",
            icon: "img_ficon_04",
        },
        "user_010": {
            id: "user_010",
            name: "实名用户010",
            icon: "img_ficon_01",
        },
    },
    getUserInfo: function (uid) {
        return this.database[uid];
    }
};