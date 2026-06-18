// 道具系统
console.log('[LOAD] inventory_system');

// 默认数据结构
const _inventoryDefault = function () {
    return {
        bag: {},      // 背包数据, {itemId: itemNum}
        history: {},    // 历史获得总量（用于判断 dropLimit）, {itemId: itemNum}
    };
};

const InventorySystem = createSystem(
    'str_inventory_data', // 变量名
    _inventoryDefault,    // 默认数据生成器
    {

        getItemCount: function (itemId) {
            return this.getData().bag[itemId] || 0;
        },

        // 获取历史总获得数量
        getHistoryCount: function (itemId) {
            return this.getData().history[itemId] || 0;
        },

        // 根据类型获取道具列表, 未获得的道具也要显示, 遍历 ItemConfig
        getItemListByType: function (type) {
            let itemList = Object.keys(ItemConfig).filter(itemId => ItemConfig[itemId].type === type);
            // 根据 itemConfig.sortIndex 排序
            itemList = itemList.sort((a, b) => {
                return ItemConfig[a].sortIndex - ItemConfig[b].sortIndex;
            })
            return itemList;
        },

        /**
         * 计算可以增加的道具数量
         * @param {string} itemId 道具ID
         * @param {number} itemNum 欲添加数量
         * @returns {number} 实际可以添加的数量 (0表示无法添加)
         */
        calcCanAddAmount: function (itemId, itemNum = 1) {
            if (itemNum <= 0) return 0;

            let config = ItemConfig[itemId];
            if (!config) {
                console.error(`未知的道具 ID: ${itemId}`);
                return 0;
            }

            const curBagNum = this.getItemCount(itemId);
            const curHistNum = this.getHistoryCount(itemId);

            let actualAdd = itemNum;

            // 1. 检查历史掉落限制 (Unique 物品，比如只能获得一次的关键道具)
            // dropLimit: -1 无限制
            if (config.dropLimit && config.dropLimit !== -1) {
                // 剩余可掉落额度 = 上限 - 历史总量
                const remainingQuota = Math.max(0, config.dropLimit - curHistNum);
                if (actualAdd > remainingQuota) {
                    actualAdd = remainingQuota;
                }
            }

            // 2. 检查背包堆叠上限 (Stack)
            // maxStack: 默认 99
            const maxStack = config.maxStack || 99;
            const spaceLeft = Math.max(0, maxStack - curBagNum);
            if (actualAdd > spaceLeft) {
                actualAdd = spaceLeft;
            }

            return Math.max(0, actualAdd);
        },

        /**
        * 获得道具, InventorySystem.addItem(itemId, itemNum)
        * @param {string} itemId 道具ID
        * @param {number} itemNum 欲添加数量
        * @returns {number} 实际添加的数量 (0表示失败)
        */
        addItem: function (itemId, itemNum = 1) {
            // 计算实际可添加数量
            const actualAdd = this.calcCanAddAmount(itemId, itemNum);
            
            if (actualAdd <= 0) {
                let config = ItemConfig[itemId];
                if (config) {
                    console.log(`[Inventory] ${config.name} 已达上限`);
                } else {
                    console.error(`未知的道具 ID: ${itemId}`);
                }
                return 0;
            }

            const data = this.getData();
            const curBagNum = this.getItemCount(itemId);
            const curHistNum = this.getHistoryCount(itemId);
            const config = ItemConfig[itemId];

            // 记录日志（如果数量被限制了）
            if (actualAdd < itemNum) {
                if (config.dropLimit && config.dropLimit !== -1) {
                    const remainingQuota = Math.max(0, config.dropLimit - curHistNum);
                    if (actualAdd === remainingQuota) {
                        console.log(`[Inventory] ${config.name} 达到历史上限 (${config.dropLimit})，修正获取量: ${itemNum} -> ${actualAdd}`);
                    }
                }
                
                const maxStack = config.maxStack || 99;
                const spaceLeft = Math.max(0, maxStack - curBagNum);
                if (actualAdd === spaceLeft) {
                    console.log(`[Inventory] ${config.name} 达到堆叠上限 (${maxStack})，修正获取量: ${itemNum} -> ${actualAdd}`);
                }
            }

            // 更新背包
            data.bag[itemId] = curBagNum + actualAdd;
            // 更新历史
            data.history[itemId] = curHistNum + actualAdd;

            // 存档
            this.save();

            console.log(`[Inventory] 获得了 ${actualAdd} 个 ${config.name}`);

            return actualAdd;
        },

        /**
         * 消耗/移除道具
         * @returns {boolean} 是否移除成功
         */
        removeItem: function (itemId, itemNum = 1) {
            if (itemNum <= 0) return false;

            const count = this.getItemCount(itemId);
            if (count < itemNum) {
                console.warn(`[Inventory] 删除失败，数量不足: ${itemId} (拥有${count}, 需要${itemNum})`);
                return false;
            }

            const data = this.getData();
            data.bag[itemId] = count - itemNum;

            // 如果数量归零，删除 key 以减小存档体积
            if (data.bag[itemId] <= 0) {
                delete data.bag[itemId];
            }

            this.save();
            console.log(`[Inventory] 移除了 ${itemNum} 个 ${itemId}`);
            return true;
        },

        /**
        * 使用道具
        * @returns {boolean} 是否使用成功
        */
        useItem: async function (itemId, itemNum = 1) {
            const config = ItemConfig[itemId];
            if (!config) return false;

            // 1. 检查类型 (只有消耗品和关键道具可主动使用)
            if (config.type !== ItemType.CONSUMABLE && config.type !== ItemType.KEY) {
                await CommonUI.showCustomDialog({ content: `${config.name} 不可使用` });
                return false;
            }

            // 2. 检查数量
            if (this.getItemCount(itemId) < itemNum) {
                await CommonUI.showCustomDialog({ content: `${config.name} 数量不足` });
                return false;
            }            

            // 3. 扣除物品
            this.removeItem(itemId, itemNum);

            // 4. 执行效果
            if (typeof config.effect === 'function') {
                console.log(`[Inventory] 正在使用 ${config.name}...`);
                await config.effect();
            }
            return true;
        },

        /**
         * 获得道具（纯数据），await InventorySystem.gainItem(itemId, itemNum)
         * 仅更新背包与历史数据，不涉及任何 UI 表演
         * UI 表演请走 InventoryUI.gainItem
         * @param {string} itemId 道具ID
         * @param {number} itemNum 欲添加数量
         * @returns {number} 实际添加的数量 (0表示失败)
         */
        gainItem: function (itemId, itemNum = 1) {
            return this.addItem(itemId, itemNum);
        },
    }
);
