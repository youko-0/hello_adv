// 通用 UI
console.log('[LOAD] common_ui');

const CommonUI = {
    alert: {
        width: 600,
        height: 400,
        centerX: 600 / 2,
        centerY: 400 / 2,
        mask: {
            resId: ResMap.img_mask_black,
            width: 32,
            height: 32,
        },
        bg: {
            resId: ResMap.img_forum_topic_bg_normal,
            width: 32,
            height: 32,
        },
    },

    // 找不到易次元的直接判断的接口，用 getPos 迂回一下
    isWidgetExist: async function (name) {
        let v = await ac.getPos({
            name: name,
        })
        console.log('[LOG] isWidgetExist', name, v.x);
        return v.x != null;
    },

    // 通用文本样式
    createTextStyles: async function () {
        console.log('[LOG] createTextStyles');
        ac.createStyle({
            name: 'style_alert',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: 24,
            color: '#d1d3df',
        });

        ac.createStyle({
            name: 'style_item_info',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: 24,
            color: '#d1d3df',
            speed: 9,
        });

    },

    // 是否是打断状态, 不可操作
    isInterrupted: async function () {
        let uiName = ['layer_alert', 'layer_item_detail_info'];
        for (let i = 0; i < uiName.length; i++) {
            let flag = await this.isWidgetExist(uiName[i]);
            console.log('[LOG] isInterrupted', uiName[i], flag);
            if (flag) {
                return true;
            }
        }
        return false;
    },

    // 创建物品详情 UI, 大图 + 文字描述
    showItemDetail: async function (itemId) {
        console.log('[LOG] showItemDetail', itemId);
        if (await this.isInterrupted()) {
            return;
        }
        let itemConfig = InventorySystem.getItemConfig(itemId);
        await ac.createImage({
            name: "layer_item_detail_info",
            index: 10,
            inlayer: "window",
            resId: ResMap.pic_common_bg_03,
            pos: { x: GameConfig.centerX , y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            opacity: 80,
        });
        // 大图
        await ac.createImage({
            name: "img_item_info_pic",
            index: 0,
            inlayer: "layer_item_detail_info",
            resId: itemConfig.illust,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY + 100},
            anchor: { x: 50, y: 50 },
        });
        // 文字描述
        await ac.sysDialogOn({
            content: `<tag style=style_item_info>${itemConfig.desc}</tag>`,
            tag: 'p',
            size: { width: 960, height: 80 },
            pos: { x: 160, y: 36 },
            hasRoleName: false,
            // 头像的位置用来显示道具图标
            hasRoleAvatar: Boolean(itemConfig.icon),
            roleAvatarResId: itemConfig.icon,
            roleAvatarPos: { x: 40, y: 40 },
            hasBg: true,
            bgResId: ResMap.img_dialog_bg_01,
        });
        console.log('[LOG] sysDialogOff');
        ac.sysDialogOff({
            effect: 'fadeout',
            duration: 500,
        });
        await ac.remove({
            name: "layer_item_detail_info",
            effect: 'fadeout',
            duration: 500,
            canskip: false,
        })
    },

    // 自动关闭的文本框
    showSysDialog: async function (content) {
        console.log('[LOG] showSysDialog', content);
        // 文字描述
        await ac.sysDialogOn({
            content: `<tag style=style_item_info>${content}</tag>`,
            tag: 'p',
            size: { width: 960, height: 80 },
            pos: { x: 160, y: 36 },
            hasRoleName: false,
            hasRoleAvatar: false,
            hasBg: true,
            bgResId: ResMap.img_dialog_bg_01,
        });
        await ac.sysDialogOff();
    },

    showAlert: async function (content, onConfirm = null) {
        async function onClickBtnConfirm() {
            ac.remove({
                name: 'layer_alert',
                effect: 'normal',
                duration: 0,
                canskip: false,
            });

            // 如果传了回调函数，就执行它
            if (onConfirm) await onConfirm();
        }

        async function onTouchmask() {
            console.log('[LOG] onTouchmask');
        }

        // 容器
        await ac.createLayer({
            name: 'layer_alert',
            index: 500,     // 置顶
            inlayer: 'window',
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            size: { width: this.alert.width, height: this.alert.height },
            anchor: { x: 50, y: 50 },
            clipMode: false,
        });

        await ac.createImage({
            name: "img_alert_mask",
            index: 0,
            inlayer: "layer_alert",
            resId: this.alert.mask.resId,
            pos: { x: this.alert.centerX, y: this.alert.centerY },
            anchor: { x: 50, y: 50 },
            scale: {
                x: GameConfig.width * 100 / this.alert.mask.width,
                y: GameConfig.height * 100 / this.alert.mask.height,
            },
            opacity: 60,
        });

        await ac.createImage({
            name: "img_alert_bg",
            index: 1,
            inlayer: "layer_alert",
            resId: this.alert.bg.resId,
            pos: {
                x: this.alert.width / 2,
                y: this.alert.height / 2
            },
            anchor: { x: 50, y: 50 },
            scale: {
                x: this.alert.width * 100 / this.alert.bg.width,
                y: this.alert.height * 100 / this.alert.bg.height,
            },
            opacity: 100,
        });

        await ac.createText({
            name: "alert_content",
            index: 2,
            inlayer: "layer_alert",
            content: content,
            pos: {
                x: this.alert.width / 2,
                y: this.alert.height / 2 + 60
            },
            anchor: { x: 50, y: 50 },
            size: { width: this.alert.width - 80, height: this.alert.height - 100 },
            style: "style_alert",
            valign: ac.VALIGN_TYPES.center,
            halign: ac.HALIGN_TYPES.middle,
        });

        await ac.createText({
            name: "alert_confirm_btn",
            index: 2,
            inlayer: "layer_alert",
            content: "确定",
            pos: {
                x: this.alert.width / 2,
                y: this.alert.height / 2 - 60
            },
            anchor: { x: 50, y: 50 },
            size: { width: 100, height: 60 },
            style: "style_alert",
            halign: ac.HALIGN_TYPES.middle,
        });

        // 拦截点击
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchBegan,
            listener: onTouchmask,
            target: "img_alert_mask",
        });

        // 确定按钮
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: onClickBtnConfirm,
            target: "alert_confirm_btn",
        });
    },

}

CommonUI.createTextStyles();
