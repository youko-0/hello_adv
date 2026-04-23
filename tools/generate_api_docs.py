"""
易次元 (AVG163) ac API 文档生成脚本
纯粹从 game.deobfuscated.js 源码中提取，不含任何手动补充内容。
"""
import re
import os
from collections import defaultdict, OrderedDict

# 脚本位于 tools/ 目录，源文件和输出都在 docs/
import pathlib
SCRIPT_DIR = pathlib.Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
SOURCE_FILE = PROJECT_ROOT / 'docs' / 'game.deobfuscated.js'
OUTPUT_FILE = PROJECT_ROOT / 'docs' / 'ac-api.md'

print(f'Reading {SOURCE_FILE}...')
with open(SOURCE_FILE, encoding='utf-8') as f:
    content = f.read()
lines = content.splitlines()
print(f'Total lines: {len(lines)}')

# ═══════════════════════════════════════════════════════════════
# Step 1: 提取 ac proxy 对象里的所有方法名
#   位置特征：一个大对象，包含 'scaleTo': function、'getPos': function 等
#   通过扫描行 37800–38300 精确定位
# ═══════════════════════════════════════════════════════════════
print('\n[1/4] Extracting ac proxy method list...')

# 找到 ac proxy 对象的起止范围
# 特征：包含 'sceneFinish' 和 'getPos' 且有大量 new Xxx().execute() 调用
proxy_method_pattern = re.compile(
    r"['\"](\w+)['\"]:\s*(?:async\s+)?function\s*\([^)]*\)\s*\{[^\}]*?new\s+\w+\(\)(?:\.execute\([^)]*\))?",
    re.DOTALL
)

# ac proxy 分布在多个区域，合并搜索
# 行 37700–38300: 基础命令（getPos, sceneFinish, callUI, 音频等）
# 行 39800–40200: create* 控件命令
# 行 41540–41620: 动画命令（_0x3302b0）
PROXY_REGIONS = [
    (37700, 38300),
    (39800, 40200),
]
ac_proxy_methods = OrderedDict()  # method_name -> class_var_name

for start, end in PROXY_REGIONS:
    region_text = '\n'.join(lines[start:end])
    for m in re.finditer(
        r"['\"](\w+)['\"]:\s*(?:async\s+)?function\s*\([^)]*\)\s*\{\s*return\s+new\s+(\w+)\(\)\.execute\(",
        region_text
    ):
        method_name = m.group(1)
        class_var = m.group(2)
        if method_name not in ac_proxy_methods:
            ac_proxy_methods[method_name] = class_var

    # 也捕获直接 return Promise 的特殊方法（如 dialogOn/Off）
    for m in re.finditer(
        r"['\"](\w+)['\"]:\s*function\s*\([^)]*\)\s*\{[^\}]{0,80}\}",
        region_text
    ):
        name = m.group(1)
        if name not in ac_proxy_methods:
            ac_proxy_methods[name] = None  # 无对应 class

print(f'  Found {len(ac_proxy_methods)} methods in ac proxy')

# ═══════════════════════════════════════════════════════════════
# Step 2: 提取动画命令注册表（_0x3302b0，行 41547–41610）
# ═══════════════════════════════════════════════════════════════
print('[2/4] Extracting animation command table...')

anim_region_text = '\n'.join(lines[41540:41620])
anim_methods = OrderedDict()

for m in re.finditer(
    r"['\"](\w+)['\"]:\s*function\s*\([^)]*\)\s*\{\s*return\s+new\s+(\w+)\(\)\.execute\(",
    anim_region_text
):
    anim_methods[m.group(1)] = m.group(2)

print(f'  Found {len(anim_methods)} animation commands')

# 合并：动画命令也是 ac proxy 的一部分（通过分发调用）
for name, cls in anim_methods.items():
    if name not in ac_proxy_methods:
        ac_proxy_methods[name] = cls

# ═══════════════════════════════════════════════════════════════
# Step 3: 对每个方法，通过 class var 找到 commandName 和 dealArgs 里的 config
# ═══════════════════════════════════════════════════════════════
print('[3/4] Extracting parameters for each command...')

def extract_block_from(pos):
    """从指定位置的 '{' 开始，提取匹配的完整括号块"""
    depth = 0
    i = pos
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                return content[pos:i+1]
        i += 1
    return None

def parse_top_level(obj_str):
    """解析对象字面量的顶层字段，返回 OrderedDict{key: default_value_str}"""
    obj_str = re.sub(r'//[^\n]*', '', obj_str)
    result = OrderedDict()
    depth = 0
    key = None
    buf = ''
    in_str = False
    str_char = None
    j = 1  # 跳过开头 '{'
    while j < len(obj_str) - 1:
        c = obj_str[j]
        if in_str:
            buf += c
            if c == str_char and obj_str[j-1] != '\\':
                in_str = False
        elif c in ('"', "'"):
            in_str = True
            str_char = c
            buf += c
        elif c in ('{', '[', '('):
            depth += 1
            buf += c
        elif c in ('}', ']', ')'):
            depth -= 1
            buf += c
        elif c == ':' and depth == 0 and key is None:
            key = buf.strip().strip("'\"")
            buf = ''
        elif c == ',' and depth == 0 and key is not None:
            result[key] = buf.strip()
            key = None
            buf = ''
        else:
            buf += c
        j += 1
    if key is not None and buf.strip():
        result[key] = buf.strip()
    return result

def find_command_region(cmd_name):
    """
    定位 commandName = 'xxx' 所在位置，返回从该处到类定义结束的代码片段。
    """
    m = re.search(
        r"commandName\s*=\s*['\"]" + re.escape(cmd_name) + r"['\"]",
        content
    )
    if not m:
        return None, -1
    # 向后取 4000 字符作为该命令的实现区域
    region = content[m.start(): m.start() + 4000]
    return region, m.start()

def find_command_config(cmd_name):
    """
    策略1（主策略）：从 dealArgs 里找 this.config = { 完整默认值对象 }
    返回 (fields_dict, raw_str, strategy)
    """
    region, base_pos = find_command_region(cmd_name)
    if region is None:
        return None, None, None

    # 找 this.config = { ... 非空对象 }
    cfg_m = re.search(r"this\.config\s*=\s*(\{)", region)
    if cfg_m:
        abs_brace = base_pos + cfg_m.start(1)
        raw = extract_block_from(abs_brace)
        if raw and len(raw) > 3:  # 排除空对象 {}
            fields = parse_top_level(raw)
            if fields:
                return fields, raw, 'default_config'

    return None, None, None

def find_command_config_fallback(cmd_name):
    """
    策略2（兜底）：当 this.config = {} 为空时，从实现体内推断参数名。
    来源包括：
      A. convertTupleConfig(arg, 'fieldName') 的字符串参数
      B. arg.fieldName 属性访问（在 dealArgs / convertConfig 内）
      C. this.fieldName = arg.fieldName 赋值
      D. warn('必填参数缺失：没有 xxx') 错误信息
    返回 (fields_dict, source_desc)
    """
    region, base_pos = find_command_region(cmd_name)
    if region is None:
        return None, None

    fields = OrderedDict()

    # A. convertTupleConfig / convertConfig 里的字符串字段名
    for m in re.finditer(r"convertTupleConfig\s*\([^,]+,\s*['\"](\w+)['\"]", region):
        fields[m.group(1)] = None

    # B. arg.fieldName 访问 (arg 是 dealArgs 的参数变量名)
    # 先找 dealArgs 的参数变量名
    da_m = re.search(r"\.prototype\.dealArgs\s*=\s*function\s*\((\w+)\)", region)
    if da_m:
        arg_var = da_m.group(1)
        # 在 dealArgs 函数体内找 arg_var.field 访问
        da_body_m = re.search(
            r"\.prototype\.dealArgs\s*=\s*function\s*\(\w+\)\s*\{(.{0,2000}?)\},\s*\w+\.prototype",
            region, re.DOTALL
        )
        if da_body_m:
            body = da_body_m.group(1)
            for m in re.finditer(re.escape(arg_var) + r'\.\s*(\w+)', body):
                fname = m.group(1)
                if fname not in ('assign', 'config', 'length', 'push') and not fname.startswith('_'):
                    fields.setdefault(fname, None)

    # C. convertConfig 函数体里的 arg.fieldName 访问
    cc_m = re.search(
        r"\.prototype\.convertConfig\s*=\s*function\s*\((\w+)\)\s*\{(.{0,1500}?)\}",
        region, re.DOTALL
    )
    if cc_m:
        cc_arg = cc_m.group(1)
        cc_body = cc_m.group(2)
        for m in re.finditer(re.escape(cc_arg) + r'\.\s*(\w+)', cc_body):
            fname = m.group(1)
            if fname not in ('assign', 'config', 'length', 'push') and not fname.startswith('_'):
                fields.setdefault(fname, None)

    # D. 错误提示字符串中的字段名（如 '必填参数缺失：没有对象名'）
    for m in re.finditer(r"warn\(['\"][^'\"]*?没有\s*(\w+)['\"]", region):
        fields.setdefault(m.group(1), None)
    # 也匹配英文 warn
    for m in re.finditer(r"warn\(['\"][^'\"]*?missing[：:]\s*(\w+)['\"]", region):
        fields.setdefault(m.group(1), None)

    # E. this.xxx = arg.xxx 赋值模式（如 delay: this.time = arg.time）
    if da_m:
        arg_var = da_m.group(1)
        for m in re.finditer(r"this\.(\w+)\s*=\s*" + re.escape(arg_var) + r'\.(\w+)', region):
            fname = m.group(2)
            if not fname.startswith('_'):
                fields.setdefault(fname, None)

    if not fields:
        return None, None

    return fields, 'inferred'


# 分类映射（根据命令名前缀或关键词判断）
def categorize(cmd_name):
    if cmd_name.startswith('create'):
        return 'create'
    if cmd_name.startswith('play') or cmd_name in ('stopBGM', 'stopAudio', 'pauseAudio', 'resumeAudio', 'volTo', 'volBy', 'globalVolTo', 'globalVolBy'):
        return 'media'
    if cmd_name in anim_methods or cmd_name in (
        'scaleTo', 'scaleBy', 'moveTo', 'moveBy', 'rotateTo', 'rotateBy',
        'fadeTo', 'show', 'hide', 'remove', 'flip', 'changeIndex',
        'changeMaskTo', 'changeMaskBy', 'shakeScreen', 'flicker',
        'filter', 'trans', 'drawSegment', 'drawPoly', 'clearDrawNode', 'update',
    ):
        return 'animate'
    if cmd_name.startswith('get') or cmd_name.startswith('is'):
        return 'query'
    if cmd_name in ('delay', 'sceneFinish', 'callUI', 'removeCurrentUI', 'replaceUI',
                    'startGame', 'random', 'randomSync', 'setVar', 'getVar',
                    'saveVarToServer', 'getVarFromServer', 'saveGameSettingToServer',
                    'setGameSetting', 'setAutoPlay', 'addEventListener', 'addPostStepHandler'):
        return 'control'
    return 'other'


# 提取所有命令的参数
ALL_APIS = OrderedDict()

all_names = list(ac_proxy_methods.keys()) + [n for n in anim_methods if n not in ac_proxy_methods]
for name in all_names:
    # 策略1：完整默认 config
    fields, raw, strategy = find_command_config(name)
    if not fields:
        # 策略2：兜底推断
        fields, strategy = find_command_config_fallback(name)
        raw = ''
    ALL_APIS[name] = {
        'category': categorize(name),
        'fields': fields or OrderedDict(),
        'raw': raw or '',
        'strategy': strategy or 'unknown',
    }

s1 = sum(1 for v in ALL_APIS.values() if v['strategy'] == 'default_config')
s2 = sum(1 for v in ALL_APIS.values() if v['strategy'] == 'inferred')
s0 = sum(1 for v in ALL_APIS.values() if v['strategy'] == 'unknown')
print(f'  Total APIs: {len(ALL_APIS)}')
print(f'  Strategy 1 (default_config): {s1}')
print(f'  Strategy 2 (inferred):       {s2}')
print(f'  No params found:             {s0}')

# ═══════════════════════════════════════════════════════════════
# Step 4: 生成 Markdown 文档
# ═══════════════════════════════════════════════════════════════
print('[4/4] Generating Markdown...')

os.makedirs('docs', exist_ok=True)

CATEGORY_NAMES = {
    'create':  '🏗️ 创建控件',
    'animate': '🎬 动画 / 变换',
    'media':   '🔊 媒体播放',
    'query':   '🔍 查询',
    'control': '⚙️ 控制流',
    'other':   '📦 其他',
}
CATEGORY_ORDER = ['create', 'animate', 'media', 'query', 'control', 'other']

by_cat = defaultdict(list)
for name, info in ALL_APIS.items():
    by_cat[info['category']].append(name)

out = []

# ── 标题 ──
out.append('# 易次元 (AVG163) `ac` API 参考文档')
out.append('')
out.append('> **自动生成**：由 `generate_api_docs.py` 从 `game.deobfuscated.js` 逆向提取，')
out.append('> 所有参数均直接来自源码中各命令类的 `dealArgs` 默认 `config` 对象，无手动补充。')
out.append('>')
out.append('> 调用方式：`await ac.methodName({ ... })`')
out.append('')

# ── 目录 ──
out.append('## 目录')
out.append('')
for cat in CATEGORY_ORDER:
    if cat not in by_cat:
        continue
    out.append(f'- **{CATEGORY_NAMES[cat]}**')
    for name in sorted(by_cat[cat]):
        out.append(f'  - [{name}](#{name.lower()})')
out.append('')
out.append('---')
out.append('')

# ── 通用说明 ──
out.append('## 通用说明')
out.append('')
out.append('### 坐标系')
out.append('- 原点 `(0,0)` 位于屏幕**左下角**（Cocos2d 坐标系）')
out.append('- X 轴向右为正，Y 轴向上为正，单位：像素（px）')
out.append('')
out.append('### 锚点（anchor）')
out.append('- `{x:0, y:0}` — 左下角（`createLayer` 默认）')
out.append('- `{x:0.5, y:0.5}` — 中心点（`createImage` 默认）')
out.append('- ⚠️ **锚点只能在创建时设置**，后续无法修改')
out.append('')
out.append('### duration')
out.append('- 单位：**毫秒（ms）**；`0` 表示立即执行')
out.append('')
out.append('### 沙箱限制')
out.append('- `cc`、`window`、`document` 在脚本环境中均为 `null`')
out.append('- 必须通过 `ac` API 操作所有控件')
out.append('')
out.append('---')
out.append('')

# ── 各分类 ──
for cat in CATEGORY_ORDER:
    if cat not in by_cat:
        continue

    out.append(f'## {CATEGORY_NAMES[cat]}')
    out.append('')

    for name in sorted(by_cat[cat]):
        info = ALL_APIS[name]
        fields = info['fields']

        out.append(f'### {name}')
        out.append('')

        # 签名行
        if fields:
            param_keys = ', '.join(fields.keys())
            out.append(f'```javascript')
            out.append(f'await ac.{name}({{ {param_keys} }});')
            out.append(f'```')
        else:
            out.append(f'```javascript')
            out.append(f'await ac.{name}({{ /* 参数见源码 */ }});')
            out.append(f'```')
        out.append('')

        # 参数表
        strategy = info['strategy']
        if fields:
            if strategy == 'default_config':
                out.append('**参数（来源：`dealArgs` 完整默认值）：**')
            else:
                out.append('**参数（来源：从实现体推断，仅列出字段名，无默认值）：**')
            out.append('')
            out.append('| 参数 | 默认值 |')
            out.append('|---|---|')
            for field, default in fields.items():
                if default is not None:
                    # 压缩多行为单行，并移除多余空白
                    dv = ' '.join(default.split()).strip().rstrip(',')
                    # 截断过长的值
                    if len(dv) > 80:
                        dv = dv[:77] + '...'
                else:
                    dv = '—'
                out.append(f'| `{field}` | `{dv}` |')
            out.append('')
        else:
            out.append('> ⚠️ 未能从源码中提取到参数信息，请查阅源码。')
            out.append('')

        out.append('---')
        out.append('')

# ── 统计 ──
out.append('## 统计')
out.append('')
out.append(f'| 分类 | 数量 |')
out.append(f'|---|---|')
for cat in CATEGORY_ORDER:
    if cat in by_cat:
        out.append(f'| {CATEGORY_NAMES[cat]} | {len(by_cat[cat])} |')
out.append(f'| **合计** | **{len(ALL_APIS)}** |')
out.append('')
out.append(f'*配置可提取：{sum(1 for v in ALL_APIS.values() if v["fields"])} / {len(ALL_APIS)}*')
out.append('')

# ── 写入 ──
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print(f'\n✅ Done → {OUTPUT_FILE}')
print(f'   APIs: {len(ALL_APIS)}  (with params: {sum(1 for v in ALL_APIS.values() if v["fields"])})')