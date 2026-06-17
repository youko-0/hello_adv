# -*- coding: utf-8 -*-
"""
生成论坛 UI 所需纯色图片资源
输出目录: res/论坛/
"""
from PIL import Image
import os

OUTPUT_DIR = 'res/论坛'
SIZE = (32, 32)

IMAGES = [
    ('img_forum_header_bg',       '#2b2b2b', '版头底色'),
    ('img_forum_content_bg',      '#2d2d2d', '内容区统一底板'),
    ('img_forum_row_normal',      '#303030', '奇数行底色'),
    ('img_forum_row_alt',         '#2a2a2a', '偶数行底色'),
    ('img_forum_divider',         '#232323', '分隔线'),
    ('img_forum_pagination_bg',   '#282828', '分页栏底色'),
    ('img_forum_page_btn',        '#383838', '分页按钮普通态'),
    ('img_forum_page_btn_active', '#d4935a', '分页按钮高亮'),
]

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

os.makedirs(OUTPUT_DIR, exist_ok=True)

for name, color, desc in IMAGES:
    rgb = hex_to_rgb(color)
    img = Image.new('RGB', SIZE, rgb)
    path = os.path.join(OUTPUT_DIR, f'{name}.png')
    img.save(path)
    print(f'  ✓ {name}.png  {color}  {desc}')

print(f'\n共生成 {len(IMAGES)} 张图片 -> {OUTPUT_DIR}/')
