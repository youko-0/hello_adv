// 窗口
let browserWidth = 1280;
let browserHeight = 720;
let innerMargin = 10;       // 和版头的距离

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
    name: 'style_time',
    // font: '思源黑体',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 18,
    color: '#cbd6dc',
});

// 创建标题项
async function createItemTopic(post, index, posY) {

    async function viewPost() {
        ForumSystem.setCurrentPostId(post.id);
        await ac.replaceUI({
            name: 'replaceUI12',
            uiId: 'dbjp9oun',
        });
    }

    let bgStyle = index % 2 == 0 ? ForumUI.TOPIC.BG_NORMAL : ForumUI.TOPIC.BG_HIGHLIGHT;
    let visited = ForumSystem.isPostVisited(post.id);

    await ac.createImage({
        name: `btn_topic_${post.id}`,
        index: 0,
        inlayer: ForumUI.SV.name,
        visible: true,
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
        visible: true,
        content: `【${post.reply.length}】`,
        // 左边空白
        pos: {
            x: 16,
            y: posY + ForumUI.TOPIC.height / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 80,
            height: ForumUI.TOPIC.height,
        },
        style: 'style_topic',
    });

    // 帖子标题
    await ac.createText({
        name: `lbl_topic_${post.id}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        visible: true,
        content: post.topic,
        // 左边空白
        pos: {
            x: 80,
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
        visible: true,
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
        style: 'style_time',
    });

    // 发帖时间
    await ac.createText({
        name: `lbl_time_${post.id}`,
        index: 1,
        inlayer: ForumUI.SV.name,
        visible: true,
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
            visible: true,
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
            style: 'style_time',
        });
        await ac.createText({
            name: `lbl_last_reply_time_${post.id}`,
            index: 1,
            inlayer: ForumUI.SV.name,
            visible: true,
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
// 帖子数量不多不会翻页且高度固定，直接相乘计算高度
let pageHeight = ForumUI.TOPIC.height * Object.keys(ForumSystem.postsMap).length + ForumUI.HEAD.height + innerMargin;
await createForumUI(pageHeight);

async function initPostList() {
    let postsList = Object.values(ForumSystem.postsMap);
    // 根据时间戳排序, 最新的在前面
    postsList.sort(function (a, b) {
        return b.timestamp - a.timestamp;
    });

    let startY = Math.max(ForumUI.PAGE.height, pageHeight) - ForumUI.HEAD.height - innerMargin

    for (var i = 0; i < postsList.length; i++) {
        let post = postsList[i];
        let y = startY - (i + 1) * ForumUI.TOPIC.height;
        console.log(`正在创建第 ${i} 个帖子，时间戳：${post.timestamp}`);
        await createItemTopic(post, i, y);
    }

    console.log("所有帖子创建完毕！");
}

// 执行
await initPostList();
