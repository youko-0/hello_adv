// 论坛UI配置
console.log('[LOAD] forum_ui');

const ForumUI = {
    page: {
        width: 1200,
        height: 552,
        bg: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_topic_bg_highlight,
        },
    },
    sv: {
        name: 'sv_page',
    },
    header: {
        width: 1200,
        height: 120,
        marginBottom: 10,       // 和下面内容的距离
        bg: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_topic_bg_normal,
        }
    },
    topic: {
        height: 64,
        bgNormal: {
            resId: ResMap.img_forum_topic_bg_normal,
            width: 32,
            height: 32,
        },
        bgHighlight: {
            resId: ResMap.img_forum_topic_bg_highlight,
            width: 32,
            height: 32,
        },
    },
    post: {
        PAGE_SIZE: 10,
        title: {
            height: 42,
        },
        
 
    },

    reply: {
        padding: 20,        // 上下留边
        width: 800,        // 文本宽度
        height: 72,       // 文本最小高度, 2行
        fontSize: 24,
    },

    pagination: {
        height: 40,
    },

    // 话题列表的高度
    calcTopicListHeight: function (topicList) {
        // 每个话题的高度固定
        let totalHeight = this.topic.height * topicList.length;
        return totalHeight;
    },

    // 主页高度
    calcMainPageHeight: function (pageIndex = 0) {
        let topicList = ForumSystem.getTopicListByPageIndex(pageIndex);
        let pageHeight = this.calcTopicListHeight(topicList) + this.header.height + this.header.marginBottom;
        return pageHeight;
    },

    // 回复列表的高度
    calcReplyListHeight: function (replyList) {
        let totalHeight = 0;
        for (let i = 0; i < replyList.length; i++) {
            let reply = replyList[i];
            let contentHeight = Utils.calcTextHeight(reply.content, this.reply.fontSize, this.reply.width);
            console.log('contentHeight', contentHeight, reply.content);
            contentHeight = Math.max(contentHeight, this.reply.height);
            contentHeight += this.reply.padding * 2;
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
        contentHeight += this.header.height + this.header.marginBottom;
        contentHeight += this.pagination.height;
        return contentHeight;
    },

    // 论坛框架 UI
    // pageHeight: 页面高度, 带版头
    createForumUI: async function (pageHeight = 0) {
        // 总高度不能小于页面高度
        if (pageHeight < this.page.height) {
            pageHeight = this.page.height;
        }
        // 容器
        await ac.createLayer({
            name: 'layer_forum_ui',
            index: 1,
            inlayer: 'window',
            // 左右居中底对齐
            pos: { x: GameConfig.centerX, y: 60 },
            anchor: { x: 50, y: 0 },
            size: { width: this.page.width, height: this.page.height },
            clipMode: true,
        });

        // 背景
        await ac.createImage({
            name: 'img_page_bg',
            index: 0,
            inlayer: 'layer_forum_ui',
            resId: this.page.bg.resId,
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / this.page.bg.width,
                y: this.page.height * 100 / this.page.bg.height,
            }
        });

        // 滚动层
        await ac.createScrollView({
            name: this.sv.name,
            index: 1,
            inlayer: 'layer_forum_ui',
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            size: {
                width: this.page.width,
                height: this.page.height,
            },
            innerSize: {
                width: this.page.width,
                height: pageHeight,
            },
            horizontalScroll: false,
            verticalScroll: true,
        });

        // 版头
        await ac.createImage({
            name: 'img_header_bg',
            index: 0,
            inlayer: this.sv.name,
            resId: this.header.bg.resId,
            pos: { x: this.page.width / 2, y: pageHeight },
            anchor: { x: 50, y: 100 },
            scale: {
                x: this.header.width * 100 / this.header.bg.width,
                y: this.header.height * 100 / this.header.bg.height,
            },
        });
    },
}
