console.log('[LOAD] user_system');
// 用户数据
const UserSystem = {
    database: {
        "user_001": {
            id: "user_001",
            name: "抹茶momo冰",
            icon: ResMap.icon_forum_head_02,
        },
        "user_002": {
            id: "user_002",
            name: "mo茶眠眠冰",
            icon: ResMap.icon_forum_head_03,
        },
        "user_003": {
            id: "user_003",
            name: "夏日momo茶",
            icon: ResMap.icon_forum_head_04,
        },
        "user_momo": {
            id: "user_momo",
            name: "momo",
            icon: ResMap.icon_forum_head_01,
        },
    },

    getUserInfo: function (uid) {
        return this.database[uid];
    },

    getUserName: function (uid) {
        return this.database[uid].name;
    },

    getUserIcon: function (uid) {
        return this.database[uid].icon;
    },
};