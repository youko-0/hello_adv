// 入口剧情
console.log('[LOAD] plot_entry');

// ==========================================
// [资源预加载锚点] @KEEP @PRELOAD
// 警告：请勿删除此注释块！引擎依靠此处的字符串进行静态资源预加载。
// uiId: 'cawn43cd'
// uiId: 'nw48gnat'
// uiId: 'dbjp9oun'
// uiId: '01ec9a548af54c2a86d86bd299d14003'
// uiId: 'dacbc56e73a94b3daa268f1a0616d8e2'
// uiId: '1af34c5623d74b82aa12ff9259621b91'
// ==========================================

await ac.callUI({
  name: 'callUI_desktop',
  uiId: ResMap.ui_desktop
});
