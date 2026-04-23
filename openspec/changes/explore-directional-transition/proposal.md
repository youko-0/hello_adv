## Why

当前探索系统的视图切换只有简单的平移动画，缺乏空间感和方向反馈。通过添加方向性动效（左右倾斜、上下缩放），可以增强玩家的沉浸感，让视角切换更有"转头/走近/退远"的真实感。

## What Changes

- 为探索系统的视图切换添加方向性动效
- 左右切换：添加轻微旋转倾斜效果（±2°）模拟转头
- 上下切换：添加缩放效果模拟走近/退远
- 重构 `ViewTransition` 配置为方向性配置结构

## Capabilities

### New Capabilities
<!-- 无新增能力，这是对现有功能的视觉增强 -->

### Modified Capabilities
<!-- 这是实现层面的增强，不涉及需求层面的变更 -->

## Impact

- **受影响代码**: `script/explore/explore_ui.js` 的 `switchToView` 函数和 `ViewTransition` 配置
- **受影响场景**: 所有多视图探索场景
- **依赖 API**: `ac.moveTo`, `ac.scaleTo`, `ac.rotateTo`
