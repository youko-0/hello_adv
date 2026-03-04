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
        icon: ResMap.icon_pendant,
        bigIcon: ResMap.icon_pendant_big,
        desc: "李云祥出生时带来的一块“神玉”，陪伴他长大，仔细一看是鳞片的纹理，上面用古老的文字刻画着“云祥”二字。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1,  // 只会掉落一次
        // 使用效果
        effect: async function () {
            // 返回 true 表示使用成功
            return true;
        },
    },

    item_02: {
        name: "云字铠甲",
        type: ItemType.KEY,
        icon: ResMap.icon_armor,
        bigIcon: ResMap.icon_armor_big,
        desc: "一副火红色的铠甲，胸口用繁体写着“云”字。生了情的圣人在爱欲与怜悯面前丢盔卸甲，将它与英雄梦一同束之高阁。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },

    item_03: {
        name: "八宝罗盘",
        type: ItemType.KEY,
        icon: ResMap.icon_compass,
        bigIcon: ResMap.icon_compass_big,
        desc: "佛门法器，用来兴旺避邪、镇室安宅。存放着李云祥前世的记忆。",

    }
};