// 论坛UI

var ForumUI = {
    PAGE: {
        width: 1200,
        height: 636,
        BG: {
            width: 32,
            height: 32,
            resId: '$183071397',
        },
    },
    HEAD: {
        width: 1200,
        height: 60,
        BG: {
            width: 32,
            height: 32,
            resId: '$183003987',
        }
    },

    TOPIC: {
        height: 64,
        BG_NORMAL: {
            resId: '$183003987',
            width: 32,
            height: 32,
        },
        BG_HIGHLIGHT: {
            resId: '$183071397',
            width: 32,
            height: 32,
        },
    },
    BTN: {

    },

    AVATAR: {
        ICON_01: '$183113921',
        ICON_02: '$183114062',
        ICON_03: '$183113921',
        ICON_04: '$183114062',
    },

    formatRelativeTime: function (timestamp) {
        if (!timestamp) return "";

        // 如果是数字且长度只有 10 位，说明是秒，需要乘 1000
        if (typeof timestamp === 'number' && timestamp.toString().length === 10) {
            timestamp = timestamp * 1000;
        }

        var date = new Date(timestamp);
        // TODO: now 可以指定时间戳, 注意要转成毫秒
        var now = new Date();

        var diff = now.getTime() - date.getTime();

        function pad(n) { return n < 10 ? '0' + n : n; }
        var timeStr = pad(date.getHours()) + ":" + pad(date.getMinutes());

        // 1小时内
        if (diff >= 0 && diff < 3600000) {
            // 如果是刚刚（1分钟内），显示“刚刚”
            if (diff < 60000) return "刚刚";
            return Math.floor(diff / 60000) + "分钟前";
        }

        // 今天
        if (date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()) {
            return "今天 " + timeStr;
        }

        // 昨天
        var yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.getFullYear() === yesterday.getFullYear() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getDate() === yesterday.getDate()) {
            return "昨天 " + timeStr;
        }

        // 今年
        if (date.getFullYear() === now.getFullYear()) {
            return pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + timeStr;
        }

        // 跨年
        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
    },
}

// 论坛框架 UI
// pageHeight: 页面高度, 带版头
async function createForumUI(pageHeight = 0) {
    // 总高度不能小于页面高度
    if(pageHeight < ForumUI.PAGE.height) {
        pageHeight = ForumUI.PAGE.height;
    }
    // 容器
    await ac.createLayer({
        name: 'layer_forum_ui',
        index: 1,
        inlayer: 'window',
        visible: true,
        // 左右居中底对齐
        pos: {
            x: BrowserUI.WINDOW.width / 2,
            y: 30,
        },
        anchor: {
            x: 50,
            y: 0,
        },
        size: {
            width: ForumUI.PAGE.width,
            height: ForumUI.PAGE.height,
        },
        clipMode: true,
    });

    // 背景
    await ac.createImage({
        name: 'img_page_bg',
        index: 0,
        inlayer: 'layer_forum_ui',
        resId: ForumUI.PAGE.BG.resId,
        pos: {
            x: 0,
            y: 0,
        },
        anchor: {
            x: 0,
            y: 0,
        },
        scale: {
            x: ForumUI.PAGE.width * 100 / ForumUI.PAGE.BG.width,
            y: ForumUI.PAGE.height * 100 / ForumUI.PAGE.BG.height,
        }
    });

    // 滚动层
    await ac.createScrollView({
        name: 'sv_page',
        index: 1,
        inlayer: 'layer_forum_ui',
        visible: true,
        pos: {
            x: 0,
            y: 0,
        },
        anchor: {
            x: 0,
            y: 0,
        },
        size: {
            width: ForumUI.PAGE.width,
            height: ForumUI.PAGE.height,
        },
        innerSize: {
            width: ForumUI.PAGE.width,
            height: pageHeight,
        },
        horizontalScroll: false,
        verticalScroll: true,
    });

    // 版头
    await ac.createImage({
        name: 'img_page_head_bg',
        index: 0,
        inlayer: 'sv_page',
        resId: ForumUI.HEAD.BG.resId,
        pos: {
            x: ForumUI.PAGE.width / 2,
            y: pageHeight,
        },
        anchor: {
            x: 50,
            y: 100,
        },
        scale: {
            x: ForumUI.HEAD.width * 100 / ForumUI.HEAD.BG.width,
            y: ForumUI.HEAD.height * 100 / ForumUI.HEAD.BG.height,
        },
    });

}