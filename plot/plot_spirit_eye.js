await CommonUI.showCustomDialog({
    content: '是否查看香灰',
    closeType: 2,
});

await CommonUI.showCustomOptionGroup({
    options: [
        {
            text: '查看', callback: async () => {
                await CommonUI.showCustomDialog({
                    content: '获得道具灵视',
                })
                await InventorySystem.gainItem('item_spirit_eye', 1);
            }
        },
        {
            text: '不看', callback: async () => {
                await CommonUI.showCustomDialog({
                    content: '无事发生',
                })
            }
        }
    ],
})

await ac.sysDialogOn({
    content: `灵视剧情结束`,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});

await PlotSystem.enterPlotMap()