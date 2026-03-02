// 地图页面
console.log('[LOAD] ui_map');

async function gotoNextPlot() {
    await ac.jump({
        plotID: ResMap.plot_map_next,
        transition: ac.SCENE_TRANSITION_TYPES.normal,
    });
}

// 注册点击事件
async function registerClickEvent() {
    async function gotoArea(areaIndex) {
        // 直接在这里记录点击
        MapSystem.setCurrentAreaIndex(areaIndex);
        await ac.jump({
            plotID: ResMap[`plot_area_${areaIndex}`],
            transition: ac.SCENE_TRANSITION_TYPES.normal,
        });
    }
    for (let i = 1; i <= 5; i++) {
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                if (MapSystem.isAllAreaUnlocked()) {
                    await gotoNextPlot();
                    return;
                }
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

    if (MapSystem.isAllAreaUnlocked()) {
        await ac.delay({
            time: 2000
        });
        // 前往下一章
        await gotoNextPlot();
    }

}

await createMapUI();
await registerClickEvent();
await playUnlockAnim();
