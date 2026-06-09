# -*- coding: utf-8 -*-
"""
脚本2：将 res/李云祥立绘配置剧本.txt 中的角色立绘配置合并回 res/东海市怪谈：这里没有雨20260608.txt
匹配逻辑：
  - 遍历标注文件中每个 【敖丙|...|...】 或 【李云祥|...|...】 行
  - 获取该行的下一行（对话文本）
  - 在原剧本中查找 【敖丙】或【李云祥】行，且下一行与对话文本完全一致
  - 将原剧本中该角色名行替换为标注的完整配置行
"""
import re
import shutil

ANNOTATED_FILE = 'res/李云祥立绘配置剧本.txt'
SOURCE_FILE = 'res/东海市怪谈：这里没有雨20260608.txt'
OUTPUT_FILE = 'res/东海市怪谈：这里没有雨20260608.txt'

TARGET_ROLES = {'敖丙', '李云祥'}


def is_target_config_line(line):
    """Check if line is a normalized target role config line like 【敖丙|...|...】"""
    m = re.match(r'^【(敖丙|李云祥)\|[^】]+】\s*$', line)
    return m is not None


def get_role_from_config(line):
    m = re.match(r'^【(敖丙|李云祥)\|', line.strip())
    if m:
        return m.group(1)
    return None


def get_role_from_source(line):
    """Match plain role lines like 【敖丙】 or 【李云祥】 (no extra content)"""
    m = re.match(r'^【(敖丙|李云祥)】\s*$', line)
    if m:
        return m.group(1)
    return None


def load_annotations(filepath):
    """
    Parse annotated file and collect (role, config_line, dialogue_text) tuples.
    config_line: the normalized 【role|emotion|pos】 line
    dialogue_text: the next non-empty line after the config line
    """
    with open(filepath, encoding='utf-8') as f:
        lines = f.readlines()

    annotations = []
    i = 0
    while i < len(lines):
        line = lines[i].rstrip('\r\n')
        if is_target_config_line(line):
            role = get_role_from_config(line)
            # Find next non-empty line as the dialogue text
            j = i + 1
            while j < len(lines) and lines[j].strip() == '':
                j += 1
            if j < len(lines):
                dialogue = lines[j].rstrip('\r\n')
                annotations.append((role, line, dialogue))
        i += 1

    return annotations


def build_lookup(annotations):
    """
    Build a dict: (role, dialogue_text) -> config_line
    If there are multiple entries with same key, last one wins (shouldn't happen in well-formed data).
    """
    lookup = {}
    for role, config, dialogue in annotations:
        key = (role, dialogue.strip())
        lookup[key] = config
    return lookup


def merge(source_lines, lookup):
    """
    Walk through source lines, replace plain role lines with annotated config lines.
    """
    out = []
    changed = 0
    i = 0
    while i < len(source_lines):
        line = source_lines[i]
        role = get_role_from_source(line.rstrip('\r\n'))
        if role is not None:
            # Find next non-empty line to use as dialogue key
            j = i + 1
            while j < len(source_lines) and source_lines[j].strip() == '':
                j += 1
            if j < len(source_lines):
                next_line = source_lines[j].rstrip('\r\n')
                key = (role, next_line.strip())
                if key in lookup:
                    eol = '\n' if line.endswith('\n') else ''
                    new_line = lookup[key] + eol
                    if new_line != line:
                        print(f'Line {i+1}: {repr(line.rstrip())} -> {repr(new_line.rstrip())}')
                        changed += 1
                    out.append(new_line)
                    i += 1
                    continue
        out.append(line)
        i += 1
    return out, changed


def main():
    annotations = load_annotations(ANNOTATED_FILE)
    print(f'Loaded {len(annotations)} annotations from annotated file.')

    lookup = build_lookup(annotations)
    print(f'Unique (role, dialogue) keys: {len(lookup)}')

    # Warn about duplicates
    seen = {}
    for role, config, dialogue in annotations:
        key = (role, dialogue.strip())
        if key in seen:
            print(f'  DUPLICATE KEY: {key}')
        seen[key] = config

    with open(SOURCE_FILE, encoding='utf-8') as f:
        source_lines = f.readlines()
    print(f'Source file lines: {len(source_lines)}')

    out_lines, changed = merge(source_lines, lookup)

    shutil.copy(SOURCE_FILE, SOURCE_FILE + '.bak')
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

    print(f'\nDone. {changed} lines replaced. Backup: {SOURCE_FILE}.bak')

    # Report unmatched annotations
    unmatched = []
    for role, config, dialogue in annotations:
        key = (role, dialogue.strip())
        found = False
        # We need to check if any replacement was made for this key
        # Simple re-scan
        for i, line in enumerate(source_lines):
            if get_role_from_source(line.rstrip('\r\n')) == role:
                j = i + 1
                while j < len(source_lines) and source_lines[j].strip() == '':
                    j += 1
                if j < len(source_lines) and source_lines[j].strip() == dialogue.strip():
                    found = True
                    break
        if not found:
            unmatched.append((config, dialogue))

    if unmatched:
        print(f'\nWARNING: {len(unmatched)} annotations had no match in source file:')
        for cfg, dlg in unmatched:
            print(f'  {cfg!r} -> {dlg!r}')
    else:
        print('All annotations matched successfully.')


if __name__ == '__main__':
    main()
