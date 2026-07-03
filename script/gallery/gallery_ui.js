// 图鉴 UI
console.log('[LOAD] gallery_ui');

const GalleryUI = {
    name: 'layer_gallery_ui',
    VAR_NAME: 'str_gallery_ui_state',   // 跨 callUI 临时态
    svName: 'sv_gallery_content',
    tabPrefix: 'btn_gallery_tab_',
    detailName: 'layer_gallery_detail',

    _currentTab: GalleryCategory.APPRECIATION,

    // ── 布局 ─────────────────────────────────────────────────────
    layout: {
        sv: { x: 640, y: 320, w: 1180, h: 480 },
        tab: { y: 622, xs: [440, 640, 840] },
        titleY: 688,
        closePos: { x: 1203, y: 64 },
        gap: 18,            // cell 间距
        sectionH: 56,       // 子分类小标题行高
        sectionGap: 14,     // 小标题与网格间距
        // 各宽高比 cell 配置：w/h 为逻辑尺寸（用于排版），scale 为缩略图缩放
        cells: {
            '16:9': { w: 340, h: 200, cols: 3, scale: 18 },   // 假设原图宽 ~1920
            '3:4':  { w: 210, h: 280, cols: 4, scale: 26 },   // 假设原图宽 ~800
            '1:1':  { w: 160, h: 175, cols: 5, scale: 62 },   // 假设原图宽 ~256
            'text': { w: 1080, h: 64, cols: 1, scale: 100 },
        },
    },

    // ── 跨上下文状态 ─────────────────────────────────────────────
    _loadState: function () {
        const jsonStr = ac.var[this.VAR_NAME];
        if (jsonStr && jsonStr.length > 0) {
            try { return JSON.parse(jsonStr); } catch (e) {}
        }
        return { currentTab: GalleryCategory.APPRECIATION };
    },
    _saveState: function (patch) {
        const state = Object.assign(this._loadState(), patch);
        ac.var[this.VAR_NAME] = JSON.stringify(state);
        return state;
    },

    // ── 打开 / 关闭 ──────────────────────────────────────────────
    /**
     * 打开图鉴
     * @param {Object} [config]
     * @param {string} [config.tab] 初始 Tab（GalleryCategory.*）
     */
    open: async function (config = {}) {
        const tab = config.tab || GalleryCategory.APPRECIATION;
        this._saveState({ currentTab: GalleryTabOrder.indexOf(tab) >= 0 ? tab : GalleryCategory.APPRECIATION });
        await ac.callUI({ name: 'callUI_gallery', uiId: ResMap.ui_gallery });
    },

    createGalleryUI: async function () {
        this._currentTab = this._loadState().currentTab;
        console.log('[LOG] GalleryUI.createGalleryUI tab=', this._currentTab);

        // 主背景
        await ac.createImage({
            name: this.name, index: ZORDER.UI, inlayer: 'window',
            resId: ResMap.pic_common_bg_02,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        // 标题（占位图缺省时用文字）
        if (ResMap.img_gallery_title) {
            await ac.createImage({
                name: 'img_gallery_title', index: 1, inlayer: this.name,
                resId: ResMap.img_gallery_title,
                pos: { x: GameConfig.centerX, y: this.layout.titleY },
                anchor: { x: 50, y: 50 },
            });
        } else {
            await ac.createText({
                name: 'img_gallery_title', index: 1, inlayer: this.name,
                content: '图　鉴',
                pos: { x: GameConfig.centerX, y: this.layout.titleY },
                size: { width: 200, height: 50 },
                anchor: { x: 50, y: 50 },
                style: 'style_gallery_title',
                halign: ac.HALIGN_TYPES.middle,
                valign: ac.VALIGN_TYPES.center,
            });
        }

        // 关闭按钮
        await ac.createOption({
            name: 'btn_gallery_close', index: 0, inlayer: this.name,
            nResId: ResMap.btn_common_close_normal,
            sResId: ResMap.btn_common_close_highlight,
            content: '',
            pos: this.layout.closePos,
            anchor: { x: 50, y: 50 },
            onTouchEnded: async function () { await GalleryUI.closeGalleryUI(); },
        });

        await this.createTabs();
        await this.buildTabContent(this._currentTab);
    },

    closeGalleryUI: async function () {
        await ac.removeCurrentUI({});
    },

    // ── 顶部分类 Tab ─────────────────────────────────────────────
    _tabRes: function (active) {
        return active
            ? { n: ResMap.btn_gallery_tab_active, s: ResMap.btn_gallery_tab_active }
            : { n: ResMap.btn_gallery_tab_normal, s: ResMap.btn_gallery_tab_normal };
    },

    createTabs: async function () {
        const xs = this.layout.tab.xs;
        const y = this.layout.tab.y;
        for (let i = 0; i < GalleryTabOrder.length; i++) {
            const cat = GalleryTabOrder[i];
            const active = cat === this._currentTab;
            const r = this._tabRes(active);
            // 资源缺省时 fallback 到选项底图
            const nResId = r.n || ResMap.img_selection_bg_normal;
            const sResId = r.s || ResMap.img_selection_bg_highlight;
            await ac.createOption({
                name: this.tabPrefix + cat, index: 2, inlayer: this.name,
                nResId: nResId, sResId: sResId,
                content: '',
                pos: { x: xs[i], y: y },
                anchor: { x: 50, y: 50 },
                onTouchEnded: (function (c) {
                    return async function () { await GalleryUI.onTabSelect(c); };
                })(cat),
            });
            // 独立文字标签（不依赖 createOption 渲染文字）
            await ac.createText({
                name: this.tabPrefix + cat + '_label', index: 3, inlayer: this.name,
                content: GalleryTabName[cat],
                pos: { x: xs[i], y: y },
                size: { width: 160, height: 40 },
                anchor: { x: 50, y: 50 },
                style: active ? 'style_gallery_tab_active' : 'style_gallery_tab',
                halign: ac.HALIGN_TYPES.middle,
                valign: ac.VALIGN_TYPES.center,
            });
        }
    },

    onTabSelect: async function (cat) {
        if (cat === this._currentTab) return;
        this._currentTab = cat;
        this._saveState({ currentTab: cat });
        // 重建 Tab 按钮（切换选中态）+ 内容
        for (const c of GalleryTabOrder) {
            await ac.remove({ name: this.tabPrefix + c });
            await ac.remove({ name: this.tabPrefix + c + '_label' });
        }
        await ac.remove({ name: this.svName });
        await this.createTabs();
        await this.buildTabContent(cat);
    },

    // ── 内容区构建 ───────────────────────────────────────────────
    buildTabContent: async function (category) {
        const L = this.layout;
        const groups = GallerySystem.getEntriesByCategory(category);
        const subs = GallerySubOrder[category];

        // 预算 innerHeight
        let innerH = L.sectionGap;
        for (const sub of subs) {
            const ids = groups[sub] || [];
            if (ids.length === 0) continue;
            innerH += L.sectionH;                       // 小标题
            innerH += L.sectionGap;
            const cellCfg = this._cellCfgForSub(sub);

            // 剧情 Tab 的回忆/结局有子分组副标题，额外计入开销
            const isStorySub = (sub === GallerySub.MEMORY || sub === GallerySub.ENDING);
            if (isStorySub) {
                let groupCount = 0;
                if (sub === GallerySub.MEMORY) {
                    const byWorld = groupGalleryMemoryByWorld(ids);
                    for (const w in byWorld) if (byWorld[w].length) groupCount++;
                } else {
                    const byGroup = groupGalleryEndingByGroup(ids);
                    for (const g in byGroup) if (byGroup[g].length) groupCount++;
                }
                innerH += groupCount * (18 + 36 + L.sectionGap);  // 副标题 + 间距
                // text cell cols=1，每条占一行
                innerH += ids.length * cellCfg.h + (ids.length - 1) * L.gap;
            } else {
                const rows = Math.ceil(ids.length / cellCfg.cols);
                innerH += rows * cellCfg.h + (rows - 1) * L.gap;
            }
            innerH += L.sectionGap * 2;                  // 块间留白
        }
        innerH = Math.max(innerH, L.sv.h);

        await ac.createScrollView({
            name: this.svName, index: 1, inlayer: this.name,
            pos: { x: L.sv.x, y: L.sv.y },
            anchor: { x: 50, y: 50 },
            size: { width: L.sv.w, height: L.sv.h },
            innerSize: { width: L.sv.w, height: innerH },
            verticalScroll: true, horizontalScroll: false,
        });

        // 从顶部往下填
        let cursorY = innerH - L.sectionGap;
        for (const sub of subs) {
            const ids = groups[sub] || [];
            if (ids.length === 0) continue;
            // 小标题
            cursorY -= L.sectionH / 2;
            await this.createSection(sub, cursorY);
            cursorY -= L.sectionH / 2 + L.sectionGap;

            const cellCfg = this._cellCfgForSub(sub);
            cursorY = await this.createGrid(ids, cellCfg, cursorY);
            cursorY -= L.sectionGap * 2;
        }
    },

    /** 子分类 → cell 配置（图片按 aspect，剧情用 text） */
    _cellCfgForSub: function (sub) {
        if (sub === GallerySub.CG || sub === GallerySub.SCENE) return this.layout.cells['16:9'];
        if (sub === GallerySub.PORTRAIT) return this.layout.cells['3:4'];
        if (sub === GallerySub.AVATAR) return this.layout.cells['1:1'];
        return this.layout.cells['text'];   // memory / ending
    },

    /** 创建子分类小标题，返回占用高度 */
    createSection: async function (sub, y) {
        // 剧情回忆/结局用更具语义的标题已在分组内处理，此处统一显示子分类名
        const title = GallerySubName[sub] || sub;
        await ac.createText({
            name: `txt_gallery_section_${sub}_${y}`, index: 5, inlayer: this.svName,
            content: title,
            pos: { x: this.layout.sv.w / 2, y: y },
            size: { width: 200, height: 40 },
            anchor: { x: 50, y: 50 },
            style: 'style_gallery_section',
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
        });
    },

    /**
     * 创建网格（图片或文字），返回填充后的 cursorY
     * @param {Array<string>} entryIds
     * @param {Object} cellCfg { w, h, cols, scale }
     * @param {number} topY 该块顶行中心 y
     */
    createGrid: async function (entryIds, cellCfg, topY) {
        const L = this.layout;
        const cols = cellCfg.cols;
        const cellW = cellCfg.w, cellH = cellCfg.h;
        const totalW = cols * cellW + (cols - 1) * L.gap;
        const startX = (L.sv.w - totalW) / 2 + cellW / 2;
        let y = topY - cellH / 2;

        // 剧情 Tab：回忆按世次、结局按 endingGroup 再分组，每组前插副标题
        const isStory = GalleryConfig[entryIds[0]] && GalleryConfig[entryIds[0]].category === GalleryCategory.STORY;

        if (isStory && entryIds[0] && GalleryConfig[entryIds[0]].sub === GallerySub.MEMORY) {
            const byWorld = groupGalleryMemoryByWorld(entryIds);
            for (const wKey of ['world1', 'world2', 'world3', 'other']) {
                const list = byWorld[wKey];
                if (!list || list.length === 0) continue;
                y -= 18;
                await this.createSubGroupTitle(GalleryWorldName[wKey] || wKey, y);
                y -= 36 + cellH / 2;
                y = await this._fillRow(list, cellCfg, startX, y);
                y -= cellH / 2 + L.sectionGap;
            }
            return y;
        }

        if (isStory && entryIds[0] && GalleryConfig[entryIds[0]].sub === GallerySub.ENDING) {
            const byGroup = groupGalleryEndingByGroup(entryIds);
            for (const gKey of ['ending', 'side']) {
                const list = byGroup[gKey];
                if (!list || list.length === 0) continue;
                y -= 18;
                await this.createSubGroupTitle(GalleryEndingGroup[gKey] || gKey, y);
                y -= 36 + cellH / 2;
                y = await this._fillRow(list, cellCfg, startX, y);
                y -= cellH / 2 + L.sectionGap;
            }
            return y;
        }

        // 普通图片网格
        return await this._fillRow(entryIds, cellCfg, startX, y);
    },

    /** 按行填充，返回最后一行下方 y（cellH/2 已减） */
    _fillRow: async function (entryIds, cellCfg, startX, y) {
        const L = this.layout;
        const cols = cellCfg.cols;
        let yCur = y;
        for (let i = 0; i < entryIds.length; i++) {
            const entryId = entryIds[i];
            const col = i % cols;
            const x = startX + col * (cellCfg.w + L.gap);
            await this.createCell(entryId, x, yCur, cellCfg);
            if (col === cols - 1 || i === entryIds.length - 1) {
                yCur -= cellCfg.h + L.gap;
            }
        }
        return yCur + L.gap;   // 回到最后一行底边
    },

    createSubGroupTitle: async function (text, y) {
        await ac.createText({
            name: `txt_gallery_subgroup_${y}`, index: 6, inlayer: this.svName,
            content: text,
            pos: { x: this.layout.sv.w / 2, y: y },
            size: { width: 300, height: 32 },
            anchor: { x: 50, y: 50 },
            style: 'style_gallery_subgroup',
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
        });
    },

    // ── 单个条目 cell ────────────────────────────────────────────
    createCell: async function (entryId, x, y, cellCfg) {
        const entry = GalleryConfig[entryId];
        const unlocked = GallerySystem.isUnlocked(entryId);
        const view = getGalleryView(entry, !unlocked);
        const cellName = `gallery_cell_${entryId}`;

        if (entry.type === GalleryType.TEXT) {
            await this._createTextCell(cellName, entryId, x, y, cellCfg, unlocked, view);
        } else {
            await this._createImageCell(cellName, entryId, x, y, cellCfg, unlocked, view);
        }
    },

    _createImageCell: async function (cellName, entryId, x, y, cellCfg, unlocked, view) {
        // 缩略图：解锁用真图，未解锁用遮罩 fallback；统一 scale 保证尺寸一致
        const imgRes = unlocked && view.resId ? view.resId : ResMap.img_mask_black;
        await ac.createOption({
            name: cellName, index: 3, inlayer: this.svName,
            nResId: imgRes, sResId: imgRes,
            content: '',
            pos: { x: x, y: y },
            anchor: { x: 50, y: 50 },
            scale: cellCfg.scale,
            onTouchEnded: (function (id) {
                return async function () { await GalleryUI.onCellClick(id); };
            })(entryId),
        });
        // 未解锁压黑 + ？？？标签
        if (!unlocked) {
            await ac.changeMaskTo({ name: cellName, r: 0, g: 0, b: 0, opacity: 70 });
            await ac.createText({
                name: cellName + '_lock', index: 4, inlayer: this.svName,
                content: '？？？',
                pos: { x: x, y: y },
                size: { width: cellCfg.w, height: 36 },
                anchor: { x: 50, y: 50 },
                style: 'style_gallery_lock',
                halign: ac.HALIGN_TYPES.middle,
                valign: ac.VALIGN_TYPES.center,
            });
        }
    },

    _createTextCell: async function (cellName, entryId, x, y, cellCfg, unlocked, view) {
        const bgRes = ResMap.img_gallery_text_card || ResMap.img_selection_bg_normal;
        await ac.createOption({
            name: cellName, index: 3, inlayer: this.svName,
            nResId: bgRes, sResId: ResMap.img_selection_bg_highlight || bgRes,
            content: '',
            pos: { x: x, y: y },
            anchor: { x: 50, y: 50 },
            scale: 100,
            onTouchEnded: (function (id) {
                return async function () { await GalleryUI.onCellClick(id); };
            })(entryId),
        });
        const label = unlocked ? view.name : '？？？';
        await ac.createText({
            name: cellName + '_label', index: 4, inlayer: this.svName,
            content: label,
            pos: { x: x, y: y },
            size: { width: cellCfg.w - 20, height: cellCfg.h - 10 },
            anchor: { x: 50, y: 50 },
            style: unlocked ? 'style_gallery_text_cell' : 'style_gallery_lock',
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
        });
        if (!unlocked) {
            await ac.changeMaskTo({ name: cellName, r: 0, g: 0, b: 0, opacity: 60 });
        }
    },

    // ── 点击 / 详情 ──────────────────────────────────────────────
    onCellClick: async function (entryId) {
        const entry = GalleryConfig[entryId];
        if (!GallerySystem.isUnlocked(entryId)) {
            await CommonUI.showCustomDialog({ content: '尚未解锁' });
            return;
        }
        const view = getGalleryView(entry, false);
        if (entry.type === GalleryType.IMAGE && view.resId) {
            await this.showImageDetail(entryId);
        } else {
            // 文字条目或无图：对话框展示
            await CommonUI.showCustomDialog({ content: `${view.name}\n${view.desc}` });
        }
    },

    /** 图片详情：全屏大图 + 名字 + 描述，点击关闭 */
    showImageDetail: async function (entryId) {
        const entry = GalleryConfig[entryId];
        const view = getGalleryView(entry, false);

        await ac.createLayer({
            name: this.detailName, index: ZORDER.UI + 1, inlayer: 'window',
            pos: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 0, y: 0 }, clipMode: false,
        });
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () { await GalleryUI.closeImageDetail(); },
            target: this.detailName,
        });

        // 半透明底
        await ac.createImage({
            name: 'img_gallery_detail_bg', index: 0, inlayer: this.detailName,
            resId: ResMap.pic_common_bg_03,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 }, opacity: 85,
        });

        // 大图（按宽高比适配屏幕，留底部描述空间）
        const detail = this._fitDetailScale(entry.aspect);
        await ac.createImage({
            name: 'img_gallery_detail_pic', index: 1, inlayer: this.detailName,
            resId: view.resId,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY + 60 },
            anchor: { x: 50, y: 50 },
            scale: detail.scale,
        });

        // 名字
        await ac.createText({
            name: 'txt_gallery_detail_name', index: 2, inlayer: this.detailName,
            content: view.name,
            pos: { x: GameConfig.centerX, y: 96 },
            size: { width: 600, height: 50 },
            anchor: { x: 50, y: 50 },
            style: 'style_gallery_detail_name',
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
        });

        // 描述
        await ac.createText({
            name: 'txt_gallery_detail_desc', index: 3, inlayer: this.detailName,
            content: view.desc,
            pos: { x: GameConfig.centerX, y: 48 },
            size: { width: 900, height: 50 },
            anchor: { x: 50, y: 50 },
            style: 'style_gallery_detail_desc',
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
        });
    },

    closeImageDetail: async function () {
        await ac.remove({ name: this.detailName });
    },

    /** 详情大图缩放（基于假设原图尺寸适配屏幕） */
    _fitDetailScale: function (aspect) {
        // 假设原图尺寸，按 aspect 给定，目标显示宽 ≤ 900
        const natural = {
            '16:9': { w: 1920, h: 1080 },
            '3:4':  { w: 800,  h: 1067 },
            '1:1':  { w: 512,  h: 512 },
        }[aspect] || { w: 1000, h: 750 };
        const targetW = aspect === '1:1' ? 420 : (aspect === '3:4' ? 560 : 900);
        return { scale: Math.round(targetW / natural.w * 100) };
    },

    // ── 常驻入口按钮 ────────────────────────────────────────────
    btnGallery: { name: 'global_btn_gallery' },

    /** 创建图鉴入口按钮（位置避开背包按钮），点击打开图鉴 */
    createBtnGallery: async function () {
        await ac.createImage({
            name: this.btnGallery.name,
            index: ZORDER.HUD,
            inlayer: 'window',
            resId: ResMap.btn_gallery_tab_normal || ResMap.img_selection_bg_normal,
            pos: { x: GameConfig.width - 64, y: GameConfig.height - 300 },
            anchor: { x: 50, y: 50 },
        });
        await ac.createText({
            name: this.btnGallery.name + '_label',
            index: ZORDER.HUD,
            inlayer: 'window',
            content: '图鉴',
            pos: { x: GameConfig.width - 64, y: GameConfig.height - 300 },
            size: { width: 80, height: 30 },
            anchor: { x: 50, y: 50 },
            style: 'style_gallery_tab',
            halign: ac.HALIGN_TYPES.middle,
            valign: ac.VALIGN_TYPES.center,
        });
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: async function () { await GalleryUI.open(); },
            target: this.btnGallery.name,
        });
    },
};
