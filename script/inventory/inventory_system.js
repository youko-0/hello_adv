// 道具系统
console.log('[LOAD] inventory_system');

// 默认数据结构
const _inventoryDefault = function () {
    return {
        bag: {},      // 背包数据, {itemId: num}
        history: {},    // 历史获得总量（用于判断 dropLimit）, {itemId: num}
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

        getTempViewId: function () {
            return ac.var['_temp_view_item_id'] || ""
        },

        saveTempViewId: function (itemId) {
            console.log('saveTempViewId', itemId);
            ac.var['_temp_view_item_id'] = itemId;
        },
        

        /**
        * 获得道具, InventorySystem.addItem(itemId, num)
        * @param {string} itemId 道具ID
        * @param {number} num 欲添加数量
        * @returns {number} 实际添加的数量 (0表示失败)
        */
        addItem: function (itemId, num = 1) {
            if (num <= 0) return 0;

            let config = ItemConfig[itemId];
            if (!config) {
                console.error(`未知的道具 ID: ${itemId}`);
                return 0;
            }

            const data = this.getData(); // 获取核心数据引用
            const curBagNum = this.getItemCount(itemId);
            const curHistNum = this.getHistoryCount(itemId);

            let actualAdd = num;

            // 1. 检查历史掉落限制 (Unique 物品，比如只能获得一次的关键道具)
            // dropLimit: -1 无限制
            if (config.dropLimit && config.dropLimit !== -1) {
                // 剩余可掉落额度 = 上限 - 历史总量
                const remainingQuota = Math.max(0, config.dropLimit - curHistNum);
                if (actualAdd > remainingQuota) {
                    console.log(`[Inventory] ${config.name} 达到历史上限 (${config.dropLimit})，修正获取量: ${actualAdd} -> ${remainingQuota}`);
                    actualAdd = remainingQuota;
                }
            }

            // 2. 检查背包堆叠上限 (Stack)
            // maxStack: 默认 99
            const maxStack = config.maxStack || 99;
            const spaceLeft = Math.max(0, maxStack - curBagNum);
            if (actualAdd > spaceLeft) {
                console.log(`[Inventory] ${config.name} 达到堆叠上限 (${maxStack})，修正获取量: ${actualAdd} -> ${spaceLeft}`);
                actualAdd = spaceLeft;
            }

            if (actualAdd <= 0) {
                console.log(`[Inventory] ${config.name} 已达上限`);
                return 0;
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
        removeItem: function (itemId, num = 1) {
            if (num <= 0) return false;

            const count = this.getItemCount(itemId);
            if (count < num) {
                console.warn(`[Inventory] 删除失败，数量不足: ${itemId} (拥有${count}, 需要${num})`);
                return false;
            }

            const data = this.getData();
            data.bag[itemId] = count - num;

            // 如果数量归零，删除 key 以减小存档体积
            if (data.bag[itemId] <= 0) {
                delete data.bag[itemId];
            }

            this.save();
            console.log(`[Inventory] 移除了 ${num} 个 ${itemId}`);
            return true;
        },

        /**
        * 使用道具
        * @returns {boolean} 是否使用成功
        */
        useItem: async function (itemId, num = 1) {
            const config = ItemConfig[itemId];
            if (!config) return false;

            // 1. 检查数量
            if (this.getItemCount(itemId) < num) {
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
            this.removeItem(itemId, num);

            await CommonUI.showAlert(`使用了 ${num} 个 ${config.name}`);
            return true;
        },

        /**
        * 打开背包界面, await InventorySystem.openBag()
        * 这里用一个 while(true) 循环来实现背包自动打开
        * 背包主循环：负责打开 UI -> 等关闭 -> 检查是不是要看详情 -> 循环
        */
        openBag: async function () {

            await ac.callUI({
                name: 'callUI_bag',
                uiId: ResMap.ui_bag
            });

            // 下面这些是之前使用 systemDialog 作出的尝试
            // let keepOpen = true;
            // while (keepOpen) {
            //     // 打开背包 UI，并等待 UI 关闭
            //     await ac.callUI({
            //         name: 'callUI_bag', // 你的 UI 调用名
            //         uiId: ResMap.ui_bag       // 你的 UI 资源 ID
            //     });

            //     // --- 只有当 UI 被 removeCurrentUI 关闭后，代码才会跑到这里 ---

            //     // 检查全局变量, 是通过 closeBag 关闭的还是通过 viewItem 关闭的
            //     let targetItemId = this.getTempViewId();
            //     console.log('[LOG] targetItemId', targetItemId);
            //     if (targetItemId) {
            //         console.log(`[Inventory] 检测到详情请求: ${targetItemId}`);
            //         // 在 UI 关闭状态下，显示系统对话框
            //         await CommonUI.showItemDetail(targetItemId);

            //         console.log('[Inventory] 详情查看结束，准备重新打开背包');
            //         // 循环继续，会再次执行 callUI
            //     } else {
            //         // 没有标记，说明是主动点击了关闭按钮
            //         console.log('[Inventory] 玩家正常关闭背包，退出循环');
            //         keepOpen = false; // 打破循环
            //     }
            // }
        },

        // 清掉临时数据并关闭背包界面
        closeBag: async function () {
            console.log('[LOG] closeBag');
            this.saveTempViewId("");
            await ac.removeCurrentUI();
        },

        /**
        * 从背包UI中查看道具详情
        * UI 界面打开的情况下不能显示 sysDialog, 
        * 需要先关闭UI, 之后再配合 openBag 中的循环打开
        */
        viewItem: async function (itemId) {
            console.log('[LOG] viewItem', itemId);
            this.saveTempViewId(itemId);
            // await ac.removeCurrentUI();
            await InventoryUI.showItemDetail(itemId);
        }
    }
);
