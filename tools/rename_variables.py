"""
易次元引擎反混淆变量名恢复脚本
从上下文推断 _0x 变量的语义名称并批量替换

策略：
1. 对象属性传播：'KEY': _0xabc → _0xabc 重命名为 KEY
2. commandName 推断：commandName = 'xxx' 所在类 → XxxCommand
3. 赋值传播：var _0xabc = knownVar → _0xabc 重命名为 knownVar 相关名
4. 函数参数语义化：根据调用上下文推断参数名
"""
import re
import os
from collections import defaultdict, Counter
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
INPUT_FILE = PROJECT_ROOT / 'docs' / 'game.deobfuscated.js'
OUTPUT_FILE = PROJECT_ROOT / 'docs' / 'game.readable.js'

print(f'Reading {INPUT_FILE}...')
with open(INPUT_FILE, encoding='utf-8') as f:
    content = f.read()

print(f'File size: {len(content):,} chars')

# ═══════════════════════════════════════════════════════════════
# Step 1: 收集所有 _0x 变量名
# ═══════════════════════════════════════════════════════════════
print('\n[1/6] Collecting _0x variables...')

all_0x_vars = set(re.findall(r'\b(_0x[a-f0-9]+)\b', content))
print(f'  Found {len(all_0x_vars)} unique _0x variables')

# ═══════════════════════════════════════════════════════════════
# Step 2: 从对象字面量属性推断变量名
#   模式: 'SOME_KEY': _0xabc  或  SOME_KEY: _0xabc
# ═══════════════════════════════════════════════════════════════
print('[2/6] Inferring from object property assignments...')

rename_map = {}  # _0x... -> new_name
confidence = {}  # _0x... -> confidence score (higher = more certain)

# 模式1: 'KEY': _0xabc (对象属性)
for m in re.finditer(r"['\"](\w+)['\"]:\s*(_0x[a-f0-9]+)\b(?!\s*[(\[])", content):
    key = m.group(1)
    var = m.group(2)
    # 排除一些无意义的 key
    if key in ('f', 'get', 'set', 'value', 'configurable', 'enumerable', 'writable'):
        continue
    if len(key) < 2:
        continue
    # 选择更有意义的名字
    if var not in rename_map or len(key) > len(rename_map[var]):
        rename_map[var] = key
        confidence[var] = 3

# 模式2: KEY: _0xabc (无引号的属性名)
for m in re.finditer(r"(?<!['\"])\b([A-Z][A-Z_0-9]+)\b:\s*(_0x[a-f0-9]+)\b(?!\s*[(\[])", content):
    key = m.group(1)
    var = m.group(2)
    if var not in rename_map:
        rename_map[var] = key
        confidence[var] = 2

print(f'  Inferred {len(rename_map)} names from object properties')

# ═══════════════════════════════════════════════════════════════
# Step 3: 从 commandName = 'xxx' 推断命令类名
# ═══════════════════════════════════════════════════════════════
print('[3/6] Inferring command class names...')

# 找到所有 commandName = 'xxx' 并提取对应的变量名
command_classes = {}

# 模式1: _0xabc.commandName = 'xxx'
for m in re.finditer(r"(_0x[a-f0-9]+)\.commandName\s*=\s*['\"](\w+)['\"]", content):
    class_var = m.group(1)
    cmd_name = m.group(2)
    # 转换为 PascalCase + Command
    pascal_name = ''.join(word.capitalize() for word in cmd_name.split('_'))
    if pascal_name[0].islower():
        pascal_name = pascal_name[0].upper() + pascal_name[1:]
    new_class_name = pascal_name + 'Command'
    command_classes[class_var] = new_class_name

# 模式2: return _0xabc.commandName = 'xxx', _0xabc  (内联赋值)
for m in re.finditer(r"return\s+(_0x[a-f0-9]+)\.commandName\s*=\s*['\"](\w+)['\"]", content):
    class_var = m.group(1)
    cmd_name = m.group(2)
    pascal_name = ''.join(word.capitalize() for word in cmd_name.split('_'))
    if pascal_name and pascal_name[0].islower():
        pascal_name = pascal_name[0].upper() + pascal_name[1:]
    new_class_name = pascal_name + 'Cmd'
    command_classes[class_var] = new_class_name

print(f'  Found {len(command_classes)} command classes')

# 合并到 rename_map
for var, name in command_classes.items():
    if var not in rename_map or confidence.get(var, 0) < 5:
        rename_map[var] = name
        confidence[var] = 5

# ═══════════════════════════════════════════════════════════════
# Step 4: 从赋值语句推断
#   模式: var _0xabc = SomeKnownThing
#   模式: _0xabc = function xxx() {}
# ═══════════════════════════════════════════════════════════════
print('[4/6] Inferring from assignments...')

# 函数名赋值: var _0xabc = function someName() {}
for m in re.finditer(r"var\s+(_0x[a-f0-9]+)\s*=\s*function\s+(\w+)\s*\(", content):
    var = m.group(1)
    func_name = m.group(2)
    if not func_name.startswith('_0x') and var not in rename_map:
        rename_map[var] = func_name
        confidence[var] = 4

# 赋值到已知对象属性: SomeObj.knownProp = _0xabc
for m in re.finditer(r"(\w+)\.(\w+)\s*=\s*(_0x[a-f0-9]+)\s*[,;]", content):
    obj = m.group(1)
    prop = m.group(2)
    var = m.group(3)
    if prop not in ('prototype', 'exports', 'default', '__esModule'):
        if var not in rename_map or confidence.get(var, 0) < 2:
            rename_map[var] = f'{prop}'
            confidence[var] = 2

# var _0xabc = require('xxx') 或 var _0xabc = SomeModule
for m in re.finditer(r"var\s+(_0x[a-f0-9]+)\s*=\s*(\w+)\s*[,;]", content):
    var = m.group(1)
    value = m.group(2)
    # 只有当 value 不是 _0x 开头且是有意义的名字
    if not value.startswith('_0x') and len(value) > 2 and value[0].isupper():
        if var not in rename_map or confidence.get(var, 0) < 1:
            rename_map[var] = value + '_ref'
            confidence[var] = 1

print(f'  Total inferred names: {len(rename_map)}')

# ═══════════════════════════════════════════════════════════════
# Step 5: 处理重复名称冲突
# ═══════════════════════════════════════════════════════════════
print('[5/6] Resolving name conflicts...')

# 统计每个新名字被使用的次数
name_counts = Counter(rename_map.values())
# 为重复的名字添加后缀
name_usage = defaultdict(int)
final_rename_map = {}

for var, name in sorted(rename_map.items(), key=lambda x: -confidence.get(x[0], 0)):
    if name_counts[name] > 1:
        name_usage[name] += 1
        final_name = f'{name}_{name_usage[name]}'
    else:
        final_name = name
    final_rename_map[var] = final_name

print(f'  Resolved {sum(1 for c in name_counts.values() if c > 1)} conflicts')

# ═══════════════════════════════════════════════════════════════
# Step 6: 执行替换（使用单次正则批量替换，性能更好）
# ═══════════════════════════════════════════════════════════════
print('[6/6] Applying renames...')

# 构建一个大正则，一次性替换所有变量
# 按变量名长度降序排列，避免短变量名误替换长变量名的一部分
sorted_vars = sorted(final_rename_map.keys(), key=len, reverse=True)

# 构建正则: \b(_0x1234|_0x5678|...)\b
pattern = r'\b(' + '|'.join(re.escape(v) for v in sorted_vars) + r')\b'

def replacer(m):
    return final_rename_map.get(m.group(1), m.group(1))

result = re.sub(pattern, replacer, content)
replaced_count = len(final_rename_map)

print(f'  Replaced {replaced_count} variable names')

# ═══════════════════════════════════════════════════════════════
# 额外优化：简化一些常见模式
# ═══════════════════════════════════════════════════════════════
print('Applying additional optimizations...')

# 优化1: void 0 -> undefined
result = re.sub(r'\bvoid\s+0\b', 'undefined', result)

# 优化2: !0 -> true, !1 -> false
result = re.sub(r'(?<![=!<>])!0\b', 'true', result)
result = re.sub(r'(?<![=!<>])!1\b', 'false', result)

# 优化3: 移除多余的分号
result = re.sub(r';\s*;', ';', result)

# ═══════════════════════════════════════════════════════════════
# 写入结果
# ═══════════════════════════════════════════════════════════════
print(f'\nWriting to {OUTPUT_FILE}...')
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(result)

# 统计
remaining_0x = len(set(re.findall(r'\b_0x[a-f0-9]+\b', result)))
print(f'\n✅ Done!')
print(f'   Original _0x vars: {len(all_0x_vars)}')
print(f'   Renamed:           {len(final_rename_map)}')
print(f'   Remaining _0x:     {remaining_0x}')
print(f'   Reduction:         {100 * (1 - remaining_0x / len(all_0x_vars)):.1f}%')

# 输出部分重命名示例
print('\n📝 Sample renames:')
samples = list(final_rename_map.items())[:20]
for old, new in samples:
    print(f'   {old} -> {new}')
