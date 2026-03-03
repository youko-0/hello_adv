// 资源映射
console.log('[LOAD] res_map');

let RES_FLAG = 0;        // 用来切换资源

const HelloADVRes = {
    pic_browser_bg: '$182983354',
    pic_desktop_bg: '$182982547',
    pic_map_bg: '$183497324',
    pic_mask_area_0: '$183505919',
    pic_mask_area_1: '$183505299',
    pic_mask_area_2: '$183505300',
    pic_mask_area_3: '$183505301',
    pic_mask_area_4: '$183505302',
    pic_mask_area_5: '$183505303',

    btn_browser: '$182972526',
    btn_web_close_normal: '$183130998',
    btn_web_close_highlight: '$183130996',

    img_mask_black: '$183470049',
    img_mask_round: '$183502801',
    img_forum_topic_bg_normal: '$183003987',
    img_forum_topic_bg_highlight: '$183071397',
    img_forum_head_01: '$183114062',
    img_forum_head_02: '$183113921',
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

    // UI 唯一 ID, 需要搜索 @KEEP @PRELOAD 在入口 UI 配置预加载
    ui_desktop: 'cawn43cd',
    ui_main_page: 'nw48gnat',
    ui_post_detail: 'dbjp9oun',
    ui_map: 'j1u5e_wu',

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
    img_forum_head_01: '$183358120',
    img_forum_head_02: '$183358119',
    img_area_1: '$183518325',
    img_area_2: '$183518326',
    img_area_3: '$183518327',
    img_area_4: '$183518328',
    img_area_5: '$183518329',

    // UI 唯一 ID, 需要搜索 @KEEP @PRELOAD 在入口 UI 配置预加载
    ui_desktop: '01ec9a548af54c2a86d86bd299d14003',
    ui_main_page: 'dacbc56e73a94b3daa268f1a0616d8e2',
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
