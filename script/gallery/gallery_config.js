// 图鉴静态配置表
console.log('[LOAD] gallery_config');

// ── 分类常量 ─────────────────────────────────────────────────────
const GalleryCategory = {
    APPRECIATION: 'appreciation',   // 鉴赏
    CHARACTER:    'character',       // 人物收集
    STORY:        'story',            // 剧情收集
};

// 子分类
const GallerySub = {
    // 鉴赏
    CG:        'cg',        // CG
    SCENE:     'scene',     // 特殊场景
    // 人物
    PORTRAIT:  'portrait',  // 立绘
    AVATAR:    'avatar',     // 头像
    // 剧情
    MEMORY:    'memory',    // 回忆
    ENDING:    'ending',     // 结局 / 番外
};

// 条目展示类型
const GalleryType = {
    IMAGE: 'image',   // 图片网格
    TEXT:  'text',     // 文字卡片
};

// 顶部分类标签顺序
const GalleryTabOrder = [
    GalleryCategory.APPRECIATION,
    GalleryCategory.CHARACTER,
    GalleryCategory.STORY,
];

// 顶部分类显示名
const GalleryTabName = {
    [GalleryCategory.APPRECIATION]: '鉴赏',
    [GalleryCategory.CHARACTER]:    '人物收集',
    [GalleryCategory.STORY]:        '剧情收集',
};

// 子分类显示名
const GallerySubName = {
    [GallerySub.CG]:       'CG',
    [GallerySub.SCENE]:    '特殊场景',
    [GallerySub.PORTRAIT]: '立绘',
    [GallerySub.AVATAR]:   '头像',
    [GallerySub.MEMORY]:   '回忆',
    [GallerySub.ENDING]:   '结局',
};

// 各 Tab 下子分类顺序
const GallerySubOrder = {
    [GalleryCategory.APPRECIATION]: [GallerySub.CG, GallerySub.SCENE],
    [GalleryCategory.CHARACTER]:    [GallerySub.PORTRAIT, GallerySub.AVATAR],
    [GalleryCategory.STORY]:        [GallerySub.MEMORY, GallerySub.ENDING],
};

// 回忆世次显示名（剧情 Tab 内分组用）
const GalleryWorldName = {
    world1: '第一世',
    world2: '第二世',
    world3: '第三世',
};

// 结局子分组
const GalleryEndingGroup = {
    ending: '结局',
    side:   '番外',
};

/**
 * 返回条目在指定状态下的视图字段
 * locked 子对象覆盖解锁态字段，未写则沿用解锁态
 * @param {Object}  config   GalleryConfig 中的单条配置
 * @param {boolean} isLocked 是否未解锁
 */
const getGalleryView = function (config, isLocked) {
    if (!isLocked || !config.locked) return config;
    return Object.assign({}, config, config.locked);
};

// ── 条目表 ───────────────────────────────────────────────────────
const GalleryConfig = {

    // ════════ 鉴赏 - CG（16:9）════════
    cg_lingzhu_yu_long_1: {
        name: '灵珠与龙 1', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.CG,
        aspect: '16:9', sortIndex: 0,
        resId: ResMap.pic_gallery_cg_lingzhu_long_1,
        desc: '灵珠与龙初遇。',
        locked: { desc: '尚未解锁' },
    },
    cg_zhaoyun_musan_1: {
        name: '朝云暮散 1', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.CG,
        aspect: '16:9', sortIndex: 1,
        resId: ResMap.pic_gallery_cg_zhaoyun_musan_1,
        desc: '朝云暮散。',
        locked: { desc: '尚未解锁' },
    },
    cg_yunbing_chujian_1: {
        name: '云冰初见 1', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.CG,
        aspect: '16:9', sortIndex: 2,
        resId: ResMap.pic_gallery_cg_yunbing_chuji_1,
        desc: '云冰初见。',
        locked: { desc: '尚未解锁' },
    },
    cg_yunbing_chujian_2: {
        name: '云冰初见 2', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.CG,
        aspect: '16:9', sortIndex: 3,
        resId: ResMap.pic_gallery_cg_yunbing_chuji_2,
        desc: '云冰初见。',
        locked: { desc: '尚未解锁' },
    },
    cg_aobing_zijin_1: {
        name: '敖丙自尽 1', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.CG,
        aspect: '16:9', sortIndex: 4,
        resId: ResMap.pic_gallery_cg_aobing_zijin_1,
        desc: '敖丙自尽。',
        locked: { desc: '尚未解锁' },
    },
    cg_aobing_zijin_2: {
        name: '敖丙自尽 2', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.CG,
        aspect: '16:9', sortIndex: 5,
        resId: ResMap.pic_gallery_cg_aobing_zijin_2,
        desc: '敖丙自尽。',
        locked: { desc: '尚未解锁' },
    },
    cg_aobing_zijin_3: {
        name: '敖丙自尽 3', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.CG,
        aspect: '16:9', sortIndex: 6,
        resId: ResMap.pic_gallery_cg_aobing_zijin_3,
        desc: '敖丙自尽。',
        locked: { desc: '尚未解锁' },
    },

    // ════════ 鉴赏 - 特殊场景 ════════
    scene_nezha_temple: {
        name: '哪吒庙', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.SCENE,
        aspect: '16:9', sortIndex: 0,
        resId: ResMap.pic_gallery_scene_nezha_temple,
        desc: '哪吒庙。',
        locked: { desc: '尚未解锁' },
    },
    scene_nezha_temple_dark: {
        name: '黑哪吒庙', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.SCENE,
        aspect: '16:9', sortIndex: 1,
        resId: ResMap.pic_gallery_scene_nezha_dark,
        desc: '黑哪吒庙。',
        locked: { desc: '尚未解锁' },
    },
    scene_dragon_temple: {
        name: '龙王庙', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.SCENE,
        aspect: '16:9', sortIndex: 2,
        resId: ResMap.pic_gallery_scene_dragon_tmpl,
        desc: '龙王庙。',
        locked: { desc: '尚未解锁' },
    },
    scene_dragon_palace: {
        name: '龙王行宫', type: GalleryType.IMAGE,
        category: GalleryCategory.APPRECIATION, sub: GallerySub.SCENE,
        aspect: '16:9', sortIndex: 3,
        resId: ResMap.pic_gallery_scene_dragon_pal,
        desc: '龙王行宫。',
        locked: { desc: '尚未解锁' },
    },

    // ════════ 人物 - 立绘 ════════
    portrait_lingzhuzi: {
        name: '灵珠子', nameEn: 'LINGZHUZI',
        type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.PORTRAIT,
        aspect: '3:4', sortIndex: 0,
        resId: ResMap.pic_gallery_portrait_lingzhuzi,
        portraitResIds: [
            ResMap.pic_gallery_por_lzz_normal,
            ResMap.pic_gallery_por_lzz_happy,
            ResMap.pic_gallery_por_lzz_shy,
            ResMap.pic_gallery_por_lzz_doubt,
            ResMap.pic_gallery_por_lzz_angry,
            ResMap.pic_gallery_por_lzz_sad,
        ],
        desc: '灵珠子。',
        locked: { desc: '尚未解锁' },
    },
    portrait_xiaolongshen: {
        name: '小龙神', nameEn: 'XIAOLONGSHEN',
        type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.PORTRAIT,
        aspect: '3:4', sortIndex: 1,
        resId: ResMap.pic_gallery_portrait_xlongshen,
        portraitResIds: [
            ResMap.pic_gallery_por_xls_normal,
            ResMap.pic_gallery_por_xls_happy,
            ResMap.pic_gallery_por_xls_shy,
            ResMap.pic_gallery_por_xls_doubt,
            ResMap.pic_gallery_por_xls_angry,
            ResMap.pic_gallery_por_xls_sad,
        ],
        desc: '小龙神。',
        locked: { desc: '尚未解锁' },
    },
    portrait_liyunxiang: {
        name: '李云祥', nameEn: 'LI YUNXIANG',
        type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.PORTRAIT,
        aspect: '3:4', sortIndex: 2,
        resId: ResMap.pic_gallery_portrait_liyunxian,
        portraitResIds: [
            ResMap.pic_gallery_por_lyx_normal,
            ResMap.pic_gallery_por_lyx_happy,
            ResMap.pic_gallery_por_lyx_shy,
            ResMap.pic_gallery_por_lyx_doubt,
            ResMap.pic_gallery_por_lyx_angry,
            ResMap.pic_gallery_por_lyx_sad,
        ],
        desc: '李云祥。',
        locked: { desc: '尚未解锁' },
    },
    portrait_aobing: {
        name: '敖丙', nameEn: 'AOBING',
        type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.PORTRAIT,
        aspect: '3:4', sortIndex: 3,
        resId: ResMap.pic_gallery_portrait_aobing,
        portraitResIds: [
            ResMap.pic_gallery_por_ab_normal,
            ResMap.pic_gallery_por_ab_happy,
            ResMap.pic_gallery_por_ab_shy,
            ResMap.pic_gallery_por_ab_doubt,
            ResMap.pic_gallery_por_ab_angry,
            ResMap.pic_gallery_por_ab_sad,
            ResMap.pic_gallery_por_ab_joy,
        ],
        desc: '敖丙。',
        locked: { desc: '尚未解锁' },
    },

    // ════════ 人物 - 头像 ════════
    avatar_shaonian_kasha: {
        name: '少年喀莎', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 0,
        resId: ResMap.icon_gallery_avatar_shn_kasha,
        desc: '少年喀莎。',
        locked: { desc: '尚未解锁' },
    },
    avatar_kasha: {
        name: '喀莎', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 1,
        resId: ResMap.icon_gallery_avatar_kasha,
        desc: '喀莎。',
        locked: { desc: '尚未解锁' },
    },
    avatar_qingnian_lijinxiang: {
        name: '青年李金祥', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 2,
        resId: ResMap.icon_gallery_avatar_qn_lijinxi,
        desc: '青年李金祥。',
        locked: { desc: '尚未解锁' },
    },
    avatar_lijinxiang: {
        name: '李金祥', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 3,
        resId: ResMap.icon_gallery_avatar_lijinxiang,
        desc: '李金祥。',
        locked: { desc: '尚未解锁' },
    },
    avatar_laoli: {
        name: '老李', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 4,
        resId: ResMap.icon_gallery_avatar_laoli,
        desc: '老李。',
        locked: { desc: '尚未解锁' },
    },
    avatar_aoguang: {
        name: '敖广', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 5,
        resId: ResMap.icon_gallery_avatar_aoguang,
        desc: '敖广。',
        locked: { desc: '尚未解锁' },
    },
    avatar_ligen: {
        name: '李艮', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 6,
        resId: ResMap.icon_gallery_avatar_ligen,
        desc: '李艮。',
        locked: { desc: '尚未解锁' },
    },
    avatar_yunv: {
        name: '鱼女', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 7,
        resId: ResMap.icon_gallery_avatar_yunv,
        desc: '鱼女。',
        locked: { desc: '尚未解锁' },
    },
    avatar_mianjuren: {
        name: '面具人', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 8,
        resId: ResMap.icon_gallery_avatar_mianjuren,
        desc: '面具人。',
        locked: { desc: '尚未解锁' },
    },
    avatar_aolie: {
        name: '敖烈', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 9,
        resId: ResMap.icon_gallery_avatar_aolie,
        desc: '敖烈。',
        locked: { desc: '尚未解锁' },
    },
    avatar_diyong_furen: {
        name: '地涌夫人', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 10,
        resId: ResMap.icon_gallery_avatar_diyong_fu,
        desc: '地涌夫人。',
        locked: { desc: '尚未解锁' },
    },
    avatar_xiaolong: {
        name: '小龙', type: GalleryType.IMAGE,
        category: GalleryCategory.CHARACTER, sub: GallerySub.AVATAR,
        aspect: '1:1', sortIndex: 11,
        resId: ResMap.icon_gallery_avatar_xiaolong,
        desc: '小龙。',
        locked: { desc: '尚未解锁' },
    },

    // ════════ 剧情 - 回忆 ════════
    // 第一世
    memory_lingzhu_yu_long: {
        name: '灵珠与龙', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world1', sortIndex: 0,
        resId: ResMap.pic_gallery_mem_lingzhu_long,
        desc: '灵珠与龙，初遇之缘。',
        locked: { desc: '尚未解锁' },
    },
    memory_zhaoyun_musan: {
        name: '朝云暮散', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world1', sortIndex: 1,
        resId: ResMap.pic_gallery_mem_zhaoyun_musan,
        desc: '朝云暮散，聚散匆匆。',
        locked: { desc: '尚未解锁' },
    },
    // 第二世
    memory_nezha_naohai: {
        name: '哪吒闹海', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world2', sortIndex: 0,
        resId: ResMap.pic_gallery_mem_nezha_naohai,
        desc: '哪吒闹海，搅动东海。',
        locked: { desc: '尚未解锁' },
    },
    // 第三世
    memory_longshen_quqin: {
        name: '龙神娶亲', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world3', sortIndex: 0,
        resId: ResMap.pic_gallery_mem_longshen_quqin,
        desc: '龙神娶亲，红妆铺海。',
        locked: { desc: '尚未解锁' },
    },
    memory_yunbing_chujian: {
        name: '云冰初见', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world3', sortIndex: 1,
        resId: ResMap.pic_gallery_mem_yunbing_chuji,
        desc: '云冰初见，前世今生。',
        locked: { desc: '尚未解锁' },
    },
    memory_three_dates: {
        name: '三个约会', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world3', sortIndex: 2,
        resId: ResMap.pic_gallery_mem_three_dates,
        desc: '三个约会，情愫渐生。',
        locked: { desc: '尚未解锁' },
    },
    memory_lijing_tanhua: {
        name: '李靖谈话', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world3', sortIndex: 3,
        resId: ResMap.pic_gallery_mem_lijing_tanhua,
        desc: '李靖谈话，父子心结。',
        locked: { desc: '尚未解锁' },
    },
    memory_aolie_laifang: {
        name: '敖烈来访', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world3', sortIndex: 4,
        resId: ResMap.pic_gallery_mem_aolie_laifang,
        desc: '敖烈来访，旧人重逢。',
        locked: { desc: '尚未解锁' },
    },
    memory_longzhu_beihui: {
        name: '龙珠被毁', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world3', sortIndex: 5,
        resId: ResMap.pic_gallery_mem_longzhu_beihui,
        desc: '龙珠被毁，劫数将至。',
        locked: { desc: '尚未解锁' },
    },
    memory_aobing_zijin: {
        name: '敖丙自尽', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.MEMORY,
        world: 'world3', sortIndex: 6,
        resId: ResMap.pic_gallery_mem_aobing_zijin,
        desc: '敖丙自尽，魂归沧海。',
        locked: { desc: '尚未解锁' },
    },

    // ════════ 剧情 - 结局 / 番外 ════════
    ending_yinian_chengmo: {
        name: '真结局 · 一念成魔', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'ending', sortIndex: 0,
        resId: ResMap.pic_gallery_ending_yinian_chengmo,
        desc: '一念成魔，万劫不复。',
        locked: { desc: '尚未解锁' },
    },
    ending_zhuxian_zhanlong: {
        name: '假结局 · 诛仙斩龙', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'ending', sortIndex: 1,
        resId: ResMap.pic_gallery_ending_zhuxian_zhanlong,
        desc: '诛仙斩龙，斩断因果。',
        locked: { desc: '尚未解锁' },
    },
    ending_renjian_zhenghao: {
        name: '梦结局 · 人间正好', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'ending', sortIndex: 2,
        resId: ResMap.pic_gallery_ending_renjian_zhenghao,
        desc: '人间正好，大梦一场。',
        locked: { desc: '尚未解锁' },
    },
    ending_bugai_jiushi: {
        name: '失败结局 1 · 不改旧时', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'ending', sortIndex: 3,
        resId: ResMap.pic_gallery_ending_bugai_jiushi,
        desc: '不改旧时，重蹈覆辙。',
        locked: { desc: '尚未解锁' },
    },
    ending_guimian_taohua: {
        name: '失败结局 2 · 鬼面桃花', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'ending', sortIndex: 4,
        resId: ResMap.pic_gallery_ending_guimian_taohua,
        desc: '鬼面桃花，镜花水月。',
        locked: { desc: '尚未解锁' },
    },
    side_wo_de_laili: {
        name: '番外 1 · "我"的来历', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'side', sortIndex: 5,
        resId: ResMap.pic_gallery_side_wo_de_laili,
        desc: '"我"的来历。',
        locked: { desc: '尚未解锁' },
    },
    side_shengren_wuqing: {
        name: '番外 2 · 圣人无情', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'side', sortIndex: 6,
        resId: ResMap.pic_gallery_side_shengren_wuqing,
        desc: '圣人无情。',
        locked: { desc: '尚未解锁' },
    },
    side_longlei_huahai: {
        name: '番外 3 · 龙泪化海', type: GalleryType.TEXT,
        category: GalleryCategory.STORY, sub: GallerySub.ENDING,
        endingGroup: 'side', sortIndex: 7,
        resId: ResMap.pic_gallery_side_longlei_huahai,
        desc: '龙泪化海。',
        locked: { desc: '尚未解锁' },
    },
};

/**
 * 取某分类下、按子分类分组的条目列表
 * @param {string} category
 * @returns {Object} { subKey: [entryId, ...] } 按 sortIndex 升序
 */
const getGalleryEntriesByCategory = function (category) {
    const result = {};
    const subs = GallerySubOrder[category] || [];
    for (const sub of subs) result[sub] = [];

    for (const entryId in GalleryConfig) {
        const entry = GalleryConfig[entryId];
        if (entry.category !== category) continue;
        if (!result[entry.sub]) result[entry.sub] = [];
        result[entry.sub].push(entryId);
    }

    for (const sub of subs) {
        result[sub].sort((a, b) => GalleryConfig[a].sortIndex - GalleryConfig[b].sortIndex);
    }
    return result;
};

/**
 * 取某子分类下、按世次(world)分组的条目（仅回忆用）
 * @param {Array<string>} entryIds
 * @returns {Object} { worldKey: [entryId, ...] } 已按 sortIndex 排序
 */
const groupGalleryMemoryByWorld = function (entryIds) {
    const result = {};
    for (const entryId of entryIds) {
        const w = GalleryConfig[entryId].world || 'other';
        if (!result[w]) result[w] = [];
        result[w].push(entryId);
    }
    for (const w in result) {
        result[w].sort((a, b) => GalleryConfig[a].sortIndex - GalleryConfig[b].sortIndex);
    }
    return result;
};

/**
 * 取结局条目按 endingGroup 分组
 * @param {Array<string>} entryIds
 * @returns {Object} { 'ending'|'side': [entryId, ...] }
 */
const groupGalleryEndingByGroup = function (entryIds) {
    const result = { ending: [], side: [] };
    for (const entryId of entryIds) {
        const g = GalleryConfig[entryId].endingGroup || 'ending';
        if (!result[g]) result[g] = [];
        result[g].push(entryId);
    }
    return result;
};
