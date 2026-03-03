// 入口剧情
console.log('[LOAD] map plot_entry');

// @TODO: UI 不能显示在 SysDialog 下面, 可能需要改成在剧情里直接执行 ui_map

/**
 * [资源预加载锚点] @KEEP @PRELOAD
 * 警告：请勿删除此注释块！引擎依靠此处的字符串进行静态资源预加载。
 * uiId: 'j1u5e_wu'
 * uiId: 'ztyhx3u3'
*/

await ac.callUI({
    name: 'callUI_map',
    uiId: ResMap.ui_map
});
