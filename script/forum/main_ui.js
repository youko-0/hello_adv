// 窗口
let browserWidth = 1280;
let browserHeight = 720;

// 创建标题项
async function createItemTopic(post, index, posY) {
    let layerName = `btn_topic_${post.id}`;
    let bgStyle = index % 1 == 0 ? ForumStyle.TOPIC.BG_NORMAL : ForumStyle.TOPIC.BG_HIGHLIGHT;
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
    // await ac.createText({
    //     name: `lbl_topic_${post.id}`,
    //     index: 0,
    //     inlayer: layer_name,
    //     visible: true,
    //     content: post.topic,
    //     anchor: {
    //         x: 0,
    //         y: 50,
    //     },
    //     pos: {
    //         x: 20,
    //         y: 24,
    //     },
    // })
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

// 网页背景图
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
    // 这里只有三条帖子, 超不过页面高度, innerSize 直接设置为页面高度
    innerSize: {
        width: ForumStyle.PAGE.WIDTH,
        height: ForumStyle.PAGE.HEIGHT,
    },
    horizontalScroll: false,
    verticalScroll: true,
});

ForumSystem.posts.forEach((postData, index) => {
    let y = ForumStyle.PAGE.HEIGHT - (index + 1) * ForumStyle.TOPIC.HEIGHT;
    createItemTopic(postData, index, y);
});
