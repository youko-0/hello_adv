// 地图页面
console.log('[LOAD] ui_map_full');

await ac.createLayer({
    name: 'layer_full_map',
    index: 1,
    inlayer: 'window',
    pos: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    size: { width: MapUI.width, height: MapUI.height },
    clipMode: true,
});

await ac.createImage({
    name: 'img_mask',
    index: 1,
    inlayer: 'layer_full_map',
    resId: MapUI.MASK.resId,
    pos: { x: MapUI.width / 2, y: MapUI.height / 2 },
    anchor: { x: 50, y: 50 },
    scale: { x: MapUI.width * 100 / MapUI.MASK.width, y: MapUI.height * 100 / MapUI.MASK.height },
    opacity: 80,
});

await ac.createImage({
    name: 'img_map_bg',
    index: 0,
    inlayer: 'layer_full_map',
    resId: ResMap.pic_map_bg,
    pos: { x: MapUI.width / 2, y: MapUI.height / 2 },
    anchor: { x: 50, y: 50 },
});

await ac.createImage({
    name: 'img_area_1',
    index: 1,
    inlayer: 'img_map_bg',
    resId: ResMap.img_area_1,
    pos: { x: 628, y: 370 },
    anchor: { x: 50, y: 50 },
});

await ac.createImage({
    name: 'img_area_2',
    index: 1,
    inlayer: 'img_map_bg',
    resId: ResMap.img_area_2,
    pos: { x: 334, y: 142 },
    anchor: { x: 50, y: 50 },
});

await ac.createImage({
    name: 'img_area_3',
    index: 1,
    inlayer: 'img_map_bg',
    resId: ResMap.img_area_3,
    pos: { x: 1088, y: 650 },
    anchor: { x: 50, y: 50 },
});

await ac.createImage({
    name: 'img_area_4',
    index: 1,
    inlayer: 'img_map_bg',
    resId: ResMap.img_area_4,
    pos: { x: 106, y: 540 },
    anchor: { x: 50, y: 50 },
});

await ac.createImage({
    name: 'img_area_5',
    index: 1,
    inlayer: 'img_map_bg',
    resId: ResMap.img_area_5,
    pos: { x: 1096, y: 348 },
    anchor: { x: 50, y: 50 },
});
