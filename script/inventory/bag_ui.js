console.log('[LOAD] bag_ui');

// 背包 UI

const BagUI = {
    name: 'layer_bag_ui',
    _selectedId: '',

    horiCount: 3,
    vertCount: 2,
    svItem: {
        width: 420,
        height: 348,
        sliderWidth: 40,
    },
    bg: {
        resIdNormal:    ResMap.img_bag_item_normal,
        resIdHighlight: ResMap.img_bag_item_highlight,
        width:  106,
        height: 148,
    },
    itemIcon: {
        width:  64,
        height: 64,
    },
    itemDetail: {
        width:    280,
        fontSize: 24,
    },
    svDetail: {
        width:  360,
        height: 160,
    },

    // ── 场景框架 ──────────────────────────────────────────────────

    createBagUI: async function () {
        // 主背景（callUI 层级自动盖住系统菜单，不需要 onTouchMask）
        await ac.createImage({
            name:   this.name,
            index:  ZORDER.UI,
            inlayer: 'window',
            resId:  ResMap.pic_common_bg_02,
            pos:    { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        // 标题
        await ac.createImage({
            name:    'img_title',
            index:   1,
            inlayer: this.name,
            resId:   ResMap.img_bag_title,
            pos:     { x: 26, y: 670 },
            anchor:  { x: 0, y: 50 },
        });

        // 关闭按钮（ac.removeCurrentUI 结束 callUI，无需 waitForUIClosed）
        await ac.createOption({
            name:    'btn_ui_close',
            index:   0,
            inlayer: this.name,
            nResId:  ResMap.btn_common_close_normal,
            sResId:  ResMap.btn_common_close_highlight,
            content: '',
            pos:     { x: 1220, y: 72 },
            anchor:  { x: 50, y: 50 },
            onTouchEnded: async function () {
                await ac.fadeTo({ name: BagUI.name, opacity: 0, duration: 500 });
                await ac.removeCurrentUI({});
            },
        });

        // 详情区背景
        await ac.createImage({
            name:    'img_bag_detail_bg',
            index:   1,
            inlayer: this.name,
            resId:   ResMap.img_bag_detail_bg,
            pos:     { x: 900, y: 360 },
            anchor:  { x: 50, y: 50 },
        });

        // 详情区标题装饰
        await ac.createImage({
            name:    'img_bag_detail_title',
            index:   1,
            inlayer: this.name,
            resId:   ResMap.img_bag_detail_title,
            pos:     { x: 900, y: 488 },
            anchor:  { x: 50, y: 50 },
        });
    },

    // 入场动效（UI 文件末尾 await，callUI 在此期间自然阻塞）
    onBagOpen: async function () {
        await ac.show({
            name:     this.name,
            effect:   'fadein',
            duration: 500,
            canskip:  false,
        });
    },

    // ── 道具列表 ──────────────────────────────────────────────────

    /**
     * 创建背景按钮（选中态相关，选中变化时只重建此控件）
     * 需要在 _selectedId 已设置后调用
     */
    _createItemBg: async function (itemId, posX, posY) {
        const resId = this._selectedId === itemId
            ? this.bg.resIdHighlight
            : this.bg.resIdNormal;
        await ac.createOption({
            name:    `bag_item_bg_${itemId}`,
            index:   1,
            inlayer: 'sv_items',
            nResId:  resId,
            sResId:  resId,
            content: '',
            pos:     { x: posX, y: posY },
            anchor:  { x: 50, y: 50 },
            onTouchEnded: async function () {
                await BagUI.onItemSelect(itemId);
            },
        });
    },

    /**
     * 创建静态部分：图标 / 名称 / 数量（只建一次，选中变化不重建）
     */
    _createItemWidgets: async function (itemId, posX, posY) {
        const itemConfig   = InventorySystem.getItemConfig(itemId);
        const historyCount = InventorySystem.getHistoryCount(itemId);
        const itemCount    = InventorySystem.getItemCount(itemId);

        const itemIcon = historyCount <= 0 ? itemConfig.iconLocked : itemConfig.icon;
        await ac.createImage({
            name:    `bag_item_icon_${itemId}`,
            index:   2,
            inlayer: 'sv_items',
            resId:   itemIcon,
            pos:     { x: posX, y: posY + 20 },
            anchor:  { x: 50, y: 50 },
        });

        const itemName = historyCount <= 0 ? '？？？' : itemConfig.name;
        await ac.createText({
            name:    `lbl_item_name_${itemId}`,
            index:   2,
            inlayer: 'sv_items',
            content: Utils.truncateText(itemName, 4),
            pos:     { x: posX, y: posY - 48 },
            size:    { width: this.bg.width - 4, height: 28 },
            halign:  ac.HALIGN_TYPES.middle,
            valign:  ac.VALIGN_TYPES.center,
            anchor:  { x: 50, y: 50 },
            style:   'style_bag_item',
        });

        await ac.createImage({
            name:    `bag_item_count_${itemId}`,
            index:   3,
            inlayer: 'sv_items',
            resId:   ResMap.img_bag_item_count,
            pos:     { x: posX + 30, y: posY - 4 },
            anchor:  { x: 50, y: 50 },
        });

        await ac.createText({
            name:    `lbl_item_count_${itemId}`,
            index:   4,
            inlayer: 'sv_items',
            content: `${itemCount}`,
            pos:     { x: posX + 30, y: posY - 4 },
            size:    { width: 40, height: 28 },
            halign:  ac.HALIGN_TYPES.middle,
            valign:  ac.VALIGN_TYPES.center,
            anchor:  { x: 50, y: 50 },
            style:   'style_bag_item',
        });
    },

    /**
     * 创建道具列表（bg + widgets 各一次，_selectedId 需提前设好）
     */
    createItemList: async function (itemList) {
        const count     = itemList.length;
        const rowCount  = Math.ceil(count / this.horiCount);
        const horiSpace = Math.floor(
            (this.svItem.width - this.svItem.sliderWidth - this.horiCount * this.bg.width)
            / (this.horiCount - 1)
        );
        const vertSpace = Math.floor(
            (this.svItem.height - this.vertCount * this.bg.height) / (this.vertCount - 1)
        );
        const listHeight = Math.max(
            rowCount * this.bg.height + (rowCount - 1) * vertSpace,
            this.svItem.height
        );

        await ac.createScrollView({
            name:           'sv_items',
            index:          1,
            inlayer:        this.name,
            pos:            { x: 450, y: 360 },
            anchor:         { x: 50, y: 50 },
            size:           { width: this.svItem.width, height: this.svItem.height },
            innerSize:      { width: this.svItem.width, height: listHeight },
            horizontalScroll: false,
            verticalScroll: true,
        });

        const startX = this.bg.width / 2;
        const startY = listHeight - this.bg.height / 2;
        for (let i = 0; i < count; i++) {
            const itemId = itemList[i];
            const x = startX + (i % this.horiCount) * (this.bg.width + horiSpace);
            const y = startY - Math.floor(i / this.horiCount) * (this.bg.height + vertSpace);
            await this._createItemBg(itemId, x, y);
            await this._createItemWidgets(itemId, x, y);
        }
    },

    /**
     * 选中变化时：只重建前后两个 bg 按钮，刷新右侧详情
     * 初始选中由 ui_bag.js 直接调 refreshItemDetail，不走此函数
     */
    onItemSelect: async function (itemId) {
        if (!itemId || itemId === this._selectedId) return;
        const prev = this._selectedId;
        this._selectedId = itemId;

        if (prev) await this._refreshItemBg(prev);
        await this._refreshItemBg(itemId);
        await this.refreshItemDetail(itemId);
    },

    /** 仅重建 bg 按钮（移除旧的，按当前 _selectedId 重建） */
    _refreshItemBg: async function (itemId) {
        const pos = await ac.getPos({ name: `bag_item_bg_${itemId}` });
        if (pos.x == null) return;
        await ac.remove({ name: `bag_item_bg_${itemId}` });
        await this._createItemBg(itemId, pos.x, pos.y);
    },

    // ── 道具详情 ──────────────────────────────────────────────────

    /** 刷新右侧详情面板（名称 / 描述 / 按钮）*/
    refreshItemDetail: async function (itemId) {
        const itemConfig   = InventorySystem.getItemConfig(itemId);
        const historyCount = InventorySystem.getHistoryCount(itemId);
        const itemCount    = InventorySystem.getItemCount(itemId);

        const itemName = historyCount <= 0 ? '？？？' : itemConfig.name;
        await ac.createText({
            name:      'lbl_item_detail_name',
            index:     1,
            inlayer:   this.name,
            content:   itemName,
            pos:       { x: 900, y: 486 },
            size:      { width: this.itemDetail.width, height: 120 },
            direction: ac.TEXT_DIRECTION_TYPES.horizontal,
            halign:    ac.HALIGN_TYPES.middle,
            valign:    ac.VALIGN_TYPES.center,
            anchor:    { x: 50, y: 50 },
            style:     'style_bag_detail',
        });

        const itemDesc     = historyCount <= 0 ? itemConfig.descLocked : itemConfig.desc;
        const contentHeight = Math.max(
            Utils.calcTextHeight(itemDesc, this.itemDetail.fontSize, this.itemDetail.width, 1.2),
            this.svDetail.height
        );
        await ac.createScrollView({
            name:      'sv_item_detail_desc',
            index:     1,
            inlayer:   this.name,
            pos:       { x: 900, y: 372 },
            anchor:    { x: 50, y: 50 },
            size:      { width: this.svDetail.width, height: this.svDetail.height },
            innerSize: { width: this.svDetail.width, height: contentHeight },
        });
        await ac.createText({
            name:      'lbl_item_detail_desc',
            index:     0,
            inlayer:   'sv_item_detail_desc',
            content:   itemDesc,
            pos:       { x: this.svDetail.width / 2, y: contentHeight / 2 },
            size:      { width: this.itemDetail.width, height: contentHeight },
            direction: ac.TEXT_DIRECTION_TYPES.horizontal,
            halign:    ac.HALIGN_TYPES.middle,
            valign:    ac.VALIGN_TYPES.top,
            spacing:   1.2,
            anchor:    { x: 50, y: 50 },
            style:     'style_bag_detail',
        });

        if (true || itemCount <= 0) {
            await ac.createOption({
                name:    'btn_view_item',
                index:   2,
                inlayer: this.name,
                nResId:  ResMap.btn_item_view_normal,
                sResId:  ResMap.btn_item_view_highlight,
                content: '',
                pos:     { x: 894, y: 228 },
                anchor:  { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await InventoryUI.showItemDetail(itemId, historyCount <= 0);
                },
            });
        } else {
            await ac.createOption({
                name:    'btn_use_item',
                index:   2,
                inlayer: this.name,
                nResId:  ResMap.btn_item_use_normal,
                sResId:  ResMap.btn_item_use_highlight,
                content: '',
                pos:     { x: 894, y: 228 },
                anchor:  { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await InventorySystem.useItem(itemId, 1);
                    await BagUI._refreshItemBg(itemId);
                },
            });
        }
    },
};
