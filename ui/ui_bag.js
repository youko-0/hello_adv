

await ac.createImage({
    name: 'image2',
    index: 100,
    inlayer: 'window',
    resId: '$183664278',
    pos: {
        x: 640,
        y: 360,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    opacity: 50,
    scale: 100,
    visible: true,
    verticalFlip: false,
    horizontalFlip: false,
});

await ac.createImage({
    name: 'img_bg',
    index: 0,
    inlayer: 'window',
    resId: '$183658448',
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

await ac.createImage({
    name: 'img_title',
    index: 2,
    inlayer: 'window',
    resId: '$183658488',
    pos: {
        x: 26,
        y: 669,
    },
    anchor: {
        x: 0,
        y: 50,
    },
    opacity: 100,
    scale: 100,
    visible: true,
    verticalFlip: false,
    horizontalFlip: false,
});

async function function1() {

}

await ac.createOption({
    name: 'btn_close_ui',
    index: 0,
    inlayer: 'window',
    visible: true,
    nResId: '$183658478',
    sResId: '$183658477',
    content: ``,
    pos: {
        x: 1220,
        y: 72,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    onTouchEnded: function1,
});

await ac.createScrollView({
    name: 'sv_items',
    index: 0,
    inlayer: 'window',
    visible: true,
    pos: {
        x: 450,
        y: 360,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    size: {
        width: 512,
        height: 360,
    },
    innerSize: {
        width: 512,
        height: 360,
    },
    horizontalScroll: false,
    verticalScroll: true,
});

await ac.createImage({
    name: 'img_item_1',
    index: 0,
    inlayer: 'sv_items',
    resId: '$183658487',
    pos: {
        x: 58,
        y: 280,
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

await ac.createText({
    name: 'lbl_item_name_1',
    index: 200,
    inlayer: 'window',
    visible: true,
    content: `物品名称`,
    pos: {
        x: 250,
        y: 410,
    },
    size: {
        width: 72,
        height: 16,
    },
    direction: ac.TEXT_DIRECTION_TYPES.horizontal,
    halign: ac.HALIGN_TYPES.left,
    valign: ac.VALIGN_TYPES.center,
    spacing: 1.5,
    anchor: {
        x: 50,
        y: 50,
    },
});

await ac.createText({
    name: 'lbl_item_count_1',
    index: 200,
    inlayer: 'window',
    visible: true,
    content: `99`,
    pos: {
        x: 280,
        y: 452,
    },
    size: {
        width: 16,
        height: 16,
    },
    direction: ac.TEXT_DIRECTION_TYPES.horizontal,
    halign: ac.HALIGN_TYPES.left,
    valign: ac.VALIGN_TYPES.center,
    spacing: 1.5,
    anchor: {
        x: 50,
        y: 50,
    },
});

await ac.createImage({
    name: 'img_item_2',
    index: 0,
    inlayer: 'sv_items',
    resId: '$183658487',
    pos: {
        x: 188,
        y: 280,
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

await ac.createImage({
    name: 'img_item_3',
    index: 0,
    inlayer: 'sv_items',
    resId: '$183658487',
    pos: {
        x: 54,
        y: 82,
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

await ac.createImage({
    name: 'img_item_detail_bg',
    index: 5,
    inlayer: 'window',
    resId: '$183685565',
    pos: {
        x: 900,
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

await ac.createImage({
    name: 'img_item_title_bg',
    index: 5,
    inlayer: 'window',
    resId: '$183685868',
    pos: {
        x: 900,
        y: 488,
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

await ac.createOption({
    name: 'btn_use',
    index: 5,
    inlayer: 'window',
    visible: true,
    nResId: '$183658483',
    sResId: '$183658482',
    content: ``,
    pos: {
        x: 894,
        y: 228,
    },
    anchor: {
        x: 50,
        y: 50,
    },
    onTouchEnded: function1,
});
await ac.createText({
    name: 'lbl_item_detail_name',
    index: 200,
    inlayer: 'window',
    visible: true,
    content: `道具名称有八个字`,
    pos: {
        x: 900,
        y: 480,
    },
    size: {
        width: 240,
        height: 36,
    },
    direction: ac.TEXT_DIRECTION_TYPES.horizontal,
    halign: ac.HALIGN_TYPES.middle,
    valign: ac.VALIGN_TYPES.top,
    spacing: 1,
    anchor: {
        x: 50,
        y: 50,
    },
});

await ac.createText({
    name: 'lbl_item_detail_desc',
    index: 5,
    inlayer: 'window',
    visible: true,
    content: `文本文本文本文本文本文本文本文本文本`,
    pos: {
        x: 900,
        y: 380,
    },
    size: {
        width: 240,
        height: 120,
    },
    direction: ac.TEXT_DIRECTION_TYPES.horizontal,
    halign: ac.HALIGN_TYPES.middle,
    valign: ac.VALIGN_TYPES.center,
    spacing: 1.2,
    anchor: {
        x: 50,
        y: 50,
    },
});