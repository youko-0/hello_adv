// 论坛 UI 配置与页面构建
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
        marginBottom: 10,
        bg: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_topic_bg_normal,
        },
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
        padding: 20,
        width: 800,
        height: 72,
        fontSize: 24,
    },
    pagination: {
        height: 40,
        separatorHeight: 8,
    },

    // ── 高度计算 ──────────────────────────────────────────────────

    calcTopicListHeight: function (topicList) {
        return this.topic.height * topicList.length;
    },

    calcMainPageHeight: function (pageIndex) {
        let topicList = ForumSystem.getTopicListAtPage(pageIndex || 0);
        return this.calcTopicListHeight(topicList) + this.header.height + this.header.marginBottom;
    },

    calcReplyListHeight: function (replyList) {
        let totalHeight = 0;
        for (let i = 0; i < replyList.length; i++) {
            let reply = replyList[i];
            let contentHeight = Utils.calcTextHeight(reply.content, this.reply.fontSize, this.reply.width);
            console.log('contentHeight', contentHeight, reply.content);
            contentHeight = Math.max(contentHeight, this.reply.height);
            contentHeight += this.reply.padding * 2;
            reply.height = contentHeight;
            totalHeight += contentHeight;
        }
        return totalHeight;
    },

    calcPostPageHeight: function (post, pageIndex) {
        let replyList = ForumSystem.getReplyListAtPage(post, pageIndex || 1);
        let contentHeight = this.calcReplyListHeight(replyList);
        contentHeight += this.header.height + this.header.marginBottom;
        contentHeight += this.pagination.separatorHeight + this.pagination.height;
        return contentHeight;
    },

    // ── 论坛框架（滚动容器 + 版头）────────────────────────────────

    createForumUI: async function (pageHeight) {
        if (pageHeight < this.page.height) pageHeight = this.page.height;

        await ac.createLayer({
            name: 'layer_forum_ui',
            index: ZORDER.OVERLAY,
            inlayer: 'window',
            pos: { x: GameConfig.centerX, y: 60 },
            anchor: { x: 50, y: 0 },
            size: { width: this.page.width, height: this.page.height },
            clipMode: true,
        });

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
            },
        });

        await ac.createScrollView({
            name: this.sv.name,
            index: 1,
            inlayer: 'layer_forum_ui',
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            size: { width: this.page.width, height: this.page.height },
            innerSize: { width: this.page.width, height: pageHeight },
            horizontalScroll: false,
            verticalScroll: true,
        });

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

    // ── 论坛主页 ──────────────────────────────────────────────────

    /**
     * 渲染论坛主页（帖子列表）
     * 调用前需已创建 BrowserUI + ForumUI 框架
     */
    createForumPage: async function () {
        let pageHeight = this.calcMainPageHeight(0);
        await this.createForumUI(pageHeight);

        let postsList = ForumSystem.getTopicListAtPage(0);
        let startY = Math.max(this.page.height, pageHeight) - this.header.height - this.header.marginBottom;

        for (let i = 0; i < postsList.length; i++) {
            let post = postsList[i];
            let posY = startY - (i + 1) * this.topic.height;
            console.log(`正在创建第 ${i} 个帖子 ${post.id}`);
            await this._createTopicItem(post, i, posY);
        }

        console.log('所有帖子创建完毕');
    },

    _createTopicItem: async function (post, index, posY) {
        let bgStyle = index % 2 === 0 ? this.topic.bgNormal : this.topic.bgHighlight;
        let read = ForumSystem.isRead(post.id);

        await ac.createImage({
            name: `btn_topic_${post.id}`,
            index: 0,
            inlayer: this.sv.name,
            resId: bgStyle.resId,
            pos: { x: 0, y: posY },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / bgStyle.width,
                y: this.topic.height * 100 / bgStyle.height,
            },
        });

        // 回复数量
        await ac.createText({
            name: `lbl_reply_count_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            content: `【${post.reply.length}】`,
            pos: { x: 60, y: posY + this.topic.height / 2 },
            anchor: { x: 50, y: 50 },
            size: { width: 80, height: this.topic.height },
            style: 'style_forum_topic',
            halign: ac.HALIGN_TYPES.middle,
        });

        // 帖子标题
        await ac.createText({
            name: `lbl_topic_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            content: post.topic,
            pos: { x: 100, y: posY + this.topic.height / 2 },
            anchor: { x: 0, y: 50 },
            size: { width: 600, height: this.topic.height },
            style: read ? 'style_forum_topic_read' : 'style_forum_topic',
        });

        // 帖子作者
        await ac.createText({
            name: `lbl_author_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            content: UserSystem.getUserName(post.authorId),
            pos: { x: 800, y: posY + this.topic.height / 2 + 2 },
            anchor: { x: 0, y: 0 },
            size: { width: 200, height: this.topic.height },
            style: 'style_forum_author',
            valign: ac.VALIGN_TYPES.bottom,
        });

        // 发帖时间
        await ac.createText({
            name: `lbl_time_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            content: Utils.formatRelativeTime(post.timestamp, ForumSystem.NOW_YEAR),
            pos: { x: 800, y: posY + this.topic.height / 2 - 2 },
            anchor: { x: 0, y: 100 },
            size: { width: 200, height: this.topic.height },
            style: 'style_forum_time',
            valign: ac.VALIGN_TYPES.top,
        });

        // 最后回复
        let lastReply = post.reply[post.reply.length - 1];
        if (lastReply) {
            await ac.createText({
                name: `lbl_last_reply_${post.id}`,
                index: 1,
                inlayer: this.sv.name,
                content: UserSystem.getUserName(lastReply.authorId),
                pos: { x: 1000, y: posY + this.topic.height / 2 + 2 },
                anchor: { x: 0, y: 0 },
                size: { width: 200, height: this.topic.height },
                style: 'style_forum_author',
                valign: ac.VALIGN_TYPES.bottom,
            });
            await ac.createText({
                name: `lbl_last_reply_time_${post.id}`,
                index: 1,
                inlayer: this.sv.name,
                content: Utils.formatRelativeTime(lastReply.timestamp, ForumSystem.NOW_YEAR),
                pos: { x: 1000, y: posY + this.topic.height / 2 - 2 },
                anchor: { x: 0, y: 100 },
                size: { width: 200, height: this.topic.height },
                style: 'style_forum_time',
                valign: ac.VALIGN_TYPES.top,
            });
        }

        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                await ForumSystem.viewPost(post.id, 1);
            },
            target: `lbl_topic_${post.id}`,
        });
    },

    // ── 帖子详情页 ────────────────────────────────────────────────

    /**
     * 渲染帖子详情页（回复列表 + 分页）
     * 调用前需已创建 BrowserUI
     */
    createPostPage: async function () {
        let postId = ForumSystem.getPostId();
        let pageIndex = ForumSystem.getPageIndex();
        console.log(`正在创建帖子 ${postId} 的回复列表，第 ${pageIndex} 页`);

        let post = ForumSystem.getPostData(postId);
        if (!post) return;

        let isFirstPage = pageIndex <= 1;
        let extraHeight = isFirstPage ? this.post.title.height : 0;
        let pageHeight = this.calcPostPageHeight(post, pageIndex) + extraHeight;
        pageHeight = Math.max(this.page.height, pageHeight);

        await this.createForumUI(pageHeight);

        let startY = pageHeight - this.header.height - this.header.marginBottom;

        if (isFirstPage) {
            await ac.createText({
                name: 'lbl_topic_title',
                index: 1,
                inlayer: this.sv.name,
                content: post.topic,
                pos: { x: 42, y: startY + 6 },
                anchor: { x: 0, y: 100 },
                size: { width: this.reply.width, height: this.post.title.height },
                style: 'style_post_title',
                valign: ac.VALIGN_TYPES.top,
            });
            startY -= this.post.title.height;
        }

        let replyList = ForumSystem.getReplyListAtPage(post, pageIndex);
        for (let i = 0; i < replyList.length; i++) {
            let reply = replyList[i];
            let h = reply.height;
            startY -= h;
            await this._createReplyItem(reply, i, startY, h, post);
        }

        let pageCount = ForumSystem.calcPostPageCount(post);
        await this._createPagination(pageCount, pageIndex);
    },

    _createReplyItem: async function (reply, index, posY, contentHeight, post) {
        let bgStyle = index % 2 === 0 ? this.topic.bgNormal : this.topic.bgHighlight;

        await ac.createImage({
            name: `img_bg_${index}`,
            index: 0,
            inlayer: this.sv.name,
            resId: bgStyle.resId,
            pos: { x: 0, y: posY },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / bgStyle.width,
                y: contentHeight * 100 / bgStyle.height,
            },
        });

        // 头像
        await ac.createImage({
            name: `img_avatar_${index}`,
            index: 0,
            inlayer: this.sv.name,
            resId: UserSystem.getUserIcon(reply.authorId),
            pos: { x: 100, y: posY + contentHeight - 42 },
            anchor: { x: 50, y: 50 },
        });

        // 用户名
        await ac.createText({
            name: `lbl_username_${index}`,
            index: 1,
            inlayer: this.sv.name,
            content: UserSystem.getUserName(reply.authorId),
            pos: { x: 100, y: posY + contentHeight - 76 },
            anchor: { x: 50, y: 50 },
            size: { width: 200, height: this.reply.fontSize },
            style: 'style_post_author',
            halign: ac.HALIGN_TYPES.middle,
        });

        // 回复内容
        await ac.createText({
            name: `lbl_reply_${index}`,
            index: 1,
            inlayer: this.sv.name,
            content: reply.content,
            pos: { x: 200, y: posY + contentHeight - this.reply.padding },
            anchor: { x: 0, y: 100 },
            size: { width: this.reply.width, height: contentHeight - this.reply.padding * 2 },
            style: 'style_post_content',
            valign: ac.VALIGN_TYPES.top,
        });

        // 层数
        await ac.createText({
            name: `lbl_index_${index}`,
            index: 1,
            inlayer: this.sv.name,
            content: `${reply.index}楼`,
            pos: { x: this.page.width - 136, y: posY + 10 },
            anchor: { x: 100, y: 0 },
            size: { width: 60, height: this.reply.fontSize },
            style: 'style_post_time',
            halign: ac.HALIGN_TYPES.right,
        });

        // 时间
        await ac.createText({
            name: `lbl_reply_time_${index}`,
            index: 1,
            inlayer: this.sv.name,
            content: Utils.formatRelativeTime(reply.timestamp, ForumSystem.NOW_YEAR),
            pos: { x: this.page.width - 28, y: posY + 10 },
            anchor: { x: 100, y: 0 },
            size: { width: 200, height: this.reply.fontSize },
            style: 'style_post_time',
            halign: ac.HALIGN_TYPES.right,
        });

        // 楼主标识
        if (reply.authorId === post.authorId) {
            await ac.createText({
                name: `lbl_author_flag_${index}`,
                index: 1,
                inlayer: this.sv.name,
                content: '[楼主]',
                pos: { x: this.page.width - 28, y: posY + contentHeight - 10 },
                anchor: { x: 100, y: 100 },
                size: { width: 100, height: this.reply.fontSize },
                style: 'style_post_time',
                halign: ac.HALIGN_TYPES.right,
                valign: ac.VALIGN_TYPES.top,
            });
        }
    },

    _createPagination: async function (pageCount, currentPage) {
        const separatorH = this.pagination.separatorHeight;
        const paginationH = this.pagination.height;
        const bgStyle = this.topic.bgNormal;

        // 深色分隔条，位于分页导航正上方
        await ac.createImage({
            name: 'img_pagination_separator',
            index: 0,
            inlayer: this.sv.name,
            resId: bgStyle.resId,
            pos: { x: 0, y: paginationH },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / bgStyle.width,
                y: separatorH * 100 / bgStyle.height,
            },
        });

        for (let i = 1; i <= pageCount; i++) {
            let x = 100 + (i - 1) * 56;
            let isCurrent = i === currentPage;
            let content = isCurrent ? `${i}` : `[${i}]`;

            await ac.createText({
                name: `btn_page_${i}`,
                index: 1,
                inlayer: this.sv.name,
                content: content,
                pos: { x: x, y: 10 },
                anchor: { x: 50, y: 0 },
                size: { width: 32, height: 32 },
                style: isCurrent ? 'style_post_pagination_active' : 'style_post_pagination',
                halign: ac.HALIGN_TYPES.middle,
                valign: ac.VALIGN_TYPES.center,
            });

            ac.addEventListener({
                type: ac.EVENT_TYPES.onTouchEnded,
                listener: async function () {
                    if (isCurrent) return;
                    await ForumSystem.viewPost(null, i);
                },
                target: `btn_page_${i}`,
            });
        }
    },
};
