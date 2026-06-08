// 入口剧情
console.log('[LOAD] plot_entry');

// ==========================================
// [资源预加载锚点] @KEEP @PRELOAD
// 警告：请勿删除此注释块！引擎依靠此处的字符串进行静态资源预加载。
// uiId: 'cawn43cd'
// uiId: '5a63b4fc0a7041f38685971fcecfd962'
// ==========================================

await ac.callUI({
  name: 'callUI_desktop',
  uiId: ResMap.ui_desktop
});