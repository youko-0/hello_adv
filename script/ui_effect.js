// UI 特效模块
console.log('[LOAD] ui_effect');

const UIEffect = {

    // ─── 拖尾特效 ────────────────────────────────────────────────────────────

    /**
     * 播放拖尾特效（粒子跟随直线移动）
     * @param {{ x: number, y: number }} startPos 起点（屏幕坐标）
     * @param {{ x: number, y: number }} endPos   终点（屏幕坐标）
     */
    playTrailEffect: async function (startPos, endPos) {
        // ac 坐标系以屏幕中心为原点，需偏移
        const sx = startPos.x - GameConfig.centerX;
        const sy = startPos.y - GameConfig.centerY;
        const ex = endPos.x   - GameConfig.centerX;
        const ey = endPos.y   - GameConfig.centerY;

        const moveSpeed = 0.8; // 像素/毫秒
        const duration  = Math.sqrt((sx - ex) ** 2 + (sy - ey) ** 2) / moveSpeed;

        const containerName = 'trail_container';
        await ac.createLayer({
            name:     containerName,
            pos:      { x: sx, y: sy },
            size:     { width: 0, height: 0 },
            inlayer:  'window',
            index:    ZORDER.PARTICLE,
            clipMode: false,
        });

        const particleName = 'trail_effect_' + Date.now();
        await ac.createParticle({
            name:          particleName,
            type:          ac.PARTICLE_TYPES.fire,
            index:         0,
            inlayer:       containerName,
            totalParticle: 200,
            life:          { base: 200, deviation: 100 },
            emissionRate:  60,
            shootAngle:    { base: 0, deviation: 360 },
            moveSpeed:     { base: 100, deviation: 50 },
            resId:         ResMap.spr_particle_trail,
            duration:      duration * 0.9,
            parpos:        { xBase: 0, xDeviation: 2, yBase: 0, yDeviation: 2 },
        });

        await ac.moveTo({
            name:     containerName,
            x:        ex,
            y:        ey,
            duration: duration,
        });
        await ac.remove({
            name:     containerName,
            duration: 500,
        });
    },

    // ─── 弧线飞行特效 ─────────────────────────────────────────────────────────

    /**
     * 已存在的控件沿弧线从起点飞到终点，同时自转并淡出，动画结束后移除控件。
     * 调用方负责提前创建好控件并将其放置到起点位置。
     *
     * 弧线方向由 rotateAngle 符号决定：
     *   rotateAngle > 0  → 图片向左旋转，弧线向左弯
     *   rotateAngle < 0  → 图片向右旋转，弧线向右弯
     *
     * @param {Object} config
     * @param {string}  config.name         控件名（已存在，起点位置由 ac.getPos 自动读取）
     * @param {{ x: number, y: number }} config.to    终点（ac 坐标）
     * @param {number}  config.rotateAngle  自身旋转总角度（正=左转，负=右转），默认 360
     * @param {number}  [config.duration]   总时长（毫秒），默认 1500
     * @param {number}  [config.steps]      分段数，默认 12
     */
    playArcFlyEffect: async function (config) {
        const {
            name,
            to,
            rotateAngle = 360,
            duration    = 1500,
            steps       = 12,
        } = config;

        const from = await ac.getPos({ name });
        const sx = from.x;
        const sy = from.y;
        const ex = to.x;
        const ey = to.y;

        // 弧线控制点：垂直于 start→end 方向，偏移量与旋转方向绑定
        //   rotateAngle > 0 → 向左弯（控制点偏向左侧）
        //   rotateAngle < 0 → 向右弯（控制点偏向右侧）
        const dx = ex - sx;
        const dy = ey - sy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const arcSign = rotateAngle >= 0 ? 1 : -1;
        const bulge   = dist * 0.5; // 弧线最大偏移幅度

        // 控制点 = 中点 + 垂直方向 * bulge
        const mx = (sx + ex) / 2 + (-dy / dist) * bulge * arcSign;
        const my = (sy + ey) / 2 + ( dx / dist) * bulge * arcSign;

        const stepDur = duration / steps;

        // 并行：旋转 + 淡出（不 await，立即启动）
        ac.rotateTo({
            name:     name,
            angle1:   rotateAngle,
            duration: duration,
            canskip:  false,
        });
        ac.fadeTo({
            name:     name,
            opacity:  0,
            duration: duration,
            canskip:  false,
        });

        // 串行：沿二次贝塞尔曲线分段 moveTo
        for (let i = 1; i <= steps; i++) {
            const t  = i / steps;
            const t1 = 1 - t;
            // 二次贝塞尔插值: B(t) = (1-t)^2*P0 + 2*(1-t)*t*P1 + t^2*P2
            const bx = t1 * t1 * sx + 2 * t1 * t * mx + t * t * ex;
            const by = t1 * t1 * sy + 2 * t1 * t * my + t * t * ey;
            await ac.moveTo({
                name:     name,
                x:        bx,
                y:        by,
                duration: stepDur,
                canskip:  false,
            });
        }

        await ac.remove({ name: name });
    },
}
