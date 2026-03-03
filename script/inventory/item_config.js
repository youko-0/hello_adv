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
    "gold_coin": {
        name: "金币",
        type: ItemType.MATERIAL,
        icon: ResMap.icon_gold_coin,
        desc: "通用的货币。",
        maxStack: 9999,     // 最大堆叠数量
        dropLimit: -1       // 无掉落限制
    },

    // 苹果
    "apple": {
        name: "苹果",
        type: ItemType.CONSUMABLE,
        icon: ResMap.icon_apple,
        desc: "吃了可以恢复一点体力。",
        maxStack: 99,       // 最大堆叠数量
        dropLimit: -1,       // 无掉落限制
        // 使用效果
        effect: async function () {
            // 返回 true 表示使用成功
            return true;
        },
    },

    "old_photo": {
        name: "旧照片",
        type: ItemType.KEY,
        icon: ResMap.icon_old_photo,
        desc: "一张泛黄的老舅照片",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1  // 只会掉落一次
    },
};