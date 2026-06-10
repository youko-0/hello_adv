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
     * 已存在的控件沿弧线从起点飞到终点，均匀自转并淡出，动画结束后移除控件。
     * 调用方负责提前创建好控件并将其放置到起点位置。
     *
     * 弧线方向由 arcDir 决定：
     *   arcDir =  1 → 弧线向左弯
     *   arcDir = -1 → 弧线向右弯
     *
     * spinAngle 负数为逆时针，正数为顺时针，默认 -360（逆时针一圈）。
     *
     * @param {Object} config
     * @param {string}  config.name        控件名（已存在，起点位置由 ac.getPos 自动读取）
     * @param {{ x: number, y: number }} config.to  终点（ac 坐标）
     * @param {number}  [config.arcDir]    弧线方向：1=向左弯，-1=向右弯，默认 1
     * @param {number}  [config.arcBulge]  弧线弯曲幅度（0~1，相对于起终点距离），默认 0.3
     * @param {number}  [config.arcPosT]   控制点在路径上的位置（0=靠近起点，1=靠近终点），默认 0.5
     * @param {number}  [config.spinAngle]    自转总角度，负=逆时针，正=顺时针，默认 -360
     * @param {number}  [config.fadeFromStep] 从第几段开始淡出（1~steps），-1 不淡出，默认 1
     * @param {number}  [config.duration]     总时长（毫秒），默认 1500
     * @param {number}  [config.steps]        分段数，默认 12
     * @param {boolean} [config.debug]        是否绘制路径辅助线，默认 false
     */
    playArcFlyEffect: async function (config) {
        const {
            name,
            to,
            arcDir       = 1,
            arcBulge     = 0.3,
            arcPosT      = 0.5,
            spinAngle    = -360,
            fadeFromStep = 1,
            duration     = 1500,
            steps        = 12,
            debug        = false,
        } = config;

        const from = await ac.getPos({ name });
        const sx = from.x;
        const sy = from.y;
        const ex = to.x;
        const ey = to.y;

        // 二次贝塞尔控制点：沿 start→end 的 arcPosT 位置，垂直偏移 bulge * arcDir
        const dx   = ex - sx;
        const dy   = ey - sy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const bulge = dist * arcBulge;
        const mx = sx + dx * arcPosT + (-dy / dist) * bulge * arcDir;
        const my = sy + dy * arcPosT + ( dx / dist) * bulge * arcDir;

        // ── debug：绘制贝塞尔路径辅助线 ──────────────────────────────────────
        if (debug) {
            const debugName = 'debug_arc_path_' + name;
            await ac.createDrawNode({
                name:    debugName,
                index:   ZORDER.TOP + 1,
                inlayer: 'window',
                pos:     { x: 0, y: 0 },
            });

            const debugSteps = config.steps; // 辅助线细分段数，越高越平滑
            let prevX = sx, prevY = sy;
            for (let i = 1; i <= debugSteps; i++) {
                const t  = i / debugSteps;
                const t1 = 1 - t;
                const bx = t1 * t1 * sx + 2 * t1 * t * mx + t * t * ex;
                const by = t1 * t1 * sy + 2 * t1 * t * my + t * t * ey;
                await ac.drawSegment({
                    name:  debugName,
                    from:  { x: prevX, y: prevY },
                    to:    { x: bx,    y: by    },
                    width: 2,
                    color: '#00ff88',
                });
                prevX = bx;
                prevY = by;
            }

            // 画控制点标记（起点→控制点→终点 的辅助虚线）
            await ac.drawSegment({ name: debugName, from: { x: sx, y: sy }, to: { x: mx, y: my }, width: 1, color: '#ff8800' });
            await ac.drawSegment({ name: debugName, from: { x: mx, y: my }, to: { x: ex, y: ey }, width: 1, color: '#ff8800' });
        }
        // ────────────────────────────────────────────────────────────────────

        const stepDur = duration / steps;

        // 预算各段端点和弦长，用于按比例分配旋转角度
        const points = [{ x: sx, y: sy }];
        for (let i = 1; i <= steps; i++) {
            const t  = i / steps;
            const t1 = 1 - t;
            points.push({
                x: t1 * t1 * sx + 2 * t1 * t * mx + t * t * ex,
                y: t1 * t1 * sy + 2 * t1 * t * my + t * t * ey,
            });
        }
        const chords = [];
        let totalLen = 0;
        for (let i = 0; i < steps; i++) {
            const cdx = points[i + 1].x - points[i].x;
            const cdy = points[i + 1].y - points[i].y;
            const len = Math.sqrt(cdx * cdx + cdy * cdy);
            chords.push(len);
            totalLen += len;
        }

        // 串行：逐段 moveTo + 按弦长比例 rotateBy
        for (let i = 0; i < steps; i++) {
            const stepRotate = totalLen > 0 ? spinAngle * (chords[i] / totalLen) : spinAngle / steps;

            // 到达 fadeFromStep 段时启动淡出（并行，不 await）
            if (fadeFromStep !== -1 && i + 1 === fadeFromStep) {
                ac.fadeTo({
                    name:     name,
                    opacity:  0,
                    duration: (steps - fadeFromStep + 1) * stepDur,
                    canskip:  false,
                });
            }

            ac.rotateBy({
                name:     name,
                angle1:   stepRotate,
                duration: stepDur,
                canskip:  false,
            });
            await ac.moveTo({
                name:     name,
                x:        points[i + 1].x,
                y:        points[i + 1].y,
                duration: stepDur,
                canskip:  false,
            });
        }

        await ac.remove({ name: name });
    },
}
