// 主页

ac.createStyle({
    name: 'style_topic',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
    color: '#d1d3df',
});

ac.createStyle({
    name: 'style_topic_visited',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
    color: '#b33411',
});

ac.createStyle({
    name: 'style_name',
    // font: '思源黑体',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 18,
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

// 创建标题项
async function createItemTopic(post, index, posY) {

    async function viewPost() {
        ForumSystem.setCurrentPostId(post.id);
        ForumSystem.setCurrentPageIndex(1);
        await ac.replaceUI({
            name: 'replaceUI_post',
            uiId: 'dbjp9oun',
        });
    }

    let bgStyle = index % 2 == 0 ? ForumUI.TOPIC.BG_NORMAL : ForumUI.TOPIC.BG_HIGHLIGHT;
    let visited = ForumSystem.isPostVisited(post.id);

    await ac.createImage({
        name: `btn_topic_${post.id}`,
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
            y: ForumUI.TOPIC.height * 100 / bgStyle.height,
        },
    });

    // 回复数量
    await ac.createText({
        name: `lbl_reply_count_${post.id}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: `【${post.reply.length}】`,
        pos: {
            x: 60,
            y: posY + ForumUI.TOPIC.height / 2,
        },
        anchor: {
            x: 50,
            y: 50,
        },
        size: {
            width: 80,
            height: ForumUI.TOPIC.height,
        },
        style: 'style_topic',
        halign: ac.HALIGN_TYPES.middle,
    });

    // 帖子标题
    await ac.createText({
        name: `lbl_topic_${post.id}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: post.topic,
        pos: {
            x: 100,
            y: posY + ForumUI.TOPIC.height / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 600,
            height: ForumUI.TOPIC.height,
        },
        style: visited ? 'style_topic_visited' : 'style_topic',
    });

    // 帖子作者
    await ac.createText({
        name: `lbl_author_${post.id}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: UserSystem.getUserName(post.authorId),
        pos: {
            x: 800,
            y: posY + ForumUI.TOPIC.height / 2 + 10,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 200,
            height: ForumUI.TOPIC.height,
        },
        style: 'style_name',
    });

    // 发帖时间
    await ac.createText({
        name: `lbl_time_${post.id}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        content: ForumUI.formatRelativeTime(post.timestamp),
        pos: {
            x: 800,
            y: posY + ForumUI.TOPIC.height / 2 - 10,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 200,
            height: ForumUI.TOPIC.height,
        },
        style: 'style_time',
    });

    // 最后回复
    let lastReply = post.reply[post.reply.length - 1];
    if (lastReply) {
        await ac.createText({
            name: `lbl_last_reply_${post.id}`,
            index: 1,
            inlayer: ForumUI.SV.name,
            content: UserSystem.getUserName(lastReply.authorId),
            pos: {
                x: 1000,
                y: posY + ForumUI.TOPIC.height / 2 + 10,
            },
            anchor: {
                x: 0,
                y: 50,
            },
            size: {
                width: 200,
                height: ForumUI.TOPIC.height,
            },
            style: 'style_name',
        });
        await ac.createText({
            name: `lbl_last_reply_time_${post.id}`,
            index: 1,
            inlayer: ForumUI.SV.name,
            content: ForumUI.formatRelativeTime(lastReply.timestamp),
            pos: {
                x: 1000,
                y: posY + ForumUI.TOPIC.height / 2 - 10,
            },
            anchor: {
                x: 0,
                y: 50,
            },
            size: {
                width: 200,
                height: ForumUI.TOPIC.height,
            },
            style: 'style_time',
        });
    }

    ac.addEventListener({
        type: ac.EVENT_TYPES.onTouchEnded,
        listener: viewPost,
        target: `lbl_topic_${post.id}`,
    });

}

async function onClose() {
    let flag = ForumSystem.isAllPostVisited();
    console.log(`是否看完了所有的帖子：${flag}`);
    if (!flag) {
        await showGameAlert("请先看完所有的帖子！");
    } else {
        await showGameAlert("TODO: 进入下一个剧情");
    }
}

await createBrowserUI(onClose);

// 创建论坛 UI
let pageHeight = ForumUI.calcMainPageHeight(0);
await createForumUI(pageHeight);

async function initPostList() {
    let postsList = ForumSystem.getTopicListByPageIndex(0);

    let startY = Math.max(ForumUI.PAGE.height, pageHeight) - ForumUI.HEADER.height - ForumUI.HEADER.marginBottom;

    for (var i = 0; i < postsList.length; i++) {
        let post = postsList[i];
        let y = startY - (i + 1) * ForumUI.TOPIC.height;
        console.log(`正在创建第 ${i} 个帖子 ${post.id}`);
        await createItemTopic(post, i, y);
    }

    console.log("所有帖子创建完毕！");
}

// 执行
await initPostList();

await startTimeLoop();
