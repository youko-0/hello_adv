import re
import json
import time
import random
import os
import datetime

# ================= 配置区域 =================
INPUT_FILE = 'data.txt'
# 目标 JS 文件名
JS_TARGET_FILE = 'forum_data.js'

# 可用的用户ID列表
AUTHOR_IDS = ["user_001", "user_002", "user_003", "user_004", "user_010"]

# 起始帖子ID
START_ID = 1001

# 当前年份
NOW_YEAR = 2034
# ===========================================


def change_timestamp_year(timestamp, target_year):
    """
    将时间戳的年份修改为 target_year
    """
    # 转换为 datetime 对象
    dt = datetime.datetime.fromtimestamp(timestamp)
    
    try:
        # 尝试直接替换年份
        new_dt = dt.replace(year=target_year)
    except ValueError:
        # 如果报错，说明是 2月29日 变到了非闰年
        # 策略：改为 2月28日 或者 3月1日，这里改为 2月28日
        new_dt = dt.replace(year=target_year, month=2, day=28)
    
    # 转回时间戳并取整
    return int(new_dt.timestamp())


def find_matching_brace(text, start_index):
    """
    查找匹配的闭合大括号位置，支持嵌套和跳过字符串
    """
    stack = 0
    in_string = False
    quote_char = ''
    
    for i in range(start_index, len(text)):
        char = text[i]
        
        # 处理字符串内的字符 (忽略字符串内的大括号)
        if in_string:
            if char == '\\': # 转义字符跳过下一个
                continue 
            if char == quote_char:
                in_string = False
        else:
            if char == '"' or char == "'":
                in_string = True
                quote_char = char
            elif char == '{':
                stack += 1
            elif char == '}':
                stack -= 1
                if stack == 0:
                    return i # 找到最外层的闭合括号
    return -1

def update_forum_data_js(posts_map, timestamp):
    """
    针对 var ForumSystem = { ... } 结构的专用更新函数
    """
    if not os.path.exists(JS_TARGET_FILE):
        print(f"错误：找不到目标 JS 文件 {JS_TARGET_FILE}")
        return

    with open(JS_TARGET_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 更新 STATIC_TIMESTAMP
    # 查找格式: STATIC_TIMESTAMP: 123456,
    ts_pattern = r'(STATIC_TIMESTAMP:\s*)(\d+)'
    if re.search(ts_pattern, content):
        content = re.sub(ts_pattern, f'\\g<1>{timestamp}', content)
        print(f"已更新 JS 时间戳为: {timestamp}")
    else:
        print("警告：未找到 STATIC_TIMESTAMP 字段，跳过时间更新。")

    # 2. 更新 postsMap
    # 查找 postsMap: { 的位置
    map_start_match = re.search(r'(postsMap:\s*\{)', content)
    
    if map_start_match:
        start_index = map_start_match.end() - 1 # 获取 '{' 的索引位置
        end_index = find_matching_brace(content, start_index)
        
        if end_index != -1:
            # 把 Python 字典转成 JSON 字符串
            # ensure_ascii=False 保证中文正常显示
            json_str = json.dumps(posts_map, ensure_ascii=False, indent=4)
            
            # 【美化】去掉 JSON key 的双引号，使其符合 JS 对象字面量风格 (id: "1" 而不是 "id": "1")
            # 只匹配由字母数字下划线组成的key
            json_str = re.sub(r'"([a-zA-Z0-9_]+)":', r'\1:', json_str)
            
            # 拼接新文件内容：头部 + 新数据 + 尾部
            new_content = content[:start_index] + json_str + content[end_index+1:]
            
            with open(JS_TARGET_FILE, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"成功！已将 {len(posts_map)} 个帖子写入 {JS_TARGET_FILE}")
        else:
            print("错误：JS 文件结构异常，找不到 postsMap 对应的闭合括号 '}'")
    else:
        print("错误：JS 文件中找不到 'postsMap:' 字段")


def parse_forum_data():
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except FileNotFoundError:
        print(f"错误：找不到文件 {INPUT_FILE}，请确保文件在当前目录下。")
        return

    # 当作 2034 年运行
    static_timestamp = change_timestamp_year(time.time(), NOW_YEAR)
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
            base_timestamp = static_timestamp - (random.randint(120, 180) * 60)

            # 特殊处理: 1001 帖子 1~6 楼为2021年, 其余为 2022 年
            if p_id == '1001':
                base_timestamp = change_timestamp_year(base_timestamp, 2021)

            current_post = {
                "id": p_id,
                "authorId": topic_author,
                "topic": topic_content,
                "timestamp": base_timestamp,
                "reply": [] # 稍后填充
            }
            current_reply_list = []
            print(f"正在解析帖子 ID: {p_id}, 标题: {topic_content}, 发帖时间：{base_timestamp}")
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
                # 1楼的时间就是发帖时间
                current_timestamp = current_post['timestamp']
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

            # 特殊处理: 1001 帖子 1~6 楼为2021年, 其余为 2022 年
            if p_id == '1001':
                if floor_index > 6:
                    r_time = change_timestamp_year(r_time, 2022)

            reply_obj = {
                "index": floor_index,
                "authorId": r_author,
                "content": content,
                "timestamp": r_time,
            }
            current_reply_list.append(reply_obj)

    # 循环结束后，保存最后一个帖子
    if current_post:
        current_post['reply'] = current_reply_list
        posts_map[str(current_post['id'])] = current_post

    # 3. 直接更新 JS 文件
    update_forum_data_js(posts_map, static_timestamp)

if __name__ == '__main__':
    parse_forum_data()