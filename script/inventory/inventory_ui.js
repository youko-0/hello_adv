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
            index: ZORDER.HUD,
            inlayer: 'window',
            resId: ResMap.btn_bag_normal,
            pos: { x: GameConfig.width - 64, y: GameConfig.height - 220 },
            anchor: { x: 50, y: 50 },
        });
        // 绑定事件
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () {
                await BagUI.open();
                // const itemId = await BagUI.open({ mode: 'choose' });
                // console.log('[LOG] 背包按钮点击', itemId);
            },
            target: 'global_btn_bag'
        });
    },

    /**
     * 获得道具并播放提示效果, await InventoryUI.gainItem(itemId, itemNum, itemName)
     * 数据由 InventorySystem.gainItem 处理，本方法负责表演与开背包
     * @param {string} itemId   道具ID
     * @param {number} itemNum  欲添加数量
     * @param {string} itemName 场景中的控件名, 控件消失并播放拖尾特效
     * @returns {number} 实际添加的数量 (0表示失败)
     */
    gainItem: async function (itemId, itemNum = 1, itemName = '') {
        const addCount = InventorySystem.gainItem(itemId, itemNum);
        if (addCount > 0) {
            await InventoryUI.onGainItem(itemId, itemNum, itemName);
        }
        return addCount;
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
        // 打开背包界面
        await BagUI.open({ selectedId: itemId });

    },

    // 创建物品详情 UI, 大图 + 文字描述
    showItemDetail: async function (itemId, locked = false) {
        console.log('[LOG] showItemDetail', itemId, locked);
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
        const view   = getItemView(ItemConfig[itemId], locked);
        const illust = view.illust;
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
                visible: !locked,
            });

            if (locked) {
                // 压黑
                await ac.changeMaskTo({ name: 'img_item_info_pic', r: 0, g: 0, b: 0, opacity: 100 });
                // 再显示
                await ac.show({ name: 'img_item_info_pic' });
            }

        }
        const itemDesc = view.desc;
        const itemIcon = view.icon;
        await CommonUI.showCustomDialog({
            content: itemDesc,
            // roleAvatarResId: itemIcon,   // 不显示小图标
        });
        await ac.remove({
            name: this.itemDetail.name,
            // 用了 mask 之后这里不能淡出, 会穿帮
            // effect: 'fadeout',
            // duration: 500,
            // canskip: false,
        })
    },
}