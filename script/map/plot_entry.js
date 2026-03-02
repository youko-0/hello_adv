// 入口剧情
console.log('[LOAD] map plot_entry');

// ==========================================
// [资源预加载锚点] @KEEP @PRELOAD
// 警告：请勿删除此注释块！引擎依靠此处的字符串进行静态资源预加载。
// uiId: '2ea57tk1'
// uiId: 'j1u5e_wu'
// uiId: 'd1l5qa83'
// uiId: 'ztyhx3u3'

// ==========================================

await ac.callUI({
    name: 'callUI_map',
    uiId: ResMap.ui_map
});
