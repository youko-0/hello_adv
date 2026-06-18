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
    fontSize: 24, color: '#ebebf0',
});

ac.createStyle({
    name: 'style_common_dialog_red',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#bd1725',
});

ac.createStyle({
    name: 'style_common_option',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 24, color: '#ebebf0',
});

ac.createStyle({
    name: 'style_common_option_disabled',
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
    name: 'style_bag_item_count',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 20, color: '#000000',   // 道具数量徽标
});

ac.createStyle({
    name: 'style_bag_detail_name',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 26, color: '#ebebf0',
});

ac.createStyle({
    name: 'style_bag_detail_desc',
    font: '思源宋体',
    bold: false, italic: false,
    fontSize: 22, color: '#b1b1ba',
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
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 24, color: '#c5c5c5',   // 未读帖子标题（默认灰色）
});

ac.createStyle({
    name: 'style_forum_topic_read',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 24, color: '#d4935a',   // 已读帖子标题（橙色高亮）
});

ac.createStyle({
    name: 'style_forum_author',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 18, color: '#999999',   // 作者名
});

ac.createStyle({
    name: 'style_forum_time',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 18, color: '#666666',   // 时间副文字
});

// ── Post Detail UI ────────────────────────────────────────────────
ac.createStyle({
    name: 'style_post_title',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 28, color: '#d0d0d0',   // 帖子详情标题
});

ac.createStyle({
    name: 'style_post_content',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 24, color: '#c8c8c8',   // 回复正文
});

ac.createStyle({
    name: 'style_post_author',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 18, color: '#aaaaaa',   // 回复区用户名
});

ac.createStyle({
    name: 'style_post_time',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 18, color: '#666666',   // 楼层 / 时间
});

ac.createStyle({
    name: 'style_post_pagination',
    font: '微软雅黑',
    bold: true, italic: false,
    fontSize: 20, color: '#aaaaaa',   // 分页按钮普通态
});

ac.createStyle({
    name: 'style_post_pagination_active',
    font: '微软雅黑',
    bold: true, italic: false,
    fontSize: 20, color: '#1a1a1a',   // 分页按钮当前页（深色字配橙底）
});

ac.createStyle({
    name: 'style_post_tag',
    font: '微软雅黑',
    bold: false, italic: false,
    fontSize: 18, color: '#d4935a',   // 身份标识 [楼主] / [管理员]
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
