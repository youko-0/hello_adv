// 通用 UI
console.log('[LOAD] common_ui');

const CommonUI = {
    // 黑条
    toast: {
        name: 'layer_toast',
    },
    // 弹窗
    alert: {
        name: 'layer_alert',
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
        style: {
            name: 'style_alert',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: 24,
            color: '#d1d3df',
        },
    },
    // 对话框
    dialog: {
        name: 'layer_dialog',
        width: 960,
        height: 80,
        centerX: 960 / 2,
        centerY: 80 / 2,
        bg: {
            resId: ResMap.img_dialog_bg,
            width: 1241,
            height: 150,
        }
    },


    // 找不到易次元的直接判断的接口，用 getPos 迂回一下
    isWidgetExist: async function (name) {
        let v = await ac.getPos({
            name: name,
        })
        console.log('[LOG] isWidgetExist', name, v.x);
        return v.x != null;
    },

    // 是否是打断状态(有关键 UI 弹出), 不可操作
    isInterrupted: async function () {
        let uiName = [this.alert.name, 'layer_item_detail_info'];
        for (let i = 0; i < uiName.length; i++) {
            let flag = await this.isWidgetExist(uiName[i]);
            console.log('[LOG] isInterrupted', uiName[i], flag);
            if (flag) {
                return true;
            }
        }
        return false;
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

    /**
     * 可以在 UI 之上弹出的自定义对话框, 模拟 sysDialogOn）
     * @param {Object} config 配置项
     */
    showCustomDialog: async function (config) {
        console.log('[CustomDialog] 打开对话框');
        const finalConfig = { ...this.dialog, ...config };

        // 1. --- 布局常量配置 (根据你的参数调整) ---
        const DIALOG_X = config.pos ? config.pos.x : 160;
        const DIALOG_Y = config.pos ? config.pos.y : 36;
        const DIALOG_W = config.size ? config.size.width : 960;
        const DIALOG_H = config.size ? config.size.height : 80;

        // 内容区域（去除内边距）
        const PADDING_X = 20;
        const PADDING_Y = 15;
        const ICON_SIZE = 80; // 假设头像/图标大小

        // 计算文本显示的起始 X 坐标和最大宽度
        let textStartX = DIALOG_X + PADDING_X;
        let maxTextW = DIALOG_W - (PADDING_X * 2);

        // 如果有图标，文本要给图标腾地方
        if (config.hasRoleAvatar && config.roleAvatarResId) {
            // 头像位置 (config.roleAvatarPos 是相对坐标还是绝对？这里假设是相对对话框左上角)
            const iconX = DIALOG_X + (config.roleAvatarPos ? config.roleAvatarPos.x : 40);
            // 文本起始 X 往右移
            textStartX = iconX + ICON_SIZE + 20; // 20是图标和文字的间距
            maxTextW = (DIALOG_X + DIALOG_W) - textStartX - PADDING_X;
        }

        const FONT_SIZE = 24; // 假设字体大小
        const LINE_HEIGHT = 36; // 行高
        // 计算一页能放下几行
        const MAX_LINES = Math.floor((DIALOG_H - PADDING_Y * 2) / LINE_HEIGHT);


        // 2. --- 创建 UI 层级 ---

        // 创建一个高层级的 Layer (zIndex 设大一点，盖住背包)
        // 这一层也充当“点击拦截层”
        let layer = await ac.createLayer({
            name: 'layer_custom_dialog',
            zIndex: 2000,
            touchable: true // 开启点击交互
        });
        this._dialogState.layer = layer;

        // 背景图
        if (config.hasBg && config.bgResId) {
            await ac.createImage({
                resId: config.bgResId,
                parent: layer,
                pos: { x: DIALOG_X, y: DIALOG_Y },
                size: { width: DIALOG_W, height: DIALOG_H },
                anchor: { x: 0, y: 0 } // 确保坐标对齐习惯
            });
        }

        // 图标/头像
        if (config.hasRoleAvatar && config.roleAvatarResId) {
            await ac.createImage({
                resId: config.roleAvatarResId,
                parent: layer,
                pos: {
                    x: DIALOG_X + (config.roleAvatarPos?.x || 40),
                    y: DIALOG_Y + (config.roleAvatarPos?.y || 40)
                },
                anchor: { x: 0.5, y: 0.5 }, // 居中定位
                size: { width: ICON_SIZE, height: ICON_SIZE } // 限制一下图标大小
            });
        }

        // 文本对象 (初始为空)
        let textObj = await ac.createText({
            content: "",
            parent: layer,
            pos: { x: textStartX, y: DIALOG_Y + PADDING_Y },
            size: FONT_SIZE,
            color: '#ffffff', // 根据背景调整颜色
            anchor: { x: 0, y: 0 }
            // 注意：不要在这里设置 width 自动换行，我们要手动控制打字机
        });
        this._dialogState.textObj = textObj;


        // 3. --- 绑定点击事件 ---

        // 重置状态
        this._dialogState.isTyping = false;
        this._dialogState.skipTyping = false;
        this._dialogState.nextPage = false;

        // 监听整个 Layer 的点击
        layer.on('touch_end', () => {
            if (this._dialogState.isTyping) {
                // 如果正在打字 -> 标记“跳过”，瞬间显示
                this._dialogState.skipTyping = true;
            } else {
                // 如果没在打字（已显示完） -> 标记“下一页/关闭”
                this._dialogState.nextPage = true;
            }
        });


        // 4. --- 文本分页算法 (关键) ---

        // 去除 HTML 标签获取纯文本用于计算（如果你的 calcTextWidth 不支持标签）
        // 简单处理：itemConfig.desc 可能是纯文本，也可能有简单的 tag
        let rawText = config.content.replace(/<[^>]+>/g, '');

        let pages = this._paginateText(rawText, FONT_SIZE, maxTextW, MAX_LINES);


        // 5. --- 异步打字机循环 (Game Loop) ---

        for (let i = 0; i < pages.length; i++) {
            let pageContent = pages[i];
            let currentDisplay = "";

            this._dialogState.isTyping = true;
            this._dialogState.skipTyping = false;
            this._dialogState.nextPage = false; // 重置下一页信号

            // [阶段 A] 打字显示
            // 遍历这一页的每一个字符
            for (let char of pageContent) {
                // 检查是否被点击要求跳过
                if (this._dialogState.skipTyping) {
                    currentDisplay = pageContent; // 直接变成全页内容
                    textObj.text = currentDisplay; // 刷新 UI
                    break; // 跳出打字循环
                }

                currentDisplay += char;
                textObj.text = currentDisplay;

                // 打字速度：0.03秒一个字
                await ac.delay(0.03);
            }

            // 打字结束
            this._dialogState.isTyping = false;

            // [阶段 B] 等待点击翻页
            // 只要用户没点下一页，就卡在这里
            while (!this._dialogState.nextPage) {
                await ac.delay(0.1); // 每 0.1 秒检查一次点击状态
            }

            // 用户点击了下一页，循环继续，进入 i+1 页
            // 如果是最后一页，循环结束
        }

        // 6. --- 关闭清理 ---
        console.log('[CustomDialog] 关闭');
        layer.remove(); // 或者 layer.destroy()，视引擎版本而定
        this._dialogState.layer = null;
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
        // 同步执行
        ac.sysDialogOff({
            effect: 'fadeout',
            duration: 500,
        });
        ac.remove({
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
