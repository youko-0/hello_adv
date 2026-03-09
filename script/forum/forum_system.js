// 论坛系统配置
console.log('[LOAD] forum_system');

const ForumSystem = {
    HOST: "donghaiguaitan.topic.com/",      // 域名
    NAME: "东海论坛",
    PAGE_SIZE: 10,                          // 分页大小
    NOW_YEAR: 2034,                         // 当前年份
    STATIC_TIMESTAMP: 2024814236,             // 基准时间戳

    // 当前帖子id
    getCurrentPostId: function () {
        return ac.var.currentPostId;
    },

    setCurrentPostId: function (postId) {
        console.log("setCurrentPostId old: ", ac.var.currentPostId, ", new: ", postId)
        ac.var.currentPostId = postId;
    },

    getCurrentPageIndex: function () {
        return ac.var.currentPageIndex;
    },

    setCurrentPageIndex: function (pageIndex) {
        console.log("setCurrentPageIndex old: ", ac.var.currentPageIndex, ", new: ", pageIndex)
        ac.var.currentPageIndex = pageIndex;
    },

    getCurrentTitle: function () {
        let postId = this.getCurrentPostId();
        let post = this.getPostData(postId);
        if (!post) return this.NAME;
        return post.topic;
    },

    getCurrentUrl: function () {
        let postId = this.getCurrentPostId();
        let suffix = this.getCurrentPageIndex() > 1 ? `?page=${this.getCurrentPageIndex()}` : "";
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

    getTopicListByPageIndex: function (pageIndex) {
        let postsList = Object.values(ForumData.postData);
        // 根据最后回帖的时间戳排序, 最新的在前面
        postsList.sort(function (a, b) {
            return b.reply[b.reply.length - 1].timestamp - a.reply[a.reply.length - 1].timestamp;
        });
        // 帖子总数不多不会翻页，就不做分页了
        return postsList;
    },

    getReplyListByPageIndex: function (post, pageIndex) {
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

    isPostVisited: function (postId) {
        let visitedPosts = ac.var.visitedPosts.split("|");
        return visitedPosts.includes(postId);
    },

    savePostVisited: function (postId) {
        let visitedPosts = ac.var.visitedPosts.split("|");
        if (!visitedPosts.includes(postId)) {
            visitedPosts.push(postId);
            ac.var.visitedPosts = visitedPosts.join("|");
        }
    },

    // 是否看完了所有的帖子
    isAllPostVisited: function () {
        for (let post of Object.values(ForumData.postData)) {
            if (!this.isPostVisited(post.id)) {
                return false;
            }
        }
        return true;
    },

};
