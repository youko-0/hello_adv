// 剧情流程
console.log('[LOAD] plot_system');

const PlotSystem = {
    /**
     * 通用逻辑：显示回溯选项，并根据是否拥有指定道具决定剧情走向
     * @param {string} itemId 需要检查的道具ID，例如 'item_spirit_vision' (灵视)
     * @param {Function} successBranch 拥有道具时的剧情回调
     * @param {Function} failBranch 未拥有道具时的剧情回调
     */
    checkTraceback: async function (itemId, successBranch, failBranch) {
        // 1. 弹出选项让玩家选择 (假设你的引擎使用 ac.showOptions 或类似方法)
        // 注意：这里的具体 API 请替换为你项目中实际使用的选项 UI 方法
        let choice = await ac.showOptions(['尝试回溯', '放弃']);

        if (choice === 0) { // 玩家选择了“尝试回溯”
            // 2. 调用 InventorySystem 判断是否拥有道具
            // 根据 inventory_system.js 的逻辑，getItemCount > 0 即为拥有
            let hasItem = InventorySystem.getItemCount(itemId) > 0;

            if (hasItem) {
                // 3. 拥有道具，执行成功剧情
                if (successBranch) await successBranch();
            } else {
                // 4. 未拥有道具，执行失败剧情
                if (failBranch) await failBranch();
            }
        } else {
            // 玩家选择了“放弃”，可以直接结束或执行其他默认逻辑
            console.log("玩家放弃了回溯");
        }
    }

    // 未来还可以添加其他通用剧情逻辑...
    // checkAttribute: async function(...) {}
};

// // 调用通用回溯逻辑
// await PlotSystem.checkTraceback(
//     'item_spirit_vision', // 假设这是灵视的道具ID
//     async () => {
//         // 成功分支
//         await ac.sysDialogOn({ content: `【灵视】生效了！你看破了虚妄，找到了隐藏的道路。` });
//         await ExploreSystem.enterScene('hidden_room');
//     },
//     async () => {
//         // 失败分支
//         await ac.sysDialogOn({ content: `你试图回溯，但缺少关键道具【灵视】，精神受到了极大的冲击...` });
//         // 跳转到失败/死亡结局
//         await ExploreSystem.enterScene('bad_end_scene');
//     }
// );