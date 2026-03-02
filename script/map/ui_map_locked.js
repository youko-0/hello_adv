// 未解锁地图页面
console.log('[LOAD] ui_map_locked');

await ac.createLayer({
    name: 'layer_full_map',
    index: 1,
    inlayer: 'window',
    pos: { x: 0, y: 0 },
    anchor: { x: 0, y: 0 },
    size: { width: MapSystem.width, height: MapSystem.height },
    clipMode: true,
});

await ac.createImage({
    name: 'img_map_bg',
    index: 0,
    inlayer: 'layer_full_map',
    resId: ResMap.pic_map_bg,
    pos: { x: MapSystem.width / 2, y: MapSystem.height / 2 },
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

// 解锁进度
async function playUnlockAnim() {
    let currentIndex = MapSystem.getCurrentAreaIndex();
    let nextIndex = currentIndex + 1;
    console.log('[LOG] playUnlockAnim', currentIndex, nextIndex);
    // 创建已解锁区域遮罩
    await ac.createImage({
        name: `img_mask_area_${currentIndex}`,
        index: 5,
        inlayer: 'img_map_bg',
        resId: ResMap[`pic_mask_area_${currentIndex}`],
        pos: { x: MapSystem.width / 2, y: MapSystem.height / 2 },
        anchor: { x: 50, y: 50 },
        scale: 100,
        opacity: 20,
    });
}

await playUnlockAnim();
