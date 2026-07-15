// 图鉴子页 - 人物收集（立绘 / 头像）
// 独立 callUI，独立文件
console.log('[LOAD] gallery_sub_character');

const GallerySubCharacter = {
    name: 'layer_gallery_character',

    PAGE_SIZE: 4,
    _currentPage: 0,
    _entries: [],

    // ── 布局（1280×720）──
    layout: {
        bg:    { x: 640, y: 360 },
        title: { x: 885, y: 375 },
        prev:  { x: 1188, y: 570 },
        next:  { x: 1188, y: 415 },
        close: { x: 1143, y: 62 },
        cards: [
            { imgX: 228, imgY: 510, nameX: 228, nameY: 412 },
            { imgX: 562, imgY: 510, nameX: 562, nameY: 412 },
            { imgX: 228, imgY: 268, nameX: 228, nameY: 170 },
            { imgX: 562, imgY: 268, nameX: 562, nameY: 170 },
        ],
        // 立绘卡（3:4，假设原图800×1067，展示宽~240）
        cardImg:  { w: 320, h: 180, scale: 17 },
        nameBar:  { w: 320, h: 36 },
    },

    createUI: async function () {
        console.log('[LOG] GallerySubCharacter.createUI');
        this._currentPage = 0;
        const groups = GallerySystem.getEntriesByCategory(GalleryCategory.CHARACTER);
        this._entries = [
            ...(groups[GallerySub.PORTRAIT] || []),
            ...(groups[GallerySub.AVATAR]   || []),
        ];

        const L = this.layout;

        await ac.createImage({
            name: this.name, index: ZORDER.UI, inlayer: 'window',
            resId: ResMap.pic_gallery_bg || ResMap.pic_common_bg_02,
            pos: { x: L.bg.x, y: L.bg.y }, anchor: { x: 50, y: 50 },
        });

        if (ResMap.img_gallery_subtitle_char) {
            await ac.createImage({
                name: 'img_character_title', index: 1, inlayer: this.name,
                resId: ResMap.img_gallery_subtitle_char,
                pos: { x: L.title.x, y: L.title.y }, anchor: { x: 50, y: 50 },
            });
        } else {
            await ac.createText({
                name: 'img_character_title', index: 1, inlayer: this.name,
                content: '人\n物\n收\n集',
                pos: { x: L.title.x, y: L.title.y }, size: { width: 50, height: 140 },
                anchor: { x: 50, y: 50 },
                style: 'style_gallery_title',
                halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
            });
        }

        await ac.createOption({
            name: 'btn_character_prev', index: 2, inlayer: this.name,
            nResId: ResMap.btn_gallery_prev_n || ResMap.img_selection_bg_normal,
            sResId: ResMap.btn_gallery_prev_s || ResMap.img_selection_bg_highlight,
            content: '',
            pos: { x: L.prev.x, y: L.prev.y }, anchor: { x: 50, y: 50 },
            onTouchEnded: async function () { await GallerySubCharacter.prevPage(); },
        });
        await ac.createText({
            name: 'txt_character_prev', index: 3, inlayer: this.name,
            content: '上一页', pos: { x: L.prev.x, y: L.prev.y },
            size: { width: 40, height: 80 }, anchor: { x: 50, y: 50 },
            style: 'style_gallery_tab', direction: ac.TEXT_DIRECTION_TYPES.vertical,
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });

        await ac.createOption({
            name: 'btn_character_next', index: 2, inlayer: this.name,
            nResId: ResMap.btn_gallery_next_n || ResMap.img_selection_bg_normal,
            sResId: ResMap.btn_gallery_next_s || ResMap.img_selection_bg_highlight,
            content: '',
            pos: { x: L.next.x, y: L.next.y }, anchor: { x: 50, y: 50 },
            onTouchEnded: async function () { await GallerySubCharacter.nextPage(); },
        });
        await ac.createText({
            name: 'txt_character_next', index: 3, inlayer: this.name,
            content: '下一页', pos: { x: L.next.x, y: L.next.y },
            size: { width: 40, height: 80 }, anchor: { x: 50, y: 50 },
            style: 'style_gallery_tab', direction: ac.TEXT_DIRECTION_TYPES.vertical,
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });

        await ac.createOption({
            name: 'btn_character_close', index: 2, inlayer: this.name,
            nResId: ResMap.btn_common_close_normal,
            sResId: ResMap.btn_common_close_highlight,
            content: '',
            pos: { x: L.close.x, y: L.close.y }, anchor: { x: 50, y: 50 },
            onTouchEnded: async function () { await ac.removeCurrentUI({}); },
        });

        await this.renderPage();
    },

    renderPage: async function () {
        await this._clearCards();

        const start = this._currentPage * this.PAGE_SIZE;
        const pageEntries = this._entries.slice(start, start + this.PAGE_SIZE);
        const L = this.layout;

        for (let i = 0; i < 4; i++) {
            const slot = L.cards[i];
            const entryId = pageEntries[i] || null;
            await this._renderCard(i, slot, entryId);
        }

        const totalPages = Math.max(1, Math.ceil(this._entries.length / this.PAGE_SIZE));
        await ac.fadeTo({ name: 'btn_character_prev', opacity: this._currentPage > 0 ? 100 : 30, duration: 0 });
        await ac.fadeTo({ name: 'btn_character_next', opacity: this._currentPage < totalPages - 1 ? 100 : 30, duration: 0 });
        await ac.fadeTo({ name: 'txt_character_prev', opacity: this._currentPage > 0 ? 100 : 30, duration: 0 });
        await ac.fadeTo({ name: 'txt_character_next', opacity: this._currentPage < totalPages - 1 ? 100 : 30, duration: 0 });
    },

    _clearCards: async function () {
        for (let i = 0; i < 4; i++) {
            await ac.remove({ name: `character_card_${i}_img` });
            await ac.remove({ name: `character_card_${i}_lock` });
            await ac.remove({ name: `character_card_${i}_bar` });
            await ac.remove({ name: `character_card_${i}_name` });
        }
    },

    _renderCard: async function (slotIdx, slot, entryId) {
        const L = this.layout;

        if (!entryId) {
            await ac.createImage({
                name: `character_card_${slotIdx}_img`, index: 3, inlayer: this.name,
                resId: ResMap.img_gallery_card_locked || ResMap.img_mask_black,
                pos: { x: slot.imgX, y: slot.imgY }, anchor: { x: 50, y: 50 },
                scale: L.cardImg.scale,
            });
            await ac.changeMaskTo({ name: `character_card_${slotIdx}_img`, r: 0, g: 0, b: 0, opacity: 60 });
            await ac.createImage({
                name: `character_card_${slotIdx}_bar`, index: 3, inlayer: this.name,
                resId: ResMap.img_gallery_name_bar || ResMap.img_mask_black,
                pos: { x: slot.nameX, y: slot.nameY }, anchor: { x: 50, y: 50 },
                scale: 100,
            });
            return;
        }

        const entry = GalleryConfig[entryId];
        const unlocked = GallerySystem.isUnlocked(entryId);
        const view = getGalleryView(entry, !unlocked);

        const imgRes = unlocked && view.resId
            ? view.resId
            : (ResMap.img_gallery_card_locked || ResMap.img_mask_black);
        await ac.createOption({
            name: `character_card_${slotIdx}_img`, index: 3, inlayer: this.name,
            nResId: imgRes, sResId: imgRes, content: '',
            pos: { x: slot.imgX, y: slot.imgY }, anchor: { x: 50, y: 50 },
            scale: L.cardImg.scale,
            onTouchEnded: (function (id) {
                return async function () { await GallerySubCharacter.onCardClick(id); };
            })(entryId),
        });
        if (!unlocked) {
            await ac.changeMaskTo({ name: `character_card_${slotIdx}_img`, r: 0, g: 0, b: 0, opacity: 70 });
        }
        if (!unlocked) {
            await ac.createText({
                name: `character_card_${slotIdx}_lock`, index: 4, inlayer: this.name,
                content: '－暂未收集－',
                pos: { x: slot.imgX, y: slot.imgY }, size: { width: L.cardImg.w, height: L.cardImg.h },
                anchor: { x: 50, y: 50 },
                style: 'style_gallery_lock',
                halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
            });
        }

        await ac.createImage({
            name: `character_card_${slotIdx}_bar`, index: 3, inlayer: this.name,
            resId: ResMap.img_gallery_name_bar || ResMap.img_mask_black,
            pos: { x: slot.nameX, y: slot.nameY }, anchor: { x: 50, y: 50 },
            scale: 100,
        });
        await ac.createText({
            name: `character_card_${slotIdx}_name`, index: 4, inlayer: this.name,
            content: unlocked ? view.name : '',
            pos: { x: slot.nameX, y: slot.nameY }, size: { width: L.nameBar.w - 20, height: L.nameBar.h },
            anchor: { x: 50, y: 50 },
            style: 'style_gallery_text_cell',
            halign: ac.HALIGN_TYPES.middle, valign: ac.VALIGN_TYPES.center,
        });
    },

    prevPage: async function () {
        if (this._currentPage <= 0) return;
        this._currentPage--;
        await this.renderPage();
    },

    nextPage: async function () {
        const totalPages = Math.ceil(this._entries.length / this.PAGE_SIZE);
        if (this._currentPage >= totalPages - 1) return;
        this._currentPage++;
        await this.renderPage();
    },

    onCardClick: async function (entryId) {
        const unlocked = GallerySystem.isUnlocked(entryId);
        if (!unlocked) {
            await CommonUI.showCustomDialog({ content: '尚未收集' });
            return;
        }
        const view = getGalleryView(GalleryConfig[entryId], false);
        await CommonUI.showCustomDialog({ content: `${view.name}\n${view.desc}` });
    },
};
