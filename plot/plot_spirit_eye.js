await CommonUI.showCustomDialog({
    content: '是否查看香灰',
    closeType: 2,
});

let flagGain = false;
await CommonUI.showCustomOptionGroup({
    options: [
        {
            content: '查看', onTouchEnded: async () => {
                await CommonUI.closeCustomOptionGroup();
                flagGain = true;
                
            }
        },
        {
            content: '不看', onTouchEnded: async () => {
                await CommonUI.closeCustomOptionGroup();
                
            }
        }
    ],
})

if (flagGain) {
    await CommonUI.showCustomDialog({
        content: '获得道具灵视',
    })
    await InventorySystem.gainItem('item_spirit_eye', 1);
}
else {
    await CommonUI.showCustomDialog({
        content: '无事发生',
    })
}

await ac.sysDialogOn({
    content: `灵视剧情结束`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});

await PlotSystem.enterPlotMap()