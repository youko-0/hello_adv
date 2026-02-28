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
    
    # 时间控制变量
    # 设定脚本运行时间前2小时为基准发帖时间
    base_timestamp = int(time.time()) - (2 * 60 * 60) 
    current_timestamp = base_timestamp
    
    post_id_counter = START_ID

    # 正则表达式预编译
    # 匹配标题：[标题内容]
    re_topic = re.compile(r'^\[(.*?)\]\s*$')
    # 匹配回复：1L（楼主）：内容 或 30l: 内容
    # 说明：^(\d+) 捕获楼层数字
    # [Ll] 匹配大小写L
    # (?:[（(].*?[）)])? 非捕获组，匹配可选的 (楼主) 或 （楼主）
    # \s*[:：]\s* 匹配冒号(中英文)及周围空格
    # (.*) 捕获内容
    re_reply = re.compile(r'^(\d+)[Ll](?:[（(].*?[）)])?\s*[:：]\s*(.*)')

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
            
            # 重置时间：每个新帖子的发帖时间都视为基准时间（或者你可以让帖子之间也有时间间隔）
            # 这里设定为所有帖子都是2小时前发的
            current_timestamp = base_timestamp

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
            content = reply_match.group(2).strip()
            
            # 逻辑：分配作者
            if floor_index == 1:
                # 1楼通常是楼主自己，保持ID一致
                r_author = current_post['authorId']
                r_time = current_post['timestamp']
                # 1楼的时间通常和发帖时间一致，或者极短时间内
                current_timestamp = r_time 
            else:
                # 其他楼层随机分配
                r_author = random.choice(AUTHOR_IDS)
                # 时间递增 30s ~ 180s
                add_seconds = random.randint(30, 180)
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

    # 3. 输出到文件
    # 这里我们按照你要求的格式输出，虽然通常是 JSON 数组，但你的例子是一个对象 Key-Value 结构
    # 为了通用性，我将其包裹在一个名为 postsMap 的 JSON 对象中
    
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