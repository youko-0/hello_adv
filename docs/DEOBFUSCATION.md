# 易次元引擎反混淆与 API 文档生成

## 概述

本次操作从易次元游戏引擎的混淆源码 `game.rJP4aN1f2kN8K6Ymzf8reXZ9D5iWIc5R.min.js` 中逆向提取出 `ac` API 的完整文档。

## 操作步骤

### 1. 反混淆处理

使用 [synchrony](https://github.com/nicka/synchrony) 工具对混淆的 JS 文件进行反混淆：

```bash
npm install -g synchrony
synchrony deobfuscate game.rJP4aN1f2kN8K6Ymzf8reXZ9D5iWIc5R.min.js --output game.deobfuscated.js
```

### 2. Unicode 转义解码

反混淆后的文件中包含大量 `\uFF1A` 形式的 Unicode 转义序列（中文标点），需要解码为可读字符：

```python
import re
with open('game.deobfuscated.js', encoding='utf-8') as f:
    content = f.read()

def replace_unicode(m):
    code = int(m.group(1), 16)
    if 0xD800 <= code <= 0xDFFF:  # 跳过代理对
        return m.group(0)
    return chr(code)

content = re.sub(r'\\u([0-9a-fA-F]{4})', replace_unicode, content)

with open('game.deobfuscated.js', 'w', encoding='utf-8') as f:
    f.write(content)
```

### 3. API 文档生成

运行 `tools/generate_api_docs.py` 脚本，自动从反混淆后的源码中提取 API 信息：

```bash
cd tools
python generate_api_docs.py
```

### 4. 变量语义重命名（可选）

反混淆后的源码仍包含大量 `_0x` 形式的混淆变量名。使用 `rename_variables.py` 脚本可以根据代码上下文推断并恢复部分变量的语义名称：

```bash
python tools/rename_variables.py
```

**重命名策略**：
- 从对象属性赋值推断：`'EASE_TYPES': _0xabc` → `EASE_TYPES`
- 从命令类定义推断：`commandName = 'jump'` → `JumpCmd`
- 从变量赋值推断：`var xxx = _0xabc` → 继承 `xxx` 的名称

**统计结果**：
- 原始 `_0x` 变量：13,332 个
- 成功重命名：1,977 个（14.8%）
- 包括 116 个命令类名

### 5. 提取核心 API 代码

原始文件前 6500+ 行是 polyfill/core-js 代码，与易次元 API 无关。使用 `extract_api_code.py` 提取纯净的 API 代码：

```bash
python tools/extract_api_code.py
```

输出 `docs/game.api-only.js`，仅包含易次元引擎核心实现。

## 生成结果

### 产出文件

| 文件 | 位置 | 说明 |
|---|---|---|
| `game.deobfuscated.js` | `docs/` | 反混淆后的引擎源码（3.8MB，64267 行） |
| `game.api-only.js` | `docs/` | 精简版：仅易次元核心 API（移除 polyfill，55000+ 行） |
| `ac-api.md` | `docs/` | 自动生成的 API 参考文档 |
| `generate_api_docs.py` | `tools/` | API 文档生成脚本 |
| `rename_variables.py` | `tools/` | 变量语义重命名脚本 |
| `extract_api_code.py` | `tools/` | 提取核心 API 代码脚本 |

### 统计数据

- **总 API 数量**：99 个
- **策略 1（完整默认配置）**：71 个
- **策略 2（从实现体推断）**：17 个
- **无法提取参数**：11 个
- **参数覆盖率**：88/99 (89%)

### API 分类

| 分类 | 数量 |
|---|---|
| 🏗️ 创建控件 | 24 |
| 🎬 动画/变换 | 21 |
| 🔊 媒体播放 | 11 |
| 🔍 查询 | 4 |
| ⚙️ 控制流 | 7 |
| 📦 其他 | 32 |

## 关键发现

### 沙箱架构

易次元脚本运行在严格的沙箱环境中：
- `cc`、`window`、`document` 均被设置为 `null`
- 所有控件操作必须通过 `ac` API 进行
- 无法直接访问 Cocos2d 底层对象

### anchor 属性限制

**重要发现**：`anchor`（锚点）属性只能在创建控件时设置，创建后无法通过 `ac.update()` 修改。这是因为：
1. `ac.update()` 的参数处理逻辑中没有 `anchor` 字段
2. 底层 proxy 只暴露了有限的属性更新接口

### 提取策略

文档生成脚本使用两种策略提取参数：

1. **策略 1**：从 `dealArgs` 函数的 `this.config = {...}` 中直接提取完整默认值
2. **策略 2**：当 config 为空对象时，从以下位置推断参数名：
   - `convertTupleConfig(arg, 'fieldName')` 调用
   - `arg.fieldName` 属性访问
   - `this.xxx = arg.xxx` 赋值模式
   - `warn('必填参数缺失：没有xxx')` 错误信息

## 后续维护

如需更新文档，只需：

1. 如果引擎版本更新，重新执行反混淆
2. 运行 `python tools/generate_api_docs.py`

脚本会自动处理新增/修改的 API。
