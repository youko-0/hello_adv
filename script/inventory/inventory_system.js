// 道具系统
console.log('[LOAD] inventory_system');

const InventorySystem = {
    // 内存中的缓存（操作都在这里进行，计算快）
    _bagCache: {},     // 存道具数量 { "apple": 5 }
    _historyCache: {}, // 存获得历史 { "rusty_key": 1 }

    // 存入 ac.var 的变量名
    KEY_BAG: 'bagData',
    KEY_HISTORY: 'dropHistory',

    /**
     * 1. 初始化：游戏启动或读档后必须调用一次
     * 从 ac.var 读取字符串并解析为对象
     */
    init: function () {
        // --- 加载背包数据 ---
        let bagStr = ac.var[this.KEY_BAG];
        if (bagStr && typeof bagStr === 'string' && bagStr !== "") {
            try {
                this._bagCache = JSON.parse(bagStr);
            } catch (e) {
                console.error("背包数据解析失败，重置为空", e);
                this._bagCache = {};
            }
        } else {
            this._bagCache = {};
        }

        // --- 加载历史记录数据 ---
        let histStr = ac.var[this.KEY_HISTORY];
        if (histStr && typeof histStr === 'string' && histStr !== "") {
            try {
                this._historyCache = JSON.parse(histStr);
            } catch (e) {
                this._historyCache = {};
            }
        } else {
            this._historyCache = {};
        }
    },

    /**
     * 2. 保存：每次修改数据后自动调用
     * 将对象转为字符串存入 ac.var
     */
    _save: function () {
        ac.var[this.KEY_BAG] = JSON.stringify(this._bagCache);
        ac.var[this.KEY_HISTORY] = JSON.stringify(this._historyCache);
    },

    /**
     * 获得道具接口
     * @param {string} itemId 道具ID
     * @param {number} num 数量
     * @returns {boolean} 是否成功获得
     */
    addItem: function (itemId, num = 1) {
        let config = ItemConfig[itemId];
        if (!config) {
            console.error(`未知的道具 ID: ${itemId}`);
            return false;
        }


        // --- 检查掉落限制 (dropLimit) ---
        if (config.dropLimit !== -1) {
            let historyCount = this._historyCache[itemId] || 0;
            if (historyCount + num > config.dropLimit) {
                // 限制添加数量不超过历史上限
                num = config.dropLimit - historyCount;
                console.log(`道具 ${config.name} 达到历史掉落上限，限制添加 ${num} 个`);
            }
        }

        // --- 检查堆叠上限 (maxStack) ---
        let currentCount = this._bagCache[itemId] || 0;
        if (currentCount + num > config.maxStack) {
            // 限制添加数量不超过堆叠上限
            num = Math.min(num, config.maxStack - currentCount);
            console.log(`道具 ${config.name} 达到堆叠上限，限制添加 ${num} 个`);
        }

        // 添加数量 <= 0，不执行任何操作
        if (num <= 0) {
            return false;
        }

        // --- 执行添加 ---
        this._bagCache[itemId] = currentCount + num;

        // 更新历史记录
        this._historyCache[itemId] = (this._historyCache[itemId] || 0) + num;

        // --- 存盘 ---
        this._save();

        console.log(`获得了 ${num} 个 ${config.name}`);
        return true;
    },

    /**
     * 消耗/移除道具接口
     * @returns {boolean} 是否移除成功
     */
    removeItem: function (itemId, num = 1) {
        let currentCount = this._bagCache[itemId] || 0;

        if (currentCount < num) {
            return false; // 数量不足
        }

        this._bagCache[itemId] = currentCount - num;

        // 如果数量为0，清理key，减小json体积
        if (this._bagCache[itemId] <= 0) {
            delete this._bagCache[itemId];
        }

        this._save();
        return true;
    },

    /**
    * 使用道具
    * @returns {boolean} 是否使用成功
    */
    useItem: async function (itemId, num = 1) {
        let config = ItemConfig[itemId];

        // 1. 检查是否存在
        if (!config) return false;

        // 2. 检查数量是否足够
        if (this.getCount(itemId) < num) {
            await CommonUI.showAlert("物品数量不足！");
            return false;
        }
        // 只有消耗品和关键道具可以使用
        if (config.type !== ItemType.CONSUMABLE && config.type !== ItemType.KEY) {
            console.log(`道具 ${config.name} 不可使用`);
            return false;
        }

        // 使用道具
        if (typeof config.effect === 'function') {
            let success = await config.effect();
            if (!success) {
                await CommonUI.showAlert(`道具 ${config.name} 使用失败！`);
                return false;
            }
        }
        // 扣除数量
        this.removeItem(itemId, num);
        conslole.log(`使用了 ${num} 个 ${config.name}`);
        return true;
    },

    /**
     * 查询数量
     */
    getCount: function (itemId) {
        return this._bagCache[itemId] || 0;
    },

    /**
     * 是否拥有（数量 > 0）
     */
    hasItem: function (itemId) {
        return this.getCount(itemId) > 0;
    },

    getItemConfig: function (itemId) {
        return ItemConfig[itemId];
    },

    // 根据类型获取道具列表, 未获得的道具也要显示, 遍历 ItemConfig
    getItemListByType: function (type) {
        let itemList = Object.keys(ItemConfig).filter(itemId => ItemConfig[itemId].type === type);
        // 根据 itemId 排序
        return itemList.sort();
    },

};