// 电脑桌面
console.log('[LOAD] ui_desktop');

await ac.createLayer({
    name: 'layer_desktop',
    index: 1,
    inlayer: 'window',
    pos: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    size: { width: GameConfig.width, height: GameConfig.height },
    clipMode: true,
});

await ac.createImage({
    name: 'img_desktop',
    index: 0,
    inlayer: 'layer_desktop',
    resId: ResMap.pic_desktop_bg,
    pos: { x: GameConfig.centerX, y: GameConfig.centerY },
    anchor: { x: 50, y: 50 },
});

async function func_open_forum() {
    await ac.replaceUI({
        name: 'replaceUI_main_page',
        uiId: ResMap.ui_main_page
    });
}

await ac.createOption({
    name: 'btn_browser',
    index: 1,
    inlayer: 'layer_desktop',
    nResId: ResMap.btn_browser,
    sResId: ResMap.btn_browser,
    content: ``,
    pos: { x: 96, y: 640 },
    anchor: { x: 50, y: 50 },
    onTouchEnded: func_open_forum,
});

await BrowserUI.createSystemTimeLoop();
