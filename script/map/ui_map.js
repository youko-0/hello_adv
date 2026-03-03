// 地图页面
console.log('[LOAD] ui_map');

async function gotoNextPlot() {
    async function onConfirm() {
        await ac.jump({
            plotID: ResMap.plot_map_next,
            transition: ac.SCENE_TRANSITION_TYPES.normal,
        });
    }
    await showGameAlert("探索全部完成", onConfirm);
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

await createMapUI();
await refreshMapMask();
await registerClickEvent();

// 全部解锁前往下一章
if (MapSystem.isAllAreaUnlocked()) {
    await ac.delay({
        time: 2000
    });
    await gotoNextPlot();
}