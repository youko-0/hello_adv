## Context

当前 `explore_ui.js` 中的 `ViewTransition` 配置：

```javascript
const ViewTransition = {
    duration: 500,
    scale: {
        peak: 1.05,
        normal: 1.00,
    },
};
```

所有方向使用相同的动画效果，缺乏空间感。需要重构为方向性配置。

## Goals / Non-Goals

**Goals:**
- 为不同导航方向提供差异化的动效体验
- 左右切换：轻微旋转倾斜（±2°）模拟转头
- 上下切换：缩放效果模拟走近/退远
- 保持动画流畅，时长控制在 400ms 左右

**Non-Goals:**
- 不改变场景配置结构
- 不改变导航按钮逻辑
- 不添加新的 API 依赖

## Decisions

### 1. 动效配置结构

**决策**: 重构为方向性配置对象

```javascript
const DirectionalTransition = {
    duration: 400,
    
    left: {
        rotate: { peak: -2 },   // 向左倾斜 2°
        scale: null,            // 无缩放
    },
    right: {
        rotate: { peak: 2 },    // 向右倾斜 2°
        scale: null,
    },
    up: {
        rotate: null,
        scale: { start: 0.9, end: 1.0 },  // 缩小→正常（走近）
    },
    down: {
        rotate: null,
        scale: { start: 1.1, end: 1.0 },  // 放大→正常（退远）
    },
};
```

### 2. 动画时序

**决策**: 分两阶段执行

```
0ms              200ms              400ms
 │                 │                  │
 ├─────────────────┴──────────────────┤
 │           moveTo (400ms)           │
 ├────────────────►├──────────────────┤
 │ rotate to peak  │ rotate to 0      │
 │ scale to start  │ scale to end     │
 │    (200ms)      │    (200ms)       │
```

### 3. 应用动效的对象

**决策**: 对 `view_root` 应用所有动效

- moveTo: 已有，用于平移
- rotateTo: 新增，用于旋转倾斜
- scaleTo: 已有，用于缩放

## Risks / Trade-offs

**[风险] 旋转动画可能导致边缘露出背景**
→ 缓解：使用很小的角度（2°），且动画时间短，视觉上不明显

**[风险] 缩放动画可能影响点击区域**
→ 缓解：动画期间导航按钮已移除，不影响交互

**[风险] 多个动画同时执行可能有性能问题**
→ 缓解：易次元引擎原生支持并行动画，且动画简单
