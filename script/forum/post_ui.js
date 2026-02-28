// 帖子
// 通用部分
let browserWidth = 1280;
let browserHeight = 720;

ac.createStyle({
    name: 'style_topic',
    font: '思源黑体',
    bold: false,
    italic: false,
    fontSize: ForumUI.TOPIC.height / 4,
    color: '#1a3959',
});

ac.createStyle({
    name: 'style_time',
    font: '思源黑体',
    bold: false,
    italic: false,
    fontSize: ForumUI.TOPIC.height / 4,
    color: '#888888',
});


// 创建回复
async function createItemReply(reply, index, posY, contentHeight) {
    let padding = 20;
    let itemHeight = contentHeight + padding * 2;
    let bgStyle = index % 2 == 0 ? ForumUI.TOPIC.BG_NORMAL : ForumUI.TOPIC.BG_HIGHLIGHT;
    // 背景
    await ac.createImage({
        name: `img_bg_${index}`,
        index: 0,
        inlayer: 'sv_page',
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
            y: itemHeight * 100 / bgStyle.height,
        },
    });

    // 头像
    await ac.createImage({
        name: `img_avatar_${index}`,
        index: 0,
        inlayer: 'sv_page',
        resId: UserSystem.getUserIcon(reply.authorId),
        pos: {
            x: 100,
            y: posY + itemHeight / 2,
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
        inlayer: 'sv_page',
        visible: true,
        content: UserSystem.getUserName(reply.authorId),
        pos: {
            x: 200,
            y: posY + itemHeight / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 200,
            height: ForumUI.TOPIC.height,
        },
        style: 'style_topic',
    });

    // 回复内容
    await ac.createText({
        name: `lbl_reply_${index}`,
        index: 1,
        inlayer: 'sv_page',
        visible: true,
        content: reply.content,
        pos: {
            x: 400,
            y: posY + padding,
        },
        anchor: {
            x: 0,
            y: 0,
        },
        size: {
            width: 800,
            height: contentHeight,
        },
        style: 'style_topic',
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

await createForumUI(1000);

async function initReplyList(postId) {
    let post = ForumSystem.postsMap[postId];
    if (!post) {
        console.log(`帖子 ${postId} 不存在！`);
        return;
    }
    let replyList = post.reply;

    for (var i = 0; i < replyList.length; i++) {
        let reply = replyList[i];
        let y = ForumUI.PAGE.height - (i + 1) * 200;
        let h = 200;
        await createItemReply(reply, i, y, h);
    }

    console.log("所有回复创建完毕！");
}

// 执行
let postId = ForumSystem.getCurrentPostId();
await initReplyList(postId);
// 保存浏览记录
ForumSystem.savePostVisited(postId);
