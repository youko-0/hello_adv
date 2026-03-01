// 浏览器UI
console.log('browser_ui.js')
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
    },

    // 系统时间
    formatSystemTimeStr: function () {
        var now = new Date();
        // 修改年份
        now.setFullYear(ForumSystem.NOW_YEAR);
        var year = now.getFullYear();
        // 月份 + 1
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        // 不支持 \n, 用空格填充
        var timePart = `${hours}:${minutes}`;
        var datePart = `${year}/${month}/${day}`;
        var timeStr = `    ${hours}:${minutes} ${year}/${month}/${day}`;
        return timeStr;
    },
};

ac.createStyle({
    name: 'style_status_bar',
    font: '微软雅黑',
    bold: false,
    italic: false,
    fontSize: 10,
    color: '#d1d3df',
});

ac.createStyle({
    name: 'style_alert',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
    color: '#d1d3df',
});

// 创建浏览器 UI
// onClose: 页面关闭回调
async function createBrowserUI(onClose = null) {
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

// 创建系统时间
async function createSystemTime() {
    let timeStr = BrowserUI.formatSystemTimeStr();
    await ac.createText({
        name: 'lbl_system_time',
        index: 10,
        inlayer: 'window',
        content: timeStr,
        pos: {
            x: 300,
            y: 300
        },
        anchor: { x: 100, y: 100 },
        size: {
            width: 500,
            height: 500,
        },
        // style: 'style_status_bar',
        halign: ac.HALIGN_TYPES.right,
        valign: ac.VALIGN_TYPES.bottom,
    });
}


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

// 估算字符宽度
function measureCharWidth(char, fontSize) {
    var code = char.charCodeAt(0);
    // 1. 汉字和全角字符 (Unicode > 255)
    if (code > 255) {
        return fontSize;
    }
    // 2. 空格 (空格通常比普通字母窄)
    if (char === ' ') {
        return fontSize * 0.35;
    }
    // 3. 大写字母 (比小写稍微宽一点，约 0.7)
    if (code >= 65 && code <= 90) {
        return fontSize * 0.7;
    }
    // 4. 其他 ASCII (小写字母、数字、半角标点，约 0.55~0.6)
    return fontSize * 0.58;
    // // code > 255 通常是中日韩文字，算 1 个字宽
    // if (code > 255) {
    //     return fontSize;
    // }
    // // 英文、数字、标点，大约算 0.6 个字宽
    // else {
    //    return (fontSize * 0.6);
    // }
}

// 计算文本宽度
function calcTextWidth(text, fontSize) {
    var width = 0;
    for (var i = 0; i < text.length; i++) {
        width += measureCharWidth(text[i], fontSize);
    }
    return width;
}


// 计算文本高度
function calcTextHeight(content, fontSize = 28, containerWidth = 580) {
    if (!content) return 0;

    const lineHeightMultiplier = 1.5;
    const singleLineHeight = fontSize * lineHeightMultiplier;

    let paragraphs = content.toString().split('\n');
    let totalLines = 0;

    paragraphs.forEach(para => {
        if (para.length === 0) {
            totalLines += 1; // 空行也算一行
            return;
        }

        let currentLineWidth = 0;
        currentLineWidth += calcTextWidth(para, fontSize);

        // 向上取整
        let linesInPara = Math.ceil(currentLineWidth / containerWidth);
        totalLines += Math.max(1, linesInPara);
    });

    // 总行数 * 单行高度
    return totalLines * singleLineHeight;
}