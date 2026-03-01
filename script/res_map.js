// 资源常量
console.log('[LOAD] res_map');

let RES_FLAG_DONHAI = 0;        // 用来切换资源

let ResMap = {};

if (RES_FLAG_DONHAI == 1) {
    // for DongHai
    ResMap = {
        btn_browser: '$183358123',
        pic_desktop_bg: '$183358116',

        pic_browser_bg: '$183358115',
        btn_web_close_normal: '$183358117',
        btn_web_close_highlight: '$183358118',

        img_forum_topic_bg_normal: '$183358122',
        img_forum_topic_bg_highlight: '$183358121',

        img_forum_head_01: '$183358120',
        img_forum_head_02: '$183358119',

        // UI 唯一 ID, 需要搜索 @KEEP @PRELOAD 在入口 UI 配置预加载
        ui_desktop: '01ec9a548af54c2a86d86bd299d14003',
        ui_main_page: 'dacbc56e73a94b3daa268f1a0616d8e2',
        ui_post_detail: '1af34c5623d74b82aa12ff9259621b91',
    }
}
else {
    // for HelloADV
    ResMap = {
        btn_browser: '$182972526',
        pic_desktop_bg: '$182982547',

        pic_browser_bg: '$182983354',
        btn_web_close_normal: '$183130998',
        btn_web_close_highlight: '$183130996',

        img_forum_topic_bg_normal: '$183003987',
        img_forum_topic_bg_highlight: '$183071397',

        img_forum_head_01: '$183114062',
        img_forum_head_02: '$183113921',

        // UI 唯一 ID, 需要搜索 @KEEP @PRELOAD 在入口 UI 配置预加载
        ui_desktop: 'cawn43cd',
        ui_main_page: 'nw48gnat',
        ui_post_detail: 'dbjp9oun',
    }
}
