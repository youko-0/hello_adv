// 资源映射
console.log('[LOAD] res_map');

let RES_FLAG = 0;        // 用来切换资源

const HelloADVRes = {
    // 通用
    img_mask_black: '$183470049',
    img_mask_round: '$183502801',
    img_dialog_bg_01: '$183945897',
    btn_common_close_normal: '$183658478',
    btn_common_close_highlight: '$183658477',
    pic_common_bg_01: '$183658447',
    pic_common_bg_02: '$183658448',
    pic_common_bg_03: '$183773264',

    // 论坛
    img_forum_topic_bg_normal: '$183003987',
    img_forum_topic_bg_highlight: '$183071397',
    btn_web_close_normal: '$183130998',
    btn_web_close_highlight: '$183130996',
    pic_desktop_bg: '$182982547',
    pic_browser_bg: '$182983354',
    btn_browser: '$182972526',

    // UI - 背包
    img_bag_title: '$183658488',
    img_bag_item_normal: '$183658487',
    img_bag_item_highlight: '$183658486',
    img_bag_item_count: '$183688524',
    img_bag_detail_title: '$183685868',
    img_bag_detail_bg: '$183685565',
    btn_item_view_normal: '$183658485',
    btn_item_view_highlight: '$183658484',
    btn_item_use_normal: '$183658483',
    btn_item_use_highlight: '$183658482',

    // 地图
    pic_map_bg: '$183497324',
    pic_mask_area_0: '$183505919',
    pic_mask_area_1: '$183505299',
    pic_mask_area_2: '$183505300',
    pic_mask_area_3: '$183505301',
    pic_mask_area_4: '$183505302',
    pic_mask_area_5: '$183505303',
    img_area_1: '$183498637',
    img_area_1_locked: '$183562482',
    img_area_2: '$183498689',
    img_area_2_locked: '$183562466',
    img_area_3: '$183498733',
    img_area_3_locked: '$183562465',
    img_area_4: '$183498891',
    img_area_4_locked: '$183562464',
    img_area_5: '$183498968',
    img_area_5_locked: '$183562355',

    // 探索
    btn_explore_view_normal: '$183658418',
    btn_explore_view_highlight: '$183658417',
    btn_explore_arrow_up: '$183924706',
    btn_explore_arrow_down: '$183924701',
    btn_explore_arrow_left: '$183924704',
    btn_explore_arrow_right: '$183924705',
    pic_old_residence_living_room: '$183954557',
    pic_nezha_temple_main_hall: '$183918196',
    pic_nezha_temple_left_hall: '$183918197',
    pic_nezha_temple_back_hall: '$183918195',
    pic_nezha_temple_right_hall: '$183918198',
    pic_broken_nezha_temple_main_hall: '$183954556',

    // 头像
    icon_forum_head_01: '$183114062',
    icon_forum_head_02: '$183113921',
    // 物品图标
    icon_item_pendant: '$183687836',
    icon_item_armor: '$183720439',
    icon_item_compass: '$183720476',
    icon_item_blessing: '$183720595',
    icon_item_visa: '$183720793',
    // 场景对象
    spr_item_family_photo: '$183946183',
    spr_item_motorcycle_key: '$183946184',
    spr_item_cookie_box: '$183946182',
    spr_item_mural_nezhanaohai: '$183946187',
    spr_item_mural_ziwenguitian: '$183946188',
    spr_item_mural_lianhuatuosheng: '$183946185',
    spr_item_mural_jianzaoshenmiao: '$183946186',
    spr_item_mural_zhuzaosuxiang: '$183946189',
    spr_item_mural_lijingsb: '$183946190',
    // 详情大图
    img_item_pendent: '$183720948',
    img_item_armor: '$183720970',
    img_item_compass: '$183721506',
    img_item_blessing: '$183721672',
    img_item_visa: '$183722014',
    img_item_family_photo: '$183918600',
    img_item_motorcycle_key: '$183918601',
    img_item_cookie_box: '$183918599',
    img_item_mural_nezhanaohai: '$183918603',
    img_item_mural_ziwenguitian: '$183918604',
    img_item_mural_lianhuatuosheng: '$183918602',
    img_item_mural_jianzaoshenmiao: '$183918605',
    img_item_mural_zhuzaosuxiang: '$183918606',
    img_item_mural_lijingsb: '$183918607',

    // UI 唯一 ID, 需要搜索 @KEEP @PRELOAD 在入口 UI 配置预加载
    ui_desktop: 'cawn43cd',
    ui_forum: 'nw48gnat',
    ui_post_detail: 'dbjp9oun',
    ui_map: 'j1u5e_wu',
    ui_bag: 'h_83r63s',

    // 剧情唯一 ID
    plot_forum_next: 13977507,
    plot_map: 13977507,
    plot_area_1: 13980816,
    plot_area_2: 13980816,
    plot_area_3: 13980816,
    plot_area_4: 13980816,
    plot_area_5: 13980816,
    plot_map_next: 13946330,
}

const DongHaiRes = {
    pic_browser_bg: '$183358115',
    pic_desktop_bg: '$183358116',
    pic_map_bg: '$183518317',
    pic_mask_area_0: '$183518318',
    pic_mask_area_1: '$183518319',
    pic_mask_area_2: '$183518320',
    pic_mask_area_3: '$183518321',
    pic_mask_area_4: '$183518322',
    pic_mask_area_5: '$183518323',

    btn_browser: '$183358123',
    btn_web_close_normal: '$183358117',
    btn_web_close_highlight: '$183358118',

    img_mask_black: '$183518332',
    img_mask_round: '$183518330',
    img_forum_topic_bg_normal: '$183358122',
    img_forum_topic_bg_highlight: '$183358121',
    icon_forum_head_01: '$183358120',
    icon_forum_head_02: '$183358119',
    img_area_1: '$183518325',
    img_area_2: '$183518326',
    img_area_3: '$183518327',
    img_area_4: '$183518328',
    img_area_5: '$183518329',

    // UI 唯一 ID, 需要搜索 @KEEP @PRELOAD 在入口 UI 配置预加载
    ui_desktop: '01ec9a548af54c2a86d86bd299d14003',
    ui_forum: 'dacbc56e73a94b3daa268f1a0616d8e2',
    ui_post_detail: '1af34c5623d74b82aa12ff9259621b91',
    ui_map: 'ztyhx3u3',

    // 剧情唯一 ID
    plot_forum_next: 13977507,
    plot_map: 13980661,
    plot_area_1: 13969535,
    plot_area_2: 13974014,
    plot_area_3: 13974015,
    plot_area_4: 13974016,
    plot_area_5: 13974017,
    plot_map_next: 13970354,
};

const ResMap = (RES_FLAG == 0) ? HelloADVRes : DongHaiRes;
