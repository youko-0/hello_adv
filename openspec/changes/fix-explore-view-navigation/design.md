## Context

探索系统采用 `view_root` 容器 + 多个 `view` 子层的架构。通过移动 `view_root` 来实现视图切换动画。当前 `switchToView` 的问题在于：

**当前逻辑（有 bug）：**
```javascript
// 第 244-252 行
const offset = this.Nav[direction].offset;
const targetPosX = currentPos.x + offset.x * GameConfig.width;
const targetPosY = currentPos.y + offset.y * GameConfig.height;

if (!(await this.isViewCreated(viewId))) {
    await this.createView(sceneId, viewId, targetPosX, targetPosY);
}
```

问题：当目标 view 已存在时，`targetPosX/Y` 仍然是通过偏移量计算的，可能与目标 view 的实际位置不一致。

## Goals / Non-Goals

**Goals:**
- 修复视图导航返回时画面不切换的 bug
- 优化代码：避免重复调用 `getPos`（`isViewCreated` 内部已调用一次）

**Non-Goals:**
- 不改变现有的场景配置结构
- 不改变导航按钮的交互逻辑
- 不涉及其他探索系统功能

## Decisions

### 1. 使用 `getPos` 返回值判断 view 是否存在

**决策**: 直接调用 `ac.getPos` 获取目标 view 位置，通过返回值判断 view 是否存在。

**理由**:
- `isViewCreated` 内部就是通过 `ac.getPos` 实现的
- 直接调用可以一次性获得"是否存在"和"实际位置"两个信息
- 减少重复的异步调用

**替代方案**: 保留 `isViewCreated` 调用后再单独 `getPos` → 不采用，因为有冗余调用

### 2. 位置计算策略

**决策**: 
- 如果目标 view 已存在 → 使用 `getPos` 返回的实际位置
- 如果目标 view 不存在 → 使用偏移量计算位置并创建 view

**理由**: 已存在的 view 位置是创建时确定的，不应该被后续计算覆盖。

## Risks / Trade-offs

**[风险] `ac.getPos` 对不存在的控件返回值不确定**
→ 缓解：根据易次元 API 行为，不存在的控件 `getPos` 返回 `null` 或抛异常，代码中用 try-catch 或 null 检查处理

**[风险] 修改核心切换逻辑可能影响其他场景**
→ 缓解：逻辑修改是修正性的，所有场景都会受益；可在 `nezha_temple` 场景充分测试
