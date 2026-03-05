// ==========================================
// 道具静态配置表
// ==========================================
const ItemType = {
    MATERIAL: 1,    // 材料
    CONSUMABLE: 2, // 消耗品, 可使用
    EQUIP: 3,      // 装备
    KEY: 4,        // 关键道具, 可使用, 不可丢弃
};

const ItemConfig = {
    // "gold_coin": {
    //     name: "金币",
    //     type: ItemType.MATERIAL,
    //     icon: ResMap.icon_gold_coin,
    //     desc: "通用的货币。",
    //     maxStack: 9999,     // 最大堆叠数量
    //     dropLimit: -1       // 无掉落限制
    // },

    item_01: {
        name: "龙鳞吊坠",
        type: ItemType.KEY,
        icon: ResMap.icon_item_pendant,
        illust : ResMap.img_item_pendant,
        desc: "李云祥出生时带来的一块“神玉”，陪伴他长大，仔细一看是鳞片的纹理，上面用古老的文字刻画着“云祥”二字。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1,  // 只会掉落一次
        // // 使用效果
        // effect: async function () {
        //     // 返回 true 表示使用成功
        //     return true;
        // },
    },

    item_02: {
        name: "云字铠甲",
        type: ItemType.KEY,
        icon: ResMap.icon_item_armor,
        illust: ResMap.img_item_armor,
        desc: "一副火红色的铠甲，胸口用繁体写着“云”字。生了情的圣人在爱欲与怜悯面前丢盔卸甲，将它与英雄梦一同束之高阁。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },

    item_03: {
        name: "八宝罗盘",
        type: ItemType.KEY,
        icon: ResMap.icon_item_compass,
        illust: ResMap.img_item_compass,
        desc: "佛门法器，用来兴旺避邪、镇室安宅。存放着李云祥前世的记忆。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },

    item_04: {
        name: "龙三太子的庇佑",
        type: ItemType.KEY,
        icon: ResMap.icon_item_blessing,
        illust: ResMap.img_item_blessing,
        desc: "龙三太子把你当自己人了，从此以后你可以在海里横着走。不过谁会没事去海里呢？",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },

    item_05: {
        name: "黑卡",
        type: ItemType.KEY,
        icon: ResMap.icon_item_visa,
        illust: ResMap.img_item_visa,
        desc: "传说中能让飞机掉头的梅山银行信用卡。面向全球顶级富豪、政要及社会名流发卡，持卡人可享受无额度上限、生活出行各方面的顶级服务。可是对敖丙来说，daddy的爱比黑卡更有含金量，daddy也会为他做这些，并且不会因为他很优秀才爱他。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },
    item_06: {
        name: "黑卡",
        type: ItemType.KEY,
        icon: ResMap.icon_item_visa,
        illust: ResMap.img_item_visa,
        desc: "传说中能让飞机掉头的梅山银行信用卡。面向全球顶级富豪、政要及社会名流发卡，持卡人可享受无额度上限、生活出行各方面的顶级服务。可是对敖丙来说，daddy的爱比黑卡更有含金量，daddy也会为他做这些，并且不会因为他很优秀才爱他。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },
    item_07: {
        name: "黑卡",
        type: ItemType.KEY,
        icon: ResMap.icon_item_visa,
        illust: ResMap.img_item_visa,
        desc: "传说中能让飞机掉头的梅山银行信用卡。面向全球顶级富豪、政要及社会名流发卡，持卡人可享受无额度上限、生活出行各方面的顶级服务。可是对敖丙来说，daddy的爱比黑卡更有含金量，daddy也会为他做这些，并且不会因为他很优秀才爱他。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },
    item_08: {
        name: "黑卡",
        type: ItemType.KEY,
        icon: ResMap.icon_item_visa,
        illust: ResMap.img_item_visa,
        desc: "传说中能让飞机掉头的梅山银行信用卡。面向全球顶级富豪、政要及社会名流发卡，持卡人可享受无额度上限、生活出行各方面的顶级服务。可是对敖丙来说，daddy的爱比黑卡更有含金量，daddy也会为他做这些，并且不会因为他很优秀才爱他。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },
};