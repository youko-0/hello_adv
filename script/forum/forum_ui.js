// 论坛UI配置
console.log('[LOAD] forum_ui');

var ForumUI = {
    PAGE: {
        width: 1200,
        height: 552,
        BG: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_topic_bg_normal,
        },
    },
    SV: {
        name: 'sv_page',
    },
    HEADER: {
        width: 1200,
        height: 120,
        marginBottom: 10,       // 和下面内容的距离
        BG: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_topic_bg_highlight,
        }
    },
    TOPIC: {
        height: 64,
        BG_NORMAL: {
            resId: ResMap.img_forum_topic_bg_normal,
            width: 32,
            height: 32,
        },
        BG_HIGHLIGHT: {
            resId: ResMap.img_forum_topic_bg_highlight,
            width: 32,
            height: 32,
        },
    },
    POST: {
        PAGE_SIZE: 10,
        TITLE: {
            height: 42,
        },
        REPLY: {
            padding: 20,        // 上下留边
            width: 800,        // 文本宽度
            height: 72,       // 文本最小高度, 2行
            fontSize: 24,
        },
        PAGINATION: {
            height: 40,
        },
    },

    // 话题列表的高度
    calcTopicListHeight: function (topicList) {
        // 每个话题的高度固定
        let totalHeight = this.TOPIC.height * topicList.length;
        return totalHeight;
    },

    // 主页高度
    calcMainPageHeight: function (pageIndex = 0) {
        let topicList = ForumSystem.getTopicListByPageIndex(pageIndex);
        let pageHeight = this.calcTopicListHeight(topicList) + this.HEADER.height + this.HEADER.marginBottom;
        return pageHeight;
    },

    // 回复列表的高度
    calcReplyListHeight: function (replyList) {
        let totalHeight = 0;
        for (let i = 0; i < replyList.length; i++) {
            let reply = replyList[i];
            let contentHeight = calcTextHeight(reply.content, this.POST.REPLY.fontSize, this.POST.REPLY.width);
            console.log('contentHeight', contentHeight, reply.content);
            contentHeight = Math.max(contentHeight, this.POST.REPLY.height);
            contentHeight += this.POST.REPLY.padding * 2;
            // 记录高度
            reply.height = contentHeight;
            totalHeight += contentHeight;
        }
        return totalHeight;
    },

    // 帖子页面的高度
    calcPostPageHeight: function (post, pageIndex = 0) {
        let replyList = ForumSystem.getReplyListByPageIndex(post, pageIndex);
        let contentHeight = this.calcReplyListHeight(replyList);
        contentHeight += this.HEADER.height + this.HEADER.marginBottom;
        contentHeight += this.POST.PAGINATION.height;
        return contentHeight;
    },

    formatRelativeTime: function (timestamp) {
        if (!timestamp) return "";

        // 如果是数字且长度只有 10 位，说明是秒，需要乘 1000
        if (typeof timestamp === 'number' && timestamp.toString().length === 10) {
            timestamp = timestamp * 1000;
        }

        var date = new Date(timestamp);
        var now = new Date();
        // 修改年份
        now.setFullYear(ForumSystem.NOW_YEAR);

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
    if (pageHeight < ForumUI.PAGE.height) {
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
            y: 60,
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
        name: ForumUI.SV.name,
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
        name: 'img_header_bg',
        index: 0,
        inlayer: ForumUI.SV.name,
        resId: ForumUI.HEADER.BG.resId,
        pos: {
            x: ForumUI.PAGE.width / 2,
            y: pageHeight,
        },
        anchor: {
            x: 50,
            y: 100,
        },
        scale: {
            x: ForumUI.HEADER.width * 100 / ForumUI.HEADER.BG.width,
            y: ForumUI.HEADER.height * 100 / ForumUI.HEADER.BG.height,
        },
    });
}
