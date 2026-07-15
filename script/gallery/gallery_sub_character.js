// 图鉴子页 - 人物收集·立绘
// 独立 callUI，独立文件
// 交互：4个竖框并排 → 点击：其他框淡出，选中帧滑到左侧 → 右侧显示大立绘 + 左右切换按钮
//       点关闭：选中帧滑回原位，其他框淡入
console.log('[LOAD] gallery_sub_character');

const GallerySubCharacter = {
    name: 'layer_gallery_character',

    _portraits:      [],
    _selectedIdx:    -1,
    _portraitPage:   0,

    // ── 布局 ─────────────────────────────────────────────────────
    // 竖框几何（1280×720，引擎 y=0 在底部）：
    //   FRAME_H=508 → 顶 +254 / 底 -254（相对框中心）
    //   立绘区 高430，顶对齐 → center y_off = +254 - 215 = +39
    //   名字区 高78，底对齐  → center y_off = -254 + 39 = -215
    // clip layer 使用 anchor(50,50)，子元素坐标以 clip 中心为原点(0,0)
    layout: {
        bg:       { x: 640,  y: 360 },
        subtitle: { x: 885,  y: 375 },
        close:    { x: 1037, y: 68  },

        FRAME_W:      142,
        FRAME_H:      508,
        PORTRAIT_H:   430,   // clip 区高度
        NAME_H:        78,
        CLIP_Y_OFF:    39,   // clip 中心相对框中心 y 偏移

        NAME_CN_Y_OFF: -200,
        NAME_EN_Y_OFF: -228,

        frameY:  400,
        frameXs: [101, 258, 415, 572],

        expandedX: 91,

        expandPortrait: { x: 560, y: 370, scale: 55 },
        prevBtn: { x: 460, y: 85 },
        nextBtn: { x: 570, y: 85 },

        ANIM_DUR: 350,

        PORTRAIT_SCALE: 18,  // TODO: 按实际立绘尺寸调整
    },

    _saveState: function (patch) { return GalleryUI._saveState(patch); },

    // ── 进入 ─────────────────────────────────────────────────────
    enter: async function (cat, sub, selectedEntry) {
        this._selectedIdx  = -1;
        this._portraitPage = 0;
        this._saveState({ page: 'sub', category: cat });
        await this.createUI();
    },

    createUI: async function () {
        console.log('[LOG] GallerySubCharacter.createUI');
        const L = this.layout;

        const groups = GallerySystem.getEntriesByCategory(GalleryCategory.CHARACTER);
        this._portraits = groups[GallerySub.PORTRAIT] || [];

        // 背景
        await ac.createImage({
            name: this.name, index: ZORDER.UI, inlayer: 'window',
            resId: ResMap.pic_gallery_bg || ResMap.pic_common_bg_02,
            pos: { x: L.bg.x, y: L.bg.y }, anchor: { x: 50, y: 50 },
        });

        // 子页标题
        if (ResMap.img_gallery_por_subtitle) {
            await ac.createImage({
                name: 'img_character_subtitle', index: 1, inlayer: this.name,
                resId: ResMap.img_gallery_por_subtitle,
                pos: { x: L.subtitle.x, y: L.subtitle.y }, anchor: { x: 50, y: 50 },
            });
        } else {
            await ac.createText({
                name: 'img_character_subtitle', index: 1, inlayer: this.name,
                content: '人\n物\n收\n集',
                pos: { x: L.subtitle.x, y: L.subtitle.y },
                size: { width: 50, height: 140 }, anchor: { x: 50, y: 50 },
                style: 'style_gallery_title',
                halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
            });
        }

        // 关闭按钮（展开态→折叠；非展开态→关闭 UI）
        await ac.createOption({
            name: 'btn_character_close', index: 5, inlayer: this.name,
            nResId: ResMap.btn_common_close_normal,
            sResId: ResMap.btn_common_close_highlight,
            content: '',
            pos: { x: L.close.x, y: L.close.y }, anchor: { x: 50, y: 50 },
            onTouchEnded: async function () {
                if (GallerySubCharacter._selectedIdx >= 0) {
                    await GallerySubCharacter._collapseFrame();
                } else {
                    await ac.removeCurrentUI({});
                }
            },
        });

        for (let i = 0; i < this._portraits.length; i++) {
            await this._createFrame(i, this._portraits[i]);
        }
    },

    // ── 帧创建 ───────────────────────────────────────────────────
    _createFrame: async function (i, entryId) {
        const L        = this.layout;
        const entry    = GalleryConfig[entryId];
        const unlocked = GallerySystem.isUnlocked(entryId);
        const view     = getGalleryView(entry, !unlocked);
        const fx = L.frameXs[i];
        const fy = L.frameY;

        if (!unlocked) {
            // ── 未解锁：整体一张图（底板+锁图标+文字） ──────────
            await ac.createImage({
                name: `char_locked_frame_${i}`, index: 2, inlayer: this.name,
                resId: ResMap.img_gallery_por_locked || ResMap.img_mask_black,
                pos: { x: fx, y: fy }, anchor: { x: 50, y: 50 },
                onTouchEnded: (function (idx) {
                    return async function () { await GallerySubCharacter.onFrameClick(idx); };
                })(i),
            });
            return;
        }

        // ── 已解锁 ───────────────────────────────────────────────
        // 1. 竖框底板（实心，z=2，在 clip 后面）
        await ac.createImage({
            name: `char_frame_bg_${i}`, index: 2, inlayer: this.name,
            resId: ResMap.img_gallery_portrait_frame || ResMap.img_mask_black,
            pos: { x: fx, y: fy }, anchor: { x: 50, y: 50 },
            onTouchEnded: (function (idx) {
                return async function () { await GallerySubCharacter.onFrameClick(idx); };
            })(i),
        });

        // 2. 立绘 clip layer（z=3，覆盖底板立绘区，clipMode 裁切）
        //    位置 = 框中心 + CLIP_Y_OFF，anchor(50,50)
        //    子元素坐标以 clip 中心为原点(0,0)
        await ac.createLayer({
            name: `char_clip_${i}`, index: 3, inlayer: this.name,
            pos: { x: fx, y: fy + L.CLIP_Y_OFF },
            size: { width: L.FRAME_W, height: L.PORTRAIT_H },
            anchor: { x: 50, y: 50 },
            clipMode: true,
        });

        // 3. 立绘图（在 clip 内，中心对齐）
        await ac.createImage({
            name: `char_portrait_${i}`, index: 0, inlayer: `char_clip_${i}`,
            resId: view.resId || ResMap.img_mask_black,
            pos: { x: 0, y: 0 }, anchor: { x: 50, y: 50 },
            scale: L.PORTRAIT_SCALE,
        });

        // 4. 中文名
        await ac.createText({
            name: `char_name_cn_${i}`, index: 4, inlayer: this.name,
            content: view.name || '',
            pos: { x: fx, y: fy + L.NAME_CN_Y_OFF },
            size: { width: L.FRAME_W - 10, height: 30 }, anchor: { x: 50, y: 50 },
            style: 'style_gallery_detail_name',
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });

        // 5. 英文名
        await ac.createText({
            name: `char_name_en_${i}`, index: 4, inlayer: this.name,
            content: entry.nameEn || '',
            pos: { x: fx, y: fy + L.NAME_EN_Y_OFF },
            size: { width: L.FRAME_W - 10, height: 22 }, anchor: { x: 50, y: 50 },
            style: 'style_gallery_strip_label',
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });
    },

    // ── 点击 ─────────────────────────────────────────────────────
    onFrameClick: async function (i) {
        if (this._selectedIdx === i) return;
        if (this._selectedIdx >= 0) {
            await this._collapseFrame();
        }
        await this._expandFrame(i);
    },

    // ── 展开 ─────────────────────────────────────────────────────
    _expandFrame: async function (i) {
        const L = this.layout;
        this._selectedIdx  = i;
        this._portraitPage = 0;

        for (let j = 0; j < this._portraits.length; j++) {
            if (j === i) continue;
            this._fadeFrame(j, 0, L.ANIM_DUR);
        }
        this._moveFrame(i, L.expandedX, L.ANIM_DUR);

        await ac.delay({ time: L.ANIM_DUR + 50 });
        await this._showExpandedPortrait(i);
    },

    // ── 移动帧（并行，非 await）──────────────────────────────────
    _moveFrame: function (i, newX, duration) {
        const L  = this.layout;
        const fy = L.frameY;
        const unlocked = GallerySystem.isUnlocked(this._portraits[i]);
        if (!unlocked) {
            ac.moveTo({ name: `char_locked_frame_${i}`, x: newX, y: fy, duration });
            return;
        }
        ac.moveTo({ name: `char_frame_bg_${i}`, x: newX, y: fy,                     duration });
        ac.moveTo({ name: `char_clip_${i}`,     x: newX, y: fy + L.CLIP_Y_OFF,      duration });
        ac.moveTo({ name: `char_name_cn_${i}`,  x: newX, y: fy + L.NAME_CN_Y_OFF,   duration });
        ac.moveTo({ name: `char_name_en_${i}`,  x: newX, y: fy + L.NAME_EN_Y_OFF,   duration });
    },

    // ── 淡入/淡出帧（并行，非 await）────────────────────────────
    _fadeFrame: function (i, opacity, duration) {
        const unlocked = GallerySystem.isUnlocked(this._portraits[i]);
        if (!unlocked) {
            ac.fadeTo({ name: `char_locked_frame_${i}`, opacity, duration });
            return;
        }
        ac.fadeTo({ name: `char_frame_bg_${i}`, opacity, duration });
        ac.fadeTo({ name: `char_clip_${i}`,     opacity, duration });
        ac.fadeTo({ name: `char_name_cn_${i}`,  opacity, duration });
        ac.fadeTo({ name: `char_name_en_${i}`,  opacity, duration });
    },

    // ── 展开态：右侧大立绘 ───────────────────────────────────────
    _showExpandedPortrait: async function (i) {
        const L    = this.layout;
        const list = this._getPortraitList(this._portraits[i]);
        const res  = list[this._portraitPage] || ResMap.img_mask_black;

        await ac.createImage({
            name: 'char_expand_portrait', index: 3, inlayer: this.name,
            resId: res,
            pos: { x: L.expandPortrait.x, y: L.expandPortrait.y },
            anchor: { x: 50, y: 50 }, scale: L.expandPortrait.scale,
        });

        if (list.length > 1) {
            await ac.createOption({
                name: 'btn_portrait_prev', index: 4, inlayer: this.name,
                nResId: ResMap.btn_gallery_portrait_switch_n || ResMap.img_selection_bg_normal,
                sResId: ResMap.btn_gallery_portrait_switch_s || ResMap.img_selection_bg_highlight,
                content: '',
                pos: { x: L.prevBtn.x, y: L.prevBtn.y }, anchor: { x: 50, y: 50 },
                onTouchEnded: async function () { await GallerySubCharacter.onPrevPortrait(); },
            });
            await ac.createOption({
                name: 'btn_portrait_next', index: 4, inlayer: this.name,
                nResId: ResMap.btn_gallery_portrait_switch_n || ResMap.img_selection_bg_normal,
                sResId: ResMap.btn_gallery_portrait_switch_s || ResMap.img_selection_bg_highlight,
                content: '',
                pos: { x: L.nextBtn.x, y: L.nextBtn.y }, anchor: { x: 50, y: 50 },
                onTouchEnded: async function () { await GallerySubCharacter.onNextPortrait(); },
            });
        }
    },

    _getPortraitList: function (entryId) {
        const entry    = GalleryConfig[entryId];
        const unlocked = GallerySystem.isUnlocked(entryId);
        if (!unlocked) return [ResMap.img_gallery_locked_portrait || ResMap.img_mask_black];
        const ids = (entry.portraitResIds || []).filter(r => !!r);
        return ids.length > 0 ? ids : (entry.resId ? [entry.resId] : []);
    },

    // ── 切换立绘 ─────────────────────────────────────────────────
    onPrevPortrait: async function () {
        const i = this._selectedIdx;
        if (i < 0) return;
        const list = this._getPortraitList(this._portraits[i]);
        this._portraitPage = (this._portraitPage - 1 + list.length) % list.length;
        await this._refreshExpandedPortrait(i);
    },

    onNextPortrait: async function () {
        const i = this._selectedIdx;
        if (i < 0) return;
        const list = this._getPortraitList(this._portraits[i]);
        this._portraitPage = (this._portraitPage + 1) % list.length;
        await this._refreshExpandedPortrait(i);
    },

    _refreshExpandedPortrait: async function (i) {
        await ac.remove({ name: 'char_expand_portrait' });
        const list = this._getPortraitList(this._portraits[i]);
        const res  = list[this._portraitPage] || ResMap.img_mask_black;
        const L    = this.layout;
        await ac.createImage({
            name: 'char_expand_portrait', index: 3, inlayer: this.name,
            resId: res,
            pos: { x: L.expandPortrait.x, y: L.expandPortrait.y },
            anchor: { x: 50, y: 50 }, scale: L.expandPortrait.scale,
        });
    },

    // ── 折叠 ─────────────────────────────────────────────────────
    _collapseFrame: async function () {
        const i = this._selectedIdx;
        if (i < 0) return;
        const L = this.layout;

        await ac.remove({ name: 'char_expand_portrait' });
        await ac.remove({ name: 'btn_portrait_prev' });
        await ac.remove({ name: 'btn_portrait_next' });

        this._moveFrame(i, L.frameXs[i], L.ANIM_DUR);

        for (let j = 0; j < this._portraits.length; j++) {
            if (j !== i) this._fadeFrame(j, 100, L.ANIM_DUR);
        }

        await ac.delay({ time: L.ANIM_DUR + 50 });
        this._selectedIdx  = -1;
        this._portraitPage = 0;
    },

    backToEntry: async function () {
        await ac.removeCurrentUI({});
    },
};
