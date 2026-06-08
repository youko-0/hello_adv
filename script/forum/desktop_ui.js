// 电脑桌面 UI 与页面路由
console.log('[LOAD] desktop_ui');

const DesktopUI = {

    layer: {
        desktop: 'layer_desktop',
    },

    // ── 桌面场景入口 ──────────────────────────────────────────────

    /**
     * 创建桌面场景（背景 + 浏览器图标 + 系统时间）
     * 替代原来的 ac.callUI({ uiId: ResMap.ui_desktop })
     */
    createDesktop: async function () {
        await ac.createLayer({
            name: this.layer.desktop,
            index: ZORDER.SCENE,
            inlayer: 'window',
            pos: { x: 0, y: 0 },
            anchor: { x: 0, y: 0 },
            size: { width: GameConfig.width, height: GameConfig.height },
            clipMode: true,
        });

        await ac.createImage({
            name: 'img_desktop',
            index: 0,
            inlayer: this.layer.desktop,
            resId: ResMap.pic_desktop_bg,
            pos: { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor: { x: 50, y: 50 },
        });

        await ac.createOption({
            name: 'btn_browser',
            index: 1,
            inlayer: this.layer.desktop,
            nResId: ResMap.btn_browser,
            sResId: ResMap.btn_browser,
            content: '',
            pos: { x: 96, y: 640 },
            anchor: { x: 50, y: 50 },
            onTouchEnded: ForumSystem.viewForum,
        });

        await BrowserUI.createSystemTimeLoop();
    },

    // ── 页面切换（替代 ac.replaceUI）────────────────────────────

    /** 清除当前浏览器页内容（browser 框架保留，只移除内容层） */
    _clearPage: async function () {
        try { await ac.remove({ name: 'layer_forum_ui' }); } catch (e) {}
        try { await ac.remove({ name: 'lbl_system_time' }); } catch (e) {}
    },

    /**
     * 显示论坛主页
     * 清除旧页内容 → 创建浏览器框架 → 渲染帖子列表
     */
    showForumPage: async function () {
        await this._clearPage();

        async function onClose() {
            let flag = ForumSystem.isAllPostRead();
            console.log(`是否全部已读：${flag}`);
            if (!flag) {
                await CommonUI.showAlert('请先阅读所有帖子！');
            } else {
                await ForumSystem.onAllPostRead();
            }
        }

        await BrowserUI.createBrowserUI(onClose);
        await ForumUI.createForumPage();
        await BrowserUI.createSystemTimeLoop();
    },

    /**
     * 显示帖子详情页
     * 清除旧页内容 → 创建浏览器框架 → 渲染回复列表
     */
    showPostPage: async function () {
        await this._clearPage();
        await BrowserUI.createBrowserUI(ForumSystem.viewForum);
        await ForumUI.createPostPage();
        await BrowserUI.createSystemTimeLoop();
    },
};
