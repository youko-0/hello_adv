// 剧情收集解锁（对应 res/收集系统.txt）
console.log('[LOAD] plot_collect');

const PlotCollect = {
    // ════════ 鉴赏 - CG ════════
    cg_lingzhu_yu_long_1:  () => GallerySystem.unlock('cg_lingzhu_yu_long_1'),   // 灵珠与龙 1
    cg_zhaoyun_musan_1:    () => GallerySystem.unlock('cg_zhaoyun_musan_1'),     // 朝云暮散 1
    cg_yunbing_chujian_1:  () => GallerySystem.unlock('cg_yunbing_chujian_1'),   // 云冰初见 1
    cg_yunbing_chujian_2:  () => GallerySystem.unlock('cg_yunbing_chujian_2'),   // 云冰初见 2
    cg_aobing_zijin_1:     () => GallerySystem.unlock('cg_aobing_zijin_1'),      // 敖丙自尽 1
    cg_aobing_zijin_2:     () => GallerySystem.unlock('cg_aobing_zijin_2'),      // 敖丙自尽 2
    cg_aobing_zijin_3:     () => GallerySystem.unlock('cg_aobing_zijin_3'),      // 敖丙自尽 3

    // ════════ 鉴赏 - 特殊场景 ════════
    scene_nezha_temple:        () => GallerySystem.unlock('scene_nezha_temple'),        // 哪吒庙
    scene_nezha_temple_dark:   () => GallerySystem.unlock('scene_nezha_temple_dark'),   // 黑哪吒庙
    scene_dragon_temple:       () => GallerySystem.unlock('scene_dragon_temple'),       // 龙王庙
    scene_dragon_palace:       () => GallerySystem.unlock('scene_dragon_palace'),       // 龙王行宫

    // ════════ 人物 - 立绘 ════════
    portrait_lingzhuzi:    () => GallerySystem.unlock('portrait_lingzhuzi'),    // 灵珠子
    portrait_xiaolongshen: () => GallerySystem.unlock('portrait_xiaolongshen'), // 小龙神
    portrait_liyunxiang:   () => GallerySystem.unlock('portrait_liyunxiang'),   // 李云祥
    portrait_aobing:       () => GallerySystem.unlock('portrait_aobing'),       // 敖丙

    // ════════ 人物 - 头像 ════════
    avatar_shaonian_kasha:     () => GallerySystem.unlock('avatar_shaonian_kasha'),     // 少年喀莎
    avatar_kasha:              () => GallerySystem.unlock('avatar_kasha'),              // 喀莎
    avatar_qingnian_lijinxiang:() => GallerySystem.unlock('avatar_qingnian_lijinxiang'),// 青年李金祥
    avatar_lijinxiang:         () => GallerySystem.unlock('avatar_lijinxiang'),         // 李金祥
    avatar_laoli:              () => GallerySystem.unlock('avatar_laoli'),              // 老李
    avatar_aoguang:            () => GallerySystem.unlock('avatar_aoguang'),            // 敖广
    avatar_ligen:              () => GallerySystem.unlock('avatar_ligen'),              // 李艮
    avatar_yunv:               () => GallerySystem.unlock('avatar_yunv'),               // 鱼女
    avatar_mianjuren:          () => GallerySystem.unlock('avatar_mianjuren'),          // 面具人
    avatar_aolie:              () => GallerySystem.unlock('avatar_aolie'),              // 敖烈
    avatar_diyong_furen:       () => GallerySystem.unlock('avatar_diyong_furen'),       // 地涌夫人
    avatar_xiaolong:           () => GallerySystem.unlock('avatar_xiaolong'),           // 小龙

    // ════════ 剧情 - 回忆 ════════
    // 第一世
    memory_lingzhu_yu_long: () => GallerySystem.unlock('memory_lingzhu_yu_long'), // 灵珠与龙
    memory_zhaoyun_musan:   () => GallerySystem.unlock('memory_zhaoyun_musan'),   // 朝云暮散
    // 第二世
    memory_nezha_naohai:    () => GallerySystem.unlock('memory_nezha_naohai'),    // 哪吒闹海
    // 第三世
    memory_longshen_quqin:  () => GallerySystem.unlock('memory_longshen_quqin'),  // 龙神娶亲
    memory_yunbing_chujian: () => GallerySystem.unlock('memory_yunbing_chujian'), // 云冰初见
    memory_three_dates:     () => GallerySystem.unlock('memory_three_dates'),     // 三个约会
    memory_lijing_tanhua:   () => GallerySystem.unlock('memory_lijing_tanhua'),   // 李靖谈话
    memory_aolie_laifang:   () => GallerySystem.unlock('memory_aolie_laifang'),   // 敖烈来访
    memory_longzhu_beihui:  () => GallerySystem.unlock('memory_longzhu_beihui'),  // 龙珠被毁
    memory_aobing_zijin:    () => GallerySystem.unlock('memory_aobing_zijin'),    // 敖丙自尽

    // ════════ 剧情 - 结局 ════════
    ending_true:  () => GallerySystem.unlock('ending_true'),  // 真结局 · 一念成魔
    ending_fake:  () => GallerySystem.unlock('ending_fake'),  // 假结局 · 诛仙斩龙
    ending_dream: () => GallerySystem.unlock('ending_dream'), // 梦结局 · 人间正好
    ending_fail1: () => GallerySystem.unlock('ending_fail1'), // 失败结局 1 · 不改旧时
    ending_fail2: () => GallerySystem.unlock('ending_fail2'), // 失败结局 2 · 鬼面桃花

    // ════════ 剧情 - 番外 ════════
    side1: () => GallerySystem.unlock('side1'), // 番外 1 · "我"的来历
    side2: () => GallerySystem.unlock('side2'), // 番外 2 · 圣人无情
    side3: () => GallerySystem.unlock('side3'), // 番外 3 · 龙泪化海
};
