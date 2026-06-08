// 背包 UI（通过 ac.callUI 调用，层级高于引擎系统菜单）
console.log('[LOAD] ui_bag');
console.log('_selectedId: ', BagUI._selectedId);

const _itemList = InventorySystem.getItemListByType(ItemType.KEY);

// openBag 已设 BagUI._selectedId，createItemList 据此一次性渲染正确 bg
await BagUI.createBagUI();
await BagUI.createItemList(_itemList);

// 直接刷新详情，跳过 onItemSelect 中不必要的 bg 重建
if (BagUI._selectedId) {
    await BagUI.refreshItemDetail(BagUI._selectedId);
}

await BagUI.onBagOpen();
// callUI 在此自然阻塞，直到关闭按钮调用 ac.removeCurrentUI()
