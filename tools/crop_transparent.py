#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
透明像素裁切脚本
功能：批量去除图片中的透明像素，裁切出最小内容区域，并计算中心点坐标
坐标系统：左下角为原点 (0, 0)
支持批量处理input文件夹下的所有PNG文件，输出到output文件夹
"""

import os
import sys
import glob
from PIL import Image
import numpy as np


def find_content_bbox(image):
    """
    找到图像中非透明像素的边界框
    
    Args:
        image: PIL Image对象，需要包含alpha通道
    
    Returns:
        tuple: (left, top, right, bottom) 边界框坐标
    """
    # 转换为RGBA格式确保有alpha通道
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    
    # 转换为numpy数组
    img_array = np.array(image)
    
    # 获取alpha通道
    alpha_channel = img_array[:, :, 3]
    
    # 找到非透明像素的位置
    non_transparent = np.where(alpha_channel > 0)
    
    if len(non_transparent[0]) == 0:
        print("错误：图像中没有非透明像素")
        return None
    
    # 计算边界框
    top = np.min(non_transparent[0])
    bottom = np.max(non_transparent[0])
    left = np.min(non_transparent[1])
    right = np.max(non_transparent[1])
    
    # PIL的crop方法使用 (left, top, right+1, bottom+1) 格式
    return (left, top, right + 1, bottom + 1)


def crop_transparent_pixels(input_path, output_path=None):
    """
    裁切图片中的透明像素，保留最小内容区域
    
    Args:
        input_path: 输入图片路径
        output_path: 输出图片路径，如果为None则自动生成
    
    Returns:
        tuple: (center_x, center_y) 裁切矩形在原图中的中心点坐标（左下角为原点）
    """
    try:
        # 打开图片
        image = Image.open(input_path)
        original_width, original_height = image.size
        
        print(f"原始图片尺寸: {original_width} x {original_height}")
        
        # 找到内容边界框
        bbox = find_content_bbox(image)
        if bbox is None:
            return None
        
        left, top, right, bottom = bbox
        
        # 裁切图片
        cropped_image = image.crop(bbox)
        cropped_width = right - left
        cropped_height = bottom - top
        
        print(f"裁切区域: left={left}, top={top}, right={right-1}, bottom={bottom-1}")
        print(f"裁切后尺寸: {cropped_width} x {cropped_height}")
        
        # 计算中心点坐标（以左下角为原点）
        # PIL坐标系是左上角为原点，需要转换
        center_x = left + cropped_width // 2
        center_y = original_height - (top + cropped_height // 2)  # 转换为左下角坐标系
        
        print(f"裁切矩形中心点坐标（左下角为原点）: pos: {{ x: {center_x}, y: {center_y} }}")
        
        # 生成输出文件名
        if output_path is None:
            base_name, ext = os.path.splitext(input_path)
            output_path = f"{base_name}_cropped{ext}"
        
        # 保存裁切后的图片
        cropped_image.save(output_path)
        print(f"裁切后的图片已保存到: {output_path}")
        
        return (center_x, center_y)
        
    except FileNotFoundError:
        print(f"错误：找不到文件 {input_path}")
        return None
    except Exception as e:
        print(f"处理图片时发生错误: {e}")
        return None


def process_batch():
    """批量处理input文件夹下的所有PNG文件"""
    input_dir = "input"
    output_dir = "output"
    
    # 检查input文件夹是否存在
    if not os.path.exists(input_dir):
        print(f"错误：找不到 {input_dir} 文件夹")
        print("请创建 input 文件夹并将PNG文件放入其中")
        return
    
    # 创建output文件夹（如果不存在）
    os.makedirs(output_dir, exist_ok=True)
    
    # 查找所有PNG文件
    png_files = glob.glob(os.path.join(input_dir, "*.png"))
    png_files.extend(glob.glob(os.path.join(input_dir, "*.PNG")))  # 包含大写扩展名
    
    if not png_files:
        print(f"在 {input_dir} 文件夹中没有找到PNG文件")
        return
    
    print(f"找到 {len(png_files)} 个PNG文件，开始批量处理...")
    print("=" * 60)
    
    success_count = 0
    results = []
    
    for i, input_path in enumerate(png_files, 1):
        filename = os.path.basename(input_path)
        output_path = os.path.join(output_dir, filename)
        
        print(f"\n[{i}/{len(png_files)}] 正在处理: {filename}")
        print("-" * 50)
        
        # 执行裁切
        result = crop_transparent_pixels(input_path, output_path)
        
        if result:
            center_x, center_y = result
            success_count += 1
            results.append({
                'filename': filename,
                'center_x': center_x,
                'center_y': center_y
            })
            print(f"✓ 处理完成！中心点坐标: pos: {{ x: {center_x}, y: {center_y} }},")
        else:
            print(f"✗ 处理失败: {filename}")
    
    # 输出汇总信息
    print("\n" + "=" * 60)
    print(f"批量处理完成！")
    print(f"成功处理: {success_count}/{len(png_files)} 个文件")
    print(f"输出文件夹: {output_dir}")
    
    if results:
        print("\n处理结果汇总:")
        print("文件名".ljust(30) + "中心点坐标")
        print("-" * 60)
        for result in results:
            coord_str = f"pos: {{ x: {result['center_x']}, y: {result['center_y']} }},"
            print(f"{result['filename']:<30} {coord_str}")


def process_single_file(input_path, output_path=None):
    """处理单个文件"""
    # 检查输入文件是否存在
    if not os.path.exists(input_path):
        print(f"错误：文件 {input_path} 不存在")
        return
    
    print(f"正在处理图片: {input_path}")
    print("-" * 50)
    
    # 执行裁切
    result = crop_transparent_pixels(input_path, output_path)
    
    if result:
        center_x, center_y = result
        print("-" * 50)
        print(f"处理完成！")
        print(f"裁切矩形中心点坐标: pos: {{ x: {center_x}, y: {center_y} }}")
    else:
        print("处理失败！")


def main():
    """主函数"""
    if len(sys.argv) == 1:
        # 没有参数，执行批量处理
        process_batch()
    elif len(sys.argv) >= 2:
        # 有参数，处理单个文件
        if sys.argv[1] in ['-h', '--help', 'help']:
            print("透明像素裁切工具")
            print("\n使用方法:")
            print(f"  1. 批量处理: python {sys.argv[0]}")
            print(f"     - 处理 input/ 文件夹下的所有PNG文件")
            print(f"     - 输出到 output/ 文件夹")
            print(f"  2. 单文件处理: python {sys.argv[0]} <输入文件> [输出文件]")
            print("\n示例:")
            print(f"  python {sys.argv[0]}                    # 批量处理")
            print(f"  python {sys.argv[0]} image.png          # 处理单个文件")
            print(f"  python {sys.argv[0]} image.png out.png  # 指定输出文件名")
            return
        
        input_path = sys.argv[1]
        output_path = sys.argv[2] if len(sys.argv) > 2 else None
        process_single_file(input_path, output_path)


if __name__ == "__main__":
    main()