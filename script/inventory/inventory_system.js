// 道具系统
console.log('[LOAD] inventory_system');

// 默认数据结构
const _inventoryDefault = function () {
    return {
        selectedId: "",     // 当前选中的道具ID
        bag: {},      // 背包数据, {itemId: itemNum}
        history: {},    // 历史获得总量（用于判断 dropLimit）, {itemId: itemNum}
    };
};

const InventorySystem = createSystem(
    'str_inventory_data', // 变量名
    _inventoryDefault,    // 默认数据生成器
    {

        getItemConfig: function (itemId) {
            return ItemConfig[itemId];
        },

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

            // 1. 检查数量
            if (this.getItemCount(itemId) < itemNum) {
                await CommonUI.showAlert("物品数量不足！");
                return false;
            }

            // 2. 检查类型 (只有消耗品和关键道具可主动使用)
            // 假设 ItemType 是全局枚举
            if (config.type !== ItemType.CONSUMABLE && config.type !== ItemType.KEY) {
                console.log(`[Inventory] ${config.name} 不可直接使用`);
                return false;
            }

            // 3. 执行效果
            // 先执行效果，成功后再扣除物品
            let success = true;
            if (typeof config.effect === 'function') {
                console.log(`[Inventory] 正在使用 ${config.name}...`);
                success = await config.effect();
            }

            if (!success) {
                await CommonUI.showAlert(`${config.name} 使用无效`);
                return false;
            }

            // 4. 扣除物品
            this.removeItem(itemId, itemNum);

            await CommonUI.showAlert(`使用了 ${itemNum} 个 ${config.name}`);
            return true;
        },

        /**
         * 获得道具并播放提示效果, await InventorySystem.gainItem(itemId, itemNum, itemName)
         * @param {string} itemId 道具ID
         * @param {number} itemNum 欲添加数量
         * @param {string} itemName 场景中的控件名, 控件消失并播放拖尾特效
         * @returns {number} 实际添加的数量 (0表示失败)
         */
        gainItem: async function (itemId, itemNum = 1, itemName='') {
            let addCount = this.addItem(itemId, itemNum);
            if (addCount > 0) {
                await InventoryUI.onGainItem(itemId, itemNum, itemName);
            }
            return addCount;
        },

        /**
        * 打开背包界面, await InventorySystem.openBag(itemId)
        * 通过 ac.callUI 打开真正的 UI 层（入口 ui/ui_bag.js）
        * @param {string} selectedId 默认选中的道具ID, 不传则默认选中第一个道具
        */
        openBag: async function (selectedId = null) {
            let itemList = this.getItemListByType(ItemType.KEY);
            if (typeof selectedId !== 'string' || !selectedId) {
                selectedId = itemList[0];
            }
            BagUI._mode = 'view';
            BagUI._onChoose = null;
            BagUI._selectedId = selectedId;
            await ac.callUI({
                name: 'callUI_bag',
                uiId: ResMap.ui_bag,
            });
        },

        /**
         * 以"选择模式"打开背包，btn_view 变为 btn_use
         * 点击使用后关闭背包，将选中的道具 ID 回调给调用方
         * 消耗道具与否完全由调用方在 onChoose 中决定
         * @param {Object}   config
         * @param {Function} config.onChoose       async (itemId) => {}
         * @param {string}   [config.selectedId]   默认选中的道具 ID
         */
        openBagForChoose: async function (config = {}) {
            const { onChoose, selectedId = null } = config;
            let itemList = this.getItemListByType(ItemType.KEY);
            const resolvedId = (typeof selectedId === 'string' && selectedId) ? selectedId : itemList[0];
            BagUI._mode = 'choose';
            BagUI._onChoose = onChoose || null;
            BagUI._selectedId = resolvedId;
            await ac.callUI({
                name: 'callUI_bag',
                uiId: ResMap.ui_bag,
            });
        },
    }
);
