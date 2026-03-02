// 地图页面
console.log('[LOAD] ui_map_full');

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

// 注册点击事件
async function registerClickEvent() {
    async function gotoArea(areaIndex) {
        // 直接在这里记录点击
        MapSystem.setCurrentAreaIndex(areaIndex);
        await ac.replaceUI({
            name: 'replaceUI_area',
            uiId: ResMap[`ui_area_${areaIndex}`],
        });
    }
    for (let i = 1; i <= 5; i++) {
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                let state = MapSystem.getAreaState(i);
                switch (state) {
                    case 0:
                        await gotoArea(i);
                        break;
                    case -1:
                        await showGameAlert("该区域未解锁！");
                        break;
                    case 1:
                        await showGameAlert("该区域已查看！");
                        break;
                    default:
                        console.warn(`未知的区域状态: ${state}`);
                        break;
                }
            },
            target: `img_area_${i}`,
        });
    }
}


// 解锁进度
async function playUnlockAnim() {
    let currentIndex = MapSystem.getCurrentAreaIndex();
    let nextIndex = currentIndex + 1;
    console.log('[LOG] playUnlockAnim', currentIndex, nextIndex);
    // 创建已解锁区域遮罩(淡出)
    await ac.createImage({
        name: `img_mask_area_${currentIndex}`,
        index: 5,
        inlayer: 'img_map_bg',
        resId: ResMap[`pic_mask_area_${currentIndex}`],
        pos: { x: MapSystem.width / 2, y: MapSystem.height / 2 },
        anchor: { x: 50, y: 50 },
        scale: 100,
        opacity: 100,
    });

    // 淡出
    ac.hide({
        name: `img_mask_area_${currentIndex}`,
        effect: 'fadeout',
        duration: 1000,
        canskip: false,
    });

    if (nextIndex <= 5) {
        // 创建待探索区域遮罩(淡入)
        await ac.createImage({
            name: `img_mask_area_${nextIndex}`,
            index: 5,
            inlayer: 'img_map_bg',
            resId: ResMap[`pic_mask_area_${nextIndex}`],
            pos: { x: MapSystem.width / 2, y: MapSystem.height / 2 },
            anchor: { x: 50, y: 50 },
            scale: 100,
            opacity: 100,
        });

        ac.show({
            name: `img_mask_area_${nextIndex}`,
            effect: 'fadein',
            duration: 1000,
            canskip: false,
        });
    }

}

await registerClickEvent();
await playUnlockAnim();
