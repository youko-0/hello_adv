// 通用 UI
console.log('[LOAD] common_ui');

const ZORDER = {
    SCENE:   0,    // 场景底层（地图、探索等，HUD 可见）
    HUD:     5,    // 系统常驻 UI（背包按钮等）
    OVERLAY: 10,   // 全屏覆盖场景（论坛桌面、浏览器等）
    UI:      20,   // 普通面板（背包面板、占卜等）
    DIALOG:  50,   // 对话框
    EFFECT:  500,  // 特效与全屏转场（粒子、眨眼遮罩）
}

const CommonUI = {
    // 黑条
    toast: {
        name: 'layer_toast',
    },
    // 对话框
    dialog: {
        name: 'layer_dialog',
        bg: {
            resId: ResMap.img_dialog_bg,
        },
        // 头像配置
        avatar: {
            x: 1100,
            y: 0,
        },
        // 文本配置
        text: {
            x:           170,
            y:           36,
            width:       860,
            height:      80,
            typingSpeed: 0.03,  // 每个字符显示间隔（秒）
            fontSize:    24,    // 用于分页行高估算，需与 style_common_dialog 保持一致
        },
    },
    // 选项组
    optionGroup: {
        name:         'layer_option_group',
    },


    // 找不到易次元的直接判断的接口，用 getPos 迂回一下
    isWidgetExist: async function (name) {
        let v = await ac.getPos({
            name: name,
        })
        console.log('[LOG] isWidgetExist', name, v.x);
        return v.x != null;
    },

    /**
     * 等待指定UI控件关闭（消失）
     * @param {string} widgetName 要等待关闭的控件名称
     * @param {number} checkInterval 检查间隔时间（毫秒），默认500ms
     */
    waitForUIClosed: async function (widgetName, checkInterval = 500) {
        console.log(`[CommonUI] 开始等待 UI 关闭: ${widgetName}`);

        // 先检查一次是否存在，如果不存在就直接返回
        if (!(await this.isWidgetExist(widgetName))) {
            console.log(`[CommonUI] UI 不存在，无需等待: ${widgetName}`);
            return;
        }

        // 循环检查直到UI关闭
        while (await this.isWidgetExist(widgetName)) {
            await ac.delay({ time: checkInterval });
        }

        console.log(`[CommonUI] UI 已关闭: ${widgetName}`);
    },

    // 通用点击拦截函数
    onTouchMask: async function (params) {
        console.log('[LOG] onTouchMask', this, params);
    },

    /**
     * 可以在 UI 之上弹出的自定义对话框, 模拟 sysDialogOn
     * @param {Object} config 配置项
     * @param {string}   config.content          要显示的文本内容
     * @param {string}   [config.roleAvatarResId] 角色头像资源ID，有值则显示头像
     * @param {Function} [config.onComplete]      对话完成回调
     * @param {number}   [config.closeType]       关闭逻辑：默认=等待点击后关闭，1=自动关闭，2=不关闭，3=等待点击后保留
     */
    showCustomDialog: async function (config) {
        if (!config || !config.content) {
            console.error('[CustomDialog] 错误: 缺少必要的 content 参数');
            return;
        }

        this._dialogContext = {
            content:         config.content,
            roleAvatarResId: config.roleAvatarResId || null,
            closeType:       config.closeType,
            onComplete:      config.onComplete || null,
            state: {
                currentPage:     0,
                pages:           [],
                waitingForClick: false,
            },
        };

        const onTouchDialog = async () => {
            this._dialogContext.state.waitingForClick = false;
        };

        console.log('[CustomDialog] 显示对话框:', config.content);
        await this._createDialogUI();
        ac.addEventListener({
            type:     ac.EVENT_TYPES.onTouchEnded,
            listener: onTouchDialog,
            target:   'layer_dialog_mask',
        });
        await this._prepareDialogContent();
        await this._playAllPages();
    },

    _playAllPages: async function () {
        const { state, closeType, onComplete } = this._dialogContext;

        for (let pageIndex = 0; pageIndex < state.pages.length; pageIndex++) {
            state.currentPage = pageIndex;
            await this._playPageContent(state.pages[pageIndex]);
            if (pageIndex < state.pages.length - 1) {
                await this._waitForUserClick();
            }
        }
        console.log('[LOG] 所有页面播放完成');

        if (onComplete) await onComplete();

        if (closeType == 1) {
            await ac.delay({ time: 1000 });
            await this.closeCustomDialog();
        } else if (closeType == 2) {
            // 不关闭
        } else if (closeType == 3) {
            await this._waitForUserClick();
        } else {
            await this._waitForUserClick();
            await this.closeCustomDialog();
        }
    },

    _playPageContent: async function (pageContent) {
        const state = this._dialogContext.state;
        state.waitingForClick = true;
        for (let i = 0; i < pageContent.length; i++) {
            if (!state.waitingForClick) break;
            await this._updateDialogText(pageContent.slice(0, i + 1));
            await ac.delay({ time: this.dialog.text.typingSpeed * 1000 });
        }
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

    _createDialogUI: async function () {
        const { roleAvatarResId } = this._dialogContext;
        const D = this.dialog;

        await ac.createLayer({
            name:    D.name,
            index:   ZORDER.DIALOG,
            inlayer: 'window',
            pos:     { x: GameConfig.centerX, y: 0 },
            anchor:  { x: 50, y: 0 },
            size:    { width: GameConfig.width, height: GameConfig.height },
            clipMode: false,
        });

        await ac.createLayer({
            name:    'layer_dialog_mask',
            index:   0,
            inlayer: D.name,
            pos:     { x: 0, y: 0 },
            size:    { width: GameConfig.width, height: GameConfig.height },
            anchor:  { x: 0, y: 0 },
            clipMode: false,
        });

        await ac.createImage({
            name:    'img_dialog_bg',
            index:   1,
            inlayer: D.name,
            resId:   D.bg.resId,
            pos:     { x: GameConfig.centerX, y: 0 },
            anchor:  { x: 50, y: 0 },
        });

        if (roleAvatarResId) {
            await ac.createImage({
                name:    'img_dialog_avatar',
                index:   2,
                inlayer: D.name,
                resId:   roleAvatarResId,
                pos:     { x: D.avatar.x, y: D.avatar.y },
                anchor:  { x: 50, y: 0 },
            });
        }
    },

    _prepareDialogContent: async function () {
        const D = this.dialog;
        const lineH    = D.text.fontSize * 1.5;
        const maxLines = Math.floor(D.text.height / lineH);

        this._dialogContext.state.pages = Utils.paginateText(
            this._dialogContext.content,
            D.text.fontSize,
            D.text.width,
            maxLines
        );
    },

    _updateDialogText: async function (content) {
        const D = this.dialog;
        await ac.createText({
            name:    'txt_dialog_content',
            index:   3,
            inlayer: D.name,
            content: content,
            pos:     { x: D.text.x, y: D.text.y },
            anchor:  { x: 0, y: 0 },
            size:    { width: D.text.width, height: D.text.height },
            style:   'style_common_dialog',
            halign:  ac.HALIGN_TYPES.left,
            valign:  ac.VALIGN_TYPES.top,
        });
    },

    /**
     * 关闭对话框
     */
    closeCustomDialog: async function () {
        console.log('[CustomDialog] 关闭对话框');

        // 移除UI（会自动移除绑定的事件）
        ac.remove({
            name: this.dialog.name,
            effect: 'normal',
            duration: 0,
            canskip: false,
        });

        // 清理状态
        this._dialogContext = null;
    },

    /**
     * 在系统的选项基础上实现的自定义选项, 支持 enabled 属性
     * @param {Object} config 配置项, 包含常规 ac.createOption 的配置项
     * @param {boolean} config.enabled 是否可用, 默认 true
     * @param {string} config.dResId 禁用资源ID
     * @param {string} config.dStyle 禁用文本样式
     */
    createOption: async function (config) {
        // ?? 空值合并运算符
        const enabled = config.enabled ?? true;
        console.log('enabledenabled', enabled);
        if (!enabled) {
            config.onTouchBegan = null
            config.onTouchEnded = null
            config.nResId = config.dResId
            config.sResId = config.dResId
            config.style = config.dStyle
        }
        console.log('[CustomOption] 创建自定义选项:', config);
        await ac.createOption(config);
    },

    /**
     * 自定义选项组, 会返回选项索引
     * @param {Object} config 配置项
     * @param {list} config.options [option, option]
     * @param {Object} option {content, callback, enabled=true}
     * @return {number} 选项索引, 从 0 开始
     */
    showCustomOptionGroup: async function (config) {
        console.log('[CustomOptionGroup] 显示自定义选项组:', config);
        let flag = -1;
        // 全屏层级
        await ac.createLayer({
            name: this.optionGroup.name,
            index: ZORDER.DIALOG,
            inlayer: 'window',
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            size: { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 50, y: 50 },
            clipMode: false,
        })

        for (let i = 0; i < config.options.length; i++) {
            let option = config.options[i];
            option.name = 'option_' + i;
            option.inlayer = this.optionGroup.name;
            option.pos = { x: GameConfig.centerX, y: 420 - i * 120 };
            option.anchor = { x: 50, y: 50 };
            option.style  = 'style_common_option';
            option.dStyle = 'style_common_option_disabled';
            option.nResId = ResMap.img_selection_bg_normal;
            option.sResId = ResMap.img_selection_bg_highlight;
            option.dResId = ResMap.img_selection_bg_disabled;
            // 点击事件添加关闭逻辑
            option.onTouchEnded = async () => {
                flag = i;
                await CommonUI.closeCustomOptionGroup();
                if (option.callback) {
                    await option.callback();
                }
            }
            await this.createOption(option);
        }

        await CommonUI.waitForUIClosed(this.optionGroup.name);
        return flag;
    },

    // 关闭自定义选项组
    closeCustomOptionGroup: async function () {
        console.log('[CustomOptionGroup] 关闭自定义选项组');
        await ac.remove({
            name: CommonUI.optionGroup.name,
            effect: 'normal',
            duration: 0,
        })
    },

    // 脚本载入时的初始化函数
    onLoad: async function () {
        console.log('[LOG] [CommonUI] onLoad');

        await ac.delay({ time: 10 });
        await this.onLoadDelay();

    },

    onLoadDelay: async function () {
        console.log('[LOG] [CommonUI] onLoadDelay');
        // 创建全局背包按钮, 靠层级控制显示
        InventoryUI.createBtnBag();
    }

}


CommonUI.onLoad();