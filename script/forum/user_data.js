// 用户数据
var UserSystem = {
    database: {
        "user_001": {
            id: "user_001",
            name: "匿名用户1",
            icon: ForumStyle.AVATAR.ICON_01,
        },
        "user_002": {
            id: "user_002",
            name: "匿名用户002",
            icon: ForumStyle.AVATAR.ICON_02,
        },
        "user_003": {
            id: "user_003",
            name: "匿名用户003",
            icon: ForumStyle.AVATAR.ICON_03,
        },
        "user_004": {
            id: "user_004",
            name: "匿名用户004",
            icon: ForumStyle.AVATAR.ICON_01,
        },
        "user_010": {
            id: "user_010",
            name: "实名用户010",
            icon: ForumStyle.AVATAR.ICON_04,
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