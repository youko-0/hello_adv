// ==========================================
// 道具静态配置表
// ==========================================
const ItemType = {
    MATERIAL: 1,    // 材料
    CONSUMABLE: 2, // 消耗品, 可使用
    CLUE: 3,      // 普通线索
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

    item_pendant: {
        name: "龙鳞吊坠",
        type: ItemType.KEY,
        icon: ResMap.icon_item_pendant,
        illust : ResMap.img_item_pendant,
        desc: "李云祥出生时带来的一块“神玉”，陪伴他长大，仔细一看是鳞片的纹理，上面用古老的文字刻画着“云祥”二字。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1,  // 只会掉落一次
        sortIndex: 1,
        // // 使用效果
        // effect: async function () {
        //     // 返回 true 表示使用成功
        //     return true;
        // },
    },

    item_armor: {
        name: "云字铠甲",
        type: ItemType.KEY,
        icon: ResMap.icon_item_armor,
        illust: ResMap.img_item_armor,
        desc: "一副火红色的铠甲，胸口用繁体写着“云”字。生了情的圣人在爱欲与怜悯面前丢盔卸甲，将它与英雄梦一同束之高阁。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1,  // 只会掉落一次
        sortIndex: 2,
    },

    item_compass: {
        name: "八宝罗盘",
        type: ItemType.KEY,
        icon: ResMap.icon_item_compass,
        illust: ResMap.img_item_compass,
        desc: "佛门法器，用来兴旺避邪、镇室安宅。存放着李云祥前世的记忆。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1,  // 只会掉落一次
        sortIndex: 3,
    },

    item_blessing: {
        name: "龙三太子的庇佑",
        type: ItemType.KEY,
        icon: ResMap.icon_item_blessing,
        illust: ResMap.img_item_blessing,
        desc: "龙三太子把你当自己人了，从此以后你可以在海里横着走。不过谁会没事去海里呢？",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1,  // 只会掉落一次
        sortIndex: 4,
    },

    item_visa: {
        name: "黑卡",
        type: ItemType.KEY,
        icon: ResMap.icon_item_visa,
        sprite: ResMap.spr_item_visa,
        illust: ResMap.img_item_visa,
        desc: "传说中能让飞机掉头的梅山银行信用卡。面向全球顶级富豪、政要及社会名流发卡，持卡人可享受无额度上限、生活出行各方面的顶级服务。可是对敖丙来说，daddy的爱比黑卡更有含金量，daddy也会为他做这些，并且不会因为他很优秀才爱他。",
        maxStack: 1,  // 最多持有一个
        dropLimit: 1,  // 只会掉落一次
        sortIndex: 5,
    },

    item_family_photo: {
        name: "全家福",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_family_photo,
        illust: ResMap.img_item_family_photo,
        desc: "老旧的照片上是一对年轻的夫妻和一大一小两个男孩，一家人衣着体面，笑得很幸福。",
    },

    item_motorcycle_key: {
        name: "车钥匙",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_motorcycle_key,
        illust: ResMap.img_item_motorcycle_key,
        desc: "这是一辆摩托车的钥匙，有一点磨损，但是不知道摩托车去了哪里。家里没有人喜欢摩托车，这会是谁的车钥匙呢？",
    },

    item_cookie_box: {
        name: "饼干盒",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_cookie_box,
        illust: ResMap.img_item_cookie_box,
        desc: "铁盒里面放着很多小纸条，不同的稚嫩笔迹写着充满童趣的愿望：“我想当万众瞩目的歌星”、“我想挣很多钱让全家人住上大房子”、“我想当东海市的大英雄”……",
    },

    item_mural_nezhanaohai: {
        name: "哪吒闹海",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_mural_nezhanaohai,
        illust: ResMap.img_item_mural_nezhanaohai,
        desc: "海浪翻滚，画中哪吒脚踏风火轮，手持火尖枪，与东海龙王三太子缠斗。",
    },

    item_mural_ziwenguitian: {
        name: "自刎归天",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_mural_ziwenguitian,
        illust: ResMap.img_item_mural_ziwenguitian,
        desc: "哪吒立于陈塘关城楼之上，一手握剑横于颈前，面容平静。城下殷母仰面伸手，神色悲恸。",
    },

    item_mural_lianhuatuosheng: {
        name: "莲花托生",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_mural_lianhuatuosheng,
        illust: ResMap.img_item_mural_lianhuatuosheng,
        desc: "翠色莲茎从水中生出，托起一朵盛开的红莲，莲心端坐一个唇红齿白的小儿。莲池周围仙鹤翔集，祥云缭绕。",
    },

    item_mural_jianzaoshenmiao: {
        name: "???",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_mural_jianzaoshenmiao,
        illust: ResMap.img_item_mural_jianzaoshenmiao,
        desc: "第一面墙上，绘着殷母跪于山野，双手捧土，面前是一座刚起地基的小庙。她身后是成队的奴隶肩扛巨木，背负石料。远处有巫师披发跣足，手持骨笛吹奏，一旁有牺牲——牛、羊、人，一排排跪在祭坑前。天空阴沉，乌鸦盘旋。",
    },

    item_mural_zhuzaosuxiang: {
        name: "???",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_mural_zhuzaosuxiang,
        illust: ResMap.img_item_mural_zhuzaosuxiang,
        desc: "这一幅中，庙已建成，殿内立着未完工的泥胎。殷夫人亲手捧着一尊青铜爵，正往泥胎上浇。四周工匠手持木槌、石刀，在胎骨上雕琢。有人捧来金箔，有人端来朱砂。",
    },

    item_mural_lijingsb: {
        name: "???",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_mural_lijingsb,
        illust: ResMap.img_item_mural_lijingsb,
        desc: "最后一幅壁画上，李靖立于庙门前，身披甲胄手持长剑，身后是持戈的兵卒。庙内金身已倒，断成数截，头颅滚落在地，六臂散落各处，身断处流出朱砂调成的、血一般的东西，庙外火光连天，工匠都被处死。",
    },

    item_letter: {
        name: "小白龙的书信",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_letter,
        illust: ResMap.img_item_letter,
        desc: "这是一封落款人为敖烈，落款时间是2021年的书信。上面写着什么……仁兄台鉴……",
    },

    item_jewelry_box: {
        name: "首饰盒",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_jewelry_box,
        illust: ResMap.img_item_jewelry_box,
        desc: "首饰盒里放着的是一支小指大小，类似鹿角之类脱落下来的东西，它是玉色的，静静躺在黑色绒布上，被好好珍藏着。",
    },

    item_old_newspaper: {
        name: "旧报纸",
        type: ItemType.CLUE,
        sprite: ResMap.spr_item_old_newspaper,
        illust: ResMap.img_item_old_newspaper,
        desc: "报纸上头条刊登着一则新闻：德兴集团年仅二十七岁的三公子敖丙个人全权承办的第一个工程顺利竣工。剪彩仪式上德兴董事长敖广亲自到场，笑容满面地与几位政府的嘉宾碰杯，对此非常骄傲。但主人公敖丙并没有出现在照片上，民间所说敖广不希望小儿子在公共媒体露面的传言似乎属实。",
    },

};