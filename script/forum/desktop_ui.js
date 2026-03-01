await ac.createLayer({
    name: 'layer_desktop',
    index: 1,
    inlayer: 'window',
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
        width: 1280,
        height: 720,
    },
    clipMode: true,
});
await ac.createImage({
    name: 'img_desktop',
    index: 0,
    inlayer: 'layer_desktop',
    resId: '$182982547',
    pos: {
        x: 640,
        y: 360,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    opacity: 100,
    scale: 100,
    visible: true,
    verticalFlip: false,
    horizontalFlip: false,
});

async function func_open_forum() {
    await ac.replaceUI({
        name: 'replaceUI_forum',
        uiId: 'nw48gnat',
    });
}

await ac.createOption({
    name: 'btn_browser',
    index: 1,
    inlayer: 'layer_desktop',
    visible: true,
    nResId: '$182972526',
    sResId: '$182972526',
    content: ``,
    pos: {
        x: 78,
        y: 646,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    onTouchEnded: func_open_forum,
});

await startTimeLoop();
