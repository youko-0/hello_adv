// 浏览器UI
console.log('[LOAD] browser_ui');

const BrowserUI = {
    bg: {
        resId: ResMap.pic_browser_bg,
        width: 1280,
        height: 720,
    },
    btnClose: {
        resIdNormal: ResMap.btn_web_close_normal,
        resIdHighlight: ResMap.btn_web_close_highlight,
    },

    // 创建浏览器 UI
    // onClose: 页面关闭回调函数
    createBrowserUI: async function (onClose = null) {
        // 容器
        await ac.createLayer({
            name: 'layer_browser_ui',
            index: 0,
            inlayer: 'window',
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            size: { width: GameConfig.width, height: GameConfig.height },
            clipMode: true,
        });

        // 背景图
        await ac.createImage({
            name: 'img_browser_bg',
            index: 0,
            inlayer: 'layer_browser_ui',
            resId: this.bg.resId,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            scale: {
                x: GameConfig.width * 100 / this.bg.width,
                y: GameConfig.height * 100 / this.bg.height,
            },
        });

        // 标题栏
        await ac.createText({
            name: 'lbl_site_title',
            index: 1,
            inlayer: 'layer_browser_ui',
            content: ForumSystem.getCurrentTitle(),
            pos: { x: 94, y: GameConfig.height - 24 },
            anchor: { x: 0, y: 50 },
            size: { width: 220, height: 26 },
            style: 'style_status_bar',
            halign: ac.HALIGN_TYPES.left,
            valign: ac.VALIGN_TYPES.top,
        });

        // 地址栏
        await ac.createText({
            name: 'lbl_site_url',
            index: 1,
            inlayer: 'layer_browser_ui',
            content: ForumSystem.getCurrentUrl(),
            pos: { x: 200, y: GameConfig.height - 78 },
            anchor: { x: 0, y: 50 },
            size: { width: 480, height: 26 },
            style: 'style_status_bar',
            halign: ac.HALIGN_TYPES.left,
            valign: ac.VALIGN_TYPES.top,
        });

        // 关闭按钮
        await ac.createOption({
            name: 'btn_close_browser',
            index: 5,
            inlayer: 'layer_browser_ui',
            nResId: this.btnClose.resIdNormal,
            sResId: this.btnClose.resIdHighlight,
            content: ``,
            pos: { x: GameConfig.width, y: GameConfig.height },
            anchor: { x: 100, y: 100 },
            onTouchEnded: onClose,
        });
    },

    // 创建系统时间
    createSystemTime: async function () {
        let timeStr = Utils.formatSystemTimeStr(ForumSystem.NOW_YEAR);
        await ac.createText({
            name: 'lbl_system_time',
            index: 10,
            inlayer: 'window',
            content: timeStr,
            pos: { x: GameConfig.width - 20, y: 12 },
            anchor: { x: 100, y: 0 },
            size: { width: 120, height: 64 },
            style: 'style_system_time',
            halign: ac.HALIGN_TYPES.right,
            valign: ac.VALIGN_TYPES.bottom,
        });
    },

    // 创建系统时间循环
    createSystemTimeLoop: async function () {
        // 先执行一次
        await this.createSystemTime();
        // 计算距离下一分钟还差多少毫秒
        let now = new Date();
        let delayMs = (60 - now.getSeconds()) * 1000;
        // 至少等待 1 秒，防止计算出 0 导致死循环
        delayMs = Math.max(1000, delayMs);
        // 等待直到下一分钟
        await ac.delay({
            time: delayMs
        });
        await this.createSystemTimeLoop();
    },

};

ac.createStyle({
    name: 'style_status_bar',
    font: '微软雅黑',
    bold: false,
    italic: false,
    fontSize: 18,
    color: '#fefefe',
});

ac.createStyle({
    name: 'style_system_time',
    font: '微软雅黑',
    bold: false,
    italic: false,
    fontSize: 14,
    color: '#fdf4f4',
});

ac.createStyle({
    name: 'style_alert',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
    color: '#d1d3df',
});
