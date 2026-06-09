// 探索通用 UI
console.log('[LOAD] inventory_ui');

const InventoryUI = {

    btnBag: {
        name: 'global_btn_bag',
    },
    // 物品详情
    itemDetail: {
        name: 'layer_item_detail',
    },

    // 背包按钮
    createBtnBag: async function () {
        await ac.createImage({
            name: InventoryUI.btnBag.name,
            index: ZORDER.SYSTEM_UI,
            inlayer: 'window',
            resId: ResMap.btn_bag_normal,
            pos: { x: GameConfig.width - 36, y: GameConfig.height - 186 },
            anchor: { x: 100, y: 100 },
        });
        // 绑定事件
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: InventorySystem.openBag,
            target: 'global_btn_bag'
        });
    },

    // 物品获得效果
    onGainItem: async function (itemId, itemNum, itemName) {
        ac.playAudio({
            name: 'audio_gain_item',
            resId: ResMap.audio_gain_item,
            vol: 50,
            effect: 'normal',
            loop: false,
        });
        // 从屏幕中心闪一个粒子飞去背包
        let startPos = await ac.getPos({
            name: itemName,
        });
        if (!startPos.x) {
            // 换成屏幕中心
            startPos = { x: GameConfig.centerX, y: GameConfig.centerY };
        }
        else {
            // 删除物品, 这里和动效同步进行
            ac.remove({
                name: itemName,
                effect: 'fadeout',
                duration: 100,
            })
        }
        let endPos = await ac.getPos({
            name: this.btnBag.name,
        });
        console.log('[LOG] onGainItem', startPos, endPos);
        await UIEffect.playTrailEffect(startPos, endPos);
        // 关闭对话框
        await ac.sysDialogOff({});
        // 打开背包界面
        await InventorySystem.openBag(itemId);

    },

    // 创建物品详情 UI, 大图 + 文字描述
    showItemDetail: async function (itemId, locked = false) {
        console.log('[LOG] showItemDetail', itemId, locked);
        let itemConfig = InventorySystem.getItemConfig(itemId);
        // 背景层
        await ac.createLayer({
            name: this.itemDetail.name,
            index: ZORDER.UI + 1,
            inlayer: 'window',
            pos: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 0, y: 0 },
            clipMode: false,
        })

        // 拦截点击
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchBegan,
            listener: CommonUI.onTouchMask,
            target: this.itemDetail.name,
        });
        // 大图
        const illust = locked? itemConfig.illustLocked: itemConfig.illust
        if (illust) {
            await ac.createImage({
                name: 'img_item_detail_bg',
                index: 0,
                inlayer: this.itemDetail.name,
                resId: ResMap.pic_common_bg_03,
                pos: { x: GameConfig.centerX, y: GameConfig.centerY },
                anchor: { x: 50, y: 50 },
                opacity: 80,

            });

            await ac.createImage({
                name: 'img_item_info_pic',
                index: 0,
                inlayer: this.itemDetail.name,
                resId: illust,
                pos: { x: GameConfig.centerX, y: GameConfig.centerY + 80 },
                anchor: { x: 50, y: 50 },
            });
        }
        const itemDesc = locked? itemConfig.descLocked: itemConfig.desc
        const itemIcon = locked? itemConfig.iconLocked: itemConfig.icon
        await CommonUI.showCustomDialog({
            content: itemDesc,
            // roleAvatarResId: itemIcon,   // 不显示小图标
        });
        await ac.remove({
            name: this.itemDetail.name,
            effect: 'fadeout',
            duration: 500,
            canskip: false,
        })
    },
}