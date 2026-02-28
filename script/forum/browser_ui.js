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
async function createBrowserUI(onClose = null) {
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
        name: 'layer_browser_ui',
        index: 0,
        inlayer: 'window',
        visible: true,
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
        inlayer: 'layer_browser_ui',
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
        inlayer: 'layer_browser_ui',
        visible: true,
        content: ForumSystem.getCurrentTitle(),
        pos: {
            x: 48,
            y: BrowserUI.WINDOW.height - 13,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 110,
            height: 10,
        },
        style: 'style_status_bar',
    });

    // 地址栏
    await ac.createText({
        name: 'lbl_site_url',
        index: 1,
        inlayer: 'layer_browser_ui',
        visible: true,
        content: ForumSystem.getCurrentUrl(),
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
        inlayer: 'layer_browser_ui',
        visible: true,
        nResId: BrowserUI.BTN.CLOSE.resIdNormal,
        sResId: BrowserUI.BTN.CLOSE.resIdHighlight,
        content: ``,
        pos: {
            x: BrowserUI.WINDOW.width,
            y: BrowserUI.WINDOW.height,
        },
        anchor: {
            x: 100,
            y: 100,
        },
        onTouchEnded: onClose,
    });
}

ac.createStyle({
    name: 'style_alert',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
    color: '#d1d3df',
});


async function showGameAlert(content, onConfirm = null) {

    async function closeAlert() {
        ac.remove({
            name: 'layer_alert',
            effect: 'normal',
            duration: 0,
            canskip: false,
        });

        // 如果传了回调函数，就执行它
        if (onConfirm) await onConfirm();
    }

    // 容器
    await ac.createLayer({
        name: 'layer_alert',
        index: 500,     // 置顶
        inlayer: 'window',
        visible: true,
        pos: {
            x: BrowserUI.WINDOW.width / 2,
            y: BrowserUI.WINDOW.height / 2,
        },
        anchor: {
            x: 50,
            y: 50,
        },
        size: {
            width: 400,
            height: 360,
        },
        clipMode: true,
    });

    await ac.createImage({
        name: "img_alert_bg",
        inlayer: "layer_alert",
        resId: '$183071397',
        visible: true,
        pos: { x: 200, y: 180 },
        anchor: { x: 50, y: 50 },
        scale: { x: 2000, y: 1600 },
        opacity: 180,

    });

    await ac.createText({
        name: "alert_content",
        inlayer: "layer_alert",
        content: content,
        pos: {
            x: 200,
            y: 200,
        },
        anchor: { x: 50, y: 50 },
        size: { width: 400, height: 360 },
        style: "style_alert",
        halign: ac.HALIGN_TYPES.middle,
    });

    await ac.createText({
        name: "alert_confirm_btn",
        inlayer: "layer_alert",
        content: "确定",
        pos: {
            x: 200,
            y: 100,
        },
        anchor: { x: 50, y: 50 },
        size: { width: 100, height: 60 },
        style: "style_alert",
        halign: ac.HALIGN_TYPES.middle,
    });

    // 确定按钮
    ac.addEventListener({
        type: ac.EVENT_TYPES.onTouchEnded,
        listener: closeAlert,
        target: "alert_confirm_btn",
    });
}