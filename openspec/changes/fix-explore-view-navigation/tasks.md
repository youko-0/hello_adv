## 1. 修复 switchToView 函数

- [x] 1.1 修改 `explore_ui.js` 的 `switchToView` 函数，使用 `ac.getPos` 直接获取目标 view 位置，通过返回值判断 view 是否存在：
  - 如果 `getPos` 返回有效位置，说明 view 已存在，直接使用该位置
  - 如果 `getPos` 返回 null 或抛异常，说明 view 不存在，使用偏移量计算位置并创建

## 2. 验证修复

- [x] 2.1 测试 `nezha_temple` 场景：main_hall → right_hall → main_hall 导航流程
- [x] 2.2 测试 `nezha_temple` 场景：main_hall → left_hall → main_hall 导航流程
- [x] 2.3 测试 `broken_nezha_temple` 场景的多向导航
