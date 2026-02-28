// 窗口
let browserWidth = 1280;
let browserHeight = 720;

ac.createStyle({
    name: 'style_topic',
    font: '思源黑体',
    bold: false,
    italic: false,
    fontSize: ForumUI.TOPIC.HEIGHT / 4,
    color: '#1a3959',
});

ac.createStyle({
    name: 'style_time',
    font: '思源黑体',
    bold: false,
    italic: false,
    fontSize: ForumUI.TOPIC.HEIGHT / 4,
    color: '#888888',
});

// 创建标题项
async function createItemTopic(post, index, posY) {
    let layerName = `btn_topic_${post.id}`;
    let bgStyle = index % 2 == 0 ? ForumUI.TOPIC.BG_NORMAL : ForumUI.TOPIC.BG_HIGHLIGHT;
    console.log(index, bgStyle);

    async function gotoPost() {
        ac.var.currentPostId = post.id;
        console.log('gotoPost', post.id, ac.var.currentPostId);
        await ac.replaceUI({
            name: 'replaceUI12',
            uiId: 'dbjp9oun',
        });
    }
    await ac.createOption({
        name: layerName,
        index: 0,
        inlayer: 'sv_topic',
        visible: true,
        nResId: bgStyle.resId,
        sResId: bgStyle.resId,
        content: ``,
        pos: {
            x: 0,
            y: posY,
        },
        anchor: {
            x: 0,
            y: 0,
        },
        scale: {
            x: ForumUI.PAGE.WIDTH * 100 / bgStyle.width,
            y: ForumUI.TOPIC.HEIGHT * 100 / bgStyle.height,
        },
        onTouchEnded: gotoPost,
    });

    // 帖子标题
    // 上面的背景是缩放实现的，这里文字不能放在背景下面
    await ac.createText({
        name: `lbl_topic_${post.id}`,
        index: 1,
        inlayer: 'sv_topic',
        visible: true,
        content: post.topic,
        // 左边空白
        pos: {
            x: 80,
            y: posY + ForumUI.TOPIC.HEIGHT / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 400,
            height: ForumUI.TOPIC.HEIGHT,
        },
        style: 'style_topic',
    });

    // 帖子作者
    await ac.createText({
        name: `lbl_author_${post.id}`,
        index: 1,
        inlayer: 'sv_topic',
        visible: true,
        content: UserSystem.getUserName(post.authorId),
        pos: {
            x: 800,
            y: posY + ForumUI.TOPIC.HEIGHT / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 200,
            height: ForumUI.TOPIC.HEIGHT,
        },
        style: 'style_topic',
    });

    // 帖子时间
    await ac.createText({
        name: `lbl_time_${post.id}`,
        index: 1,
        inlayer: 'sv_topic',
        visible: true,
        content: ForumSystem.formatRelativeTime(post.timestamp),
        pos: {
            x: 1000,
            y: posY + ForumUI.TOPIC.HEIGHT / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 200,
            height: ForumUI.TOPIC.HEIGHT,
        },
        style: 'style_time',
    });

}

await BrowserUI.createBrowserUI();

// 网页
await ac.createLayer({
    name: 'layer_page',
    index: 1,
    inlayer: 'window',
    visible: true,
    // 左右居中底对齐
    pos: {
        x: browserWidth / 2,
        y: 32,
    },
    anchor: {
        x: 50,
        y: 0,
    },
    size: {
        width: ForumUI.PAGE.WIDTH,
        height: ForumUI.PAGE.HEIGHT,
    },
    clipMode: true,
});

// 网页背景图片
await ac.createImage({
    name: 'img_page_bg',
    index: 0,
    inlayer: 'layer_page',
    resId: ForumUI.PAGE.BG.resId,
    pos: {
        x: 0,
        y: 0,
    },
    anchor: {
        x: 0,
        y: 0,
    },
    scale: {
        x: ForumUI.PAGE.WIDTH * 100 / ForumUI.PAGE.BG.width,
        y: ForumUI.PAGE.HEIGHT * 100 / ForumUI.PAGE.BG.height,
    }
})

// 帖子列表
await ac.createScrollView({
    name: 'sv_topic',
    index: 1,
    inlayer: 'layer_page',
    visible: true,
    pos: {
        x: 0,
        y: 0,
    },
    anchor: {
        x: 0,
        y: 0,
    },
    size: {
        width: ForumUI.PAGE.WIDTH,
        height: ForumUI.PAGE.HEIGHT,
    },
    // 帖子数量不多, 超不过页面高度, innerSize 直接设置为页面高度
    innerSize: {
        width: ForumUI.PAGE.WIDTH,
        height: ForumUI.PAGE.HEIGHT,
    },
    horizontalScroll: false,
    verticalScroll: true,
});

async function initPostList() {
    let postsList = Object.values(ForumSystem.postsMap);
    // 根据时间戳排序, 最新的在前面
    postsList.sort(function (a, b) {
        return b.timestamp - a.timestamp;
    });

    for (var i = 0; i < postsList.length; i++) {
        let post = postsList[i];
        let y = ForumUI.PAGE.HEIGHT - (i + 1) * ForumUI.TOPIC.HEIGHT;
        console.log(`正在创建第 ${i} 个帖子，时间戳：${post.timestamp}`);
        await createItemTopic(post, i, y);
    }

    console.log("所有帖子创建完毕！");
}

// 执行
await initPostList();

// 关闭按钮
let flag = ForumSystem.isAllPostReaded();
console.log(`是否看完了所有的帖子：${flag}`);
if (flag) {
    await ac.createOption({
        name: 'btn_close',
        index: 5,
        inlayer: 'window',
        visible: true,
        nResId: ForumUI.BTN.CLOSE.resIdNormal,
        sResId: ForumUI.BTN.CLOSE.resIdHighlight,
        content: ``,
        pos: {
            x: browserWidth,
            y: browserHeight,
        },
        anchor: {
            x: 100,
            y: 100,
        },
    });

}

