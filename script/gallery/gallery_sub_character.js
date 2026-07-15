// 图鉴子页 - 人物收集·立绘
// 独立 callUI，独立文件
// 交互：4个竖框并排 → 点击：其他框淡出，选中帧滑到左侧 → 右侧显示大立绘 + 左右切换按钮
//       点关闭：选中帧滑回原位，其他框淡入
console.log('[LOAD] gallery_sub_character');

const GallerySubCharacter = {
    name: 'layer_gallery_character',

    _portraits:      [],   // portrait entryId 列表（按 sortIndex）
    _selectedIdx:    -1,   // 当前展开帧索引，-1=无
    _portraitPage:   0,    // 展开时当前立绘索引

    // ── 布局（1280×720，引擎 y=0 在底部）──
    layout: {
        bg:       { x: 640,  y: 360 },
        subtitle: { x: 885,  y: 375 },
        close:    { x: 1037, y: 68  },

        FRAME_W: 142,
        FRAME_H: 508,
        // 框内各元素相对于"框中心"的 y 偏移
        // 框高 508 → 顶 +254 / 底 -254
        // 名字区 高 78，底部对齐：中心 y_off = -254+39 = -215
        // 立绘区 高 430，顶部对齐：中心 y_off = 254-215 = +39
        PORTRAIT_Y_OFF:   39,
        LOCK_Y_OFF:       39,
        NAME_CN_Y_OFF:  -200,
        NAME_EN_Y_OFF:  -228,

        frameY: 400,
        frameXs: [101, 258, 415, 572],   // 4 框初始世界坐标中心 x

        expandedX: 91,                    // 展开态：选中帧目标 x

        expandPortrait: { x: 560, y: 370, scale: 55 },  // 大立绘

        prevBtn: { x: 460, y: 85 },      // 切换按钮
        nextBtn: { x: 570, y: 85 },

        ANIM_DUR: 350,
    },

    _saveState: function (patch) { return GalleryUI._saveState(patch); },

    // ── 进入子页 ──────────────────────────────────────────────
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
        if (ResMap.img_gallery_subtitle_char) {
            await ac.createImage({
                name: 'img_character_subtitle', index: 1, inlayer: this.name,
                resId: ResMap.img_gallery_subtitle_char,
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

        // 关闭按钮（展开态→折叠，非展开态→关闭 UI）
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

        // 立绘竖框
        for (let i = 0; i < this._portraits.length; i++) {
            await this._createFrame(i, this._portraits[i]);
        }
    },

    // ── 单帧创建 ─────────────────────────────────────────────
    _createFrame: async function (i, entryId) {
        const L        = this.layout;
        const entry    = GalleryConfig[entryId];
        const unlocked = GallerySystem.isUnlocked(entryId);
        const view     = getGalleryView(entry, !unlocked);
        const fx = L.frameXs[i];
        const fy = L.frameY;

        // 立绘图（z=1，在竖框底图后方）
        const portraitRes = unlocked && view.resId
            ? view.resId
            : (ResMap.img_gallery_locked_portrait || ResMap.img_mask_black);
        await ac.createImage({
            name: `char_portrait_${i}`, index: 1, inlayer: this.name,
            resId: portraitRes,
            pos: { x: fx, y: fy + L.PORTRAIT_Y_OFF }, anchor: { x: 50, y: 50 },
            scale: 18,   // TODO: 填入真实立绘资源后按尺寸调整
        });

        // 竖框底图（z=2，边框不透明覆盖立绘溢出部分，视觉裁切）
        await ac.createImage({
            name: `char_frame_bg_${i}`, index: 2, inlayer: this.name,
            resId: ResMap.img_gallery_portrait_frame || ResMap.img_mask_black,
            pos: { x: fx, y: fy }, anchor: { x: 50, y: 50 },
            onTouchEnded: (function (idx) {
                return async function () { await GallerySubCharacter.onFrameClick(idx); };
            })(i),
        });

        // 锁图标（仅未解锁）
        if (!unlocked) {
            await ac.createImage({
                name: `char_lock_${i}`, index: 3, inlayer: this.name,
                resId: ResMap.img_gallery_lock_icon || ResMap.img_mask_round,
                pos: { x: fx, y: fy + L.LOCK_Y_OFF }, anchor: { x: 50, y: 50 },
            });
        }

        // 中文名
        await ac.createText({
            name: `char_name_cn_${i}`, index: 3, inlayer: this.name,
            content: view.name || '',
            pos: { x: fx, y: fy + L.NAME_CN_Y_OFF },
            size: { width: L.FRAME_W - 10, height: 30 }, anchor: { x: 50, y: 50 },
            style: 'style_gallery_detail_name',
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });

        // 英文名
        await ac.createText({
            name: `char_name_en_${i}`, index: 3, inlayer: this.name,
            content: entry.nameEn || '',
            pos: { x: fx, y: fy + L.NAME_EN_Y_OFF },
            size: { width: L.FRAME_W - 10, height: 22 }, anchor: { x: 50, y: 50 },
            style: 'style_gallery_strip_label',
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });
    },

    // ── 帧点击 ───────────────────────────────────────────────
    onFrameClick: async function (i) {
        if (this._selectedIdx === i) return;
        if (this._selectedIdx >= 0) {
            await this._collapseFrame();
        }
        await this._expandFrame(i);
    },

    // ── 展开帧 ───────────────────────────────────────────────
    _expandFrame: async function (i) {
        const L = this.layout;
        this._selectedIdx  = i;
        this._portraitPage = 0;

        // 其他帧淡出（并行）
        for (let j = 0; j < this._portraits.length; j++) {
            if (j === i) continue;
            ac.fadeTo({ name: `char_portrait_${j}`,  opacity: 0, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_frame_bg_${j}`,  opacity: 0, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_name_cn_${j}`,   opacity: 0, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_name_en_${j}`,   opacity: 0, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_lock_${j}`,      opacity: 0, duration: L.ANIM_DUR });
        }

        // 选中帧滑到左侧
        this._moveFrame(i, L.expandedX, L.ANIM_DUR);

        await ac.delay({ time: L.ANIM_DUR + 50 });
        await this._showExpandedPortrait(i);
    },

    // 移动帧所有元素（并行，非 await）
    _moveFrame: function (i, newX, duration) {
        const L  = this.layout;
        const fy = L.frameY;
        ac.moveTo({ name: `char_portrait_${i}`,  x: newX, y: fy + L.PORTRAIT_Y_OFF, duration });
        ac.moveTo({ name: `char_frame_bg_${i}`,  x: newX, y: fy,                     duration });
        ac.moveTo({ name: `char_name_cn_${i}`,   x: newX, y: fy + L.NAME_CN_Y_OFF,   duration });
        ac.moveTo({ name: `char_name_en_${i}`,   x: newX, y: fy + L.NAME_EN_Y_OFF,   duration });
        ac.moveTo({ name: `char_lock_${i}`,      x: newX, y: fy + L.LOCK_Y_OFF,      duration });
    },

    // ── 显示大立绘 ──────────────────────────────────────────
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

        // 多张立绘才显示切换按钮
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

    // ── 切换立绘 ────────────────────────────────────────────
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

    // ── 折叠（关闭展开态）────────────────────────────────────
    _collapseFrame: async function () {
        const i = this._selectedIdx;
        if (i < 0) return;
        const L = this.layout;

        await ac.remove({ name: 'char_expand_portrait' });
        await ac.remove({ name: 'btn_portrait_prev' });
        await ac.remove({ name: 'btn_portrait_next' });

        // 选中帧滑回原位
        this._moveFrame(i, L.frameXs[i], L.ANIM_DUR);

        // 其他帧淡入
        for (let j = 0; j < this._portraits.length; j++) {
            if (j === i) continue;
            ac.fadeTo({ name: `char_portrait_${j}`,  opacity: 100, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_frame_bg_${j}`,  opacity: 100, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_name_cn_${j}`,   opacity: 100, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_name_en_${j}`,   opacity: 100, duration: L.ANIM_DUR });
            ac.fadeTo({ name: `char_lock_${j}`,      opacity: 100, duration: L.ANIM_DUR });
        }

        await ac.delay({ time: L.ANIM_DUR + 50 });
        this._selectedIdx  = -1;
        this._portraitPage = 0;
    },

    backToEntry: async function () {
        await ac.removeCurrentUI({});
    },
};
