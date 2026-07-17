// 论坛 UI 配置与页面构建
console.log('[LOAD] forum_ui');

const ForumUI = {
    page: {
        width: 1280,
        height: 554,
        paddingX: 24,               // 内容区左右边距
        bg: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_content_bg,
        },
    },
    sv: {
        name: 'sv_page',
    },
    _bannerEpoch: 0,    // 轮播代次，页面重建时自增，旧 loop 自动退出
    header: {
        width: 1280,
        height: 120,
        marginBottom: 0,
        bg: {
            width: 32,
            height: 32,
            resId: ResMap.img_forum_header_bg,
        },
        // Banner 轮播配置
        banners: [
            ResMap.img_forum_banner_0,
            ResMap.img_forum_banner_1,
            ResMap.img_forum_banner_2,
        ],
        bannerImgWidth: 1200,   // 源图片宽度
        bannerImgHeight: 160,   // 源图片高度
        bannerInterval: 3000,   // 轮播间隔（ms）
        bannerSlide: 500,       // 滑动动画时长（ms）
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
            height: 56,
            paddingX: 24,           // 标题文字左右内边距
            bg: {
                resId: ResMap.img_forum_header_bg,
                width: 32,
                height: 32,
            },
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
        // 实测微软雅黑单行渲染高约 fontSize*1.67，用 1.8 覆盖真实行高并留余量
        const lineSpacing = 1.8;
        for (let i = 0; i < replyList.length; i++) {
            let reply = replyList[i];
            let contentHeight = Utils.calcTextHeight(reply.content, this.reply.fontSize, this.reply.width, lineSpacing);
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
            pos: { x: GameConfig.centerX, y: 59 },
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

        // 版头（由 _createHeader 负责，固定不随 scrollview 滚动）
        // scrollview 内不再单独铺 header_bg

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

        // 版头（含 banner 轮播，放在 scrollview 内顶部位置）
        await this._createHeader(pageHeight);
    },

    // ── 版头 & Banner 轮播 ─────────────────────────────────────────

    /**
     * 在 scrollview 顶部创建 layer_forum_header，内含背景 + 三张滑动 banner
     * @param {number} pageHeight scrollview 内容总高度（用于定位顶部）
     */
    _createHeader: async function (pageHeight) {
        const h = this.header;
        const layerW = h.width;
        const layerH = h.height;

        // 拉伸铺满 header 层（宽高各自适配，不留边距）
        const scaleX = Math.round(layerW * 100 / h.bannerImgWidth);
        const scaleY = Math.round(layerH * 100 / h.bannerImgHeight);

        // header 层：在 scrollview 内，y-up 坐标顶部，裁切超出部分
        await ac.createLayer({
            name: 'layer_forum_header',
            index: 1,
            inlayer: this.sv.name,
            pos: { x: 0, y: pageHeight },
            anchor: { x: 0, y: 100 },
            size: { width: layerW, height: layerH },
            clipMode: true,
        });

        // header 背景（兜底色，banner 下方）
        await ac.createImage({
            name: 'img_header_bg',
            index: 0,
            inlayer: 'layer_forum_header',
            resId: h.bg.resId,
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: {
                x: layerW * 100 / h.bg.width,
                y: layerH * 100 / h.bg.height,
            },
        });

        // 三张 banner 水平排列，间距 = layerW（被 clipMode 裁切，只露出 x=0 的那张）
        for (let i = 0; i < h.banners.length; i++) {
            await ac.createImage({
                name: `img_banner_${i}`,
                index: 1,
                inlayer: 'layer_forum_header',
                resId: h.banners[i],
                pos: { x: i * layerW, y: 0 },
                anchor: { x: 0, y: 0 },
                scale: { x: scaleX, y: scaleY },
            });
        }

        // 启动轮播（不阻塞后续渲染）
        // 自增代次：让上一个页面遗留的轮播 loop 自动退出，避免双份 banner
        this._bannerEpoch++;
        this._runBannerLoop(0, layerW, this._bannerEpoch);
    },

    /**
     * banner 左右滑动轮播（递归）
     * @param {number} current  当前显示的 banner 下标
     * @param {number} layerW   header 层宽度（滑动步长）
     * @param {number} epoch    本轮代次，与当前代次不符则退出
     */
    _runBannerLoop: async function (current, layerW, epoch) {
        await ac.delay({ time: this.header.bannerInterval });
        // 页面已被重建，旧 loop 退出
        if (epoch !== this._bannerEpoch) return;
        const total = this.header.banners.length;
        const next  = (current + 1) % total;
        const slide = this.header.bannerSlide;

        try {
            // 将 next banner 瞬移到右侧就位
            ac.moveTo({ name: `img_banner_${next}`, x: layerW, y: 0, duration: 0 });
            await ac.delay({ time: 32 }); // 确保就位后再开始滑动
            if (epoch !== this._bannerEpoch) return;

            // 同时：current 向左滑出，next 从右滑入
            ac.moveTo({ name: `img_banner_${current}`, x: -layerW, y: 0, duration: slide, ease: 'easeCubicInOut' });
            ac.moveTo({ name: `img_banner_${next}`,    x: 0,       y: 0, duration: slide, ease: 'easeCubicInOut' });

            // 等动画播完
            await ac.delay({ time: slide });
            if (epoch !== this._bannerEpoch) return;

            // 已出场的 banner 移回右侧待机
            ac.moveTo({ name: `img_banner_${current}`, x: layerW, y: 0, duration: 0 });
        } catch (e) {
            // layer 已销毁（页面切换），终止轮播
            return;
        }

        this._runBannerLoop(next, layerW, epoch);
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
        const px = this.page.paddingX;
        const rowW = this.page.width - px * 2;

        // 行底色（内缩 paddingX）
        await ac.createImage({
            name: `btn_topic_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            resId: bgStyle.resId,
            pos: { x: px, y: posY },
            anchor: { x: 0, y: 0 },
            scale: {
                x: rowW * 100 / bgStyle.width,
                y: this.topic.height * 100 / bgStyle.height,
            },
        });

        // 分隔线
        await ac.createImage({
            name: `img_divider_topic_${post.id}`,
            index: 1,
            inlayer: this.sv.name,
            resId: this.topic.divider.resId,
            pos: { x: px, y: posY + this.topic.height },
            anchor: { x: 0, y: 0 },
            scale: {
                x: rowW * 100 / this.topic.divider.width,
                y: this.topic.dividerHeight * 100 / this.topic.divider.height,
            },
        });

        // 回复数量
        await ac.createText({
            name: `lbl_reply_count_${post.id}`,
            index: 2,
            inlayer: this.sv.name,
            content: `【${post.reply.length}】`,
            pos: { x: px + 36, y: posY + this.topic.height / 2 },
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
            pos: { x: px + 86, y: posY + this.topic.height / 2 },
            anchor: { x: 0, y: 50 },
            size: { width: rowW - 86 - 380, height: this.topic.height },
            style: read ? 'style_forum_topic_read' : 'style_forum_topic',
        });

        // 帖子作者
        await ac.createText({
            name: `lbl_author_${post.id}`,
            index: 2,
            inlayer: this.sv.name,
            content: UserSystem.getUserName(post.authorId),
            pos: { x: px + rowW - 360, y: posY + this.topic.height / 2 + 2 },
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
            pos: { x: px + rowW - 360, y: posY + this.topic.height / 2 - 2 },
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
                pos: { x: px + rowW - 180, y: posY + this.topic.height / 2 + 2 },
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
                pos: { x: px + rowW - 180, y: posY + this.topic.height / 2 - 2 },
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
            await this._createTitleBar(post, startY);
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

    /**
     * 帖子标题栏（独立底板 + 上下分隔线，分隔 banner 与回复）
     * @param {object} post   帖子数据
     * @param {number} topY   标题栏顶边 y（y-up，版头下方）
     */
    _createTitleBar: async function (post, topY) {
        const px = this.page.paddingX;
        const rowW = this.page.width - px * 2;
        const t = this.post.title;
        const barBottom = topY - t.height;

        // 标题栏底板
        await ac.createImage({
            name: 'img_title_bar_bg',
            index: 1,
            inlayer: this.sv.name,
            resId: t.bg.resId,
            pos: { x: px, y: barBottom },
            anchor: { x: 0, y: 0 },
            scale: {
                x: rowW * 100 / t.bg.width,
                y: t.height * 100 / t.bg.height,
            },
        });

        // 顶部分隔线（紧贴 banner 下方）
        await ac.createImage({
            name: 'img_title_bar_divider_top',
            index: 1,
            inlayer: this.sv.name,
            resId: this.topic.divider.resId,
            pos: { x: px, y: topY },
            anchor: { x: 0, y: 100 },
            scale: {
                x: rowW * 100 / this.topic.divider.width,
                y: this.topic.dividerHeight * 100 / this.topic.divider.height,
            },
        });

        // 标题文字（左对齐，垂直居中）
        await ac.createText({
            name: 'lbl_topic_title',
            index: 2,
            inlayer: this.sv.name,
            content: post.topic,
            pos: { x: px + t.paddingX, y: barBottom + t.height / 2 },
            anchor: { x: 0, y: 50 },
            size: { width: rowW - t.paddingX * 2, height: t.height },
            style: 'style_post_title',
            halign: ac.HALIGN_TYPES.left,
            valign: ac.VALIGN_TYPES.center,
        });
    },

    _createReplyItem: async function (reply, index, posY, contentHeight) {
        let bgStyle = index % 2 === 0 ? this.topic.bgNormal : this.topic.bgAlt;
        const px = this.page.paddingX;
        const rowW = this.page.width - px * 2;
        const fs = this.reply.fontSize;

        // 行底色
        await ac.createImage({
            name: `img_bg_${index}`,
            index: 1,
            inlayer: this.sv.name,
            resId: bgStyle.resId,
            pos: { x: px, y: posY },
            anchor: { x: 0, y: 0 },
            scale: {
                x: rowW * 100 / bgStyle.width,
                y: contentHeight * 100 / bgStyle.height,
            },
        });

        // 分隔线
        await ac.createImage({
            name: `img_divider_reply_${index}`,
            index: 1,
            inlayer: this.sv.name,
            resId: this.topic.divider.resId,
            pos: { x: px, y: posY + contentHeight },
            anchor: { x: 0, y: 0 },
            scale: {
                x: rowW * 100 / this.topic.divider.width,
                y: this.topic.dividerHeight * 100 / this.topic.divider.height,
            },
        });

        // 头像（行中央偏上，y 更大 = 视觉更高）
        await ac.createImage({
            name: `img_avatar_${index}`,
            index: 2,
            inlayer: this.sv.name,
            resId: UserSystem.getUserIcon(reply.authorId),
            pos: { x: px + 64, y: posY + contentHeight / 2 + 12 },
            anchor: { x: 50, y: 50 },
        });

        // 用户名（头像下方，y 更小 = 视觉更低）
        await ac.createText({
            name: `lbl_username_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: UserSystem.getUserName(reply.authorId),
            pos: { x: px + 64, y: posY + contentHeight / 2 - 24 },
            anchor: { x: 50, y: 100 },
            size: { width: 160, height: fs },
            style: 'style_post_author',
            halign: ac.HALIGN_TYPES.middle,
        });

        // 回复内容
        await ac.createText({
            name: `lbl_reply_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: reply.content,
            pos: { x: px + 150, y: posY + contentHeight - this.reply.padding },
            anchor: { x: 0, y: 100 },
            size: { width: this.reply.width, height: contentHeight - this.reply.padding * 2 },
            style: 'style_post_content',
            valign: ac.VALIGN_TYPES.top,
        });

        // 楼层（右下角，时间上方一行）
        await ac.createText({
            name: `lbl_index_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: `${reply.index}楼`,
            pos: { x: px + rowW - 16, y: posY + 14 + fs + 6 },
            anchor: { x: 100, y: 0 },
            size: { width: 80, height: fs },
            style: 'style_post_time',
            halign: ac.HALIGN_TYPES.right,
        });

        // 时间（右下角，楼层下方）
        await ac.createText({
            name: `lbl_reply_time_${index}`,
            index: 2,
            inlayer: this.sv.name,
            content: Utils.formatRelativeTime(reply.timestamp, ForumSystem.NOW_YEAR),
            pos: { x: px + rowW - 16, y: posY + 14 },
            anchor: { x: 100, y: 0 },
            size: { width: 200, height: fs },
            style: 'style_post_time',
            halign: ac.HALIGN_TYPES.right,
        });

        // 身份标识（右上角）
        if (reply.tag) {
            await ac.createText({
                name: `lbl_author_flag_${index}`,
                index: 2,
                inlayer: this.sv.name,
                content: `[${reply.tag}]`,
                pos: { x: px + rowW - 16, y: posY + contentHeight - 14 },
                anchor: { x: 100, y: 100 },
                size: { width: 100, height: fs },
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
        const px = this.page.paddingX;
        const rowW = this.page.width - px * 2;

        // 分页栏底色
        await ac.createImage({
            name: 'img_pagination_bg',
            index: 1,
            inlayer: this.sv.name,
            resId: this.pagination.bg.resId,
            pos: { x: px, y: 0 },
            anchor: { x: 0, y: 0 },
            scale: {
                x: rowW * 100 / this.pagination.bg.width,
                y: paginationH * 100 / this.pagination.bg.height,
            },
        });

        // 分页栏顶部分隔线
        await ac.createImage({
            name: 'img_pagination_divider',
            index: 1,
            inlayer: this.sv.name,
            resId: this.topic.divider.resId,
            pos: { x: px, y: paginationH },
            anchor: { x: 0, y: 100 },
            scale: {
                x: rowW * 100 / this.topic.divider.width,
                y: separatorH * 100 / this.topic.divider.height,
            },
        });

        for (let i = 1; i <= pageCount; i++) {
            let x = px + 16 + (i - 1) * (btnW + btnGap);
            let isCurrent = i === currentPage;

            await ac.createImage({
                name: `img_page_btn_${i}`,
                index: 1,
                inlayer: this.sv.name,
                resId: isCurrent ? this.pagination.btnResActive : this.pagination.btnResNormal,
                pos: { x: x, y: (paginationH - btnH) / 2 },
                anchor: { x: 0, y: 0 },
                scale: { x: btnW * 100 / 32, y: btnH * 100 / 32 },
            });

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
