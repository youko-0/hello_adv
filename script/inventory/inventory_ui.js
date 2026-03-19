// 探索通用 UI
console.log('[LOAD] inventory_ui');

const InventoryUI = {

    // 物品详情
    itemDetail: {
        name: 'layer_item_detail',
    },

    createBtnBag: async function () {
        // 背包按钮
        await ac.createImage({
            name: 'global_btn_bag',
            index: ZORDER.SYSTEM_UI,
            inlayer: 'window',
            resId: ResMap.btn_bag_normal,
            pos: { x: GameConfig.width - 36, y: GameConfig.height - 186 },
            anchor: { x: 100, y: 100 },
        });
        // 绑定事件
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: BagUI.initBagUI,
            target: 'global_btn_bag'
        });
    },

    // 创建物品详情 UI, 大图 + 文字描述
    showItemDetail: async function (itemId) {
        console.log('[LOG] showItemDetail', itemId);
        let itemConfig = InventorySystem.getItemConfig(itemId);
        await ac.createImage({
            name: this.itemDetail.name,
            index: ZORDER.UI + 1,
            inlayer: 'window',
            resId: ResMap.pic_common_bg_03,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            opacity: 80,
        });
        // 拦截点击
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchBegan,
            listener: CommonUI.onTouchMask,
            target: this.itemDetail.name,
        });
        // 大图
        await ac.createImage({
            name: 'img_item_info_pic',
            index: 0,
            inlayer: this.itemDetail.name,
            resId: itemConfig.illust,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY + 100 },
            anchor: { x: 50, y: 50 },
        });
        let config = {
            content: itemConfig.desc,
            roleAvatarResId: itemConfig.icon,
        }
        await CommonUI.showCustomDialog(config);
        await ac.remove({
            name: this.itemDetail.name,
            effect: 'fadeout',
            duration: 500,
            canskip: false,
        })
    },
}