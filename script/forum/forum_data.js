var ForumSystem = {
    postsMap: {
        "1001": {
            id: "1001",
            authorId: "user_001",
            topic: "有人知道城北的哪吒庙发生大火是怎么回事吗？",
            // 这个字段用来排序, 越大越靠前
            timestamp: 1772179271,
            reply: [
                { authorId: "user_001", content: "我家就在哪吒三太子庙马路对面的幸福小区，昨天半夜我熬夜玩手机，突然感觉窗外特别亮，起来一看庙里烧起来了，然后今天过去想看看，那里已经被zf工作人员封锁起来了。", timestamp: 1772179271 },
                { authorId: "user_002", content: "不会吧，哪吒三太子不是玩火的吗？自己的道场居然也怕火烧？", timestamp: 1772179271 },
                { authorId: "user_003", content: "楼上能不能科学一点，那都快三千年的古建筑了，大部分主体都是木质的，能不怕火烧吗？", timestamp: 1772179271 },
                { authorId: "user_003", content: "我也是幸福小区的，昨晚我看见了，那个火好像不太正常，像是三昧真火，却有一股魔气，气势极凶。", timestamp: 1772179271 },
                { authorId: "user_003", content: "对啊对啊对啊！", timestamp: 1772179271 },
                { authorId: "user_001", content: "楼主回复啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊", timestamp: 1772179271 },
                { authorId: "user_003", content: "对啊对啊对啊！", timestamp: 1772179271 },
            ]
        },
        "1002": {
            id: "1002",
            authorId: "user_002",
            topic: "谁能管管德兴大厦里那个夜哭的女鬼？",
            timestamp: 1772179260,
            reply: [
                { authorId: "user_002", content: "我在德兴旁边那栋楼里上班，每天晚上加班都能听到对面那个女鬼哭。本来加班就怨气够大的，我恨不得跟她一起s。", timestamp: 1772179260 },
            ],
        },
        "1003": {
            id: "1003",
            authorId: "user_003",
            topic: "龙王庙那个水神娶亲仪式为什么这些年不举行了？",
            timestamp: 1772179250,
            reply: [
                { authorId: "user_002", content: "我奶今天给我讲她年轻的时候参加水神娶亲仪式的怪事，听完我都有点睡不着了，感觉唯物主义世界观被打破了……", timestamp: 1772179250 },
            ],
        },
    },


    // 计算文本高度
    calcTextHeight: function (content, fontSize = 28, containerWidth = 580) {
        if (!content) return 0;

        const lineHeightMultiplier = 1.5;
        const singleLineHeight = fontSize * lineHeightMultiplier;

        let paragraphs = content.toString().split('\n');
        let totalLines = 0;

        paragraphs.forEach(para => {
            if (para.length === 0) {
                totalLines += 1; // 空行也算一行
                return;
            }

            let currentLineWidth = 0;

            // 遍历每个字符计算虚拟像素宽度
            for (let i = 0; i < para.length; i++) {
                let charCode = para.charCodeAt(i);

                // charCode > 255 通常是中日韩文字，算 1 个字宽
                if (charCode > 255) {
                    currentLineWidth += fontSize;
                }
                // 英文、数字、标点，大约算 0.6 个字宽
                else {
                    currentLineWidth += (fontSize * 0.6);
                }
            }

            // 计算行数(向上取整)
            // Math.max(1, ...) 确保即使内容很少也至少算一行
            let linesInPara = Math.ceil(currentLineWidth / containerWidth);
            totalLines += Math.max(1, linesInPara);
        });

        // 总行数 * 单行高度
        return totalLines * singleLineHeight;
    },


    // 当前帖子id
    getCurrentPostId: function () {
        return ac.var.currentPostId;
    },

    setCurrentPostId: function (postId) {
        console.log("setCurrentPostId old: ", ac.var.currentPostId, "new: ", postId)
        ac.var.currentPostId = postId;
    },

    getCurrentTitle: function () {
        let postId = this.getCurrentPostId();
        let post = this.getPostData(postId);
        if (!post) return "首页";
        return post.topic;
    },

    getCurrentUrl: function () {
        let prefix = "donghaiguaitan.topic.com/";
        let postId = this.getCurrentPostId();
        return prefix + postId;
    },

    isPostReaded: function (postId) {
        let readedPosts = ac.var.readedPosts.split("|");
        return readedPosts.includes(postId);
    },

    savePostReaded: function (postId) {
        let readedPosts = ac.var.readedPosts.split("|");
        if (!readedPosts.includes(postId)) {
            readedPosts.push(postId);
            ac.var.readedPosts = readedPosts.join("|");
        }
    },

    // 是否看完了所有的帖子
    isAllPostReaded: function () {
        for (let post of Object.values(this.postsMap)) {
            if (!this.isPostReaded(post.id)) {
                return false;
            }
        }
        return true;
    },

    getPostData: function (postId) {
        let post = this.postsMap[postId];
        if (!post) {
            console.log(`帖子 ${postId} 不存在！`);
            return null;
        }
        return post;
    },


};