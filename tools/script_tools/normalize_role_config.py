# -*- coding: utf-8 -*-
"""
脚本1：将 res/李云祥立绘配置剧本.txt 中的角色配置行统一为 【角色名|表情|位置】 格式
仅处理 【敖丙】 和 【李云祥】，默认表情=正常，默认位置=中
"""
import re
import shutil

INPUT_FILE = 'res/李云祥立绘配置剧本.txt'
OUTPUT_FILE = 'res/李云祥立绘配置剧本.txt'

TARGET_ROLES = {'敖丙', '李云祥'}
DEFAULT_EMOTION = '正常'
DEFAULT_POSITION = '中'

POSITION_MAP = {'左': '左', '右': '右', '中': '中'}
EMOTION_MAP = {
    '正常': '正常', '高兴': '高兴', '生气': '生气',
    '疑惑': '疑惑', '害羞': '害羞', '悲伤': '悲伤', '开心': '开心',
}


def parse_role_line(raw_line):
    """
    Returns (role, emotion, position) if line is a target role config line, else None.
    
    Supported formats (examples):
      【敖丙】                       -> 正常, 中
      【敖丙】正常                   -> 正常, 中
      【敖丙】高兴（右）             -> 高兴, 右
      【敖丙】（悲伤）               -> 悲伤, 中
      【敖丙|生气|右】               -> 生气, 右  (already target format)
      【敖丙|左】                    -> 正常, 左
      【敖丙右】                     -> 正常, 右  (position stuck to role)
    """
    line = raw_line.strip()
    if not line.startswith('【'):
        return None

    # ---- FORMAT 1: 【role|...】 (pipe-separated, must end with 】) ----
    m = re.match(r'^【(敖丙|李云祥)\|([^】]*)】$', line)
    if m:
        role = m.group(1)
        rest = m.group(2)
        parts = [p.strip() for p in rest.split('|')]
        emotion = DEFAULT_EMOTION
        position = DEFAULT_POSITION
        if len(parts) == 1:
            val = parts[0]
            if val in POSITION_MAP:
                position = POSITION_MAP[val]
            elif val in EMOTION_MAP:
                emotion = EMOTION_MAP[val]
        elif len(parts) >= 2:
            emotion = EMOTION_MAP.get(parts[0], parts[0])
            position = POSITION_MAP.get(parts[1], parts[1])
        return role, emotion, position

    # ---- FORMAT 2: 【role+position】 (position glued, ends with 】) ----
    for pos in POSITION_MAP:
        m = re.match(rf'^【(敖丙|李云祥){pos}】$', line)
        if m:
            return m.group(1), DEFAULT_EMOTION, POSITION_MAP[pos]

    # ---- FORMAT 3: 【role】... (role in brackets, content outside) ----
    m = re.match(r'^【(敖丙|李云祥)】(.*)$', line)
    if m:
        role = m.group(1)
        rest = m.group(2).strip()
        emotion = DEFAULT_EMOTION
        position = DEFAULT_POSITION

        if not rest:
            return role, emotion, position

        # （表情）alone
        m2 = re.match(r'^（([^）]+)）$', rest)
        if m2:
            val = m2.group(1).strip()
            if val in EMOTION_MAP:
                emotion = val
            elif val in POSITION_MAP:
                position = val
            return role, emotion, position

        # 表情（位置）
        m2 = re.match(r'^([^\s（]+)（([^）]+)）$', rest)
        if m2:
            emo_val = m2.group(1).strip()
            pos_val = m2.group(2).strip()
            emotion = EMOTION_MAP.get(emo_val, emo_val)
            position = POSITION_MAP.get(pos_val, pos_val)
            return role, emotion, position

        # bare emotion
        if rest in EMOTION_MAP:
            return role, EMOTION_MAP[rest], position

        # bare position
        if rest in POSITION_MAP:
            return role, emotion, POSITION_MAP[rest]

        # fallback: treat as emotion
        return role, rest, position

    return None


def normalize_line(line):
    eol = '\n' if line.endswith('\n') else ''
    result = parse_role_line(line)
    if result is None:
        return line
    role, emotion, position = result
    return f'【{role}|{emotion}|{position}】{eol}'


def main():
    with open(INPUT_FILE, encoding='utf-8') as f:
        lines = f.readlines()

    changed = 0
    out_lines = []
    for i, line in enumerate(lines):
        new_line = normalize_line(line)
        if new_line != line:
            print(f'Line {i+1}: {repr(line.rstrip())} -> {repr(new_line.rstrip())}')
            changed += 1
        out_lines.append(new_line)

    shutil.copy(INPUT_FILE, INPUT_FILE + '.bak')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

    print(f'\nDone. {changed} lines normalized. Backup: {INPUT_FILE}.bak')


if __name__ == '__main__':
    main()
