# -*- coding: utf-8 -*-
"""
将 res/东海市怪谈：这里没有雨20260608.txt 转换为易次元对话脚本 (JS)

规则：
1. 主角【敖丙|表情|位置】【李云祥|表情|位置】：
   - 不显示姓名和头像 (hasRoleName: false, hasRoleAvatar: false)
   - 使用 ac.createImage 创建立绘，放在对应槽位
   - 切换到同一槽位但不同资源时，先 removeImage 旧的，再 createImage 新的
   - 默认朝左（scaleX: -1）
2. 配角（有头像配置的）：显示头像和姓名
3. 【角色名】/【】：旁白，不显示姓名和头像
4. 其余角色（【我】【？？？】等）：仅显示姓名，不显示头像
5. <<...>>、<...> 转为注释
6. 文字选项：... 转为注释
7. 空行跳过
"""

INPUT_FILE = 'res/东海市怪谈：这里没有雨20260608.txt'
# INPUT_FILE = 'res/李云祥立绘配置剧本.txt'
OUTPUT_FILE = 'res/东海市怪谈_易次元脚本.js'

DIALOG_PRESET_ID = 10456181
CONTENT_STYLE = 'style_common_dialog'  # 文本样式名，留空则不添加 tag 包裹
CONTENT_STYLE = ''
SPRITE_DIM_OPACITY = 60  # 非当前发言立绘的压黑遮罩透明度 (0=透明, 100=不透明)

# 测试用白色背景，留空则不添加
TEST_BG_CODE = """await ac.createImage({
  name: 'imagebg111',
  index: 0,
  inlayer: 'window',
  resId: '$185360022',
  pos: { x: 640, y: 360 },
  anchor: { x: 50, y: 50 },
});"""

TEST_BG_CODE = ''

# 主角立绘资源配置
# 位置映射: 左=left 中=center 右=right
# 每个槽位维护当前显示的图片状态
PROTAGONIST_RESOURCES = {
    '李云祥': {
        '正常': 192973458,
        '疑惑': 192973456,
        '生气': 192973454,
        '开心': 192973453,
        '害羞': 192973452,
        '悲伤': 192973221,
    },
    '敖丙': {
        '正常': 193056862,
        '疑惑': 193056860,
        '生气': 193056859,
        '开心': 193056858,
        '高兴': 193056855,
        '害羞': 193056857,
        '悲伤': 193056854,
    }
}

# 立绘槽位坐标配置
# 屏幕 1280x720，坐标原点左下角，y 轴向上为正
# 对话框背景 1208x158，底部留边 margin_bottom=24，立绘底边对齐对话框顶部：y = 24 + 158 = 182
# 立绘宽度约 400，anchor (50, 0) = 底部居中锚点
# scale 范围 1~100，负值翻转；立绘资源默认朝右
#   左槽：x = 1280/4 = 320，朝右面向中心，scale.x = 100（不翻转）
#   中槽：x = 1280/2 = 640，默认朝左，scale.x = -100（翻转）
#   右槽：x = 1280*3/4 = 960，朝左面向中心，scale.x = -100（翻转）
SLOT_ANCHOR = {'x': 50, 'y': 0}
SLOT_CONFIG = {
    '左': {'pos_x': 320, 'pos_y': 0, 'scale_x':  100, 'scale_y': 100},
    '中': {'pos_x': 640, 'pos_y': 0, 'scale_x':  100, 'scale_y': 100},
    '右': {'pos_x': 960, 'pos_y': 0, 'scale_x': -100, 'scale_y': 100},
}

# 配角头像资源配置
NPC_AVATARS = {
    '老李':       192897732,
    '外公':       192897732,  # 老李
    '李金祥':     192897214,
    '大舅':       192897218,  # 中年李金祥
    '妈妈':       192897728,  # 中年喀莎
    '喀莎':       192897216,
    '面具人':     192897731,
    '李艮':       192897730,
    '敖广':       192897160,
    '鱼女':       192897217,
    '敖烈':       192897165,
    '金鼻白毛鼠': 192897202,
    '老鼠':       192897202,  # 同金鼻白毛鼠（变身前）
    '小龙':       192805888,
    '？？？':     192813735,
    '？？':       192813735,  # 同？？？
    '？':         192813735,  # 同？？？
}

# 旁白角色（不显示姓名和头像）
NARRATOR_ROLES = {'角色名', '', None}

# 仅显示姓名的角色（无头像）
NAME_ONLY_ROLES = {
    '我',
    '陈教授', '小孩', '女人', '少女', '小道士',
    '轿夫', '道长', '李靖', '灵珠子', '元始天尊', '哪吒', '杨戬',
    '天兵', '村民甲', '村民乙', '行刑官', '云祥', '诛仙台', '斩龙台',
    '附天庭文告四海皆知', '恭喜达成梦结局人间正',
}


import re


def get_res_id_str(res_id):
    """Format resource id for JS code"""
    if isinstance(res_id, int):
        return f"'${res_id}'"
    return f"'{res_id}'"


_SLOT_ID_MAP = {'左': 'sprite_slot_l', '中': 'sprite_slot_c', '右': 'sprite_slot_r'}

def slot_image_id(slot):
    return _SLOT_ID_MAP[slot]


_POSITIONS = {'左', '中', '右'}

def parse_protagonist_line(inner):
    """
    Parse protagonist role line inner content.
    Returns (role, emotion, position) or None.
      【role|emotion|position】 → (role, emotion, position)
      【role|position】        → (role, 正常, position)   第二段是位置
      【role|emotion】         → (role, emotion, 中)     第二段是表情
      【role】                 → (role, 正常, 中)
    """
    parts = [p.strip() for p in inner.split('|')]
    if len(parts) == 3 and parts[0] in PROTAGONIST_RESOURCES:
        return parts[0], parts[1], parts[2]
    if len(parts) == 2 and parts[0] in PROTAGONIST_RESOURCES:
        second = parts[1]
        if second in _POSITIONS:
            return parts[0], '正常', second
        else:
            return parts[0], second, '中'
    if len(parts) == 1 and parts[0] in PROTAGONIST_RESOURCES:
        return parts[0], '正常', '中'
    return None


def convert(input_path, output_path):
    with open(input_path, encoding='utf-8') as f:
        lines = f.readlines()

    out = []
    # Track current image in each slot: slot -> (role, emotion, res_id) or None
    slot_state = {'左': None, '中': None, '右': None}

    def emit(s):
        out.append(s)

    def emit_comment(text):
        emit(f'// {text}')

    def emit_blank():
        emit('')

    def remove_slot_image(slot):
        """Emit remove for a slot if occupied"""
        if slot_state[slot] is not None:
            img_id = slot_image_id(slot)
            emit(f"await ac.remove({{ name: '{img_id}' }});")
            slot_state[slot] = None

    def create_slot_image(slot, role, emotion, res_id):
        """Emit createImage for a slot"""
        img_id = slot_image_id(slot)
        cfg = SLOT_CONFIG[slot]
        res_str = get_res_id_str(res_id)
        emit(
            f"await ac.createImage({{ name: '{img_id}', resId: {res_str}, "
            f"pos: {{ x: {cfg['pos_x']}, y: {cfg['pos_y']} }}, "
            f"anchor: {{ x: {SLOT_ANCHOR['x']}, y: {SLOT_ANCHOR['y']} }}, "
            f"scale: {{ x: {cfg['scale_x']}, y: {cfg['scale_y']} }} }});"
        )
        slot_state[slot] = (role, emotion, res_id)

    def update_slot_masks(active_slot):
        """压黑非当前发言的立绘，高亮当前发言立绘"""
        for s in ('左', '中', '右'):
            if slot_state[s] is not None:
                img_id = slot_image_id(s)
                if s == active_slot:
                    emit(f"await ac.changeMaskTo({{ name: '{img_id}', opacity: 0 }});")
                else:
                    emit(f"await ac.changeMaskTo({{ name: '{img_id}', r: 0, g: 0, b: 0, opacity: {SPRITE_DIM_OPACITY} }});")

    def wrap_content(text):
        safe = text.replace('`', '\\`')
        if CONTENT_STYLE:
            return f'<tag style={CONTENT_STYLE}>{safe}</tag>'
        return safe

    def dialog_protagonist(config_str, content):
        """Emit protagonist dialog (no visible name, no avatar, roleName keeps full config for reference)"""
        emit(
            f'await ac.sysDialogOn({{ id: {DIALOG_PRESET_ID}, '
            f'hasRoleName: false, roleName: `{config_str}`, hasRoleAvatar: false, '
            f'content: `{wrap_content(content)}` }});'
        )

    def dialog_narrator(content):
        """Emit narrator dialog"""
        emit(
            f'await ac.sysDialogOn({{ id: {DIALOG_PRESET_ID}, '
            f'hasRoleName: false, hasRoleAvatar: false, '
            f'content: `{wrap_content(content)}` }});'
        )

    def dialog_npc_with_avatar(role_name, avatar_res_id, content):
        """Emit NPC dialog with avatar and name"""
        res_str = get_res_id_str(avatar_res_id)
        emit(
            f'await ac.sysDialogOn({{ id: {DIALOG_PRESET_ID}, '
            f'hasRoleName: true, roleName: `{role_name}`, '
            f'hasRoleAvatar: true, roleAvatarResId: {res_str}, '
            f'content: `{wrap_content(content)}` }});'
        )

    def dialog_name_only(role_name, content):
        """Emit dialog with name but no avatar"""
        emit(
            f'await ac.sysDialogOn({{ id: {DIALOG_PRESET_ID}, '
            f'hasRoleName: true, roleName: `{role_name}`, '
            f'hasRoleAvatar: false, '
            f'content: `{wrap_content(content)}` }});'
        )

    i = 0
    current_role = None   # current role config
    current_role_type = None  # 'protagonist', 'narrator', 'npc', 'name_only'

    emit('// 东海市怪谈：这里没有雨 - 易次元对话脚本')
    emit('// 自动生成，请勿手动修改格式')
    emit(f'// 对话框预设ID: {DIALOG_PRESET_ID}')
    emit_blank()
    if TEST_BG_CODE:
        emit('// 白色背景（测试用）')
        emit(TEST_BG_CODE)
        emit_blank()

    while i < len(lines):
        raw = lines[i].rstrip('\r\n')
        stripped = raw.strip()
        i += 1

        # Skip empty lines
        if not stripped:
            continue

        # Big title: <<...>>
        if stripped.startswith('<<') and stripped.endswith('>>'):
            title = stripped[2:-2]
            emit_blank()
            emit_comment(f'====== {title} ======')
            emit_blank()
            continue

        # Chapter: <...>
        if stripped.startswith('<') and stripped.endswith('>') and not stripped.startswith('<<'):
            chapter = stripped[1:-1]
            emit_blank()
            emit_comment(f'--- {chapter} ---')
            emit_blank()
            continue

        # Option line
        if stripped.startswith('文字选项：'):
            emit_comment(f'[选项] {stripped[5:]}')
            continue

        # Role line: 【...】 或 【...】内联对话
        # inline_content: 跟在 】后面的对话内容（可能为空）
        m = re.match(r'^【([^】]*)】(.*)$', stripped)
        if m:
            inner = m.group(1)
            inline_content = m.group(2).strip()

            def handle_role(inner_str, inline_str):
                """处理角色行，若有内联内容则直接输出对话，否则只切换当前角色状态"""
                nonlocal current_role, current_role_type

                # Check if protagonist config line
                proto = parse_protagonist_line(inner_str)
                if proto:
                    role_name, emotion, position = proto
                    res_id = PROTAGONIST_RESOURCES[role_name].get(emotion,
                             PROTAGONIST_RESOURCES[role_name].get('正常'))

                    prev = slot_state[position]
                    if prev is None:
                        create_slot_image(position, role_name, emotion, res_id)
                    elif prev[0] != role_name or prev[2] != res_id:
                        remove_slot_image(position)
                        create_slot_image(position, role_name, emotion, res_id)

                    update_slot_masks(position)

                    current_role = (role_name, emotion, position, res_id, inner_str)
                    current_role_type = 'protagonist'
                    if inline_str:
                        dialog_protagonist(inner_str, inline_str)
                    return

                # Narrator: clear all sprite slots
                if inner_str in NARRATOR_ROLES:
                    for s in ('左', '中', '右'):
                        remove_slot_image(s)
                    current_role = None
                    current_role_type = 'narrator'
                    if inline_str:
                        dialog_narrator(inline_str)
                    return

                # NPC with avatar
                if inner_str in NPC_AVATARS:
                    current_role = inner_str
                    current_role_type = 'npc'
                    if inline_str:
                        dialog_npc_with_avatar(inner_str, NPC_AVATARS[inner_str], inline_str)
                    return

                # Name only
                current_role = inner_str
                current_role_type = 'name_only'
                if inline_str:
                    dialog_name_only(inner_str, inline_str)

            handle_role(inner, inline_content)
            continue

        # Bare text line (no 【】): route by current role type
        if not stripped.startswith('【'):
            if current_role_type == 'protagonist':
                role_name, emotion, position, res_id, config_str = current_role
                dialog_protagonist(config_str, stripped)
            elif current_role_type == 'npc':
                dialog_npc_with_avatar(current_role, NPC_AVATARS[current_role], stripped)
            elif current_role_type == 'name_only':
                dialog_name_only(current_role, stripped)
            else:
                # narrator or None: clear sprites and emit as narrator
                for s in ('左', '中', '右'):
                    remove_slot_image(s)
                current_role = None
                current_role_type = 'narrator'
                dialog_narrator(stripped)
            continue

    # Clean up any remaining images at end
    emit_blank()
    emit_comment('清理立绘')
    for slot in ('左', '中', '右'):
        remove_slot_image(slot)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(out))

    print(f'Done. Output: {output_path}  ({len(out)} lines)')


if __name__ == '__main__':
    import sys, os
    if len(sys.argv) > 1:
        input_path = sys.argv[1]
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        out_dir = os.path.dirname(os.path.abspath(input_path))
        output_path = os.path.join(out_dir, base_name + '.js')
    else:
        input_path = INPUT_FILE
        output_path = OUTPUT_FILE
    convert(input_path, output_path)
