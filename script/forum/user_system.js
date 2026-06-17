console.log('[LOAD] user_system');
// 用户数据
const UserSystem = {
    database: {
        "user_001": {
            id: "user_001",
            name: "抹茶momo冰",
            icon: ResMap.icon_forum_head_01,
        },
        "user_002": {
            id: "user_002",
            name: "mo茶眠眠冰",
            icon: ResMap.icon_forum_head_02,
        },
        "user_003": {
            id: "user_003",
            name: "夏日momo茶",
            icon: ResMap.icon_forum_head_03,
        },
        "user_011": {
            id: "user_011",
            name: "omom",
            icon: ResMap.icon_forum_head_11,
        },
        "user_012": {
            id: "user_012",
            name: "wowo",
            icon: ResMap.icon_forum_head_12,
        },
        "user_013": {
            id: "user_013",
            name: "owow",
            icon: ResMap.icon_forum_head_13,
        },
        "user_014": {
            id: "user_014",
            name: "user_014",
            icon: ResMap.icon_forum_head_14,
        },
        "user_015": {
            id: "user_015",
            name: "user_015",
            icon: ResMap.icon_forum_head_15,
        },
        "user_016": {
            id: "user_016",
            name: "user_016",
            icon: ResMap.icon_forum_head_16,
        },
        "user_momo": {
            id: "user_momo",
            name: "momo",
            icon: ResMap.icon_forum_head_00,
        },
        "user_admin": {
            id: "user_admin",
            name: "抹茶眠眠冰",
            icon: ResMap.icon_forum_head_99,
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