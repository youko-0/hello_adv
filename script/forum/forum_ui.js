// 论坛 UI 配置与页面构建
console.log('[LOAD] forum_ui');

const ForumUI = {
    page: {
        width: 1280,
        height: 552,
        bg: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_content_bg,
        },
    },
    sv: {
        name: 'sv_page',
    },
    header: {
        width: 1280,
        height: 120,
        marginBottom: 0,
        bg: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_header_bg,
        },
    },
    // 内容区统一底板
    contentBg: {
        resId: ResMap.img_forum_content_bg,
        width: 32,
        height: 32,
    },
    topic: {
        height: 64,
        dividerHeight: 2,
        bgNormal: {
            resId: ResMap.img_forum_row_normal,
            width: 32,
            height: 32,
        },
        bgAlt: {
            resId: ResMap.img_forum_row_alt,
            width: 32,
            height: 32,
        },
        divider: {
            resId: ResMap.img_forum_divider,
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
        width: 900,
        height: 72,
        fontSize: 24,
    },
    pagination: {
        height: 40,
        separatorHeight: 2,
        btnWidth: 32,
        btnHeight: 32,
        btnGap: 12,
        btnResNormal: ResMap.img_forum_page_btn,
        btnResActive: ResMap.img_forum_page_btn_active,
        bg: {
            resId: ResMap.img_forum_pagination_bg,
            width: 32,
            height: 32,
        },
    },

    // ── 高度计算 ──────────────────────────────────────────────────

    calcTopicListHeight: function (topicList) {
        // 每行高度 + 分隔线
        return (this.topic.height + this.topic.dividerHeight) * topicList.length;
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
            // 加上分隔线高度
            totalHeight += contentHeight + this.topic.dividerHeight;
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

    // ── 论坛框架（滚动容器 + 版头 + 内容底板）───────────────────────

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

        // 页面底色
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

        // 版头
        await ac.createImage({
            name: 'img_header_bg',
            index: 0,
            inlayer: this.sv.name,
            resId: this.header.bg.resId,
            pos: { x: 0, y: pageHeight },
            anchor: { x: 0, y: 100 },
            scale: {
                x: this.header.width * 100 / this.header.bg.width,
                y: this.header.height * 100 / this.header.bg.height,
            },
        });

        // 内容区统一底板（版头下方到底部）
        const contentTop = pageHeight - this.header.height;
        const contentHeight = pageHeight - this.header.height;
        await ac.createImage({
            name: 'img_content_bg',
            index: 0,
            inlayer: this.sv.name,
            resId: this.contentBg.resId,
            pos: { x: 0, y: contentTop },
            anchor: { x: 0, y: 100 },
            scale: {
                x: this.page.width * 100 / this.contentBg.width,
                y: contentHeight * 100 / this.contentBg.height,
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
            let itemH = this.topic.height + this.topic.dividerHeight;
            let posY = startY - (i + 1) * itemH;
            console.log(`正在创建第 ${i} 个帖子 ${post.id}`);
            await this._createTopicItem(post, i, posY);
        }

        console.log('所有帖子创建完毕');
    },

    _createTopicItem: async function (post, index, posY) {
        let bgStyle = index % 2 === 0 ? this.topic.bgNormal : this.topic.bgAlt;
        let read = ForumSystem.isRead(post.id);

        // 行底色
        await ac.createImage({
            name: `btn_topic_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            resId: bgStyle.resId,
            pos: { x: 0, y: posY },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / bgStyle.width,
                y: this.topic.height * 100 / bgStyle.height,
            },
        });

        // 分隔线（行顶部）
        await ac.createImage({
            name: `img_divider_topic_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            resId: this.topic.divider.resId,
            pos: { x: 0, y: posY + this.topic.height },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / this.topic.divider.width,
                y: this.topic.dividerHeight * 100 / this.topic.divider.height,
            },
        });

        // 回复数量
        await ac.createText({
            name: `lbl_reply_count_${post.id}`,
            index: 2,
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
            index: 2,
            inlayer: this.sv.name,
            content: post.topic,
            pos: { x: 110, y: posY + this.topic.height / 2 },
            anchor: { x: 0, y: 50 },
            size: { width: 700, height: this.topic.height },
            style: read ? 'style_forum_topic_read' : 'style_forum_topic',
        });

        // 帖子作者
        await ac.createText({
            name: `lbl_author_${post.id}`,
            index: 2,
            inlayer: this.sv.name,
            content: UserSystem.getUserName(post.authorId),
            pos: { x: 920, y: posY + this.topic.height / 2 + 2 },
            anchor: { x: 0, y: 0 },
            size: { width: 160, height: this.topic.height },
            style: 'style_forum_author',
            valign: ac.VALIGN_TYPES.bottom,
        });

        // 发帖时间
        await ac.createText({
            name: `lbl_time_${post.id}`,
            index: 2,
            inlayer: this.sv.name,
            content: Utils.formatRelativeTime(post.timestamp, ForumSystem.NOW_YEAR),
            pos: { x: 920, y: posY + this.topic.height / 2 - 2 },
            anchor: { x: 0, y: 100 },
            size: { width: 160, height: this.topic.height },
            style: 'style_forum_time',
            valign: ac.VALIGN_TYPES.top,
        });

        // 最后回复
        let lastReply = post.reply[post.reply.length - 1];
        if (lastReply) {
            await ac.createText({
                name: `lbl_last_reply_${post.id}`,
                index: 2,
                inlayer: this.sv.name,
                content: UserSystem.getUserName(lastReply.authorId),
                pos: { x: 1100, y: posY + this.topic.height / 2 + 2 },
                anchor: { x: 0, y: 0 },
                size: { width: 160, height: this.topic.height },
                style: 'style_forum_author',
                valign: ac.VALIGN_TYPES.bottom,
            });
            await ac.createText({
                name: `lbl_last_reply_time_${post.id}`,
                index: 2,
                inlayer: this.sv.name,
                content: Utils.formatRelativeTime(lastReply.timestamp, ForumSystem.NOW_YEAR),
                pos: { x: 1100, y: posY + this.topic.height / 2 - 2 },
                anchor: { x: 0, y: 100 },
                size: { width: 160, height: this.topic.height },
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
                index: 2,
                inlayer: this.sv.name,
                content: post.topic,
                pos: { x: 28, y: startY + 6 },
                anchor: { x: 0, y: 100 },
                size: { width: this.page.width - 56, height: this.post.title.height },
                style: 'style_post_title',
                valign: ac.VALIGN_TYPES.top,
            });
            startY -= this.post.title.height;
        }

        let replyList = ForumSystem.getReplyListAtPage(post, pageIndex);
        for (let i = 0; i < replyList.length; i++) {
            let reply = replyList[i];
            let h = reply.height;
            startY -= h + this.topic.dividerHeight;
            await this._createReplyItem(reply, i, startY, h);
        }

        let pageCount = ForumSystem.calcPostPageCount(post);
        await this._createPagination(pageCount, pageIndex);
    },

    _createReplyItem: async function (reply, index, posY, contentHeight) {
        let bgStyle = index % 2 === 0 ? this.topic.bgNormal : this.topic.bgAlt;

        // 行底色
        await ac.createImage({
            name: `img_bg_${index}`,
            index: 1,
            inlayer: this.sv.name,
            resId: bgStyle.resId,
            pos: { x: 0, y: posY },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / bgStyle.width,
                y: contentHeight * 100 / bgStyle.height,
            },
        });

        // 分隔线（行底部）
        await ac.createImage({
            name: `img_divider_reply_${index}`,
            index: 1,
            inlayer: this.sv.name,
            resId: this.topic.divider.resId,
            pos: { x: 0, y: posY + contentHeight },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / this.topic.divider.width,
                y: this.topic.dividerHeight * 100 / this.topic.divider.height,
            },
        });

        // 头像
        await ac.createImage({
            name: `img_avatar_${index}`,
            index: 2,
            inlayer: this.sv.name,
            resId: UserSystem.getUserIcon(reply.authorId),
            pos: { x: 80, y: posY + contentHeight / 2 },
            anchor: { x: 50, y: 50 },
        });

        // 用户名
        await ac.createText({
            name: `lbl_username_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: UserSystem.getUserName(reply.authorId),
            pos: { x: 80, y: posY + contentHeight / 2 + 36 },
            anchor: { x: 50, y: 0 },
            size: { width: 160, height: this.reply.fontSize },
            style: 'style_post_author',
            halign: ac.HALIGN_TYPES.middle,
        });

        // 回复内容
        await ac.createText({
            name: `lbl_reply_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: reply.content,
            pos: { x: 180, y: posY + contentHeight - this.reply.padding },
            anchor: { x: 0, y: 100 },
            size: { width: this.reply.width, height: contentHeight - this.reply.padding * 2 },
            style: 'style_post_content',
            valign: ac.VALIGN_TYPES.top,
        });

        // 楼层
        await ac.createText({
            name: `lbl_index_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: `${reply.index}楼`,
            pos: { x: this.page.width - 150, y: posY + 12 },
            anchor: { x: 0, y: 0 },
            size: { width: 60, height: this.reply.fontSize },
            style: 'style_post_time',
            halign: ac.HALIGN_TYPES.left,
        });

        // 时间
        await ac.createText({
            name: `lbl_reply_time_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: Utils.formatRelativeTime(reply.timestamp, ForumSystem.NOW_YEAR),
            pos: { x: this.page.width - 28, y: posY + 12 },
            anchor: { x: 100, y: 0 },
            size: { width: 200, height: this.reply.fontSize },
            style: 'style_post_time',
            halign: ac.HALIGN_TYPES.right,
        });

        // 身份标识（楼主 / 管理员 等）
        if (reply.tag) {
            await ac.createText({
                name: `lbl_author_flag_${index}`,
                index: 2,
                inlayer: this.sv.name,
                content: `[${reply.tag}]`,
                pos: { x: this.page.width - 28, y: posY + contentHeight - 12 },
                anchor: { x: 100, y: 100 },
                size: { width: 100, height: this.reply.fontSize },
                style: 'style_post_tag',
                halign: ac.HALIGN_TYPES.right,
                valign: ac.VALIGN_TYPES.top,
            });
        }
    },

    _createPagination: async function (pageCount, currentPage) {
        const paginationH = this.pagination.height;
        const separatorH = this.pagination.separatorHeight;
        const btnW = this.pagination.btnWidth;
        const btnH = this.pagination.btnHeight;
        const btnGap = this.pagination.btnGap;

        // 分页栏底色
        await ac.createImage({
            name: 'img_pagination_bg',
            index: 1,
            inlayer: this.sv.name,
            resId: this.pagination.bg.resId,
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: {
                x: this.page.width * 100 / this.pagination.bg.width,
                y: paginationH * 100 / this.pagination.bg.height,
            },
        });

        // 分页栏顶部分隔线
        await ac.createImage({
            name: 'img_pagination_divider',
            index: 1,
            inlayer: this.sv.name,
            resId: this.topic.divider.resId,
            pos: { x: 0, y: paginationH },
            anchor: { x: 0, y: 100 },
            scale: {
                x: this.page.width * 100 / this.topic.divider.width,
                y: separatorH * 100 / this.topic.divider.height,
            },
        });

        for (let i = 1; i <= pageCount; i++) {
            let x = 28 + (i - 1) * (btnW + btnGap);
            let isCurrent = i === currentPage;

            // 按钮底图
            await ac.createImage({
                name: `img_page_btn_${i}`,
                index: 1,
                inlayer: this.sv.name,
                resId: isCurrent ? this.pagination.btnResActive : this.pagination.btnResNormal,
                pos: { x: x, y: (paginationH - btnH) / 2 },
                anchor: { x: 0, y: 0 },
                scale: { x: btnW * 100 / 32, y: btnH * 100 / 32 },
            });

            // 按钮文字
            await ac.createText({
                name: `btn_page_${i}`,
                index: 2,
                inlayer: this.sv.name,
                content: `${i}`,
                pos: { x: x + btnW / 2, y: paginationH / 2 },
                anchor: { x: 50, y: 50 },
                size: { width: btnW, height: btnH },
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
