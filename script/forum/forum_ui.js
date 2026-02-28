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
    SV: {
        name: 'sv_page',
    },
    HEAD: {
        width: 1200,
        height: 120,
        marginBottom: 10,       // 和下面内容的距离
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
    POST: {
        PAGE_SIZE: 10,
        TITLE: {
            height: 40,
            BG: {
                resId: '$183071397',
                width: 32,
                height: 32,
            },

        },
        REPLY: {
            padding: 20,
            width: 800,        // 文本宽度
            height : 100,       // 文本最小高度
            fontSize: 24,
        },
    },


    AVATAR: {
        ICON_01: '$183113921',
        ICON_02: '$183114062',
        ICON_03: '$183113921',
        ICON_04: '$183114062',
    },

    // 计算文本高度
    calcTextHeight: function (content, fontSize = 28, containerWidth = 580) {
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

            // 遍历每个字符计算虚拟像素宽度
            for (let i = 0; i < para.length; i++) {
                let charCode = para.charCodeAt(i);

                // charCode > 255 通常是中日韩文字，算 1 个字宽
                if (charCode > 255) {
                    currentLineWidth += fontSize;
                }
                // 英文、数字、标点，大约算 0.6 个字宽
                else {
                    currentLineWidth += (fontSize * 0.6);
                }
            }

            // 向上取整
            let linesInPara = Math.ceil(currentLineWidth / containerWidth);
            totalLines += Math.max(1, linesInPara);
        });

        // 总行数 * 单行高度
        return totalLines * singleLineHeight;
    },

    // 帖子列表的高度
    calcTopicsHeight: function (pageIndex = 0) {
        // 帖子数量不多不会翻页且高度固定，直接相乘计算高度
        let totalHeight = this.TOPIC.height * Object.keys(ForumSystem.postsMap).length
        return totalHeight;
    },

    // 主页高度
    calcMainPageHeight: function (pageIndex = 0) {
        let pageHeight = this.calcTopicsHeight(pageIndex) + this.HEAD.height + this.HEAD.marginBottom;
        return pageHeight;
    },

    // 回复列表的高度
    calcRepliesHeight: function (post, pageIndex) {
        let totalHeight = 0;
        let replyList = post.reply;
        for (let i = 0; i < replyList.length; i++) {
            let reply = replyList[i];
            let contentHeight = this.calcTextHeight(reply.content, this.POST.REPLY.fontSize, this.POST.REPLY.width);
            contentHeight += this.POST.REPLY.padding * 2;
            // 记录高度
            reply.height = contentHeight;
            console.log('contentHeight', contentHeight, reply.content);
            totalHeight += contentHeight;
        }
        return totalHeight;
    },

    // 帖子页面的高度
    calcPostPageHeight: function (post, pageIndex = 0) {
        let contentHeight = this.calcRepliesHeight(post, pageIndex);
        contentHeight += this.HEAD.height + this.HEAD.marginBottom;
        contentHeight += this.POST.TITLE.height;
        return contentHeight;
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
        name: 'img_page_head_bg',
        index: 0,
        inlayer: ForumUI.SV.name,
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