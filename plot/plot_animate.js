// 鱼群动效

await ac.sysDialogOn({
    roleName: `角色名`,
    content: `直到莲花状的光芒笼罩在她身上的刹那，她一下子安静下来了。`,
    id: 10436456,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
    roleAvatarResId: '$1528927',
});

await ac.createImage({
    name: 'img_fish',
    index: 0,
    inlayer: 'window',
    resId: '$193064575',
    pos: {
        x: 680,
        y: 118,
    },
    anchor: {
        x: 40,
        y: 60,
    },
    opacity: 100,
    scale: 40,
    visible: false,
    verticalFlip: false,
    horizontalFlip: false,
});

ac.show({
    name: 'img_fish',
    effect: 'fadein',
    duration: 1000,
    canskip: false,
});


await ac.sysDialogOn({
    roleName: `鱼女`,
    content: `是那家伙……`,
    id: 10436456,
    hasRoleName: true,
    hasBg: true,
    hasRoleAvatar: true,
    roleAvatarResId: '$192897217',
});


await ac.sysDialogOn({
    roleName: `角色名`,
    content: `我似乎又听到神明念诵经文的声音，可这声音忽远忽近，仿佛只是我的幻觉。`,
    id: 10436456,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
    roleAvatarResId: '$1528927',
});

// ── 淡入→等待→淡出 轨道（并行，不 await）──
(async () => {
    await ac.delay({ time: 2500 });
    ac.remove({ name: 'img_fish', effect: 'fadeout', duration: 1000, canskip: false});
})();

// 弧线移动 + 同步旋转（await）
UIEffect.playArcFlyEffect({
    name: 'img_fish',
    to: { x: 620, y: 360 },
    arcDir: -1,
    arcBulge: 0.65,
    arcPosT: 0.8,
    spinAngle: -180,
    duration: 2500,
    steps: 12,
    debug: false,
});

await ac.delay({ time: 500 });

await ac.sysDialogOn({
    roleName: `角色名`,
    content: `她的身影渐渐淡了，化成一缕烟，悠悠往上飘走了。`,
    id: 10436456,
    hasRoleName: false,
    hasBg: true,
    hasRoleAvatar: false,
    roleAvatarResId: '$1528927',
});