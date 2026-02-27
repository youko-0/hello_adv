var ForumSystem = {
    posts: [
        {
            id: 1001,
            authorId: "user_001",
            topic: "有人知道城北的哪吒庙发生大火是怎么回事吗？",
            content: "我家就在哪吒三太子庙马路对面的幸福小区，昨天半夜我熬夜玩手机，突然感觉窗外特别亮，起来一看庙里烧起来了，然后今天过去想看看，那里已经被zf工作人员封锁起来了。",
            date: "2026-02-26 12:00:00",
            likes: 100,
            reply: [
                { userId: "user_002", content: "不会吧，哪吒三太子不是玩火的吗？自己的道场居然也怕火烧？", date: "2026-02-26 12:00:00", likes: 5 },
                { userId: "user_003", content: "楼上能不能科学一点，那都快三千年的古建筑了，大部分主体都是木质的，能不怕火烧吗？", date: "2026-02-26 12:00:00", likes: 5 },
                { userId: "user_003", content: "我也是幸福小区的，昨晚我看见了，那个火好像不太正常，像是三昧真火，却有一股魔气，气势极凶。", date: "2026-02-26 12:00:00", likes: 5 },
                { userId: "user_003", content: "对啊对啊对啊！", date: "2026-02-26 12:00:00", likes: 5 },
                { userId: "user_003", content: "对啊对啊对啊！", date: "2026-02-26 12:00:00", likes: 5 },
                { userId: "user_003", content: "对啊对啊对啊！", date: "2026-02-26 12:00:00", likes: 5 },
            ]
        },
        {
            id: 1002,
            authorId: "user_002",
            topic: "龙王庙那个水神娶亲仪式为什么这些年不举行了？",
            content: "我奶今天给我讲她年轻的时候参加水神娶亲仪式的怪事，听完我都有点睡不着了，感觉唯物主义世界观被打破了……",
            date: "2026-02-26 12:00:00",
            likes: 100,
        }
    ],

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

    // 计算内页帖子高度
    calcPostHeight: function (post) {

    },

    // 计算页面高度
    calcPageHeight: function () {
        let pageHeight = 0;
        let posts = this.posts;
        // 遍历帖子, 计算标题高度
        posts.forEach((post, index) => {
            let itemHeight = this.calcTextHeight(post.topic, 32, 580);
        });
    }
};