

await ExploreSystem.enterScene('nezha_temple');

// -------------- 下城区旧居 -------------------
await ac.sysDialogOn({
    content: `下城区旧居剧情`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await ExploreSystem.enterScene('residence');

await ac.sysDialogOn({
    content: `下城区大舅剧情, 获得道具龙鳞项链`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await InventoryUI.gainItem('item_pendant')

await PlotSystem.showSpiritEyeOption()

await ac.sysDialogOn({
    content: `回溯剧情balabala`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});

await PlotSystem.enterPlotMap()

// -------------- 下城区旧居 -------------------


// ----------------- 赛车场 ----------------
await ac.sysDialogOn({
    content: `赛车场剧情, 获得道具云字铠甲`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});

await InventoryUI.gainItem('item_armor')

await PlotSystem.enterPlotMap()

// ----------------- 赛车场 ----------------

// ---------------- 哪吒庙 ------------------
await ac.sysDialogOn({
    content: `哪吒庙剧情`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await ExploreSystem.enterScene('nezha_temple');

await ac.sysDialogOn({
    content: `获得道具八宝罗盘`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await InventoryUI.gainItem('item_compass')

await ac.sysDialogOn({
    content: `黑化哪吒庙剧情`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await ExploreSystem.enterScene('broken_nezha_temple');

await PlotSystem.enterPlotMap()

// ---------------- 哪吒庙 ------------------

// ---------------- 龙王庙 ------------------
await ac.sysDialogOn({
    content: `龙王庙剧情`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await ExploreSystem.enterScene('dragon_temple');

await ac.sysDialogOn({
    content: `获得道具龙三太子的庇佑`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await InventoryUI.gainItem('item_blessing')

await PlotSystem.enterPlotMap()

// ---------------- 龙王庙 ------------------

// ---------------- 德兴大厦 ----------------

await ac.sysDialogOn({
    content: `德兴大厦剧情`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
await ExploreSystem.enterScene('dexing_tower');

await PlotSystem.enterPlotMap()

// ---------------- 德兴大厦 ----------------