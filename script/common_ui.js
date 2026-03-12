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
        index: 100,     // 置顶
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
        index: 200,     // 高层级，盖住其他UI
        width: 960,
        height: 80,
        centerX: 960 / 2,
        centerY: 80 / 2,
        pos: { x: 160, y: 36 },
        mask: {
            resId: ResMap.img_mask_black,
            width: 32,
            height: 32,
        },
        bg: {
            resId: ResMap.img_dialog_bg,
            width: 1241,
            height: 150,
        },
        style: {
            name: 'style_dialog',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: 24,
            color: '#d1d3df',
            speed: 9,
        },
        // 角色头像配置
        roleAvatar: {
            size: 80,
            pos: { x: 40, y: 40 },
        },
        // 文本配置
        text: {
            padding: { x: 20, y: 15 },
            lineHeight: 36,
            typingSpeed: 0.03, // 每个字符显示间隔（秒）
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
        let uiName = [this.alert.name, this.dialog.name, 'layer_item_detail_info'];
        for (let i = 0; i < uiName.length; i++) {
            let flag = await this.isWidgetExist(uiName[i]);
            console.log('[LOG] isInterrupted', uiName[i], flag);
            if (flag) {
                return true;
            }
        }
        return false;
    },

    showAlert: async function (content, config) {
        async function onClickBtnConfirm() {
            ac.remove({
                name: finalConfig.name,
                effect: 'normal',
                duration: 0,
                canskip: false,
            });

            // 如果传了回调函数，就执行它
            if (finalConfig.onConfirm) await finalConfig.onConfirm();
        }

        async function onTouchmask() {
            console.log('[LOG] onTouchmask');
        }

        const finalConfig = { ...this.alert, ...config };

        // 容器
        await ac.createLayer({
            name: finalConfig.name,
            index: finalConfig.index,
            inlayer: 'window',
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            size: { width: finalConfig.width, height: finalConfig.height },
            anchor: { x: 50, y: 50 },
            clipMode: false,
        });

        await ac.createImage({
            name: "img_alert_mask",
            index: 0,
            inlayer: finalConfig.name,
            resId: finalConfig.mask.resId,
            pos: { x: finalConfig.centerX, y: finalConfig.centerY },
            anchor: { x: 50, y: 50 },
            scale: {
                x: GameConfig.width * 100 / finalConfig.mask.width,
                y: GameConfig.height * 100 / finalConfig.mask.height,
            },
            opacity: 60,
        });

        await ac.createImage({
            name: "img_alert_bg",
            index: 1,
            inlayer: finalConfig.name,
            resId: finalConfig.bg.resId,
            pos: {
                x: finalConfig.width / 2,
                y: finalConfig.height / 2
            },
            anchor: { x: 50, y: 50 },
            scale: {
                x: finalConfig.width * 100 / finalConfig.bg.width,
                y: finalConfig.height * 100 / finalConfig.bg.height,
            },
            opacity: 100,
        });

        await ac.createText({
            name: "txt_alert_content",
            index: 2,
            inlayer: finalConfig.name,
            content: content,
            pos: {
                x: finalConfig.width / 2,
                y: finalConfig.height / 2 + 60
            },
            anchor: { x: 50, y: 50 },
            size: { width: finalConfig.width - 80, height: finalConfig.height - 100 },
            style: finalConfig.style.name,
            valign: ac.VALIGN_TYPES.center,
            halign: ac.HALIGN_TYPES.middle,
        });

        await ac.createText({
            name: "btn_alert_confirm",
            index: 2,
            inlayer: finalConfig.name,
            content: "确定",
            pos: {
                x: finalConfig.width / 2,
                y: finalConfig.height / 2 - 60
            },
            anchor: { x: 50, y: 50 },
            size: { width: 100, height: 60 },
            style: finalConfig.style.name,
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
            target: "btn_alert_confirm",
        });
    },

    /**
     * 可以在 UI 之上弹出的自定义对话框, 模拟 sysDialogOn
     * @param {Object} config 配置项
     * @param {string} config.content 要显示的文本内容
     * @param {string} [config.roleAvatarResId] 角色头像资源ID，有值则显示头像
     * @param {Object} [config.roleAvatarPos] 角色头像位置
     * @param {boolean} [config.hasBg] 是否显示背景
     * @param {string} [config.bgResId] 背景资源ID
     * @param {boolean} [config.autoClose] 是否自动关闭（显示完毕后）
     * @param {Function} [config.onComplete] 对话框完成回调
     * @param {Function} [config.onClose] 对话框关闭回调
     */
    showCustomDialog: async function (config) {
        const self = this;

        // 对话框状态管理
        this._dialogState = {
            isTyping: false,
            skipTyping: false,
            nextPage: false,
            currentPage: 0,
            pages: [],
            isCompleted: false,
        };

        async function onTouchDialog() {
            console.log('[LOG] onTouchDialog, isTyping:', self._dialogState.isTyping);
            if (self._dialogState.isTyping) {
                // 正在打字时点击，跳过打字效果
                self._dialogState.skipTyping = true;
            } else if (self._dialogState.isCompleted) {
                // 已经完成，关闭对话框
                await closeDialog();
            } else {
                // 显示下一页
                self._dialogState.nextPage = true;
            }
        }

        async function closeDialog() {
            console.log('[CustomDialog] 关闭对话框');
            // 移除UI
            ac.remove({
                name: finalConfig.name,
                effect: 'normal',
                duration: 0,
                canskip: false,
            });

            // 执行关闭回调
            if (finalConfig.onClose) await finalConfig.onClose();

            // 清理状态
            self._dialogState = null;
        }

        const finalConfig = { ...this.dialog, ...config };

        console.log('[CustomDialog] 显示对话框:', finalConfig.content);

        // 创建容器层
        await ac.createLayer({
            name: finalConfig.name,
            index: finalConfig.index,
            inlayer: 'window',
            pos: finalConfig.pos,
            size: { width: finalConfig.width, height: finalConfig.height },
            anchor: { x: 0, y: 0 },
            clipMode: false,
        });

        // 创建遮罩层（用于拦截点击）
        await ac.createImage({
            name: "dialog_touch_area",
            index: 0,
            inlayer: finalConfig.name,
            resId: finalConfig.mask.resId,
            pos: { x: finalConfig.width / 2, y: finalConfig.height / 2 },
            anchor: { x: 50, y: 50 },
            scale: {
                x: finalConfig.width * 100 / finalConfig.mask.width,
                y: finalConfig.height * 100 / finalConfig.mask.height,
            },
            opacity: 0, // 透明，只用于接收点击
        });

        // 创建背景
        if (finalConfig.hasBg !== false) {
            await ac.createImage({
                name: "img_dialog_bg",
                index: 1,
                inlayer: finalConfig.name,
                resId: finalConfig.bg.resId,
                pos: { x: finalConfig.width / 2, y: finalConfig.height / 2 },
                anchor: { x: 50, y: 50 },
                scale: {
                    x: finalConfig.width * 100 / finalConfig.bg.width,
                    y: finalConfig.height * 100 / finalConfig.bg.height,
                },
                opacity: 100,
            });
        }

        // 创建角色头像
        if (finalConfig.roleAvatarResId) {
            await ac.createImage({
                name: "img_dialog_avatar",
                index: 2,
                inlayer: finalConfig.name,
                resId: finalConfig.roleAvatarResId,
                pos: {
                    x: finalConfig.roleAvatar.pos.x,
                    y: finalConfig.roleAvatar.pos.y
                },
                anchor: { x: 50, y: 50 },
                scale: { x: 100, y: 100 },
                opacity: 100,
            });
        }

        // 计算文本显示区域
        let textStartX = finalConfig.text.padding.x;
        let textWidth = finalConfig.width - finalConfig.text.padding.x * 2;

        // 如果有头像，需要调整文本区域
        if (finalConfig.roleAvatarResId) {
            textStartX = finalConfig.roleAvatar.pos.x + finalConfig.roleAvatar.size + 20;
            textWidth = finalConfig.width - textStartX - finalConfig.text.padding.x;
        }

        // 绑定点击事件
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: onTouchDialog,
            target: "dialog_touch_area",
        });

        // 文本分页处理
        const content = finalConfig.content || "";
        const maxLines = Math.floor((finalConfig.height - finalConfig.text.padding.y * 2) / finalConfig.text.lineHeight);

        this._dialogState.pages = Utils.paginateText(
            content,
            finalConfig.style.fontSize,
            textWidth,
            maxLines
        );

        // 逐页显示文本
        for (let pageIndex = 0; pageIndex < this._dialogState.pages.length; pageIndex++) {
            this._dialogState.currentPage = pageIndex;
            const pageContent = this._dialogState.pages[pageIndex];

            this._dialogState.isTyping = true;
            this._dialogState.skipTyping = false;
            this._dialogState.nextPage = false;

            // 打字机效果
            let displayContent = "";
            for (let charIndex = 0; charIndex < pageContent.length; charIndex++) {
                // 检查是否需要跳过打字效果
                if (this._dialogState.skipTyping) {
                    displayContent = pageContent;
                    break;
                }

                displayContent += pageContent[charIndex];

                // 通过重新创建同名组件来刷新文本显示
                await ac.createText({
                    name: "txt_dialog_content",
                    index: 3,
                    inlayer: finalConfig.name,
                    content: displayContent,
                    pos: {
                        x: textStartX,
                        y: finalConfig.text.padding.y
                    },
                    anchor: { x: 0, y: 0 },
                    size: { width: textWidth, height: finalConfig.height - finalConfig.text.padding.y * 2 },
                    style: finalConfig.style.name,
                    valign: ac.VALIGN_TYPES.top,
                    halign: ac.HALIGN_TYPES.left,
                });

                // 等待打字间隔
                await ac.delay({ time: finalConfig.text.typingSpeed * 1000 });
            }

            // 确保最终显示完整内容
            await ac.createText({
                name: "txt_dialog_content",
                index: 3,
                inlayer: finalConfig.name,
                content: pageContent,
                pos: {
                    x: textStartX,
                    y: finalConfig.text.padding.y
                },
                anchor: { x: 0, y: 0 },
                size: { width: textWidth, height: finalConfig.height - finalConfig.text.padding.y * 2 },
                style: finalConfig.style.name,
                valign: ac.VALIGN_TYPES.top,
                halign: ac.HALIGN_TYPES.left,
            });

            this._dialogState.isTyping = false;

            // 如果是最后一页
            if (pageIndex === this._dialogState.pages.length - 1) {
                this._dialogState.isCompleted = true;

                // 执行完成回调
                if (finalConfig.onComplete) await finalConfig.onComplete();

                // 如果设置了自动关闭
                if (finalConfig.autoClose) {
                    await ac.delay({ time: 1000 }); // 等待1秒后自动关闭
                    await closeDialog();
                    return;
                }
            }

            // 等待用户点击进入下一页
            while (!this._dialogState.nextPage && !this._dialogState.isCompleted) {
                await ac.delay({ time: 100 });
            }
        }

        // 如果没有设置自动关闭，等待用户点击关闭
        if (!finalConfig.autoClose) {
            while (!this._dialogState.isCompleted) {
                await ac.delay({ time: 100 });
            }
        }
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
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
            opacity: 80,
        });
        // 大图
        await ac.createImage({
            name: "img_item_info_pic",
            index: 0,
            inlayer: "layer_item_detail_info",
            resId: itemConfig.illust,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY + 100 },
            anchor: { x: 50, y: 50 },
        });
        let config = {
            content: itemConfig.desc
        }
        await this.showCustomDialog(config);
        // // 文字描述
        // await ac.sysDialogOn({
        //     content: `<tag style=style_item_info>${itemConfig.desc}</tag>`,
        //     tag: 'p',
        //     size: { width: 960, height: 80 },
        //     pos: { x: 160, y: 36 },
        //     hasRoleName: false,
        //     // 头像的位置用来显示道具图标
        //     hasRoleAvatar: Boolean(itemConfig.icon),
        //     roleAvatarResId: itemConfig.icon,
        //     roleAvatarPos: { x: 40, y: 40 },
        //     hasBg: true,
        //     bgResId: ResMap.img_dialog_bg_01,
        // });
        // console.log('[LOG] sysDialogOff');
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

        ac.createStyle({
            name: 'style_dialog',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: 24,
            color: '#d1d3df',
            speed: 9,
        });

    },

}


CommonUI.createTextStyles();
