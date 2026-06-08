// 全局字体样式集中注册
// 所有通过 ac.createStyle 动态创建的样式均在此文件统一定义
// 命名规则：style_<模块>_<用途>
console.log('[LOAD] styles');

// ── Common UI ─────────────────────────────────────────────────────
ac.createStyle({
    name: 'style_common_alert',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#d1d3df',
});

ac.createStyle({
    name: 'style_common_dialog',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#d1d3df',
});

ac.createStyle({
    name: 'style_common_dialog_disabled',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#63656d',
});

ac.createStyle({
    name: 'style_common_item_info',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#d1d3df',
    speed: 9,
});

// ── Bag UI ────────────────────────────────────────────────────────
ac.createStyle({
    name: 'style_bag_item',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 20, color: '#d1d3df',
});

ac.createStyle({
    name: 'style_bag_detail',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#d1d3df',
});

// ── Browser UI ────────────────────────────────────────────────────
ac.createStyle({
    name: 'style_browser_status_bar',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 18, color: '#fefefe',
});

ac.createStyle({
    name: 'style_browser_system_time',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 14, color: '#fdf4f4',
});

// ── Forum UI ──────────────────────────────────────────────────────
ac.createStyle({
    name: 'style_forum_topic',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#d1d3df',
});

ac.createStyle({
    name: 'style_forum_topic_read',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#b33411',
});

ac.createStyle({
    name: 'style_forum_author',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 18, color: '#cbd6dc',
});

ac.createStyle({
    name: 'style_forum_time',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 18, color: '#c6cbce',
});

// ── Post Detail UI ────────────────────────────────────────────────
ac.createStyle({
    name: 'style_post_title',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 28, color: '#cbd6dc',
});

ac.createStyle({
    name: 'style_post_content',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#d1d3df',
});

ac.createStyle({
    name: 'style_post_author',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 20, color: '#cbd6dc',
});

ac.createStyle({
    name: 'style_post_time',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 18, color: '#c6cbce',
});

ac.createStyle({
    name: 'style_post_pagination',
    font: '思源宋体',
    bold: true, italic: false,
    fontSize: 20, color: '#cbd6dc',
});

ac.createStyle({
    name: 'style_post_pagination_active',
    font: '思源宋体',
    bold: true, italic: false,
    fontSize: 22, color: '#b33411',
});

// ── Divine UI ─────────────────────────────────────────────────────
ac.createStyle({
    name: 'style_divine_yao_label',
    font: '汉仪小隶书简',
    bold: false, italic: false,
    fontSize: 30, color: '#efefe3',
});

ac.createStyle({
    name: 'style_divine_hex_name',
    font: '汉仪小隶书简',
    bold: true, italic: false,
    fontSize: 48, color: '#f5e6a3',
});

ac.createStyle({
    name: 'style_divine_judgment',
    font: '民国行楷超大字库',
    bold: false, italic: false,
    fontSize: 30, color: '#efefe3',
});

ac.createStyle({
    name: 'style_divine_yao_text',
    font: '方正书宋',
    bold: true, italic: false,
    fontSize: 30, color: '#efefe3',
});
