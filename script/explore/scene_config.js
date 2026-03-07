// 场景配置
console.log('[LOAD] scene_config');

const SceneConfig = {

    // 民居
    house: {
        // 客厅
        defaultViewId: 'living_room',
        views: {
            // 客厅
            living_room: {
                id: 'living_room',
                bg: ResMap.pic_house_living_room, // 背景图
            }
        }
    },

    // 哪吒庙
    nezha_temple: {
        defaultViewId: 'hall',
        views: {
            // 主殿
            hall: {
                id: 'hall',
                bg: ResMap.pic_nezha_temple_hall, // 背景图
                nav: {
                    up: null,
                    left: 'left_wall',
                    right: 'right_wall',
                    down: 'center_wall'
                },
                interact: {}
            },
            // 左侧墙体
            left_wall: {
                id: 'left_wall',
                bg: ResMap.pic_nezha_temple_left_wall,
                nav: {
                    down: null,
                    up: null,
                    left: 'center_wall',
                    right: 'hall'
                },
                interact: {
                    item_mural_nezhanaohai: {
                        x: 600,
                        y: 380,
                    },
                }
            },
            // 中间墙体
            center_wall: {
                id: 'center_wall',
                bg: ResMap.pic_nezha_temple_center_wall,
                nav: {
                    down: null,
                    up: 'hall',
                    left: 'right_wall',
                    right: 'left_wall'
                },
                interact: {
                    item_mural_ziwenguitian: {
                        x: 600,
                        y: 380,
                    },
                }
            },
            // 右侧墙体
            right_wall: {
                id: 'right_wall',
                bg: ResMap.pic_nezha_temple_right_wall,
                nav: {
                    down: null,
                    up: null,
                    left: 'hall',
                    right: 'center_wall'
                },
                interact: {
                    item_mural_lianhuatuosheng: {
                        x: 600,
                        y: 380,
                    },
                }
            },


        },
    },
};