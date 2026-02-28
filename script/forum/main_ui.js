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
    name: 'style_time',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 24,
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

    let layerName = `btn_topic_${post.id}`;
    let bgStyle = index % 2 == 0 ? ForumUI.TOPIC.BG_NORMAL : ForumUI.TOPIC.BG_HIGHLIGHT;
    console.log(index, bgStyle);

    await ac.createImage({
        name: layerName,
        index: 0,
        inlayer: 'sv_page',
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

    // 帖子标题
    // 上面的背景是缩放实现的，这里文字不能放在背景下面
    await ac.createText({
        name: `lbl_topic_${post.id}`,
        index: 1,
        inlayer: 'sv_page',
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
        style: 'style_topic',
    });

    // 帖子作者
    await ac.createText({
        name: `lbl_author_${post.id}`,
        index: 1,
        inlayer: 'sv_page',
        visible: true,
        content: UserSystem.getUserName(post.authorId),
        pos: {
            x: 800,
            y: posY + ForumUI.TOPIC.height / 2,
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

    // 帖子时间
    await ac.createText({
        name: `lbl_time_${post.id}`,
        index: 1,
        inlayer: 'sv_page',
        visible: true,
        content: ForumUI.formatRelativeTime(post.timestamp),
        pos: {
            x: 1000,
            y: posY + ForumUI.TOPIC.height / 2,
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

    ac.addEventListener({
        type: ac.EVENT_TYPES.onTouchEnded,
        listener: viewPost,
        target: `lbl_topic_${post.id}`,
    });

}

async function onClose() {
    alert("TODO: 进入下一个剧情")
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

    let startY = Math.max(ForumUI.PAGE.height, pageHeight)- ForumUI.HEAD.height - innerMargin 

    for (var i = 0; i < postsList.length; i++) {
        let post = postsList[i];
        let y = startY - (i + 1) * ForumUI.TOPIC.height ;
        console.log(`正在创建第 ${i} 个帖子，时间戳：${post.timestamp}`);
        await createItemTopic(post, i, y);
    }

    console.log("所有帖子创建完毕！");
}

// 执行
await initPostList();

let flag = ForumSystem.isAllPostReaded();
console.log(`是否看完了所有的帖子：${flag}`);
if (!flag) {
    // 隐藏关闭按钮
    ac.hide({
        name: 'btn_close_browser',
        effect: 'normal',
        duration: 0,
        canskip: false,
    });
}
