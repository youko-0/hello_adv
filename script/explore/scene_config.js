// 场景配置
console.log('[LOAD] scene_config');

const SceneConfig = {

    // 民居
    residence: {
        // 客厅
        defaultViewId: 'living_room',
        views: {
            // 客厅
            living_room: {
                id: 'living_room',
                bg: ResMap.pic_residence_living_room, // 背景图
                interact: {
                    item_family_photo: { x: 693, y: 554 },
                    item_motorcycle_key: { x: 374, y: 316 },
                    item_cookie_box: { x: 914, y: 343 },
                }
            }
        }
    },

    // 哪吒庙
    nezha_temple: {
        defaultViewId: 'main_hall',
        views: {
            // 主殿
            main_hall: {
                id: 'main_hall',
                bg: ResMap.pic_nezha_temple_main_hall, // 背景图
                nav: {
                    up: null,
                    left: 'left_hall',
                    right: 'right_hall',
                    down: 'back_hall'
                },
            },
            // 左殿
            left_hall: {
                id: 'left_hall',
                bg: ResMap.pic_nezha_temple_left_hall,
                nav: {
                    // left: 'back_hall',
                    right: 'main_hall'
                },
                interact: {
                    item_mural_nezhanaohai: { x: 604, y: 406 },
                }
            },
            // 后殿
            back_hall: {
                id: 'back_hall',
                bg: ResMap.pic_nezha_temple_back_hall,
                nav: {
                    up: 'main_hall',
                    // left: 'right_hall',
                    // right: 'left_hall',
                },
                interact: {
                    item_mural_ziwenguitian: { x: 691, y: 410 },
                }
            },
            // 右殿
            right_hall: {
                id: 'right_hall',
                bg: ResMap.pic_nezha_temple_right_hall,
                nav: {
                    left: 'main_hall',
                    // right: 'back_hall'
                },
                interact: {
                    item_mural_lianhuatuosheng: { x: 663, y: 400 },
                }
            },
        },
    },

    // 破碎的哪吒庙
    broken_nezha_temple: {
        defaultViewId: 'main_hall',
        views: {
            // 主殿
            main_hall: {
                id: 'main_hall',
                bg: ResMap.pic_broken_nezha_temple_main_hall, // 背景图
                nav: {
                    up: null,
                    left: 'left_hall',
                    // right: 'right_hall',
                    down: null
                },
            },
            // 左殿
            left_hall: {
                id: 'left_hall',
                bg: ResMap.pic_broken_nezha_temple_left_hall,
                nav: {
                    left: 'back_hall',
                    right: 'main_hall'
                },
                interact: {
                    item_mural_jianzaoshenmiao: { x: 604, y: 407 },
                }
            },
            // 后殿
            back_hall: {
                id: 'back_hall',
                bg: ResMap.pic_broken_nezha_temple_back_hall,
                nav: {
                    left: 'right_hall',
                    right: 'left_hall',
                },
                interact: {
                    item_mural_zhuzaosuxiang: { x: 691, y: 412 },
                }
            },
            // 右殿
            right_hall: {
                id: 'right_hall',
                bg: ResMap.pic_broken_nezha_temple_right_hall,
                nav: {
                    // left: 'main_hall',
                    right: 'back_hall'
                },
                interact: {
                    item_mural_lijingsb: { x: 663, y: 400 },
                }
            },
        },
    },

    // 龙王庙
    dragon_temple: {
        defaultViewId: 'main_hall',
        views: {
            // 主殿
            main_hall: {
                id: 'main_hall',
                bg: ResMap.pic_dragon_temple_main_hall, // 背景图
                interact: {
                    item_letter: { x: 600, y: 380 },
                }
            },
        }
    },

    // 德兴大厦
    dexing_tower: {
        defaultViewId: 'office',
        views: {
            // 办公室
            office: {
                id: 'office',
                bg: ResMap.pic_dexing_tower_office, // 背景图
                interact: {
                    item_jewelry_box: { x: 911, y: 446 },
                    item_newspaper: { x: 672, y: 215 },
                    item_visa: { x: 1000, y: 287 },
                }
            }
        }
    },
};