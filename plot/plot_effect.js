console.log('plot_effect');

// ========= 符文特效 ==============
const falling = UIEffect.playFallingEffect({
    resIds: [
        '$193135846',
        '$193135845',
        '$193135844',
        '$193135843',
        '$193135842',
        '$193130614',
    ],
    columns: 10,      // 横向分 8 区
    speed: 0.15,   // px/ms
    interval: 2000,   // 每区间隔 ms
    intervalDev: 1000,
    lifeMin: 0.6,
    lifeMax: 1.6,
});
falling.stop(2000);

