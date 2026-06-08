// 通用 UI
console.log('[LOAD] common_ui');

const ZORDER = {
    BOTTOM_SCENE: 0,      // 底层, 需要显示系统UI的场景
    SYSTEM_UI: 5,      // 系统UI, 背包按钮等
    SCENE: 10,      // 画布
    UI: 20,     // 普通 UI
    CUSTOM_DIALOG: 50,     // 对话框
    POPUP: 100,     // 弹窗
    TOP: 500,       // 顶层
    PARTICLE: 1000,     // 粒子
}

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
            name: 'style_common_alert',
            font: '思源宋体',
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
        height: 120,
        margin: { bottom: 24 }, // 底部留边
        bg: {
            resId: ResMap.img_dialog_bg_no_head,
            width: 1208,
            height: 158,
        },
        bgWithAvatar: {
            resId: ResMap.img_dialog_bg_with_head,
            width: 1208,
            height: 158,
        },
        // 角色头像配置
        roleAvatar: {
            size: 64,
        },
        // 文本配置
        text: {
            padding:          { top: 32, bottom: 10, left: 100, right: 80 },
            paddingWithAvatar: { top: 32, bottom: 10, left: 120, right: 80 },
            typingSpeed: 0.03,  // 每个字符显示间隔（秒）
            fontSize:    24,    // 用于分页行高估算，需与 style_common_dialog 保持一致
        },
        // 文本样式（对话框正文）
        style: {
            name: 'style_common_dialog',
        },
    },
    // 选项组
    optionGroup: {
        name:         'layer_option_group',
        style:        'style_common_dialog',
        styleDisabled: 'style_common_dialog_disabled',
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
     * 弹窗
     * @param {Object} config 配置项
     * @param {string} config.onConfirm 确认回调函数
     */
    showAlert: async function (content, config) {
        async function onClickBtnConfirm() {
            ac.remove({
                name: CommonUI.alert.name,
                effect: 'normal',
                duration: 0,
                canskip: false,
            });

            // 如果传了回调函数，就执行它
            if (config.onConfirm) await config.onConfirm();
        }

        // 容器
        await ac.createLayer({
            name: this.alert.name,
            index: ZORDER.POPUP,
            inlayer: 'window',
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            size: { width: this.alert.width, height: this.alert.height },
            anchor: { x: 50, y: 50 },
            clipMode: false,
        });

        await ac.createImage({
            name: "layer_alert_mask",
            index: 0,
            inlayer: this.alert.name,
            resId: this.alert.mask.resId,
            pos: { x: this.alert.width / 2, y: this.alert.height / 2 },
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
            inlayer: this.alert.name,
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
            name: "txt_alert_content",
            index: 2,
            inlayer: this.alert.name,
            content: content,
            pos: {
                x: this.alert.width / 2,
                y: this.alert.height / 2 + 60
            },
            anchor: { x: 50, y: 50 },
            size: { width: this.alert.width - 80, height: this.alert.height - 100 },
            style: this.alert.style.name,
            valign: ac.VALIGN_TYPES.center,
            halign: ac.HALIGN_TYPES.middle,
        });

        await ac.createText({
            name: "btn_alert_confirm",
            index: 2,
            inlayer: this.alert.name,
            content: "确定",
            pos: {
                x: this.alert.width / 2,
                y: this.alert.height / 2 - 60
            },
            anchor: { x: 50, y: 50 },
            size: { width: 100, height: 60 },
            style: this.alert.style.name,
            halign: ac.HALIGN_TYPES.middle,
        });

        // 拦截点击
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchBegan,
            listener: this.onTouchMask,
            target: "layer_alert_mask",
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
     * @param {string}   config.content          要显示的文本内容
     * @param {string}   [config.roleAvatarResId] 角色头像资源ID，有值则显示头像
     * @param {boolean}  [config.hasBg]           是否显示背景，默认 true
     * @param {Function} [config.onComplete]      对话完成回调
     * @param {number}   [config.closeType]       关闭逻辑：默认=等待点击后关闭，1=自动关闭，2=不关闭，3=等待点击后保留
     */
    showCustomDialog: async function (config) {
        if (!config || !config.content) {
            console.error('[CustomDialog] 错误: 缺少必要的 content 参数');
            return;
        }

        // 资源/尺寸配置完全来自 this.dialog，content 参数只包含内容相关字段
        this._dialogContext = {
            content:       config.content,
            roleAvatarResId: config.roleAvatarResId || null,
            hasBg:         config.hasBg !== false,
            closeType:     config.closeType,
            onComplete:    config.onComplete || null,
            state: {
                currentPage:    0,
                pages:          [],
                waitingForClick: false,
            },
            layout: {},
        };

        const onTouchDialog = async () => {
            this._dialogContext.state.waitingForClick = false;
        };

        console.log('[CustomDialog] 显示对话框:', config.content);
        this._calculateTextLayout();
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
        const { layout, roleAvatarResId, hasBg } = this._dialogContext;
        const D = this.dialog;

        await ac.createLayer({
            name:    D.name,
            index:   ZORDER.CUSTOM_DIALOG,
            inlayer: 'window',
            pos:     { x: layout.dialogX, y: layout.dialogY },
            anchor:  { x: 50, y: 50 },
            size:    { width: D.width, height: D.height },
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

        if (hasBg) {
            const bgConfig = roleAvatarResId ? D.bgWithAvatar : D.bg;
            await ac.createImage({
                name:    'img_dialog_bg',
                index:   1,
                inlayer: D.name,
                resId:   bgConfig.resId,
                pos:     { x: D.width / 2, y: D.height / 2 },
                anchor:  { x: 50, y: 50 },
            });
        }

        if (roleAvatarResId) {
            await ac.createImage({
                name:    'img_dialog_avatar',
                index:   2,
                inlayer: D.name,
                resId:   roleAvatarResId,
                pos:     { x: layout.avatarX, y: layout.avatarY },
                anchor:  { x: 50, y: 50 },
            });
        }
    },

    _calculateTextLayout: function () {
        const D   = this.dialog;
        const ctx = this._dialogContext;
        const padding = ctx.roleAvatarResId ? D.text.paddingWithAvatar : D.text.padding;

        ctx.layout = {
            dialogX: (GameConfig.width - D.width) / 2 + D.width / 2,
            dialogY: (D.margin.bottom || 0) + D.height / 2,
            avatarX: D.roleAvatar.size / 2 + 20,
            avatarY: D.height / 2,
            textX:   padding.left,
            textY:   D.height - padding.top,
            textWidth:  D.width  - padding.left - padding.right,
            textHeight: D.height - padding.top  - padding.bottom,
        };
    },

    _prepareDialogContent: async function () {
        const D      = this.dialog;
        const layout = this._dialogContext.layout;
        const lineH  = D.text.fontSize * 1.5;
        const maxLines = Math.floor(layout.textHeight / lineH);

        this._dialogContext.state.pages = Utils.paginateText(
            this._dialogContext.content,
            D.text.fontSize,
            layout.textWidth,
            maxLines
        );
    },

    _updateDialogText: async function (content) {
        const layout = this._dialogContext.layout;
        await ac.createText({
            name:    'txt_dialog_content',
            index:   3,
            inlayer: this.dialog.name,
            content: content,
            pos:     { x: layout.textX, y: layout.textY },
            anchor:  { x: 0, y: 100 },
            size:    { width: layout.textWidth, height: layout.textHeight },
            style:   this.dialog.style.name,
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
            index: ZORDER.CUSTOM_DIALOG,
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
            option.style  = this.optionGroup.style;
            option.dStyle = this.optionGroup.styleDisabled;
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

    // 播放拖尾特效
    playTrailEffect: async function (startPos, endPos) {

        // startPos 和 endPos 需要偏移半个屏幕
        startPos.x -= GameConfig.centerX;
        startPos.y -= GameConfig.centerY;
        endPos.x -= GameConfig.centerX;
        endPos.y -= GameConfig.centerY;

        const moveSpeed = 0.8; // 移动速度, 像素/毫秒
        let duration = Math.sqrt((startPos.x - endPos.x) ** 2 + (startPos.y - endPos.y) ** 2) / moveSpeed; // 飞行时间
        const containerName = 'trail_container';
        await ac.createLayer({
            name: containerName,
            pos: startPos, // 车在起点
            size: { width: 0, height: 0 },
            inlayer: 'window',
            index: ZORDER.PARTICLE,
            clipMode: false,
        });

        const particleName = 'trail_effect_' + Date.now(); // 生成唯一名字防止冲突
        await ac.createParticle({
            name: particleName,
            type: ac.PARTICLE_TYPES.fire,
            index: 0,
            inlayer: containerName,
            totalParticle: 200,     // 总粒子数量
            life: { base: 200, deviation: 100 },    // 生命周期
            emissionRate: 60,       // 发射频率
            shootAngle: { base: 0, deviation: 360 }, // 发射角度
            moveSpeed: { base: 100, deviation: 50 }, // 移动速度
            resId: ResMap.spr_particle_trail,
            duration: duration * 0.9,   // 持续时间
            parpos: {           // 发射范围
                xBase: 0, xDeviation: 2,
                yBase: 0, yDeviation: 2
            },
        });

        await ac.moveTo({
            name: containerName,
            x: endPos.x,
            y: endPos.y,
            duration: duration,
        });
        await ac.remove({
            name: containerName,
            duration: 500, // 给个淡出时间，让尾巴自然消失
        });
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