// 窗口
let browserWidth = 1280;
let browserHeight = 720;

ac.createStyle({
    name: 'style_topic',
    font: '思源黑体',
    bold: false,
    italic: false,
    fontSize: ForumStyle.TOPIC.HEIGHT / 4,
    color: '#1a3959',
});

ac.createStyle({
    name: 'style_time',
    font: '思源黑体',
    bold: false,
    italic: false,
    fontSize: ForumStyle.TOPIC.HEIGHT / 4,
    color: '#888888',
});

// 创建标题项
async function createItemTopic(post, index, posY) {
    let layerName = `btn_topic_${post.id}`;
    let bgStyle = index % 2 == 0 ? ForumStyle.TOPIC.BG_NORMAL : ForumStyle.TOPIC.BG_HIGHLIGHT;
    console.log(index, bgStyle);
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
            x: ForumStyle.PAGE.WIDTH * 100 / bgStyle.width,
            y: ForumStyle.TOPIC.HEIGHT * 100 / bgStyle.height,
        }
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
            y: posY + ForumStyle.TOPIC.HEIGHT / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 400,
            height: ForumStyle.TOPIC.HEIGHT,
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
            y: posY + ForumStyle.TOPIC.HEIGHT / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 200,
            height: ForumStyle.TOPIC.HEIGHT,
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
            y: posY + ForumStyle.TOPIC.HEIGHT / 2,
        },
        anchor: {
            x: 0,
            y: 50,
        },
        size: {
            width: 200,
            height: ForumStyle.TOPIC.HEIGHT,
        },
        style: 'style_time',
    });
    
}

// 全屏背景
await ac.createImage({
    name: 'img_browser_bg',
    index: 0,
    inlayer: 'window',
    resId: '$182983354',
    pos: {
        x: 0,
        y: 0,
    },
    anchor: {
        x: 0,
        y: 0,
    },
});

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
        width: ForumStyle.PAGE.WIDTH,
        height: ForumStyle.PAGE.HEIGHT,
    },
    clipMode: true,
});

// 网页背景图片
await ac.createImage({
    name: 'img_page_bg',
    index: 0,
    inlayer: 'layer_page',
    resId: ForumStyle.PAGE.BG.resId,
    pos: {
        x: 0,
        y: 0,
    },
    anchor: {
        x: 0,
        y: 0,
    },
    scale: {
        x: ForumStyle.PAGE.WIDTH * 100 / ForumStyle.PAGE.BG.width,
        y: ForumStyle.PAGE.HEIGHT * 100 / ForumStyle.PAGE.BG.height,
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
        width: ForumStyle.PAGE.WIDTH,
        height: ForumStyle.PAGE.HEIGHT,
    },
    // 帖子数量不多, 超不过页面高度, innerSize 直接设置为页面高度
    innerSize: {
        width: ForumStyle.PAGE.WIDTH,
        height: ForumStyle.PAGE.HEIGHT,
    },
    horizontalScroll: false,
    verticalScroll: true,
});

async function initForum() {
    for (const [index, postData] of ForumSystem.posts.entries()) {
        let y = ForumStyle.PAGE.HEIGHT - (index + 1) * ForumStyle.TOPIC.HEIGHT;
        console.log(`正在创建第 ${index} 个帖子...`);
        await createItemTopic(postData, index, y);
    }

    console.log("所有帖子创建完毕！");
}
await initForum();

