// 图鉴收集系统
console.log('[LOAD] gallery_system');

const _galleryDefault = function () {
    return {
        collected: {},   // 已收集/解锁条目, { entryId: true }
    };
};

const GallerySystem = createSystem(
    'cstr_gallery_data', // 永久变量，编辑器需声明为字符串类型，初始值填 '{}'（空 hex 由 _unpack 容错）
    _galleryDefault,
    {
        // ── 位图压缩（永久变量单条 ≤ 255 字符） ───────────────────
        // 每个 entry 占 1 bit，按 entryId 排序固定位序，打包成 hex 字符串

        _ENTRY_IDS: null,
        _INDEX_BY_ID: null,

        _getEntryMap: function () {
            if (!this._ENTRY_IDS) {
                this._ENTRY_IDS = GALLERY_ENTRY_ORDER;
                this._INDEX_BY_ID = {};
                for (let i = 0; i < this._ENTRY_IDS.length; i++) {
                    this._INDEX_BY_ID[this._ENTRY_IDS[i]] = i;
                }
            }
            return this._ENTRY_IDS;
        },

        // { entryId: true } → hex
        _pack: function (collected) {
            const ids = this._getEntryMap();
            const n = ids.length;
            const hexLen = Math.ceil(n / 4);
            let out = '';
            for (let i = 0; i < hexLen; i++) {
                let nibble = 0;
                for (let b = 0; b < 4; b++) {
                    const idx = i * 4 + b;
                    if (idx < n && collected[ids[idx]]) nibble |= (1 << b);
                }
                out += nibble.toString(16);
            }
            return out;
        },

        // raw（hex 或旧 JSON）→ { entryId: true }
        _unpack: function (raw) {
            const collected = {};
            const ids = this._getEntryMap();
            const n = ids.length;
            if (typeof raw !== 'string' || raw.length === 0) return collected;
            // 兼容旧 JSON 格式：{"collected":{"xxx":true}}
            if (raw[0] === '{') {
                try {
                    const obj = JSON.parse(raw);
                    if (obj && typeof obj === 'object') {
                        const c = obj.collected || obj;
                        for (const k in c) if (c[k]) collected[k] = true;
                    }
                } catch (e) {
                    console.warn(`【${this.VAR_NAME}】旧 JSON 解析失败:`, e);
                }
                return collected;
            }
            // hex 位图
            if (!/^[0-9a-f]*$/.test(raw)) return collected;
            for (let i = 0; i < n; i++) {
                const nibble = parseInt(raw[i >> 2], 16) || 0;
                if ((nibble >> (i & 3)) & 1) collected[ids[i]] = true;
            }
            return collected;
        },

        // ── 覆盖 createSystem 的存取逻辑 ─────────────────────────
        getData: function () {
            if (this._cache == null) {
                const raw = ac.cVar[this.VAR_NAME];
                const collected = this._unpack(raw);
                this._cache = { collected };
                console.log(`【${this.VAR_NAME}】数据加载完毕: ${raw}`);
            }
            return this._cache;
        },

        save: function () {
            if (this._cache == null) {
                console.warn(`【${this.VAR_NAME}】未初始化，无法保存`);
                return;
            }
            const hex = this._pack(this._cache.collected);
            ac.cVar[this.VAR_NAME] = hex;
            console.log(`【${this.VAR_NAME}】已保存: ${hex}`);
        },

        // ── 查询 ───────────────────────────────────────────────────

        /** 是否已解锁 */
        isUnlocked: function (entryId) {
            return !!this.getData().collected[entryId];
        },

        /** 解锁数 / 总数（按分类，不传则全部） */
        getProgress: function (category) {
            let total = 0, got = 0;
            for (const entryId in GalleryConfig) {
                const entry = GalleryConfig[entryId];
                if (category && entry.category !== category) continue;
                total++;
                if (this.isUnlocked(entryId)) got++;
            }
            return { got, total };
        },

        /** 取某分类下、按子分类分组的条目 ID */
        getEntriesByCategory: function (category) {
            return getGalleryEntriesByCategory(category);
        },

        // ── 解锁 / 收集 ────────────────────────────────────────────

        /**
         * 解锁条目（纯数据，无 UI 表演）
         * @param {string} entryId
         * @returns {boolean} 是否首次解锁（false 表示已解锁或未知 ID）
         */
        unlock: function (entryId) {
            if (!GalleryConfig[entryId]) {
                console.warn(`[Gallery] 未知条目 ID: ${entryId}`);
                return false;
            }
            const data = this.getData();
            if (data.collected[entryId]) return false;
            data.collected[entryId] = true;
            this.save();
            console.log(`[Gallery] 解锁: ${entryId} (${GalleryConfig[entryId].name})`);
            return true;
        },

        /** 批量解锁 */
        unlockAll: function (entryIds) {
            for (const id of entryIds) this.unlock(id);
        },

        /** 重置（调试用，由 createSystem 提供 reset，这里补一个语义别名） */
    },
    true   // 使用永久变量 ac.cVar，图鉴解锁跨存档持久
);
