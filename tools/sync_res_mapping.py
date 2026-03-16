#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
资源映射同步工具
功能：根据HelloADVRes的结构同步DongHaiRes
1. 保持HelloADVRes的顺序、注释行和空白行
2. 优先保留DongHaiRes中同名变量的内容
3. 删除HelloADVRes中没有的变量
"""

import os
import re
import sys


class ResMappingSyncer:
    def __init__(self, file_path):
        self.file_path = file_path
        self.lines = []
        self.hello_adv_res = {}
        self.dong_hai_res = {}
        
    def read_file(self):
        """读取文件内容"""
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                self.lines = f.readlines()
            print(f"✓ 成功读取文件: {self.file_path}")
            return True
        except FileNotFoundError:
            print(f"✗ 错误：找不到文件 {self.file_path}")
            return False
        except Exception as e:
            print(f"✗ 读取文件时发生错误: {e}")
            return False
    
    def parse_resource_object(self, obj_name):
        """解析资源对象的内容"""
        resources = {}
        in_object = False
        brace_count = 0
        
        for line in self.lines:
            stripped = line.strip()
            
            # 检测对象开始
            if f'const {obj_name} = {{' in stripped:
                in_object = True
                brace_count = 1
                continue
            
            if not in_object:
                continue
            
            # 计算大括号数量来判断对象结束
            brace_count += stripped.count('{') - stripped.count('}')
            
            if brace_count <= 0:
                break
            
            # 解析键值对
            # 匹配格式: key: value,
            match = re.match(r'^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+?)(?:,\s*)?(?://.*)?$', stripped)
            if match:
                key = match.group(1)
                value = match.group(2).rstrip(',').strip()
                resources[key] = value
        
        return resources
    
    def extract_resources(self):
        """提取HelloADVRes和DongHaiRes的内容"""
        self.hello_adv_res = self.parse_resource_object('HelloADVRes')
        self.dong_hai_res = self.parse_resource_object('DongHaiRes')
        
        print(f"✓ 提取HelloADVRes: {len(self.hello_adv_res)} 个资源")
        print(f"✓ 提取DongHaiRes: {len(self.dong_hai_res)} 个资源")
    
    def generate_synced_content(self):
        """生成同步后的文件内容"""
        result_lines = []
        in_hello_adv = False
        in_dong_hai = False
        hello_brace_count = 0
        dong_hai_brace_count = 0
        
        for line in self.lines:
            stripped = line.strip()
            
            # 检测HelloADVRes对象
            if 'const HelloADVRes = {' in stripped:
                result_lines.append(line)
                in_hello_adv = True
                hello_brace_count = 1
                continue
            
            # 检测DongHaiRes对象
            elif 'const DongHaiRes = {' in stripped:
                result_lines.append(line)
                in_dong_hai = True
                dong_hai_brace_count = 1
                
                # 开始生成DongHaiRes的内容
                self._generate_dong_hai_content(result_lines)
                continue
            
            # 在HelloADVRes对象内部
            if in_hello_adv:
                hello_brace_count += stripped.count('{') - stripped.count('}')
                result_lines.append(line)
                
                if hello_brace_count <= 0:
                    in_hello_adv = False
                continue
            
            # 在DongHaiRes对象内部 - 跳过原有内容
            if in_dong_hai:
                dong_hai_brace_count += stripped.count('{') - stripped.count('}')
                
                if dong_hai_brace_count <= 0:
                    result_lines.append(line)  # 添加结束大括号
                    in_dong_hai = False
                continue
            
            # 其他行直接添加
            result_lines.append(line)
        
        return result_lines
    
    def _generate_dong_hai_content(self, result_lines):
        """生成DongHaiRes的同步内容"""
        # 用于跟踪已处理的DongHaiRes键
        used_dong_hai_keys = set()
        
        # 重新解析HelloADVRes来获取结构信息
        in_hello_adv = False
        brace_count = 0
        
        for line in self.lines:
            stripped = line.strip()
            
            # 检测HelloADVRes开始
            if 'const HelloADVRes = {' in stripped:
                in_hello_adv = True
                brace_count = 1
                continue
            
            if not in_hello_adv:
                continue
            
            # 计算大括号数量
            brace_count += stripped.count('{') - stripped.count('}')
            
            if brace_count <= 0:
                break
            
            # 如果是空行或注释行，保留
            if not stripped or stripped.startswith('//'):
                result_lines.append('    ' + stripped + '\n')
                continue
            
            # 解析键值对
            match = re.match(r'^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+?)(?:,\s*)?(?://.*)?$', stripped)
            if match:
                key = match.group(1)
                original_value = match.group(2).rstrip(',').strip()
                comment_match = re.search(r'//.*$', line)
                comment = comment_match.group(0) if comment_match else ''
                
                # 优先使用DongHaiRes中的值，如果没有则使用HelloADVRes的值
                if key in self.dong_hai_res:
                    value = self.dong_hai_res[key]
                    used_dong_hai_keys.add(key)
                else:
                    value = original_value
                
                # 构建新的行
                if comment:
                    new_line = f"    {key}: {value}, {comment}\n"
                else:
                    new_line = f"    {key}: {value},\n"
                
                result_lines.append(new_line)
        
        # 报告统计信息
        unused_dong_hai_keys = set(self.dong_hai_res.keys()) - used_dong_hai_keys
        if unused_dong_hai_keys:
            print(f"⚠️  DongHaiRes中以下键将被删除（HelloADVRes中不存在）:")
            for key in sorted(unused_dong_hai_keys):
                print(f"   - {key}")
    
    def save_file(self, content_lines):
        """保存同步后的文件"""
        try:
            # 创建备份
            backup_path = self.file_path + '.backup'
            with open(backup_path, 'w', encoding='utf-8') as f:
                f.writelines(self.lines)
            print(f"✓ 创建备份文件: {backup_path}")
            
            # 保存新文件
            with open(self.file_path, 'w', encoding='utf-8') as f:
                f.writelines(content_lines)
            print(f"✓ 成功保存同步后的文件: {self.file_path}")
            return True
            
        except Exception as e:
            print(f"✗ 保存文件时发生错误: {e}")
            return False
    
    def sync(self):
        """执行同步操作"""
        print("开始同步资源映射...")
        print("=" * 60)
        
        # 读取文件
        if not self.read_file():
            return False
        
        # 提取资源
        self.extract_resources()
        print()
        
        # 生成同步内容
        print("正在生成同步内容...")
        synced_content = self.generate_synced_content()
        print()
        
        # 保存文件
        if self.save_file(synced_content):
            print("=" * 60)
            print("✅ 同步完成！")
            print(f"✓ HelloADVRes: {len(self.hello_adv_res)} 个资源")
            print(f"✓ DongHaiRes同步: {len([k for k in self.hello_adv_res if k in self.dong_hai_res])} 个保留原值")
            print(f"✓ DongHaiRes新增: {len([k for k in self.hello_adv_res if k not in self.dong_hai_res])} 个使用HelloADVRes的值")
            return True
        
        return False


def main():
    """主函数"""
    # 默认文件路径
    default_path = os.path.join('..', 'script', 'res_mapping.js')
    
    # 检查命令行参数
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = default_path
    
    # 检查文件是否存在
    if not os.path.exists(file_path):
        print(f"错误：找不到文件 {file_path}")
        print("使用方法:")
        print(f"  python {sys.argv[0]} [文件路径]")
        print("示例:")
        print(f"  python {sys.argv[0]}  # 使用默认路径: {default_path}")
        print(f"  python {sys.argv[0]} ../script/res_mapping.js")
        return
    
    # 执行同步
    syncer = ResMappingSyncer(file_path)
    success = syncer.sync()
    
    if not success:
        print("❌ 同步失败！")
        sys.exit(1)


if __name__ == "__main__":
    main()