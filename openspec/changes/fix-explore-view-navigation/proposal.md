## Why

探索系统的视图切换存在 bug：当玩家从 `main_hall` 点击右箭头进入 `right_hall`，再点击左箭头尝试返回 `main_hall` 时，画面不会切换。原因是 `switchToView` 函数在目标 view 已存在时，仍然使用"当前位置 + 方向偏移量"来计算目标位置，而不是获取目标 view 的实际位置，导致 `view_root` 移动量计算错误为 0。

## What Changes

- 修复 `ExploreUI.switchToView` 中目标 view 位置的计算逻辑
- 当目标 view 已存在时，直接通过 `ac.getPos` 获取其实际位置，而非通过偏移量计算
- 优化代码：将 `isViewCreated` 检查和位置获取合并为一次 `getPos` 调用

## Capabilities

### New Capabilities
<!-- 无新增能力 -->

### Modified Capabilities
<!-- 这是一个 bug 修复，不涉及需求层面的变更，仅是实现层面的修正 -->

## Impact

- **受影响代码**: `script/explore/explore_ui.js` 的 `switchToView` 函数
- **受影响场景**: 所有多视图探索场景（如 `nezha_temple`、`broken_nezha_temple`）
- **风险**: 低 - 修复逻辑明确，不影响其他功能
