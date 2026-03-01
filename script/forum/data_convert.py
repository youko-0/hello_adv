import re
import json
import time
import random

# ================= 配置区域 =================
INPUT_FILE = 'data.txt'
OUTPUT_FILE = 'data_output.txt'

# 可用的用户ID列表
AUTHOR_IDS = ["user_001", "user_002", "user_003", "user_004", "user_010"]

# 起始帖子ID
START_ID = 1001
# ===========================================

def parse_forum_data():
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"错误：找不到文件 {INPUT_FILE}，请确保文件在当前目录下。")
        return

    posts_map = {} # 使用字典存储，key为id
    current_post = None
    current_reply_list = []
    random_author_list = []
    
    post_id_counter = START_ID

    # 正则表达式预编译
    # 匹配标题：[标题内容]
    re_topic = re.compile(r'^\[(.*?)\]\s*$')
    # 匹配回复：1L（楼主）：内容 或 30l: 内容
    # group(1): 楼层数字
    # group(2): 身份标识，例如 "(楼主)" 或 None
    # group(3): 回复内容
    re_reply = re.compile(r'^(\d+)[Ll]([（(].*?[）)])?\s*[:：]\s*(.*)')

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # 1. 检查是否是新帖子标题 [Topic]
        topic_match = re_topic.match(line)
        if topic_match:
            # 如果当前有正在处理的帖子，先保存它
            if current_post:
                current_post['reply'] = current_reply_list
                posts_map[str(current_post['id'])] = current_post

            # 初始化新帖子
            topic_content = topic_match.group(1)
            p_id = str(post_id_counter)
            post_id_counter += 1
            
            # 为楼主随机分配一个ID
            topic_author = random.choice(AUTHOR_IDS)
            # 随机列表里剔除楼主
            random_author_list = [id for id in AUTHOR_IDS if id != topic_author] or AUTHOR_IDS
            
            # 时间控制变量
            # 设定脚本运行时间前 120 ~ 180 分钟的时间戳作为基准时间
            base_timestamp = int(time.time()) - (random.randint(120, 180) * 60)
            print(f"基准时间：{base_timestamp}")

            current_post = {
                "id": p_id,
                "authorId": topic_author,
                "topic": topic_content,
                "timestamp": base_timestamp,
                "reply": [] # 稍后填充
            }
            current_reply_list = []
            print(f"正在解析帖子 ID: {p_id}, 标题: {topic_content}")
            continue

        # 2. 检查是否是回复行 1L: Content
        reply_match = re_reply.match(line)
        if reply_match and current_post:
            floor_index = int(reply_match.group(1))
            tag = reply_match.group(2) # 捕获到的身份标识，如 "(楼主)"
            content = reply_match.group(3).strip()
            is_author = tag and "楼主" in tag
            
            # 逻辑：分配作者
            if floor_index == 1:
                # 1楼是楼主自己，保持ID一致
                r_author = current_post['authorId']
                r_time = current_post['timestamp']
                # 1楼的时间就是发帖时间
                current_timestamp = r_time
            else:
                # 楼主的回复，保持ID一致
                if is_author:
                    r_author = current_post['authorId']
                else:
                    # 其他楼层随机分配
                    r_author = random.choice(random_author_list)
                # 时间递增 30s ~ 600s
                add_seconds = random.randint(30, 600)
                current_timestamp += add_seconds
                r_time = current_timestamp

            reply_obj = {
                "index": floor_index,
                "authorId": r_author,
                "content": content,
                "timestamp": r_time
            }
            current_reply_list.append(reply_obj)

    # 循环结束后，保存最后一个帖子
    if current_post:
        current_post['reply'] = current_reply_list
        posts_map[str(current_post['id'])] = current_post

    # 3. 输出 JSON 格式到文件
    output_data = {
        "postsMap": posts_map
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        # 使用 json.dump 格式化输出，ensure_ascii=False 保证中文正常显示
        f.write(json.dumps(output_data, indent=4, ensure_ascii=False))
        
    print(f"\n转换完成！数据已保存至 {OUTPUT_FILE}")
    print(f"共处理 {len(posts_map)} 个帖子。")

if __name__ == '__main__':
    parse_forum_data()