// 图鉴入口页
// 布局参照设计图一：全屏山水背景 + 中央竖排标题卡片 + 3个竖排功能按钮 + 右下关闭
console.log('[LOAD] gallery_ui');

const GalleryUI = {
    name: 'layer_gallery_entry',

    // ── 布局（1280×720，引擎 y=0 在底部，坐标来自 crop_transparent.py 实测）──
    layout: {
        bg:    { x: 640, y: 360 },
        title: { x: 640, y: 272 },                           // 中央"图鉴/Gallery"标题竖卡片
        close: { x: 1037, y: 68 },                            // 右下关闭 ※
        entries: [
            { cat: GalleryCategory.APPRECIATION, x: 857, y: 430 },  // 鉴赏
            { cat: GalleryCategory.STORY,        x: 422, y: 373 },  // 剧情收集
            { cat: GalleryCategory.CHARACTER,    x: 242, y: 400 },  // 人物收集
        ],
    },

    // 各功能对应资源（常态 / 选中态）
    _entryRes: {
        [GalleryCategory.APPRECIATION]: {
            n: ResMap.btn_gallery_entry_apprec_n,
            s: ResMap.btn_gallery_entry_apprec_s,
        },
        [GalleryCategory.CHARACTER]: {
            n: ResMap.btn_gallery_entry_character_n,
            s: ResMap.btn_gallery_entry_character_s,
        },
        [GalleryCategory.STORY]: {
            n: ResMap.btn_gallery_entry_story_n,
            s: ResMap.btn_gallery_entry_story_s,
        },
    },

    // 子页 uiId 映射
    _subUIId: function (cat) {
        const map = {
            [GalleryCategory.APPRECIATION]: ResMap.ui_gallery_appreciation,
            [GalleryCategory.CHARACTER]:    ResMap.ui_gallery_character,
            [GalleryCategory.STORY]:        ResMap.ui_gallery_story,
        };
        return map[cat] || '';
    },

    // ── 入口 ─────────────────────────────────────────────────────
    /**
     * 打开图鉴入口页
     */
    open: async function () {
        await ac.callUI({ name: 'callUI_gallery', uiId: ResMap.ui_gallery });
    },

    createGalleryUI: async function () {
        console.log('[LOG] GalleryUI.createGalleryUI');
        const L = this.layout;

        // 全屏背景
        await ac.createImage({
            name: this.name, index: ZORDER.UI, inlayer: 'window',
            resId: ResMap.pic_gallery_bg || ResMap.pic_common_bg_02,
            pos: { x: L.bg.x, y: L.bg.y }, anchor: { x: 50, y: 50 },
        });

        // 中央标题卡片（资源缺省时用文字占位）
        if (ResMap.img_gallery_title_card) {
            await ac.createImage({
                name: 'img_gallery_title_card', index: 1, inlayer: this.name,
                resId: ResMap.img_gallery_title_card,
                pos: { x: L.title.x, y: L.title.y }, anchor: { x: 50, y: 50 },
            });
        } else {
            await ac.createText({
                name: 'img_gallery_title_card', index: 1, inlayer: this.name,
                content: '图鉴\nGallery',
                pos: { x: L.title.x, y: L.title.y }, size: { width: 100, height: 130 },
                anchor: { x: 50, y: 50 },
                style: 'style_gallery_title',
                halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
            });
        }

        // 3 个功能竖条按钮
        for (const entry of L.entries) {
            await this._createEntryBtn(entry.cat, entry.x, entry.y);
        }

        // 右下关闭按钮
        await ac.createOption({
            name: 'btn_gallery_entry_close', index: 2, inlayer: this.name,
            nResId: ResMap.btn_common_close_normal,
            sResId: ResMap.btn_common_close_highlight,
            content: '',
            pos: { x: L.close.x, y: L.close.y }, anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                await ac.removeCurrentUI({});
            },
        });
    },

    _createEntryBtn: async function (cat, x, y) {
        const r = this._entryRes[cat] || {};
        await ac.createOption({
            name: 'btn_gallery_entry_' + cat, index: 2, inlayer: this.name,
            nResId: r.n || ResMap.img_selection_bg_normal,
            sResId: r.s || ResMap.img_selection_bg_highlight,
            content: '',
            pos: { x: x, y: y }, anchor: { x: 50, y: 50 },
            onTouchEnded: (function (c) {
                return async function () { await GalleryUI.onEntrySelect(c); };
            })(cat),
        });
    },

    onEntrySelect: async function (cat) {
        const uiId = this._subUIId(cat);
        if (!uiId) {
            console.warn('[Gallery] 子页 uiId 未填:', cat);
            await CommonUI.showCustomDialog({ content: '尚未开放' });
            return;
        }
        const nameMap = {
            [GalleryCategory.APPRECIATION]: 'callUI_gallery_appreciation',
            [GalleryCategory.CHARACTER]:    'callUI_gallery_character',
            [GalleryCategory.STORY]:        'callUI_gallery_story',
        };
        await ac.callUI({ name: nameMap[cat], uiId: uiId });
    },

    // ── 常驻入口按钮（可选，挂载到 HUD）──
    btnGallery: { name: 'global_btn_gallery' },

    createBtnGallery: async function () {
        await ac.createImage({
            name: this.btnGallery.name, index: ZORDER.HUD, inlayer: 'window',
            resId: ResMap.btn_gallery_entry_appreciation_n || ResMap.img_selection_bg_normal,
            pos: { x: GameConfig.width - 64, y: GameConfig.height - 300 },
            anchor: { x: 50, y: 50 },
        });
        await ac.createText({
            name: this.btnGallery.name + '_label', index: ZORDER.HUD, inlayer: 'window',
            content: '图鉴',
            pos: { x: GameConfig.width - 64, y: GameConfig.height - 300 },
            size: { width: 80, height: 30 }, anchor: { x: 50, y: 50 },
            style: 'style_gallery_tab',
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () { await GalleryUI.open(); },
            target: this.btnGallery.name,
        });
    },
};
