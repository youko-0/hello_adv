// 帖子

ac.createStyle({
    name: 'style_title',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 28,
    color: '#cbd6dc',
});

ac.createStyle({
    name: 'style_content',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
    color: '#d1d3df',
});

ac.createStyle({
    name: 'style_name',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 20,
    color: '#cbd6dc',
});

ac.createStyle({
    name: 'style_time',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 18,
    color: '#c6cbce',
});

ac.createStyle({
    name: 'style_pagination',
    font: '汉仪小隶书简',
    bold: true,
    italic: false,
    fontSize: 20,
    color: '#cbd6dc',
});

ac.createStyle({
    name: 'style_pagination_active',
    font: '汉仪小隶书简',
    bold: true,
    italic: false,
    fontSize: 22,
    color: '#b33411',
});


// 创建回复
async function createItemReply(reply, index, posY, contentHeight, post) {
    let bgStyle = index % 2 == 0 ? ForumUI.TOPIC.BG_NORMAL : ForumUI.TOPIC.BG_HIGHLIGHT;
    // 背景
    await ac.createImage({
        name: `img_bg_${index}`,
        index: 0,
        inlayer: ForumUI.SV.name,
        resId: bgStyle.resId,
        pos: {
            x: 0,
            y: posY,
        },
        anchor: {
            x: 0,
            y: 0,
        },
        scale: {
            x: ForumUI.PAGE.width * 100 / bgStyle.width,
            y: contentHeight * 100 / bgStyle.height,
        },
    });

    // 头像
    await ac.createImage({
        name: `img_avatar_${index}`,
        index: 0,
        inlayer: ForumUI.SV.name,
        resId: UserSystem.getUserIcon(reply.authorId),
        pos: {
            x: 100,
            y: posY + contentHeight - 42,
        },
        anchor: {
            x: 50,
            y: 50,
        },
    });

    // 用户名
    await ac.createText({
        name: `lbl_username_${index}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: UserSystem.getUserName(reply.authorId),
        pos: {
            x: 100,
            y: posY + contentHeight - 76,
        },
        anchor: { x: 50, y: 50 },
        size: {
            width: 200,
            height: ForumUI.POST.REPLY.fontSize,
        },
        style: 'style_name',
        halign: ac.HALIGN_TYPES.middle,
    });

    // 回复内容
    await ac.createText({
        name: `lbl_reply_${index}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: reply.content,
        pos: {
            x: 200,
            y: posY + contentHeight - ForumUI.POST.REPLY.padding
        },
        anchor: { x: 0, y: 100 },
        size: {
            width: ForumUI.POST.REPLY.width,
            height: contentHeight - ForumUI.POST.REPLY.padding * 2,
        },
        style: 'style_content',
        valign: ac.VALIGN_TYPES.top,
    });

    // 层数
    await ac.createText({
        name: `lbl_index_${index}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: `${reply.index}楼`,
        pos: {
            x: ForumUI.PAGE.width - 132,
            y: posY + 10
        },
        anchor: { x: 100, y: 0 },
        size: {
            width: 40,
            height: ForumUI.POST.REPLY.fontSize,
        },
        style: 'style_time',
        halign: ac.HALIGN_TYPES.right,
    });

    // 时间
    await ac.createText({
        name: `lbl_reply_time_${index}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: ForumUI.formatRelativeTime(reply.timestamp),
        pos: {
            x: ForumUI.PAGE.width - 28,
            y: posY + 10
        },
        anchor: { x: 100, y: 0 },
        size: {
            width: 100,
            height: ForumUI.POST.REPLY.fontSize,
        },
        style: 'style_time',
        halign: ac.HALIGN_TYPES.right,
    });

    // 楼主标识
    let isAuthor = reply.authorId === post.authorId;
    if (isAuthor) {
        await ac.createText({
            name: `lbl_author_flag_${index}`,
            index: 1,
            inlayer: ForumUI.SV.name,
            content: '[楼主]',
            pos: {
                x: ForumUI.PAGE.width - 28,
                y: posY + contentHeight - 10,
            },
            anchor: { x: 100, y: 100 },
            size: {
                width: 100,
                height: ForumUI.POST.REPLY.fontSize,
            },
            style: 'style_time',
            halign: ac.HALIGN_TYPES.right,
            valign: ac.VALIGN_TYPES.top,
        });
    }

}

async function onClose() {
    ForumSystem.setCurrentPostId("")
    ForumSystem.setCurrentPageIndex(1);
    await ac.replaceUI({
        name: 'replaceUI_forum',
        uiId: 'nw48gnat',
    });
}

await createBrowserUI(onClose);

// 导航条
async function createPagination(pageCount, currentPage) {
    async function viewPage(pageIndex) {
        ForumSystem.setCurrentPageIndex(pageIndex);
        await ac.replaceUI({
            name: 'replaceUI_post',
            uiId: 'dbjp9oun',
        });
    }

    for (let i = 1; i <= pageCount; i++) {
        let x = 100 + (i - 1) * 56;
        // 判断是否是当前页
        let isCurrent = (i === currentPage);
        let content = isCurrent ? `${i}` : `[${i}]`;    // 按钮上显示的数字

        await ac.createText({
            name: `btn_page_${i}`,
            index: 1,
            inlayer: ForumUI.SV.name,
            content: content,
            pos: {
                x: x,
                y: 10,
            },
            anchor: {
                x: 50,
                y: 0,
            },
            size: {
                width: 32,
                height: 32,
            },
            style: isCurrent ? 'style_pagination_active' : 'style_pagination',
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
        });

        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                if (isCurrent) return; // 如果是当前页，点击无效
                await viewPage(i);     // 传递参数
            },
            target: `btn_page_${i}`,
        });
    }

}

// 回复列表
async function initReplyList(postId, pageIndex = 0) {
    console.log(`正在创建帖子 ${postId} 的回复列表，第 ${pageIndex} 页`);
    let post = ForumSystem.getPostData(postId);
    if (!post) {
        return;
    }

    // 第一页要显示标题
    let isFirstPage = pageIndex <= 1;
    let extraHeight = isFirstPage ? ForumUI.POST.TITLE.height : 0;
    let pageHeight = ForumUI.calcPostPageHeight(post, pageIndex);
    pageHeight += extraHeight;
    pageHeight = Math.max(ForumUI.PAGE.height, pageHeight);
    await createForumUI(pageHeight);

    // 帖子内容初始坐标
    let startY = pageHeight - ForumUI.HEADER.height - ForumUI.HEADER.marginBottom;

    if (isFirstPage) {
        // 标题
        await ac.createText({
            name: "lbl_topic_title",
            index: 1,
            inlayer: ForumUI.SV.name,
            content: post.topic,
            pos: {
                x: 42,
                y: startY,
            },
            anchor: { x: 0, y: 100 },
            size: {
                width: ForumUI.POST.REPLY.width,
                height: ForumUI.POST.TITLE.height,
            },
            style: 'style_title',
            valign: ac.VALIGN_TYPES.top,
        });

        startY -= ForumUI.POST.TITLE.height;
    }

    let replyList = ForumSystem.getReplyListByPageIndex(post, pageIndex);
    for (var i = 0; i < replyList.length; i++) {
        let reply = replyList[i];
        let h = reply.height;
        startY -= h;
        await createItemReply(reply, i, startY, h, post);
    }

    let pageCount = ForumSystem.calcPostPageCount(post);
    await createPagination(pageCount, pageIndex);
}


// 执行
let currentPostId = ForumSystem.getCurrentPostId();
let currentPageIndex = ForumSystem.getCurrentPageIndex();
await initReplyList(currentPostId, currentPageIndex);
// 保存浏览记录
ForumSystem.savePostVisited(currentPostId);

await startTimeLoop();
