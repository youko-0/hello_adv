var ForumSystem = {
    HOST: "donghaiguaitan.topic.com/",      // 域名
    NAME: "东海论坛",
    PAGE_SIZE: 10,                          // 分页大小
    NOW_YEAR: 2034,                         // 当前年份
    STATIC_TIMESTAMP: 1772339006,             // 基准时间戳
    // 帖子数据
    postsMap: {
        1001: {
            id: "1001",
            authorId: "user_002",
            topic: "有人知道城北的哪吒庙发生大火是怎么回事吗？",
            timestamp: 1772331086,
            reply: [
                {
                    index: 1,
                    authorId: "user_002",
                    content: "我家就在哪吒三太子庙马路对面的幸福小区，昨天半夜我熬夜玩手机，突然感觉窗外特别亮，起来一看庙里烧起来了，然后今天过去想看看，那里已经被zf工作人员封锁起来了。",
                    timestamp: 1772331086
                },
                {
                    index: 2,
                    authorId: "user_003",
                    content: "不会吧，哪吒三太子不是玩火的吗？自己的道场居然也怕火烧？",
                    timestamp: 1772331157
                },
                {
                    index: 3,
                    authorId: "user_001",
                    content: "楼上能不能科学一点，那都快三千年的古建筑了，大部分主体都是木质的，能不怕火烧吗？",
                    timestamp: 1772331447
                },
                {
                    index: 4,
                    authorId: "user_004",
                    content: "我也是幸福小区的，昨晚我看见了，那个火好像不太正常，像是三昧真火，却有一股魔气，气势极凶。",
                    timestamp: 1772331778
                },
                {
                    index: 5,
                    authorId: "user_001",
                    content: "连三昧真火都出来了，下一步是不是要在楼里卖保健品了。",
                    timestamp: 1772331890
                },
                {
                    index: 6,
                    authorId: "user_004",
                    content: "传播封建迷信，@管理员 来把这个人关小黑屋。",
                    timestamp: 1772332138
                },
                {
                    index: 23,
                    authorId: "user_003",
                    content: "这都一年了，哪吒庙怎么还不开放啊，有没有内部人士知道消息的？",
                    timestamp: 1772332682
                },
                {
                    index: 24,
                    authorId: "user_001",
                    content: "就是啊，马上要九月初九了，信徒想去请香都进不去。",
                    timestamp: 1772333148
                },
                {
                    index: 25,
                    authorId: "user_010",
                    content: "那边的宗教事务局根本都没在干活吧？这都一年了也没见他们翻修烧毁的建筑啊。",
                    timestamp: 1772333379
                },
                {
                    index: 26,
                    authorId: "user_004",
                    content: "你们没听说吗？哪吒庙闹鬼了！",
                    timestamp: 1772333915
                },
                {
                    index: 27,
                    authorId: "user_001",
                    content: "……",
                    timestamp: 1772334468
                },
                {
                    index: 28,
                    authorId: "user_001",
                    content: "666",
                    timestamp: 1772334889
                },
                {
                    index: 29,
                    authorId: "user_003",
                    content: "不是，多牛逼的鬼敢在三太子庙里闹，是嫌自己s的不够快吗？？？？",
                    timestamp: 1772335392
                },
                {
                    index: 30,
                    authorId: "user_001",
                    content: "真的啊！我有个朋友之前在那里面做义工，说哪吒庙烧了之后，神像和里面的壁画居然一夜之间变样了，变得特诡异，只要是道士和信徒靠近，就会感觉非常难受，反而是无神论者靠近就没什么感觉。",
                    timestamp: 1772335677
                },
                {
                    index: 31,
                    authorId: "user_003",
                    content: "我瓜子拿过来了，楼上继续编。",
                    timestamp: 1772335806
                },
                {
                    index: 32,
                    authorId: "user_004",
                    content: "你们爱信不信，不信就偷偷进去看看。",
                    timestamp: 1772336246
                },
                {
                    index: 33,
                    authorId: "user_010",
                    content: "我觉得30L说的并不是完全空穴来风，我那天路过，看到那里面的道士居然从外面请来了一些符，贴在供奉神像的那间殿的外面，贴得密密麻麻的，像是想镇压什么。",
                    timestamp: 1772336806
                },
                {
                    index: 34,
                    authorId: "user_004",
                    content: "镇压自家供奉的神仙？不活了他们，还是说，你意思是三太子成魔了？",
                    timestamp: 1772337123
                },
                {
                    index: 35,
                    authorId: "user_010",
                    content: "实在是看不下去了，编这种瞎话的人你是真不怕遭报应啊……",
                    timestamp: 1772337715
                },
                {
                    index: 36,
                    authorId: "user_004",
                    content: "这样编排正神确实不太好，30L和33L，我劝你们还是到三太子庙门口去请柱香赔礼道歉一下。",
                    timestamp: 1772338192
                }
            ]
        },
        1002: {
            id: "1002",
            authorId: "user_010",
            topic: "谁能管管德兴大厦里那个夜哭的女鬼？",
            timestamp: 1772329406,
            reply: [
                {
                    index: 1,
                    authorId: "user_010",
                    content: "我在德兴旁边那栋楼里上班，每天晚上加班都能听到对面那个女鬼哭。本来加班就怨气够大的，我恨不得跟她一起s。",
                    timestamp: 1772329406
                },
                {
                    index: 2,
                    authorId: "user_003",
                    content: "楼主你是在d座吗？我们公司在德兴对面，今年已经有好几个新人加班被吓跑了，习惯就好了，反正她也只是哭一哭，不害人。",
                    timestamp: 1772329828
                },
                {
                    index: 3,
                    authorId: "user_004",
                    content: "xs，说不定那个女鬼就是当年在德兴加班猝死的，所以变成了地缚灵。",
                    timestamp: 1772329960
                },
                {
                    index: 4,
                    authorId: "user_002",
                    content: "什么女鬼？？？你们俩在说什么？？这还是xx34年吗？",
                    timestamp: 1772330112
                },
                {
                    index: 5,
                    authorId: "user_001",
                    content: "同问。",
                    timestamp: 1772330581
                },
                {
                    index: 6,
                    authorId: "user_003",
                    content: "+1。",
                    timestamp: 1772331073
                },
                {
                    index: 18,
                    authorId: "user_002",
                    content: "那个事十年前我上中学的时候可火了，现在的年轻人都不知道了吗？",
                    timestamp: 1772331364
                },
                {
                    index: 19,
                    authorId: "user_010",
                    content: "十几年前德兴集团是东海市最大的企业，这个大家都知道吧？从淡水业、建筑业到娱乐业，几乎渗透垄断东海的各个方面，连本地zf都受他们家控制，算是本地的土皇帝。然后直到13年前，不知道发生了什么事，一夜之间德兴大厦竟然人去楼空了，没有人看到他们搬家，就是突然一个人也没有了，德兴大厦里的家具设备什么的也都在，就像人间蒸发了一样。",
                    timestamp: 1772331835
                },
                {
                    index: 20,
                    authorId: "user_001",
                    content: "这个我可以证明，我叔叔以前就是德兴的员工，那时候在德兴工作福利可好了，外面买水特别贵，德兴的员工工资都是发水币的，别的不说，至少水管够。后来德兴一夜之间垮了，我们全家的生活水平都跟着下降了。",
                    timestamp: 1772332070
                },
                {
                    index: 21,
                    authorId: "user_002",
                    content: "真是活久见了，我年轻的时候提起德兴都是人人喊打，骂司马资本家，现在好不容易熬到德家倒了，居然还有人怀念上了，你们内部的倒是享福了，我们普通老百姓那时候想买饮用水还得排长队，我记得每天几点到几点之间，不同的区还错峰限制生活用水……",
                    timestamp: 1772332463
                },
                {
                    index: 22,
                    authorId: "user_002",
                    content: "扯远了，我继续说，后来有新企业看中了德兴大厦那个地址，想拆了盖新的楼，没想到拆迁队过去一动工就出现怪事，派过去的工人都吓的屁滚尿流的，给多少钱都说干不了。",
                    timestamp: 1772332697
                },
                {
                    index: 23,
                    authorId: "user_002",
                    content: "是什么怪事呢？是有鬼吗？",
                    timestamp: 1772332752
                },
                {
                    index: 24,
                    authorId: "user_010",
                    content: "起初是工程队进去考察建筑结构的时候发现，那栋楼里明明没有人，但是夜里一直有女人哭的声音，一开始大家都不信邪，项目经理就说爆破强拆，什么鬼不鬼的，在火力面前都是渣渣，结果你们猜怎么的？那个项目经理居然在晚上睡觉的时候差点溺死了。",
                    timestamp: 1772333087
                },
                {
                    index: 25,
                    authorId: "user_001",
                    content: "他晚上不睡在床上吗？怎么淹死？",
                    timestamp: 1772333668
                },
                {
                    index: 26,
                    authorId: "user_002",
                    content: "啥家庭条件啊，这年头还能让水淹死。",
                    timestamp: 1772334262
                },
                {
                    index: 27,
                    authorId: "user_010",
                    content: "这就是奇怪的点。那个项目经理亲口说，他半夜感觉鼻腔、口腔、耳朵里都是水，无法呼吸，被活活呛醒了，醒来后卧室里全是鱼腥味，有一个浑身皮肤是青黑色，脸上、脖子上、四肢都覆盖着鳞片的女鬼在地上爬，一边哭得非常凄厉，第二天那个项目经理连行李都没收拾就跑了。",
                    timestamp: 1772334491
                },
                {
                    index: 28,
                    authorId: "user_001",
                    content: "我去，大半夜给我看害怕了，我要去听两遍《金刚经》。",
                    timestamp: 1772334784
                },
                {
                    index: 29,
                    authorId: "user_004",
                    content: "这都有人信，先不提世界上有没有神神鬼鬼的，就算有，当我们本地的哪吒庙是摆设吗？什么妖魔敢在此地作祟。",
                    timestamp: 1772334854
                },
                {
                    index: 30,
                    authorId: "user_002",
                    content: "楼上村通网了？城北的哪吒庙自从失火之后就没开过门了，那里面的道士都跑光了，说不定真是哪吒三太子不管我们了，才冒出来这么多妖魔鬼怪。",
                    timestamp: 1772335043
                },
                {
                    index: 31,
                    authorId: "user_002",
                    content: "用科学解释的话，搞不好就是那个项目经理考察之后发现什么问题，就编出来一些瞎话甩锅跑路。",
                    timestamp: 1772335177
                },
                {
                    index: 32,
                    authorId: "user_010",
                    content: "不是，因为后面又换了四五个项目经理，都没干成，其中有一个想强行动工，那天晚上所有工人都中邪昏迷了，醒来之后都说是梦到一个长得很美艳但是特别诡异的女鬼，醒来后每个人从头到脚都湿透了，拧下来的水一股子腥气，身上还能找到那个女鬼掉落的鳞片。",
                    timestamp: 1772335259
                },
                {
                    index: 33,
                    authorId: "user_002",
                    content: "我靠，这真是个水鬼啊。",
                    timestamp: 1772335856
                },
                {
                    index: 34,
                    authorId: "user_004",
                    content: "什么水鬼现在来了东海都得渴死。",
                    timestamp: 1772336041
                },
                {
                    index: 35,
                    authorId: "user_002",
                    content: "没准是德家当年作孽做多了，遭报应引来什么邪祟，一夜之间把他们全弄s了。",
                    timestamp: 1772336241
                },
                {
                    index: 36,
                    authorId: "user_003",
                    content: "那个地方现在怎么样了？都多少年了，有人管这个事吗？",
                    timestamp: 1772336564
                },
                {
                    index: 37,
                    authorId: "user_001",
                    content: "德兴大厦以前可是东海地标建筑，就在市中心最好的地段上，拆不了也盖不了新楼，寸金寸土的地方，浪费了这么多年怪可惜的。",
                    timestamp: 1772336841
                },
                {
                    index: 38,
                    authorId: "user_001",
                    content: "不是说市zf请了大师过去开坛做法吗？",
                    timestamp: 1772337041
                },
                {
                    index: 39,
                    authorId: "user_004",
                    content: "我那天路过的时候看见那里门窗上全贴的是各种符，怪吓人的，这得怨气多大的鬼。",
                    timestamp: 1772337094
                },
                {
                    index: 40,
                    authorId: "user_004",
                    content: "是请了，请的还是我师公。偷偷告诉你们，请谁都没用，我师公说东海的风水出问题了，本来几千年来镇守东海的是哪吒三太子，但是哪吒庙当年失火之后，这么多年谁都请不来三太子了，好像祂已经不在这里了，不仅如此，连其他大神也请不来，好像都避讳着什么。",
                    timestamp: 1772337667
                },
                {
                    index: 41,
                    authorId: "user_004",
                    content: "说的够玄乎的，无非就是那个地段租金太贵，德家倒了之后又没有相应大体量的企业补充生态位，所以哪家都租不起，zf也懒得管罢了。",
                    timestamp: 1772338259
                },
                {
                    index: 42,
                    authorId: "user_004",
                    content: "是呗，39L你老了我给你卖保健品。",
                    timestamp: 1772338694
                },
                {
                    index: 43,
                    authorId: "user_004",
                    content: "人家40L就是干这行的，专骗那些迷信的老头老太太。",
                    timestamp: 1772338783
                }
            ]
        },
        1003: {
            id: "1003",
            authorId: "user_001",
            topic: "龙王庙那个水神娶亲仪式为什么这些年不举行了？",
            timestamp: 1772329706,
            reply: [
                {
                    index: 1,
                    authorId: "user_001",
                    content: "我奶今天给我讲她年轻的时候参加水神娶亲仪式的怪事，听完我都有点睡不着了，感觉唯物主义世界观被打破了……",
                    timestamp: 1772329706
                },
                {
                    index: 2,
                    authorId: "user_002",
                    content: "什么仪式？是西郊那个龙王庙吗？我东海本地人怎么没见过？",
                    timestamp: 1772329880
                },
                {
                    index: 3,
                    authorId: "user_004",
                    content: "楼上那你应该挺小的，年纪大点的东海人肯定都知道。",
                    timestamp: 1772329991
                },
                {
                    index: 4,
                    authorId: "user_001",
                    content: "地方志上说，这个仪式源自一个古老的民间传说，最初名为“水神寻妻”。相传东海一带曾有一条河流，居住着一位能呼风唤雨的水神，沿岸村落的风调雨顺皆仰赖其庇佑。后来，水神深爱的妻子不知所踪，悲痛的水神便终日捧着一颗明珠，四处寻觅妻子的踪迹。龙王庙建成后，百姓们很自然地将水神与龙王视为一体，于是“水神寻妻”的传说便逐渐与龙王庙的信仰融合。",
                    timestamp: 1772330387
                },
                {
                    index: 5,
                    authorId: "user_010",
                    content: "我怎么听说的是每年要往河里扔一个童男童女献祭给龙王，他吃饱肚子就会好好下雨，否则就会大旱。",
                    timestamp: 1772330931
                },
                {
                    index: 6,
                    authorId: "user_002",
                    content: "此事在《哪吒闹海》里亦有记载。",
                    timestamp: 1772331174
                },
                {
                    index: 7,
                    authorId: "user_010",
                    content: "可能是因为很古老的时期有人牲祭祀的文化，习俗都比较血腥残忍，后来社会变得文明了，就从献祭小孩子演化成献祭新娘了，并且从真的献祭变成了单纯的仪式表演。",
                    timestamp: 1772331701
                },
                {
                    index: 8,
                    authorId: "user_002",
                    content: "这也没什么恐怖的吧，不就是一个表演吗？我小时候跟老人去看过，挺热闹的呀。",
                    timestamp: 1772332031
                },
                {
                    index: 9,
                    authorId: "user_001",
                    content: "我奶说她18岁那年跟小姐妹去看这个，那时候娱乐活动也比较少嘛，到处吹拉弹唱，张灯结彩的，就觉得很好玩，然后龙王庙的道长会问有没有人要主动当新娘子，现场挑选一个观众扮演新娘，我奶奶就被选上了，坐上花轿，道长还给她盖了盖头，让她抱着那颗珠子坐好。",
                    timestamp: 1772332165
                },
                {
                    index: 10,
                    authorId: "user_010",
                    content: "社会也是好了，都有人抢着要给龙王当新娘了，搁老辈子那时候都是哭着喊着不去就直接丢河里的。",
                    timestamp: 1772332319
                },
                {
                    index: 11,
                    authorId: "user_002",
                    content: "毕竟这年头给龙王当新娘真的不会s了。",
                    timestamp: 1772332570
                },
                {
                    index: 12,
                    authorId: "user_001",
                    content: "之后诡异的事情就开始了，我奶奶说轿子抬到门口的时候好像被什么无形的东西挡了一下，就停下了，然后仪式就结束了，那个道长嘱咐她原路回家，一路上不要回头，到家再取下盖头，因为被龙王退亲的女孩不能让龙王看见样貌，否则就会被记住。",
                    timestamp: 1772333040
                },
                {
                    index: 13,
                    authorId: "user_002",
                    content: "突然感觉有点恐怖了，然后呢然后呢？",
                    timestamp: 1772333599
                },
                {
                    index: 14,
                    authorId: "user_001",
                    content: "但是我奶奶从花轿上下来后，不但没把道长的话当回事，还觉得很好玩，就直接摘了盖头从庙的后门溜进去了。进了正殿后她发现，最中间供奉的龙王像旁还有一个小一点的神像，旁边的牌子上写着那是龙王的三太子。",
                    timestamp: 1772333742
                },
                {
                    index: 15,
                    authorId: "user_004",
                    content: "就是《哪吒闹海》里吃人然后被哪吒抽筋的那个龙三太子吗？",
                    timestamp: 1772334001
                },
                {
                    index: 16,
                    authorId: "user_010",
                    content: "是的，不过那个情节纯属艺术创作啦，在很多民间故事里其实龙三太子不但不吃人，还为凡人做过一些好事呢，在道教文化里也是正经的水神。",
                    timestamp: 1772334075
                },
                {
                    index: 17,
                    authorId: "user_004",
                    content: "我家老人是信士，跟我说过，好像是因为龙王三太子贪玩不喜欢工作，龙王就让信徒把儿子的神像摆到自己旁边，沾沾香火。",
                    timestamp: 1772334642
                },
                {
                    index: 18,
                    authorId: "user_003",
                    content: "哎哟我去，突然觉得好萌，神仙也喜欢带自家小孩上班。",
                    timestamp: 1772334737
                },
                {
                    index: 19,
                    authorId: "user_001",
                    content: "接着说。然后我奶奶在里面溜达了一圈就回家了，之后一直都很正常。然后我太爷那时候已经病了好多年了，春节的时候家里想去庙里敬个香求平安，我奶奶就跟着去了，没想到，她居然进不了龙王庙的门了。",
                    timestamp: 1772334901
                },
                {
                    index: 20,
                    authorId: "user_002",
                    content: "什么意思？为什么进不了门？",
                    timestamp: 1772335185
                },
                {
                    index: 21,
                    authorId: "user_001",
                    content: "好像有一堵无形的墙一样，家里其他人都进得去，只有我奶奶进不去。家里人怀疑她身上是不是跟了脏东西，就去哪吒庙想找个师父驱邪，结果竟然连哪吒庙也进不去，一到正门口就感觉腿软无力。",
                    timestamp: 1772335675
                },
                {
                    index: 22,
                    authorId: "user_004",
                    content: "会不会是因为你奶奶是“被退亲”的女孩子，所以进不去龙王家的门。",
                    timestamp: 1772335970
                },
                {
                    index: 23,
                    authorId: "user_003",
                    content: "太诡异了吧，那龙王庙进不去还能解释，哪吒庙也进不去是什么原因呢？",
                    timestamp: 1772336526
                },
                {
                    index: 24,
                    authorId: "user_003",
                    content: "后来再试过没呢，一直都进不去吗？",
                    timestamp: 1772336857
                },
                {
                    index: 25,
                    authorId: "user_001",
                    content: "对，一辈子一直都进不去。",
                    timestamp: 1772337165
                },
                {
                    index: 26,
                    authorId: "user_010",
                    content: "我家就在西郊，每天都路过那个龙王庙，怎么从来没见过什么水神娶亲呢？",
                    timestamp: 1772337645
                },
                {
                    index: 27,
                    authorId: "user_003",
                    content: "好像因为十几年前有一次游客起哄，把一个小伙子给塞进了花轿，后来还真抬进去了，闹大了之后说是龙王爷不高兴了，从那以后就再也没举行过了。",
                    timestamp: 1772338171
                },
                {
                    index: 28,
                    authorId: "user_003",
                    content: "这好像确实有点过分了，冒犯神明了吧？",
                    timestamp: 1772338458
                },
                {
                    index: 29,
                    authorId: "user_004",
                    content: "可是楼主的奶奶不是说，龙王没看上的新娘根本抬不进正殿吗？那个小伙子是怎么抬进去的？",
                    timestamp: 1772338501
                },
                {
                    index: 30,
                    authorId: "user_004",
                    content: "当个吓唬小孩的故事听听得了，真有人信啊。以前那都是表演呗，结果这次捣乱闹大了，破坏了仪式，所以后来不举行了，就这么简单。",
                    timestamp: 1772338803
                },
                {
                    index: 30,
                    authorId: "user_010",
                    content: "能想出来给龙王娶个男媳妇的也是家里该请高人了。",
                    timestamp: 1772339380
                },
                {
                    index: 31,
                    authorId: "user_003",
                    content: "不对啊，龙王都有儿子了，怎么会没有媳妇呢？说不定是给他家三太子娶的媳妇。",
                    timestamp: 1772339925
                },
                {
                    index: 32,
                    authorId: "user_002",
                    content: "楼上出院！",
                    timestamp: 1772340116
                },
                {
                    index: 33,
                    authorId: "user_010",
                    content: "我有个猜测，你们别笑话我哈，之前不是说这个仪式最开始举行是为了给龙王献祭，祈求风调雨顺吗？会不会是因为这十几年不举行仪式了，所以咱们东海市不下雨了？",
                    timestamp: 1772340335
                },
                {
                    index: 34,
                    authorId: "user_002",
                    content: "我也觉得跟这有点关系，毕竟东海不下雨已经用科学都无法解释了。",
                    timestamp: 1772340838
                },
                {
                    index: 35,
                    authorId: "user_004",
                    content: "官方都说了多少遍是气候变迁，总有人不信，义务教育扫盲的时候是不是把你们这种人给落下了？",
                    timestamp: 1772341370
                }
            ]
        }
    },
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
        let post = this.postsMap[postId];
        if (!post) {
            console.trace(`帖子 ${postId} 不存在！`);
            return null;
        }
        return post;
    },

    getTopicListByPageIndex: function (pageIndex) {
        let postsList = Object.values(this.postsMap);
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
        for (let post of Object.values(this.postsMap)) {
            if (!this.isPostVisited(post.id)) {
                return false;
            }
        }
        return true;
    },

};
