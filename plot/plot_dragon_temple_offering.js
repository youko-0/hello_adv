// 龙三太子神像上供剧情
console.log('[LOAD] plot_dragon_temple_offering');

await InventoryUI.gainItem('item_motorcycle_key');
await InventoryUI.gainItem('item_pendant');


await ac.sysDialogOn({
    content: '是否要为龙三太子的神像上供？\n<tag style=style_common_dialog_red>（重要提示：无论上供道具是否正确，都会从背包里扣除该道具，请谨慎选择。）</tag>',
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
});
const choiceIndex = await CommonUI.showCustomOptionGroup({
    options: [
        { content: '不上供。' },
        { content: '上供。' },
    ],
});

await ac.sysDialogOff({});

let itemId = '';
if (choiceIndex === 1) {
    itemId = await BagUI.open({ mode: 'choose' });
    console.log('[LOG] 选择物品', itemId);
    // 如果选择了物品，消耗道具
    if (itemId) {
        await InventorySystem.useItem(itemId);
        await ac.sysDialogOn({
            content: '一阵烟雾飘过，供品不见了。',
            hasRoleName: false,
            hasBg: true,
            hasRoleAvatar: false,
        });
    }
}

switch (itemId) {
    case 'item_spirit_eye':
        await ac.sysDialogOn({
            roleName: '？？',
            content: '这是李云祥赐予你的技能？怎么不好好收着？',
            hasRoleName: true,
            hasBg: true,
            hasRoleAvatar: false,
        });
        break;


    case 'item_pendant':
        await ac.sysDialogOn({
            roleName: '？？',
            content: '唔……是我的龙鳞，上面似乎刻着模糊的字迹，但还是把它留给李云祥吧。',
            hasRoleName: true,
            hasBg: true,
            hasRoleAvatar: false,
        });
        break;

    case 'item_armor':
        await ac.sysDialogOn({
            roleName: '？？',
            content: '拿走，这辈子没穿过这么短的衣服。',
            hasRoleName: true,
            hasBg: true,
            hasRoleAvatar: false,
        });
        break;

    case 'item_compass':
        await ac.sysDialogOn({
            roleName: '？？',
            content: '这里面是李云祥前世的记忆啊，有意思……不过，我更想听他亲口告诉我。',
            hasRoleName: true,
            hasBg: true,
            hasRoleAvatar: false,
        });
        break;

    case 'item_visa':
        await ac.sysDialogOn({
            roleName: '？？',
            content: '偷了我daddy的东西，还敢拿到本少爷面前？？你是活腻了吗？',
            hasRoleName: true,
            hasBg: true,
            hasRoleAvatar: false,
        });
        break;

    case 'item_motorcycle_key':
        break;

    default:
        // 未选择物品 或 直接选择不上贡
        await ac.sysDialogOn({
            roleName: '我',
            content: '这次来得仓促，身上什么东西都没带，我看看比脸还干净的衣兜，只能放弃了孝敬小舅妈的机会。\n下次再来吧，下次一定！',
            hasRoleName: true,
            hasBg: true,
            hasRoleAvatar: false,
        });
        // 提前打断回到地图
        await PlotSystem.enterPlotMap()
}

// 上供了非正确道具，小舅妈不领情
if (itemId && itemId !== 'item_motorcycle_key') {
    await ac.sysDialogOn({
        roleName: '我',
        content: '不需要的话倒是还给我啊！',
        hasRoleName: true,
        hasBg: true,
        hasRoleAvatar: false,
    });
    await ac.sysDialogOn({
        roleName: '我',
        content: '……',
        hasRoleName: true,
        hasBg: true,
        hasRoleAvatar: false,
    });
    await ac.sysDialogOn({
        roleName: '我',
        content: '你真的是我小舅妈吗！大人怎么可以抢孩子的东西！',
        hasRoleName: true,
        hasBg: true,
        hasRoleAvatar: false,
    });
    await ac.sysDialogOn({
        content: '小舅妈已经下线了。',
        hasRoleName: false,
        hasBg: true,
        hasRoleAvatar: false,
    });
    await ac.sysDialogOn({
        roleName: '我',
        content: '呜呜呜！',
        hasRoleName: true,
        hasBg: true,
        hasRoleAvatar: false,
    });

    // 提前打断回到地图
    await PlotSystem.enterPlotMap()
}

// 上供了正确道具（车钥匙/红莲）
await ac.sysDialogOn({
    roleName: '？？',
    content: '（开心地哼歌）哼哼，李云祥那家伙居然敢不给本少爷红莲，还不是叫我拿到了~',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await ac.sysDialogOn({
    roleName: '我',
    content: '唔……我好像见过你。',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await ac.sysDialogOn({
    roleName: '？？',
    content: '好没新意的杀猪盘套路。',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await ac.sysDialogOn({
    roleName: '我',
    content: '（怒）才不是杀猪盘！',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await ac.sysDialogOn({
    roleName: '？？',
    content: '咦？仔细一看，你确实让我有点眼熟……',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await ac.sysDialogOn({
    roleName: '？？',
    content: '看在你诚心诚意向我献上红莲钥匙的份上，本太子就大慈大悲地赏你一件礼物吧。',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await ac.sysDialogOn({
    roleName: '我',
    content: '（立刻跪下，伸出双手）谢谢丙丙大王，大王万岁万岁万万岁。',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await ac.sysDialogOn({
    roleName: '？？',
    content: '（嫌弃）大胆凡人，居然咒我短命。',
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
});
await InventoryUI.gainItem('item_blessing');

await ac.sysDialogOn({
    roleName: `角色名`,
    content: `我冲出大殿，感动涕零地握住刚才那个少女的手。`,
    id: 10436456,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
    roleAvatarResId: '$1528927',
});

await ac.sysDialogOn({
    roleName: `我`,
    content: `你家产，不，我家产是真的！！！`,
    id: 10436456,
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
    roleAvatarResId: '$1528927',
});

await ac.sysDialogOn({
    roleName: `少女`,
    content: `啊？`,
    id: 10436456,
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
    roleAvatarResId: '$1528927',
});

await ac.sysDialogOn({
    roleName: `我`,
    content: `（激动）全体东海人必须、立刻给我磕这对cp！`,
    id: 10436456,
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: false,
    roleAvatarResId: '$1528927',
});

await PlotSystem.enterPlotMap()