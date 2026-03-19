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
        height: 120,
        margin: { bottom: 24 }, // 底部留边
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
            size: 64,
        },
        // 文本配置
        text: {
            padding: { top: 20, bottom: 10, left: 100, right: 80 },
            paddingWithAvatar: { top: 20, bottom: 10, left: 120, right: 80 },
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
            if (finalConfig.onConfirm) await finalConfig.onConfirm();
        }

        const finalConfig = { ...this.alert, ...config };

        // 容器
        await ac.createLayer({
            name: this.alert.name,
            index: ZORDER.POPUP,
            inlayer: 'window',
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            size: { width: finalConfig.width, height: finalConfig.height },
            anchor: { x: 50, y: 50 },
            clipMode: false,
        });

        await ac.createImage({
            name: "layer_alert_mask",
            index: 0,
            inlayer: this.alert.name,
            resId: finalConfig.mask.resId,
            pos: { x: finalConfig.width / 2, y: finalConfig.height / 2 },
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
            inlayer: this.alert.name,
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
            inlayer: this.alert.name,
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
            inlayer: this.alert.name,
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
            target: 'layer_dialog_mask'
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
            name: this.dialog.name,
            index: ZORDER.CUSTOM_DIALOG,
            inlayer: 'window',
            pos: { x: layout.dialogX, y: layout.dialogY },
            anchor: { x: 50, y: 50 },
            size: { width: config.width, height: config.height },
            clipMode: false,
        });

        // 创建全屏点击层同时拦截点击
        await ac.createLayer({
            name: 'layer_dialog_mask',
            index: 0,
            inlayer: this.dialog.name,
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
                inlayer: this.dialog.name,
                resId: bgConfig.resId,
                pos: { x: config.width / 2, y: config.height / 2 },
                anchor: { x: 50, y: 50 },
                scale: {
                    x: config.width * 100 / bgConfig.width,
                    y: config.height * 100 / bgConfig.height,
                },
            });
        }

        // 创建角色头像
        if (config.roleAvatarResId) {
            await ac.createImage({
                name: "img_dialog_avatar",
                index: 2,
                inlayer: this.dialog.name,
                resId: config.roleAvatarResId,
                pos: { x: layout.avatarX, y: layout.avatarY },
                anchor: { x: 50, y: 50 },
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

        const textPadding = config.roleAvatarResId ? config.text.paddingWithAvatar : config.text.padding;

        // 头像位置（相对于对话框背景，易次元坐标系左下角为原点）
        const avatarX = config.roleAvatar.size / 2 + 20; // 头像居中于左边距区域
        const avatarY = config.height / 2; // 垂直居中

        // 文本区域：根据 padding 计算实际位置和大小
        const textX = textPadding.left;
        const textY = config.height - textPadding.top;
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
            inlayer: this.dialog.name,
            content: content,
            pos: { x: layout.textX, y: layout.textY },
            anchor: { x: 0, y: 100 },
            size: { width: layout.textWidth, height: layout.textHeight },
            style: config.style.name,
            halign: ac.HALIGN_TYPES.left,
            valign: ac.VALIGN_TYPES.top,
        });
    },

    /**
     * 关闭对话框
     */
    _closeCustomDialog: async function () {
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

    // 添加全屏拦截点击的系统对话框
    showSysDialog: async function (content) {
        console.log('[LOG] showSysDialog', content);
        async function onTouchMask(params) {
            console.log('[LOG] onTouchMask', this, params);
            await ac.sysDialogOff();
            await ac.remove({
                name: 'layer_sys_dialog_mask',
                effect: 'normal',
                duration: 0,
            });
        }
        await ac.createLayer({
            name: 'layer_sys_dialog_mask',
            index: 0,
            inlayer: 'window',
            pos: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            anchor: { x: 0, y: 0 },
            clipMode: false,
        });
        // 拦截点击
        ac.addEventListener({
            type: ac.EVENT_TYPES.onTouchBegan,
            listener: onTouchMask,
            target: 'layer_sys_dialog_mask',
        });
        // 文字描述
        await ac.sysDialogOn({
            content: content,
            hasRoleName: false,
            hasRoleAvatar: false,
            hasBg: true,
            tag: 'p',
        });
    },

    // 播放拖尾特效
    playTrailEffect: async function (startPos, endPos) {
        
        // startPos 和 endPos 需要偏移半个屏幕
        startPos.x -= GameConfig.centerX;
        startPos.y -= GameConfig.centerY;
        endPos.x -= GameConfig.centerX;
        endPos.y -= GameConfig.centerY;

        const moveSpeed = 0.5; // 移动速度, 像素/毫秒
        let duration = Math.sqrt((startPos.x - endPos.x) ** 2 + (startPos.y - endPos.y) ** 2 ) / moveSpeed; // 飞行时间
        const containerName = 'trail_container';
        await ac.createLayer({
            name: containerName,
            pos: startPos, // 车在起点
            size: { width: 0, height: 0 },
            inlayer: 'window',
            index: 9999,
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

        // 2. 让粒子发射器【移动】到终点
        // 易次元通常用 tween 来移动对象
        // duration 决定了飞行的快慢
        const flightTime = 1.0; // 飞行耗时 1秒

        await ac.moveTo({
            name: containerName,
            x: endPos.x,
            y: endPos.y,
            duration: duration,
        });

        // 4. 到达终点后的处理
        // 此时发射器到了终点，我们停止发射，但让已经发射出来的粒子自然消失
        // 通常引擎有一个 stopSystem() 或者直接移除

        // 如果想要粒子瞬间消失：
        // await ac.removeParticle(particleName); 

        // 【更自然的做法】：先停止发射，等存活的粒子死掉后再移除节点
        // 易次元可能没有直接暴露 stopSystem，我们可以通过设 duration 为 0 或直接 remove 来模拟
        // await ac.remove({
        //     name: containerName,
        //     duration: 500, // 给个淡出时间，让尾巴自然消失
        // });
    },

    // 脚本载入时的初始化函数
    onLoad: async function () {
        console.log('[LOG] [CommonUI] onLoad');
        ac.createStyle(this.alert.style);

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

        await ac.delay({ time: 100 });
        await this.onLoadDelay();

    },

    onLoadDelay: async function () {
        console.log('[LOG] [CommonUI] onLoadDelay');
        // 创建全局背包按钮, 靠层级控制显示
        InventoryUI.createBtnBag();
    }

}


CommonUI.onLoad();
