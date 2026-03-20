console.log('[LOAD] bag_ui');

// 背包 UI

const BagUI = {
    name: 'layer_bag_ui',
    horiCount: 3,       // 道具水平数量
    vertCount: 2,       // 道具垂直数量
    svItem: {
        width: 420,     // 道具列表宽度
        height: 348,    // 道具列表高度
        sliderWidth: 40, // 滑动条宽度
    },
    bg: {
        resIdNormal: ResMap.img_bag_item_normal,
        resIdHighlight: ResMap.img_bag_item_highlight,
        width: 106,     // 道具项宽度
        height: 148,    // 道具项高度
    },
    itemIcon: {
        width: 64,      // 道具图标宽度
        height: 64,     // 道具图标高度
    },
    itemDetail: {
        width: 280,     // 详情文本框宽度
        fontSize: 24,   // 详情文本框字体大小
    },
    svDetail: {
        width: 360,     // 道具详情列表宽度
        height: 160,    // 道具详情列表高度
    },

    // 创建背包主界面
    createBagUI: async function () {
        // 当前选中的道具ID
        this._selectedId = '';

        // 样式定义
        await ac.createStyle({
            name: 'style_item',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: 20,
            color: '#d1d3df',
        });

        await ac.createStyle({
            name: 'style_detail',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: this.itemDetail.fontSize,
            color: '#d1d3df',
        });

        // 主背景
        await ac.createImage({
            name: this.name,
            index: ZORDER.UI,
            inlayer: 'window',
            resId: ResMap.pic_common_bg_02,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        // 拦截点击
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchBegan,
            listener: CommonUI.onTouchMask,
            target: this.name,
        });

        // 标题
        await ac.createImage({
            name: 'img_title',
            index: 1,
            inlayer: this.name,
            resId: ResMap.img_bag_title,
            pos: { x: 26, y: 670 },
            anchor: { x: 0, y: 50 },
        });

        // 关闭按钮
        await ac.createOption({
            name: 'btn_ui_close',
            index: 0,
            inlayer: this.name,
            nResId: ResMap.btn_common_close_normal,
            sResId: ResMap.btn_common_close_highlight,
            content: ``,
            pos: { x: 1220, y: 72 },
            anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                await ac.remove({
                    name: BagUI.name,
                    effect: 'fadeout',
                    duration: 500,
                    canskip: false,
                })
            },
        });

        // 详情背景
        await ac.createImage({
            name: 'img_bag_detail_bg',
            index: 1,
            inlayer: this.name,
            resId: ResMap.img_bag_detail_bg,
            pos: { x: 900, y: 360 },
            anchor: { x: 50, y: 50 },
        });

        // 详情标题
        await ac.createImage({
            name: 'img_bag_detail_title',
            index: 1,
            inlayer: this.name,
            resId: ResMap.img_bag_detail_title,
            pos: { x: 900, y: 488 },
            anchor: { x: 50, y: 50 },
        });
    },

    // 道具项点击回调函数
    onItemSelect: async function (itemId) {
        const selectedId = this._selectedId;
        console.log(`[BagUI] onItemSelect: ${selectedId}, ${itemId}`);
        if (!itemId || itemId === selectedId) return;
        this._selectedId = itemId;

        // 刷新道具项的选中状态
        if (selectedId) {
            this.refreshItemUI(selectedId);
        }
        this.refreshItemUI(itemId);

        // 刷新道具详情显示
        await this.refreshItemDetail(itemId);
    },

    // 创建单个道具UI
    createItemUI: async function (itemId, posX, posY) {
        let itemConfig = InventorySystem.getItemConfig(itemId);
        let historyCount = InventorySystem.getHistoryCount(itemId);
        let itemCount = InventorySystem.getItemCount(itemId);

        // 背景
        let resId = this._selectedId === itemId ? this.bg.resIdHighlight : this.bg.resIdNormal;
        await ac.createOption({
            name: `bag_item_bg_${itemId}`,
            index: 1,
            inlayer: 'sv_items',
            nResId: resId,
            sResId: resId,
            content: ``,
            pos: { x: posX, y: posY },
            anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                await BagUI.onItemSelect(itemId);
            },
        });

        // 道具图标
        const itemIcon = historyCount <= 0 ? itemConfig.iconLocked : itemConfig.icon;
        await ac.createImage({
            name: `bag_item_icon_${itemId}`,
            index: 2,
            inlayer: 'sv_items',
            resId: itemIcon,
            pos: { x: posX, y: posY + 20 },
            anchor: { x: 50, y: 50 },
        });

        // 道具名称
        const itemName = historyCount <= 0 ? "？？？" : itemConfig.name;
        await ac.createText({
            name: `lbl_item_name_${itemId}`,
            index: 2,
            inlayer: 'sv_items',
            content: Utils.truncateText(itemName, 4),
            pos: { x: posX, y: posY - 48 },
            size: { width: this.bg.width - 4, height: 28 },
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
            anchor: { x: 50, y: 50 },
            style: 'style_item',
        });

        // 道具数量底框
        await ac.createImage({
            name: `bag_item_count_${itemId}`,
            index: 3,
            inlayer: 'sv_items',
            resId: ResMap.img_bag_item_count,
            pos: { x: posX + 30, y: posY - 4 },
            anchor: { x: 50, y: 50 },
        });

        // 道具数量
        await ac.createText({
            name: `lbl_item_count_${itemId}`,
            index: 4,
            inlayer: 'sv_items',
            content: `${itemCount}`,
            pos: { x: posX + 30, y: posY - 4 },
            size: { width: 40, height: 28 },
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
            anchor: { x: 50, y: 50 },
            style: 'style_item',
        })
    },

    // 根据现有的位置刷新道具项
    refreshItemUI: async function (itemId) {
        let itemPos = await ac.getPos({
            name: `bag_item_bg_${itemId}`,
        });
        if (!itemPos.x) {
            // 控件不存在
            return
        }
        await this.createItemUI(itemId, itemPos.x, itemPos.y);
    },

    // 创建道具列表
    createItemList: async function (itemList) {
        let count = itemList.length;
        // 计算行数
        let rowCount = Math.ceil(count / this.horiCount);
        // 计算水平间距
        // 空出一个滑动条的宽度
        let horiSpace = Math.floor((this.svItem.width - this.svItem.sliderWidth - this.horiCount * this.bg.width) / (this.horiCount - 1));
        let vertSpace = Math.floor((this.svItem.height - this.vertCount * this.bg.height) / (this.vertCount - 1));
        // 计算列表高度
        let listHeight = rowCount * this.bg.height + (rowCount - 1) * vertSpace;
        listHeight = Math.max(listHeight, this.svItem.height);
        console.log(`horiSpace: ${horiSpace}, vertSpace: ${vertSpace}, rowCount: ${rowCount}, listHeight: ${listHeight}`);

        // 创建滚动层容器
        await ac.createScrollView({
            name: 'sv_items',
            index: 1,
            inlayer: this.name,
            pos: { x: 450, y: 360 },
            anchor: { x: 50, y: 50 },
            size: { width: this.svItem.width, height: this.svItem.height },
            innerSize: { width: this.svItem.width, height: listHeight },
            horizontalScroll: false,
            verticalScroll: true,
        });

        // 创建道具项
        let startX = this.bg.width / 2;
        let startY = listHeight - this.bg.height / 2;
        console.log(`startX: ${startX}, startY: ${startY}`);
        for (let i = 0; i < count; ++i) {
            let itemId = itemList[i];
            let row = Math.floor(i / this.horiCount);
            let col = i % this.horiCount;
            let x = startX + col * (this.bg.width + horiSpace);
            let y = startY - row * (this.bg.height + vertSpace);
            await this.createItemUI(itemId, x, y);
        }
    },

    // 刷新右侧道具详情
    refreshItemDetail: async function (itemId) {
        let itemConfig = InventorySystem.getItemConfig(itemId);

        // 道具名称
        await ac.createText({
            name: 'lbl_item_detail_name',
            index: 1,
            inlayer: this.name,
            content: itemConfig.name,
            pos: { x: 900, y: 486 },
            size: { width: this.itemDetail.width, height: 120 },
            direction: ac.TEXT_DIRECTION_TYPES.horizontal,
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
            anchor: { x: 50, y: 50 },
            style: 'style_detail',
        });

        // 道具描述
        let contentHeight = Utils.calcTextHeight(itemConfig.desc, this.itemDetail.fontSize, this.itemDetail.width, 1.2);
        contentHeight = Math.max(contentHeight, this.svDetail.height);
        // 滚动层容器
        await ac.createScrollView({
            name: 'sv_item_detail_desc',
            index: 1,
            inlayer: this.name,
            pos: { x: 900, y: 372 },
            anchor: { x: 50, y: 50 },
            size: { width: this.svDetail.width, height: this.svDetail.height },
            innerSize: { width: this.svDetail.width, height: contentHeight },
        })

        await ac.createText({
            name: 'lbl_item_detail_desc',
            index: 0,
            inlayer: 'sv_item_detail_desc',
            content: itemConfig.desc,
            pos: { x: this.svDetail.width / 2, y: contentHeight / 2 },
            size: { width: this.itemDetail.width, height: contentHeight },
            direction: ac.TEXT_DIRECTION_TYPES.horizontal,
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.top,
            spacing: 1.2,
            anchor: { x: 50, y: 50 },
            style: 'style_detail',
        });

        let itemCount = InventorySystem.getItemCount(itemId);
        if (itemCount <= 0) {
            // 创建查看按钮
            await ac.createOption({
                name: 'btn_view_item',
                index: 2,
                inlayer: this.name,
                nResId: ResMap.btn_item_view_normal,
                sResId: ResMap.btn_item_view_highlight,
                content: ``,
                pos: { x: 894, y: 228 },
                anchor: { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await InventoryUI.showItemDetail(itemId);
                },
            });
        } else {
            // 创建使用按钮
            await ac.createOption({
                name: 'btn_use_item',
                index: 2,
                inlayer: this.name,
                nResId: ResMap.btn_item_use_normal,
                sResId: ResMap.btn_item_use_highlight,
                content: ``,
                pos: { x: 894, y: 228 },
                anchor: { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await InventorySystem.useItem(itemId, 1);
                    await this.refreshItemUI(itemId);
                },
            });
        }
    },

    onBagOpen: async function () {
        // 打开动效
        await ac.show({
            name: this.name,
            effect: 'fadein',
            duration: 500,
            canskip: false,
        });
        await CommonUI.waitForUIClosed(this.name);
    },
}