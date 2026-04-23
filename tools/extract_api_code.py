#!/usr/bin/env python3
"""
从 game.readable.js 提取易次元核心 API 代码，移除 polyfill/core-js 部分。

策略：
1. 找到易次元核心代码的起始位置（EASE_TYPES 枚举定义附近）
2. 保留从该位置到文件末尾的所有内容
3. 添加必要的包装代码以保持语法正确
"""

import re
from pathlib import Path

INPUT_FILE = Path(__file__).parent.parent / 'docs' / 'game.readable.js'
OUTPUT_FILE = Path(__file__).parent.parent / 'docs' / 'game.api-only.js'

def find_api_start(content: str) -> int:
    """找到易次元核心代码的起始位置"""
    
    # 方法1：找 EASE_TYPES 枚举定义（这是易次元特有的）
    match = re.search(r'var\s+_\w+\s*=\s*[\d.]+\s*,\s*EASE_TYPES\s*,\s*FILTER_TYPES\s*;', content)
    if match:
        # 往回找到这一行的开头
        line_start = content.rfind('\n', 0, match.start()) + 1
        return line_start
    
    # 方法2：找第一个易次元枚举类型
    patterns = [
        r"TEXT_DIRECTION_TYPES\s*\|\|\s*\(TEXT_DIRECTION_TYPES\s*=\s*\{\}\)",
        r"textHorizontalAlignment\s*\|\|\s*\(textHorizontalAlignment\s*=\s*\{\}\)",
    ]
    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            # 找到包含这行的函数开头
            func_start = content.rfind('(function', 0, match.start())
            if func_start > 0:
                return func_start
    
    # 方法3：保守策略 - 找 commandName = 'base' 然后往前找一个合适的边界
    match = re.search(r"commandName\s*=\s*['\"]base['\"]", content)
    if match:
        # 往前找约 20000 个字符的边界
        return max(0, match.start() - 20000)
    
    raise ValueError("无法找到易次元核心代码的起始位置")

def extract_api_code():
    print(f"Reading {INPUT_FILE}...")
    content = INPUT_FILE.read_text(encoding='utf-8')
    print(f"  Total chars: {len(content):,}")
    print(f"  Total lines: {content.count(chr(10)):,}")
    
    # 找到起始位置
    start_pos = find_api_start(content)
    start_line = content[:start_pos].count('\n') + 1
    print(f"\n找到易次元核心代码起始位置: 字符 {start_pos:,}, 行 {start_line}")
    
    # 提取核心代码
    api_content = content[start_pos:]
    
    # 统计信息
    removed_chars = start_pos
    removed_lines = start_line - 1
    print(f"  移除 polyfill 代码: {removed_chars:,} 字符, {removed_lines} 行")
    
    # 生成输出 - 添加正确的 IIFE 包装
    header = f"""/**
 * YiCiYuan (易次元) Engine API - Readable Version
 * 
 * 此文件从 game.readable.js 提取，移除了 polyfill/core-js 部分，
 * 只保留易次元引擎核心 API 实现。
 * 
 * 原始文件行数: {content.count(chr(10)):,}
 * 提取起始行: {start_line}
 * 移除行数: {removed_lines}
 * 
 * 注意：此文件仅供参考，不可直接运行。
 */

!function (_0x21975d) {{
    'function' == typeof define && define.amd ? define(_0x21975d) : _0x21975d();
}}(function () {{
    'use strict';
    
    // === 易次元核心代码开始 (polyfill 已移除) ===

"""
    
    output = header + api_content
    
    print(f"\nWriting to {OUTPUT_FILE}...")
    OUTPUT_FILE.write_text(output, encoding='utf-8')
    
    print(f"\n✅ Done!")
    print(f"   原始大小: {len(content):,} 字符")
    print(f"   输出大小: {len(output):,} 字符")
    print(f"   压缩率: {(1 - len(output)/len(content))*100:.1f}%")

if __name__ == '__main__':
    extract_api_code()
