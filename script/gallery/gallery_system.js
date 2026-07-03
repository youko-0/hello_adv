// 图鉴收集系统
console.log('[LOAD] gallery_system');

const _galleryDefault = function () {
    return {
        collected: {},   // 已收集/解锁条目, { entryId: true }
    };
};

const GallerySystem = createSystem(
    'str_gallery_data',
    _galleryDefault,
    {
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
    }
);
