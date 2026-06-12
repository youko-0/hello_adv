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
            index:    ZORDER.EFFECT,
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
                index:   ZORDER.EFFECT + 1,
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

    // ─── 自定义雨滴特效 ───────────────────────────────────────────────────────

    /**
     * 播放自定义雨滴特效：随机从屏幕顶部落下，带淡入淡出
     * @param {Object}   config
     * @param {string[]} config.resIds        图片 resId 数组，每颗雨滴随机取一张
     * @param {number}   [config.count]       同时在场的雨滴总数，默认 20
     * @param {number}   [config.duration]    整个特效持续时长（毫秒），-1 永久，默认 -1
     * @param {number}   [config.dropDur]     单颗雨滴从顶到底的时长（毫秒），默认 2000
     * @param {number}   [config.dropDurDev]  dropDur 的随机偏差，默认 800
     * @param {number}   [config.fadeInDur]   淡入时长（毫秒），默认 300
     * @param {number}   [config.fadeOutDur]  淡出时长（毫秒），默认 400
     * @param {number}   [config.overflow]    超出屏幕边缘的距离（用于计算出入屏偏移），默认 200
     * @param {number}   [config.scaleBase]   缩放基准值（%），默认 100
     * @param {number}   [config.scaleDev]    缩放随机偏差（%），默认 30
     * @param {number}   [config.index]       层级，默认 ZORDER.EFFECT
     * @param {string}   [config.inlayer]     所属层，默认 'window'
     * @returns {{ stop: Function }}          返回控制句柄，调用 stop() 停止并清理
     */
    playRainEffect: function (config) {
        const {
            resIds,
            count       = 20,
            duration    = -1,
            dropDur     = 2000,
            dropDurDev  = 800,
            fadeInDur   = 300,
            fadeOutDur  = 400,
            overflow    = 200,
            scaleBase   = 100,
            scaleDev    = 30,
            index       = ZORDER.EFFECT,
            inlayer     = 'window',
        } = config;

        const W = GameConfig.width;
        const H = GameConfig.height;
        // ac 坐标系：原点屏幕左下角，x 向右，y 向上
        const startY = H + overflow / 2;
        const endY   = -overflow / 2;

        let stopped   = false;
        let dropIndex = 0;
        const activeDrops = new Set();

        const spawnDrop = async (initialDelay = 0) => {
            if (stopped) return;

            if (initialDelay > 0) {
                await ac.delay({ time: initialDelay });
            }

            if (stopped) return;

            const id      = 'rain_drop_' + (dropIndex++);
            const resId   = resIds[Math.floor(Math.random() * resIds.length)];
            const x       = Math.random() * W;
            const acX     = x;
            const thisDur = dropDur + (Math.random() * 2 - 1) * dropDurDev;
            const scale   = scaleBase + (Math.random() * 2 - 1) * scaleDev;

            activeDrops.add(id);

            await ac.createImage({
                name:    id,
                resId:   resId,
                index:   index,
                inlayer: inlayer,
                pos:     { x: acX, y: startY - GameConfig.centerY },
                anchor:  { x: 50, y: 50 },
                scale:   { x: scale, y: scale },
                opacity: 0,
            });

            if (stopped) { ac.remove({ name: id }); activeDrops.delete(id); return; }

            // 淡入（并行）
            ac.fadeTo({ name: id, opacity: 100, duration: fadeInDur, canskip: false });

            // 下落（等待）
            await ac.moveTo({
                name:     id,
                x:        acX,
                y:        endY - GameConfig.centerY,
                duration: thisDur,
                canskip:  false,
            });

            // 淡出（若已 stop 则直接移除）
            if (!stopped) {
                await ac.fadeTo({ name: id, opacity: 0, duration: fadeOutDur, canskip: false });
            }

            ac.remove({ name: id });
            activeDrops.delete(id);

            // 补一颗新的
            if (!stopped) spawnDrop();
        };

        // 初始批量生成：分层采样，保证各雨滴均匀散开
        const slot = dropDur / count;
        for (let i = 0; i < count; i++) {
            spawnDrop(i * slot + Math.random() * slot);
        }

        // 定时停止
        if (duration > 0) {
            (async () => {
                await ac.delay({ time: duration });
                handle.stop();
            })();
        }

        const handle = {
            stop: () => {
                stopped = true;
                const toFade = [...activeDrops];
                activeDrops.clear();
                toFade.forEach(id => ac.remove({ name: id, effect: 'fadeout', duration: fadeOutDur }));
            },
        };

        return handle;
    },

    // ─── 分区下落特效 ────────────────────────────────────────────────────────

    /**
     * 分区下落特效：屏幕横向分成 N 个区域，每区域循环间隔落下一张随机图片
     * 图片 anchor 为 (50, 0)，从屏幕顶部出发，以固定速度下落，
     * 在随机存活时长内淡出并移除
     *
     * @param {Object}   config
     * @param {string[]} config.resIds       图片 resId 数组，每颗随机取一张
     * @param {number}   [config.columns]    横向分区数，默认 8
     * @param {number}   [config.speed]      下落速度（px/ms），默认 0.15
     * @param {number}   [config.interval]   每区域两次发射的间隔（毫秒），默认 2000
     * @param {number}   [config.intervalDev] 间隔随机偏差（毫秒），默认 1000
     * @param {number}   [config.fadeOutDur] 淡出时长（毫秒），默认 600
     * @param {number}   [config.lifeMin]    存活距离下限（屏高倍数），默认 0.5
     * @param {number}   [config.lifeMax]    存活距离上限（屏高倍数），默认 1.5
     * @param {number}   [config.scaleBase]  缩放基准值（%），默认 100
     * @param {number}   [config.scaleDev]   缩放随机偏差（%），默认 20
     * @param {number}   [config.index]      层级，默认 ZORDER.EFFECT
     * @param {string}   [config.inlayer]    所属层，默认 'window'
     * @returns {{ stop: Function }}         返回控制句柄，调用 stop() 停止并清理
     */
    playFallingEffect: function (config) {
        const {
            resIds,
            columns     = 8,
            speed       = 0.15,
            interval    = 2000,
            intervalDev = 1000,
            fadeOutDur  = 600,
            lifeMin     = 0.5,
            lifeMax     = 1.5,
            scaleBase   = 100,
            scaleDev    = 20,
            index       = ZORDER.EFFECT,
            inlayer     = 'window',
        } = config;

        const W = GameConfig.width;
        const H = GameConfig.height;
        const colWidth = W / columns;

        let stopped   = false;
        let dropIndex = 0;
        const activeDrops = new Set();

        // 单区域循环：每次随机间隔发射一颗
        const runColumn = async (col) => {
            // 首次发射错开，避免所有区域同时出发
            await ac.delay({ time: col * (interval / columns) + Math.random() * intervalDev });

            while (!stopped) {
                const id    = 'falling_drop_' + (dropIndex++);
                const resId = resIds[Math.floor(Math.random() * resIds.length)];
                const scale = scaleBase + (Math.random() * 2 - 1) * scaleDev;

                // 区域内随机 X
                const x = col * colWidth + Math.random() * colWidth;

                // 随机存活时长：图片能落多远由随机比例决定
                const lifeFraction = lifeMin + Math.random() * (lifeMax - lifeMin);
                const lifeDur = (H * lifeFraction) / speed;

                activeDrops.add(id);

                await ac.createImage({
                    name:    id,
                    resId:   resId,
                    index:   index,
                    inlayer: inlayer,
                    pos:     { x, y: H },
                    anchor:  { x: 50, y: 0 },
                    scale:   { x: scale, y: scale },
                    opacity: 100,
                });

                if (stopped) { ac.remove({ name: id }); activeDrops.delete(id); break; }

                // 下落 + 淡出并行
                ac.moveTo({
                    name:     id,
                    x,
                    y:        H - lifeDur * speed,
                    duration: lifeDur,
                    canskip:  false,
                });

                await ac.delay({ time: lifeDur - fadeOutDur > 0 ? lifeDur - fadeOutDur : 0 });

                if (!stopped) {
                    await ac.fadeTo({ name: id, opacity: 0, duration: fadeOutDur, canskip: false });
                }

                ac.remove({ name: id });
                activeDrops.delete(id);

                if (stopped) break;

                // 等待下一次发射
                const wait = interval + (Math.random() * 2 - 1) * intervalDev;
                await ac.delay({ time: Math.max(wait, 100) });
            }
        };

        for (let col = 0; col < columns; col++) {
            runColumn(col);
        }

        const handle = {
            stop: () => {
                stopped = true;
                const toFade = [...activeDrops];
                activeDrops.clear();
                toFade.forEach(id => ac.remove({ name: id, effect: 'fadeout', duration: fadeOutDur }));
            },
        };

        return handle;
    },

    // ─── 眨眼转场 ─────────────────────────────────────────────────────────────

    _blink: {
        duration:  240,   // 单次开/闭时长 ms
        minScaleY: 33,    // pic_mask_iris 高 2160（= 3× 屏幕高），scaleY 33% 时椭圆接近闭合
        iris: {
            name:  'img_blink_iris',
            resId: ResMap.pic_mask_iris,   // 1280×2160，中央镂空椭圆
        },
        black: {
            name:    'img_blink_black',
            resId:   ResMap.img_mask_black, // 32×32 纯黑，缩放至全屏
            srcSize: 32,
        },
    },

    /**
     * 眨眼转场：虹膜闭合 → 执行回调（黑屏期间切换内容）→ 虹膜张开
     * @param {Function} onBlackScreen 完全黑屏时执行的异步回调
     */
    playBlinkTransition: async function (onBlackScreen) {
        const { duration, minScaleY, iris, black } = this._blink;

        await ac.createImage({
            name:    iris.name,
            index:   ZORDER.EFFECT,
            inlayer: 'window',
            resId:   iris.resId,
            pos:     { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor:  { x: 50, y: 50 },
            scale:   { x: 100, y: 100 },
        });

        await ac.scaleTo({ name: iris.name, x: 100, y: minScaleY, duration });

        await ac.createImage({
            name:    black.name,
            index:   ZORDER.EFFECT + 1,
            inlayer: 'window',
            resId:   black.resId,
            pos:     { x: GameConfig.centerX, y: GameConfig.centerY },
            anchor:  { x: 50, y: 50 },
            scale: {
                x: GameConfig.width  * 100 / black.srcSize,
                y: GameConfig.height * 100 / black.srcSize,
            },
        });

        await onBlackScreen();

        ac.remove({ name: black.name, effect: 'fadeout', duration, canskip: false });
        ac.scaleTo({ name: iris.name, x: 100, y: 100, duration });
        await ac.remove({ name: iris.name, effect: 'fadeout', duration, canskip: false });
    },
}
