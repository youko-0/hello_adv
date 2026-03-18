// 论坛系统配置
console.log('[LOAD] forum_system');

// 默认数据结构
const _forumDefault = function () {
    return {
        postId: "",      // 当前阅读的帖子ID
        page: 1,    // 当前页码, 从1开始
        read: {},       // 已读历史，{id: true}
    };
};

const ForumSystem = createSystem(
    'str_forum_data', // 变量名
    _forumDefault,    // 默认数据生成器
    {
        HOST: "donghaiguaitan.topic.com/",      // 域名
        NAME: "东海论坛",
        PAGE_SIZE: 10,                          // 分页大小
        NOW_YEAR: 2034,                         // 当前年份

        // 获取当前阅读的帖子ID
        getPostId: function () {
            return this.getData().postId;
        },

        savePostId: function (postId) {
            if (!postId) return;
            let data = this.getData();
            // 只有变化时才保存，节省性能
            if (data.postId !== postId) {
                console.log(`[Forum] 切换帖子: ${data.postId} -> ${postId}`);
                data.postId = postId;
                this.save();
            }
        },

        // 获取当前页码
        getPageIndex: function () {
            return this.getData().page;
        },

        savePageIndex: function (pageIndex) {
            let data = this.getData();
            if (data.page !== pageIndex) {
                console.log(`[Forum] 翻页: ${data.page} -> ${pageIndex}`);
                data.page = pageIndex;
                this.save();
            }
        },

        // 是否已经阅读过某个帖子
        isRead: function (postId) {
            let read = this.getData().read;
            // !! 强制转换为布尔值，防止 undefined
            return !!read[postId];
        },

        saveRead: function (postId) {
            console.log(`[Forum] 标记帖子 ${postId} 为已读`);
            if (!postId) return;
            let data = this.getData();

            // 只有未读时才写入，避免重复 save
            if (!data.read[postId]) {
                data.read[postId] = true;
                this.save();
                console.log(`[Forum] 已标记帖子 ${postId} 为已读`);
            }
        },

        // 是否看完了所有的帖子
        isAllPostVisited: function () {
            for (let post of Object.values(ForumData.postData)) {
                if (!this.isRead(post.id)) {
                    return false;
                }
            }
            return true;
        },

        // 导航栏标题
        getTitle: function () {
            let postId = this.getPostId();
            let post = this.getPostData(postId);
            if (!post) return this.NAME;
            return post.topic;
        },

        // 导航栏地址
        getUrl: function () {
            let postId = this.getPostId();
            let suffix = this.getPageIndex() > 1 ? `?page=${this.getPageIndex()}` : "";
            return this.HOST + postId + suffix;
        },

        getPostData: function (postId) {
            let post = ForumData.postData[postId];
            if (!post) {
                console.trace(`帖子 ${postId} 不存在！`);
                return null;
            }
            return post;
        },

        getTopicListAtPage: function (pageIndex) {
            let postsList = Object.values(ForumData.postData);
            // 根据最后回帖的时间戳排序, 最新的在前面
            postsList.sort(function (a, b) {
                return b.reply[b.reply.length - 1].timestamp - a.reply[a.reply.length - 1].timestamp;
            });
            // 帖子总数不多不会翻页，就不做分页了
            return postsList;
        },

        getReplyListAtPage: function (post, pageIndex) {
            let currentPage = pageIndex || 1;
            let startIndex = (currentPage - 1) * this.PAGE_SIZE;
            let endIndex = startIndex + this.PAGE_SIZE;
            let replyList = post.reply.slice(startIndex, endIndex);
            console.log(`当前页: ${currentPage}, 截取范围: ${startIndex} - ${endIndex}, 本页数据条数: ${replyList.length}`);
            return replyList;
        },

        calcPostPageCount: function (post) {
            let pageCount = Math.ceil(post.reply.length / this.PAGE_SIZE);
            return pageCount;
        },

        /**
         * 查看论坛主页
         */
        viewForum: async function () {
            console.log('[Forum] 查看论坛主页');
            this.savePostId("");
            await ac.replaceUI({
                name: 'replaceUI_forum',
                uiId: ResMap.ui_forum
            });
        },

        /**
         * 查看帖子
         * @param {string} postId  - 帖子id, 默认为当前帖子
         * @param {int} pageIndex   - 页码, 默认为 1
         */
        viewPost: async function (postId=null, pageIndex=1) {
            if (postId == null) {
                postId = this.getPostId();
            }
            this.savePostId(postId);
            this.savePageIndex(pageIndex);
            // 标记为已读, 这个需要在 replaceUI 之前调用
            this.saveRead(postId);
            await ac.replaceUI({
                name: 'replaceUI_post',
                uiId: ResMap.ui_post_detail,
            });
        }
    }
);
