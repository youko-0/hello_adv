console.log('[LOAD] bag_ui');

// 背包 UI

const BagUI = {
    name: 'layer_bag_ui',
    _selectedId: '',
    _mode: 'view',      // 'view' | 'choose'
    _onChoose: null,    // async function(itemId) — 仅 mode='choose' 时有效

    horiCount: 3,       // 道具列（右侧标题占位，改为 3 列）
    svItem: {
        x:      680,    // sv 中心 x（x:420~x:940，避开右侧标题）
        y:      340,    // sv 中心 y（下移，与左侧详情上边缘对齐）
        width:  520,
        height: 520,
    },
    bg: {
        resIdNormal:    ResMap.img_bag_item_normal,
        resIdHighlight: ResMap.img_bag_item_highlight,
        width:  110,    // 裁切尺寸
        height: 112,
    },
    itemDetail: {
        x:        229,  // 详情区中心 x（对应 img_bag_detail_bg）
        width:    240,  // 文本框宽度
        fontSize: 22,
    },
    svDetail: {
        width:  280,
        height: 140,   // 缩小描述区高度，留出名字与描述之间的间距
    },

    // ── 场景框架 ──────────────────────────────────────────────────

    // ── 打开 / 关闭 ────────────────────────────────────────────────

    /**
     * 打开背包，通过 ac.callUI 打开真正的 UI 层（入口 ui/ui_bag.js）
     * @param {Object}   [config]
     * @param {string}   [config.mode='view']  'view' | 'choose'
     *        choose 模式下 btn_view 变为 btn_use，点击使用后关闭背包并回调 onChoose
     * @param {string}   [config.selectedId]   默认选中的道具 ID，不传则选中第一个
     * @param {Function} [config.onChoose]     async (itemId) => {}，仅 choose 模式有效
     */
    open: async function (config = {}) {
        const { mode = 'view', selectedId = null, onChoose = null } = config;
        this._mode = mode === 'choose' ? 'choose' : 'view';
        this._onChoose = this._mode === 'choose' ? (onChoose || null) : null;
        this._selectedId = (typeof selectedId === 'string' && selectedId) ? selectedId : '';
        console.log('[LOG] BagUI.open set:', 'this===BagUI?', this === BagUI,
            'mode=', this._mode, 'selectedId=', this._selectedId, 'onChoose=', typeof this._onChoose);
        await ac.callUI({ name: 'callUI_bag', uiId: ResMap.ui_bag });
    },

    // 由 ui/ui_bag.js 调用：构建整个背包界面
    createBagUI: async function () {
        console.log('[LOG] BagUI.createBagUI read:', 'mode=', this._mode,
            'selectedId=', this._selectedId, 'onChoose=', typeof this._onChoose);
        // 主背景
        await ac.createImage({
            name:    this.name,
            index:   ZORDER.UI,
            inlayer: 'window',
            resId:   ResMap.pic_common_bg_02,
            pos:     { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor:  { x: 50, y: 50 },
        });

        // 标题（竖排，右侧）
        await ac.createImage({
            name:    'img_title',
            index:   1,
            inlayer: this.name,
            resId:   ResMap.img_bag_title,
            pos:     { x: 1035, y: 271 },
            anchor:  { x: 50, y: 50 },
        });

        // 关闭按钮（右下角）
        await ac.createOption({
            name:    'btn_ui_close',
            index:   0,
            inlayer: this.name,
            nResId:  ResMap.btn_common_close_normal,
            sResId:  ResMap.btn_common_close_highlight,
            content: '',
            pos:     { x: 1203, y: 64 },
            anchor:  { x: 50, y: 50 },
            onTouchEnded: async function () {
                await BagUI.closeBagUI();
            },
        });

        // 详情区背景（左侧）
        await ac.createImage({
            name:    'img_bag_detail_bg',
            index:   1,
            inlayer: this.name,
            resId:   ResMap.img_bag_detail_bg,
            pos:     { x: 229, y: 361 },
            anchor:  { x: 50, y: 50 },
        });

        // 道具列表 + 初始选中详情
        const itemList = InventorySystem.getItemListByType(ItemType.KEY);
        // 未指定默认选中第一个（须在 createItemList 前设好，选中态才能正确渲染）
        if (!this._selectedId) {
            this._selectedId = itemList[0] || '';
        }
        await this.createItemList(itemList);
        if (this._selectedId) {
            await this.refreshItemDetail(this._selectedId);
        }
    },

    // 关闭背包（移除当前 UI 层）
    closeBagUI: async function () {
        await ac.removeCurrentUI({});
    },

    // ── 道具列表 ──────────────────────────────────────────────────

    /**
     * 创建背景按钮（选中态相关，选中变化时只重建此控件）
     * 需要在 _selectedId 已设置后调用
     */
    _createItemBg: async function (itemId, posX, posY) {
        const isSelected  = this._selectedId === itemId;
        const bgResId     = isSelected ? this.bg.resIdHighlight     : this.bg.resIdNormal;
        const countResId  = isSelected ? ResMap.img_bag_item_count_highlight : ResMap.img_bag_item_count_normal;
        const countOffset = this.bg.height / 2 - 18;   // 底部偏移

        await ac.createOption({
            name:    `bag_item_bg_${itemId}`,
            index:   1,
            inlayer: 'sv_items',
            nResId:  bgResId,
            sResId:  bgResId,
            content: '',
            pos:     { x: posX, y: posY },
            anchor:  { x: 50, y: 50 },
            onTouchEnded: async function () {
                await BagUI.onItemSelect(itemId);
            },
        });

        // 数量底图（选中态不同，随 bg 一同重建）
        await ac.createImage({
            name:    `bag_item_count_bg_${itemId}`,
            index:   3,
            inlayer: 'sv_items',
            resId:   countResId,
            pos:     { x: posX + 36, y: posY - countOffset },
            anchor:  { x: 50, y: 50 },
        });
    },

    /**
     * 创建静态部分：图标 / 数量文字（只建一次，选中变化不重建）
     */
    _createItemWidgets: async function (itemId, posX, posY) {
        const itemConfig   = InventorySystem.getItemConfig(itemId);
        const historyCount = InventorySystem.getHistoryCount(itemId);
        const itemCount    = InventorySystem.getItemCount(itemId);
        const countOffset  = this.bg.height / 2 - 18;

        const itemIcon = historyCount <= 0 ? itemConfig.iconLocked : itemConfig.icon;
        await ac.createImage({
            name:    `bag_item_icon_${itemId}`,
            index:   2,
            inlayer: 'sv_items',
            resId:   itemIcon,
            pos:     { x: posX, y: posY },
            anchor:  { x: 50, y: 50 },
        });

        await ac.createText({
            name:    `lbl_item_count_${itemId}`,
            index:   4,
            inlayer: 'sv_items',
            content: `${itemCount}`,
            pos:     { x: posX + 36, y: posY - countOffset },
            size:    { width: 40, height: 28 },
            halign:  ac.HALIGN_TYPES.middle,
            valign:  ac.VALIGN_TYPES.center,
            anchor:  { x: 50, y: 50 },
            style:   'style_bag_item_count',
        });
    },

    /**
     * 创建道具列表（bg + widgets 各一次，_selectedId 需提前设好）
     */
    createItemList: async function (itemList) {
        const count     = itemList.length;
        const rowCount  = Math.ceil(count / this.horiCount);
        const horiSpace = Math.floor(
            (this.svItem.width - this.horiCount * this.bg.width) / (this.horiCount + 1)
        );
        const vertSpace = horiSpace;
        const listHeight = Math.max(
            rowCount * this.bg.height + (rowCount + 1) * vertSpace,
            this.svItem.height
        );

        await ac.createScrollView({
            name:             'sv_items',
            index:            1,
            inlayer:          this.name,
            pos:              { x: this.svItem.x, y: this.svItem.y },
            anchor:           { x: 50, y: 50 },
            size:             { width: this.svItem.width, height: this.svItem.height },
            innerSize:        { width: this.svItem.width, height: listHeight },
            horizontalScroll: false,
            verticalScroll:   true,
        });

        const startX = horiSpace + this.bg.width / 2;
        const startY = listHeight - vertSpace - this.bg.height / 2;
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

    /** 重建 bg 按钮 + 数量底图（选中态变化时调用） */
    _refreshItemBg: async function (itemId) {
        const pos = await ac.getPos({ name: `bag_item_bg_${itemId}` });
        if (pos.x == null) return;
        await ac.remove({ name: `bag_item_bg_${itemId}` });
        await ac.remove({ name: `bag_item_count_bg_${itemId}` });
        await this._createItemBg(itemId, pos.x, pos.y);
    },

    // ── 道具详情 ──────────────────────────────────────────────────

    /** 刷新右侧详情面板（名称 / 描述 / 按钮）*/
    refreshItemDetail: async function (itemId) {
        const itemConfig   = InventorySystem.getItemConfig(itemId);
        const historyCount = InventorySystem.getHistoryCount(itemId);
        const itemCount    = InventorySystem.getItemCount(itemId);
        const cx           = this.itemDetail.x;   // 详情区中心 x

        const itemName = historyCount <= 0 ? '？？？' : itemConfig.name;
        await ac.createText({
            name:      'lbl_item_detail_name',
            index:     2,
            inlayer:   this.name,
            content:   itemName,
            pos:       { x: cx, y: 370 },
            size:      { width: this.itemDetail.width, height: 60 },
            direction: ac.TEXT_DIRECTION_TYPES.horizontal,
            halign:    ac.HALIGN_TYPES.middle,
            valign:    ac.VALIGN_TYPES.center,
            anchor:    { x: 50, y: 50 },
            style:     'style_bag_detail_name',
        });

        const itemDesc      = historyCount <= 0 ? itemConfig.descLocked : itemConfig.desc;
        // calcTextHeight 是近似估算，额外加一行高度防止最后一行被裁切
        const extraLine     = this.itemDetail.fontSize * 1.2;
        const contentHeight = Math.max(
            Utils.calcTextHeight(itemDesc, this.itemDetail.fontSize, this.itemDetail.width, 1.2) + extraLine,
            this.svDetail.height
        );
        await ac.createScrollView({
            name:      'sv_item_detail_desc',
            index:     2,
            inlayer:   this.name,
            pos:       { x: cx, y: 268 },
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
            style:     'style_bag_detail_desc',
        });

        if (this._mode === 'choose') {
            const canUse = InventorySystem.getItemCount(itemId) > 0;
            await ac.createOption({
                name:    'btn_use_item',
                index:   2,
                inlayer: this.name,
                nResId:  ResMap.btn_item_use_normal,
                sResId:  ResMap.btn_item_use_highlight,
                content: '',
                pos:     { x: cx, y: 144 },
                anchor:  { x: 50, y: 50 },
                opacity: canUse ? 100 : 40,
                onTouchEnded: async function () {
                    if (!canUse) return;
                    // 关闭背包
                    await BagUI.closeBagUI();
                    // 将选中的道具 ID 返回给调用方，消耗与否由调用方决定
                    if (typeof BagUI._onChoose === 'function') {
                        await BagUI._onChoose(itemId);
                    }
                },
            });
        } else {
            await ac.createOption({
                name:    'btn_view_item',
                index:   2,
                inlayer: this.name,
                nResId:  ResMap.btn_item_view_normal,
                sResId:  ResMap.btn_item_view_highlight,
                content: '',
                pos:     { x: cx, y: 144 },
                anchor:  { x: 50, y: 50 },
                onTouchEnded: async function () {
                    await InventoryUI.showItemDetail(itemId, historyCount <= 0);
                },
            });
        }
    },
};
