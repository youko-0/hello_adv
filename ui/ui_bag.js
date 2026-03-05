// 背包界面
console.log('[LOAD] ui_bag');

const BagUI = {
    horiCount: 3,       // 道具水平数量
    vertCount: 2,       // 道具垂直数量
    sv: {
        width: 420,     // 道具列表宽度
        height: 348,    // 道具列表高度
        sliderWidth: 40, // 滑动条宽度
    },
    bg: {
        resIdNormal: ResMap.img_bag_item_normal,
        resIdHighlight: ResMap.img_bag_item_highlight,
        width: 106,     // 道具项宽度
        height: 148,    // 道具项高度
        halfWidth: 106 / 2,  // 道具项宽度的一半
        halfHeight: 148 / 2, // 道具项高度的一半
    },
    icon: {
        width: 64,      // 道具图标宽度
        height: 64,     // 道具图标高度
    },

}

ac.createStyle({
    name: 'style_item',
    font: '汉仪小隶书简',
    bold: false,
    italic: false,
    fontSize: 20,
    color: '#d1d3df',
});

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
    opacity: 0,
    scale: 100,
    verticalFlip: false,
    horizontalFlip: false,
});


async function createItemUI(itemId, posX, posY) {
    let itemConfig = InventorySystem.getItemConfig(itemId);
    // 背景
    await ac.createOption({
        name: `bag_item_bg_${itemId}`,
        index: 0,
        inlayer: 'sv_items',
        nResId: BagUI.bg.resIdNormal,
        sResId: BagUI.bg.resIdHighlight,
        content: ``,
        pos: { x: posX, y: posY },
        anchor: { x: 50, y: 50 },
    });
    // 道具图标
    await ac.createImage({
        name: `bag_item_icon_${itemId}`,
        index: 1,
        inlayer: 'sv_items',
        resId: itemConfig.icon,
        pos: { x: posX, y: posY + 20 },
        anchor: { x: 50, y: 50 },
    });

    // 道具名称
    await ac.createText({
        name: `lbl_item_name_${itemId}`,
        index: 1,
        inlayer: 'sv_items',
        content: Utils.truncateText(itemConfig.name, 4),
        pos: { x: posX, y: posY - 48 },
        size: { width: BagUI.bg.width - 4, height: 28 },
        halign: ac.HALIGN_TYPES.middle,
        valign: ac.VALIGN_TYPES.center,
        anchor: { x: 50, y: 50 },
        style: 'style_item',
    });

    // 道具数量底框
    await ac.createImage({
        name: `bag_item_count_${itemId}`,
        index: 2,
        inlayer: 'sv_items',
        resId: ResMap.img_bag_item_count,
        pos: { x: posX + 30, y: posY - 4 },
        anchor: { x: 50, y: 50 },
    });

    // 道具数量
    await ac.createText({
        name: `lbl_item_count_${itemId}`,
        index: 2,
        inlayer: 'sv_items',
        content: `${InventorySystem.getItemCount(itemId)}`,
        pos: { x: posX + 30, y: posY - 4 },
        size: { width: 40, height: 28 },
        halign: ac.HALIGN_TYPES.middle,
        valign: ac.VALIGN_TYPES.center,
        anchor: { x: 50, y: 50 },
        style: 'style_item',
    })
}

// 创建道具列表
async function createItemList(itemList) {
    let count = itemList.length;
    // 计算行数
    let rowCount = Math.ceil(count / BagUI.horiCount);
    // 计算水平间距
    // 空出一个滑动条的宽度
    let horiSpace = Math.floor((BagUI.sv.width - BagUI.sv.sliderWidth - BagUI.horiCount * BagUI.bg.width) / (BagUI.horiCount - 1));
    let vertSpace = Math.floor((BagUI.sv.height - BagUI.vertCount * BagUI.bg.height) / (BagUI.vertCount - 1));
    // 计算列表高度
    let listHeight = rowCount * BagUI.bg.height + (rowCount - 1) * vertSpace;
    listHeight = Math.max(listHeight, BagUI.sv.height);
    console.log(`horiSpace: ${horiSpace}, vertSpace: ${vertSpace}, rowCount: ${rowCount}, listHeight: ${listHeight}`);

    // 创建滚动层容器
    await ac.createScrollView({
        name: 'sv_items',
        index: 1,
        inlayer: 'img_ui_bg',
        pos: { x: 450, y: 360 },
        anchor: { x: 50, y: 50 },
        size: { width: BagUI.sv.width, height: BagUI.sv.height },
        innerSize: { width: BagUI.sv.width, height: listHeight },
        horizontalScroll: false,
        verticalScroll: true,
    });

    // 创建道具项
    let startX = BagUI.bg.halfWidth;
    let startY = listHeight - BagUI.bg.halfHeight;
    console.log(`startX: ${startX}, startY: ${startY}`);
    for (let i = 0; i < count; ++i) {
        let itemId = itemList[i];
        let row = Math.floor(i / BagUI.horiCount);
        let col = i % BagUI.horiCount;
        let x = startX + col * (BagUI.bg.width + horiSpace);
        let y = startY - row * (BagUI.bg.height + vertSpace);
        await createItemUI(itemId, x, y);
    }

}

await ac.createImage({
    name: 'img_ui_bg',
    index: 0,
    inlayer: 'window',
    resId: ResMap.pic_common_bg_02,
    pos: { x: GameConfig.centerX, y: GameConfig.centerY },
    anchor: { x: 50, y: 50 },
});

await ac.createImage({
    name: 'img_title',
    index: 1,
    inlayer: 'img_ui_bg',
    resId: ResMap.img_bag_title,
    pos: { x: 26, y: 670 },
    anchor: { x: 0, y: 50 },
});

await ac.createOption({
    name: 'btn_ui_close',
    index: 0,
    inlayer: 'img_ui_bg',
    nResId: ResMap.btn_common_close_normal,
    sResId: ResMap.btn_common_close_highlight,
    content: ``,
    pos: { x: 1220, y: 72 },
    anchor: { x: 50, y: 50 },
    onTouchEnded: ac.removeCurrentUI,
});

let itemList = InventorySystem.getItemListByType(ItemType.KEY);
await createItemList(itemList);

// await ac.createImage({
//     name: 'img_item_1',
//     index: 0,
//     inlayer: 'sv_items',
//     resId: '$183658487',
//     pos: {
//         x: 58,
//         y: 280,
//     },
//     anchor: {
//         x: 50,
//         y: 50,
//     },
//     opacity: 100,
//     scale: 100,
//     visible: true,
//     verticalFlip: false,
//     horizontalFlip: false,
// });

// await ac.createImage({
//     name: 'img_item_icon_1',
//     index: 200,
//     inlayer: 'sv_items',
//     resId: '$183687836',
//     pos: {
//         x: 56,
//         y: 300,
//     },
//     anchor: {
//         x: 50,
//         y: 50,
//     },
//     opacity: 100,
//     scale: 100,
//     visible: true,
//     verticalFlip: false,
//     horizontalFlip: false,
// });

// await ac.createText({
//     name: 'lbl_item_name_1',
//     index: 200,
//     inlayer: 'window',
//     visible: true,
//     content: `物品名称`,
//     pos: {
//         x: 250,
//         y: 410,
//     },
//     size: {
//         width: 72,
//         height: 16,
//     },
//     direction: ac.TEXT_DIRECTION_TYPES.horizontal,
//     halign: ac.HALIGN_TYPES.left,
//     valign: ac.VALIGN_TYPES.center,
//     spacing: 1.5,
//     anchor: {
//         x: 50,
//         y: 50,
//     },
// });

// await ac.createImage({
//     name: 'img_bag_item_count_1',
//     index: 5,
//     inlayer: 'window',
//     resId: '$183688524',
//     pos: {
//         x: 280,
//         y: 460,
//     },
//     anchor: {
//         x: 50,
//         y: 50,
//     },
//     opacity: 100,
//     scale: 100,
//     visible: true,
//     verticalFlip: false,
//     horizontalFlip: false,
// });

// await ac.createText({
//     name: 'lbl_item_count_1',
//     index: 200,
//     inlayer: 'window',
//     visible: true,
//     content: `99`,
//     pos: {
//         x: 280,
//         y: 452,
//     },
//     size: {
//         width: 16,
//         height: 16,
//     },
//     direction: ac.TEXT_DIRECTION_TYPES.horizontal,
//     halign: ac.HALIGN_TYPES.left,
//     valign: ac.VALIGN_TYPES.center,
//     spacing: 1.5,
//     anchor: {
//         x: 50,
//         y: 50,
//     },
// });

// await ac.createImage({
//     name: 'img_item_2',
//     index: 0,
//     inlayer: 'sv_items',
//     resId: '$183658487',
//     pos: {
//         x: 188,
//         y: 280,
//     },
//     anchor: {
//         x: 50,
//         y: 50,
//     },
//     opacity: 100,
//     scale: 100,
//     visible: true,
//     verticalFlip: false,
//     horizontalFlip: false,
// });

// await ac.createImage({
//     name: 'img_item_3',
//     index: 0,
//     inlayer: 'sv_items',
//     resId: '$183658487',
//     pos: {
//         x: 54,
//         y: 82,
//     },
//     anchor: {
//         x: 50,
//         y: 50,
//     },
//     opacity: 100,
//     scale: 100,
//     visible: true,
//     verticalFlip: false,
//     horizontalFlip: false,
// });

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