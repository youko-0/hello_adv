// 浏览器UI

var BrowserUI = {
    WINDOW: {
        width: 1280,
        height: 720,
    },
    BG: {
        resId: '$182983354',
        width: 1280,
        height: 720,
    },
    BTN: {
        CLOSE: {
            resIdNormal: '$183130998',
            resIdHighlight: '$183130996',
            width: 30,
            height: 26,
        },
    }

};

// 创建浏览器 UI
// onClose: 页面关闭回调
async function createBrowserUI(onClose=null) {
    ac.createStyle({
        name: 'style_status_bar',
        font: '微软雅黑',
        bold: false,
        italic: false,
        fontSize: 10,
        color: '#d1d3df',
    });

    // 容器
    await ac.createLayer({
        name: 'layer_browser',
        index: 1,
        inlayer: 'window',
        visible: true,
        // 左右居中底对齐
        pos: {
            x: BrowserUI.WINDOW.width / 2,
            y: BrowserUI.WINDOW.height / 2,
        },
        anchor: {
            x: 50,
            y: 50,
        },
        size: {
            width: BrowserUI.WINDOW.width,
            height: BrowserUI.WINDOW.height,
        },
        clipMode: true,
    });

    // 背景图
    await ac.createImage({
        name: 'img_browser_bg',
        index: 0,
        inlayer: 'layer_browser',
        resId: BrowserUI.BG.resId,
        pos: {
            x: BrowserUI.WINDOW.width / 2,
            y: BrowserUI.WINDOW.height / 2,
        },
        anchor: {
            x: 50,
            y: 50,
        },
        scale: {
            x: BrowserUI.WINDOW.width * 100 / BrowserUI.BG.width,
            y: BrowserUI.WINDOW.height * 100 / BrowserUI.BG.height,
        },
    });

    // 标题栏
    await ac.createText({
        name: 'lbl_site_title',
        index: 1,
        inlayer: 'layer_browser',
        visible: true,
        content: ForumSystem.getSiteTitle(),
        pos: {
            x: 48,
            y: BrowserUI.WINDOW.height - 13,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 100,
            height: 10,
        },
        style: 'style_status_bar',
    });

    // 地址栏
    await ac.createText({
        name: 'lbl_site_url',
        index: 1,
        inlayer: 'layer_browser',
        visible: true,
        content: ForumSystem.getSiteUrl(),
        pos: {
            x: 98,
            y: BrowserUI.WINDOW.height - 40,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 400,
            height: 12,
        },
        style: 'style_status_bar',
    });

    // 关闭按钮
    await ac.createOption({
        name: 'btn_close_browser',
        index: 5,
        inlayer: 'layer_browser',
        visible: true,
        nResId: BrowserUI.BTN.CLOSE.resIdNormal,
        sResId: BrowserUI.BTN.CLOSE.resIdHighlight,
        content: ``,
        pos: {
            x: browserWidth,
            y: browserHeight,
        },
        anchor: {
            x: 100,
            y: 100,
        },
        onTouchEnded: onClose,
    });
}
