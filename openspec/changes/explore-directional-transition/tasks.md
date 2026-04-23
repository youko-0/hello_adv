## 1. 重构动效配置

- [x] 1.1 将 `ViewTransition` 常量重构为 `DirectionalTransition`，包含方向性动效参数
- [x] 1.2 为每个方向（left/right/up/down）配置对应的 rotate 和 scale 参数

## 2. 实现方向性动画

- [x] 2.1 修改 `switchToView` 函数，根据 direction 参数获取对应的动效配置
- [x] 2.2 实现旋转动画：在移动过程中先旋转到 peak 角度，再旋转回 0
- [x] 2.3 实现缩放动画：在移动过程中从 start 缩放到 end

## 3. 验证测试

- [ ] 3.1 测试左右切换的旋转倾斜效果
- [ ] 3.2 测试上下切换的缩放效果
- [ ] 3.3 测试连续多次切换的动画流畅性
