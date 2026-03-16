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
        height: 120,
        margin: { bottom: 36 }, // 底部留边
        bg: {
            resId: ResMap.img_dialog_bg_no_head,
            width: 1241,
            height: 150,
        },
        bgWithAvatar: {
            resId: ResMap.img_dialog_bg_with_head,
            width: 1241,
            height: 150,
        },
        // 角色头像配置
        roleAvatar: {
            size: 80,
        },
        // 文本配置
        text: {
            padding: { top: 10, bottom: 10, left: 100, right: 80 },
            typingSpeed: 0.03, // 每个字符显示间隔（秒）
        },
        // 文本样式
        style: {
            name: 'style_dialog',
            font: '汉仪小隶书简',
            bold: false,
            italic: false,
            fontSize: 24,
            color: '#d1d3df',
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
     * @param {boolean} [config.hasBg] 是否显示背景
     * @param {Function} [config.onComplete] 对话完成回调
     * @param {boolean} [config.closeType] 关闭逻辑, 默认手动关闭, 1 自动关闭, 2 不关闭
     */
    showCustomDialog: async function (config) {
        // 配置验证
        if (!config || !config.content) {
            console.error('[CustomDialog] 错误: 缺少必要的 content 参数');
            return;
        }

        const finalConfig = { ...this.dialog, ...config };

        // 统一的对话框状态管理
        this._dialogContext = {
            config: finalConfig,
            state: {
                currentPage: 0,
                pages: [],
                waitingForClick: false,
            },
            layout: {
                textStartX: 0,
                textWidth: 0,
            },
        };

        // 事件处理函数
        const onTouchDialog = async () => {
            const state = this._dialogContext.state;
            console.log('[LOG] onTouchDialog, currentPage:', state.currentPage, 'waitingForClick:', state.waitingForClick);
            // 这句判断其实没必要，本来是 false 只是赋一次相同值
            // if (state.waitingForClick)
            state.waitingForClick = false;
        };

        console.log('[CustomDialog] 显示对话框:', finalConfig.content);

        // 计算文本布局（需要在创建UI前计算）
        this._calculateTextLayout();

        // 创建UI组件
        await this._createDialogUI();

        // 绑定事件
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchEnded,
            listener: onTouchDialog,
            target: 'layer_touch_area'
        });

        // 文本分页处理
        await this._prepareDialogContent();

        // 循环播放所有页面
        await this._playAllPages();
    },

    /**
     * 循环播放所有页面（新版本实现）
     */
    _playAllPages: async function () {
        const { state, config } = this._dialogContext;

        // 循环播放每一页
        for (let pageIndex = 0; pageIndex < state.pages.length; pageIndex++) {
            state.currentPage = pageIndex;
            console.log('[LOG] 播放第', pageIndex + 1, '页，共', state.pages.length, '页');

            // 播放当前页
            await this._playPageContent(state.pages[pageIndex]);

            // 如果不是最后一页，等待用户点击翻页
            if (pageIndex < state.pages.length - 1) {
                console.log('[LOG] 等待用户点击翻页...');
                await this._waitForUserClick();
            }
        }
        console.log('[LOG] 所有页面播放完成');

        // 执行完成回调
        if (config.onComplete) {
            await config.onComplete();
        }

        // 处理对话框关闭
        if (config.closeType == 1) {
            // 自动关闭：等待1秒后关闭
            await ac.delay({ time: 1000 });
            await this._closeCustomDialog();
        } else if (config.closeType == 2) {
            // 不关闭
        } else {
            // 默认手动关闭
            console.log('[LOG] 等待用户点击关闭...');
            await this._waitForUserClick();
            await this._closeCustomDialog();
        }
    },

    /**
     * 播放单页内容（打字机效果）
     */
    _playPageContent: async function (pageContent) {
        console.log('[LOG] 播放页面内容:', pageContent);
        const { state, config } = this._dialogContext;
        state.waitingForClick = true;

        // 打字机效果
        for (let charIndex = 0; charIndex < pageContent.length; charIndex++) {
            // 检查是否需要跳过打字效果
            if (!state.waitingForClick) {
                break;
            }

            await this._updateDialogText(pageContent.slice(0, charIndex + 1));
            await ac.delay({ time: config.text.typingSpeed * 1000 });
        }

        // 确保最终显示完整内容
        await this._updateDialogText(pageContent);
    },

    /**
     * 等待用户点击
     */
    _waitForUserClick: async function () {
        this._dialogContext.state.waitingForClick = true;

        while (this._dialogContext && this._dialogContext.state.waitingForClick) {
            await ac.delay({ time: 100 });
        }
    },

    /**
     * 创建对话框UI组件
     */
    _createDialogUI: async function () {
        const config = this._dialogContext.config;
        const layout = this._dialogContext.layout;

        // 创建容器层
        await ac.createLayer({
            name: config.name,
            index: config.index,
            inlayer: 'window',
            pos: { x: layout.dialogX, y: layout.dialogY },
            anchor: { x: 50, y: 50 },
            size: { width: config.width, height: config.height },
            clipMode: false,
        });
        
        // 创建全屏点击层(拦截点击)
        await ac.createLayer({
            name: 'layer_touch_area',
            index: config.index,
            inlayer: config.name,
            pos: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 0, y: 0 },
            clipMode: false,
        });

        // 创建对话框背景
        if (config.hasBg !== false) {
            const bgConfig = config.roleAvatarResId ? config.bgWithAvatar : config.bg;
            await ac.createImage({
                name: "img_dialog_bg",
                index: 1,
                inlayer: config.name,
                resId: bgConfig.resId,
                pos: { x: config.width / 2, y: config.height / 2 },
                anchor: { x: 50, y: 50 },
                scale: {
                    x: config.width * 100 / bgConfig.width,
                    y: config.height * 100 / bgConfig.height,
                },
                opacity: 100,
            });
        }

        // 创建角色头像
        if (config.roleAvatarResId) {
            await ac.createImage({
                name: "img_dialog_avatar",
                index: 2,
                inlayer: config.name,
                resId: config.roleAvatarResId,
                pos: {
                    x: layout.avatarX,
                    y: layout.avatarY
                },
                anchor: { x: 50, y: 50 },
                scale: { x: 100, y: 100 },
                opacity: 100,
            });
        }
    },

    /**
     * 计算文本显示区域布局
     */
    _calculateTextLayout: function () {
        const config = this._dialogContext.config;

        // 对话框位置：左右居中，底部贴边
        const dialogX = (GameConfig.width - config.width) / 2 + config.width / 2;
        const dialogY = (config.margin.bottom || 0) + config.height / 2;

        const textPadding = config.text.padding;

        // 头像位置（相对于对话框背景，易次元坐标系左下角为原点）
        const avatarX = config.roleAvatar.size / 2 + textPadding.left / 2; // 头像居中于左边距区域
        const avatarY = config.height / 2; // 垂直居中

        // 文本区域：根据 padding 计算实际位置和大小
        const textX = textPadding.left;
        const textY = textPadding.bottom;
        const textWidth = config.width - textPadding.left - textPadding.right;
        const textHeight = config.height - textPadding.top - textPadding.bottom;

        // 保存布局信息
        this._dialogContext.layout = {
            dialogX: dialogX,
            dialogY: dialogY,
            avatarX: avatarX,
            avatarY: avatarY,
            textX: textX,
            textY: textY,
            textWidth: textWidth,
            textHeight: textHeight,
        };
        console.log('[CustomDialog] 对话框布局:', this._dialogContext.layout);
    },

    /**
     * 准备对话框内容（分页处理）
     */
    _prepareDialogContent: async function () {
        const config = this._dialogContext.config;
        const layout = this._dialogContext.layout;

        const content = config.content || "";
        // 使用字体大小的1.5倍作为行高估算（易次元没有明确的lineHeight支持）
        const estimatedLineHeight = config.style.fontSize * 1.5;
        const maxLines = Math.floor(layout.textHeight / estimatedLineHeight);

        this._dialogContext.state.pages = Utils.paginateText(
            content,
            config.style.fontSize,
            layout.textWidth,
            maxLines
        );
    },

    /**
     * 创建或更新文本显示
     */
    _updateDialogText: async function (content) {
        const config = this._dialogContext.config;
        const layout = this._dialogContext.layout;

        await ac.createText({
            name: "txt_dialog_content",
            index: 3,
            inlayer: config.name,
            content: content,
            pos: { x: layout.textX, y: layout.textY },
            anchor: { x: 0, y: 0 },
            size: { width: layout.textWidth, height: layout.textHeight },
            style: config.style.name,
            valign: ac.VALIGN_TYPES.top,
            halign: ac.HALIGN_TYPES.left,
        });
    },

    /**
     * 关闭对话框
     */
    _closeCustomDialog: async function () {
        if (!this._dialogContext) return;

        console.log('[CustomDialog] 关闭对话框');

        const { config } = this._dialogContext;

        // 移除UI（会自动移除绑定的事件）
        ac.remove({
            name: config.name,
            effect: 'normal',
            duration: 0,
            canskip: false,
        });

        // 清理状态
        this._dialogContext = null;
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
        await ac.remove({
            name: "layer_item_detail_info",
            effect: 'fadeout',
            duration: 500,
            canskip: false,
        })
    },

    // 自动关闭的系统文本框
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
        });
        await ac.sysDialogOff();
    },

    // 脚本载入时的初始化函数
    onLoad: async function () {
        console.log('[LOG] [CommonUI] onLoad');
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

        ac.createStyle(this.dialog.style);

    },

}


CommonUI.onLoad();
