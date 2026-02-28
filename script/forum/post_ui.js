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


// 创建回复
async function createItemReply(reply, index, posY, contentHeight) {
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
    });

    // 层数
    await ac.createText({
        name: `lbl_index_${index}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: `${reply.index}楼`,
        pos: {
            x: ForumUI.PAGE.width - 130,
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
            x: ForumUI.PAGE.width - 20,
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

}

async function onClose() {
    ForumSystem.setCurrentPostId("")
    await ac.replaceUI({
        name: 'replaceUI12',
        uiId: 'nw48gnat',
    });
}

await createBrowserUI(onClose);


async function initReplyList(postId, pageIndex = 0) {
    let post = ForumSystem.getPostData(postId);
    if (!post) {
        return;
    }
    let pageHeight = ForumUI.calcPostPageHeight(post, pageIndex);
    console.log('pageHeightpageHeight', pageHeight);
    await createForumUI(pageHeight);

    let replyList = post.reply;
    let startY = Math.max(ForumUI.PAGE.height, pageHeight) - ForumUI.HEAD.height - ForumUI.HEAD.marginBottom;
    startY -= ForumUI.POST.TITLE.height;
    for (var i = 0; i < replyList.length; i++) {
        let reply = replyList[i];
        let h = reply.height;
        startY -= h;
        await createItemReply(reply, i, startY, h);
    }

    console.log("所有回复创建完毕！");
}

// 执行
let currentPostId = ForumSystem.getCurrentPostId();
await initReplyList(currentPostId, 0);
// 保存浏览记录
ForumSystem.savePostVisited(currentPostId);
