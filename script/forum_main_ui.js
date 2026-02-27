// 窗口
let browser_width = 1280;
let browser_height = 720;

// 页面
let page_width = 1200;

// 创建标题项
async function createItemTopic(post, posY) {
    let layer_name = `btn_topic_${post.id}`;
    await ac.createOption({
        name: layer_name,
        index: 0,
        inlayer: 'sv_forum_main',
        visible: true,
        nResId: '$183003987',
        sResId: '$183003987',
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
            x: page_width * 100 / 96,
            y: 48 * 100 / 96,
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


await ac.createLayer({
    name: 'layer_browser',
    index: 1,
    inlayer: 'window',
    visible: true,
    pos: {
        x: browser_width * 0.5,
        y: browser_height * 0.5,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    size: {
        width: browser_width,
        height: browser_height,
    },
    clipMode: true,
});

await ac.createImage({
    name: 'img_browser_bg',
    index: 0,
    inlayer: 'layer_browser',
    resId: '$182983354',
    pos: {
        x: browser_width * 0.5,
        y: browser_height * 0.5,
    },
    anchor: {
        x: 50,
        y: 50,
    },
});

await ac.createScrollView({
    name: 'sv_forum_main',
    index: 0,
    inlayer: 'layer_browser',
    visible: true,
    pos: {
        x: 640,
        y: 340,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    size: {
        width: page_width,
        height: 300,
    },
    innerSize: {
        width: page_width,
        height: 600,
    },
    horizontalScroll: false,
    verticalScroll: true,
});

ForumSystem.posts.forEach((postData, index) => {
    createItemTopic(postData, 300 - 50 * index);
});
