// 场景配置
console.log('[LOAD] scene_config');

const SceneConfig = {

    // 民居
    residence: {
        // 客厅
        defaultViewId: 'living_room',
        nextPlot: ResMap.plot_residence_next, // 下一个剧情
        views: {
            // 客厅
            living_room: {
                id: 'living_room',
                bg: ResMap.pic_residence_living_room, // 背景图
                nav: {},
                interact: {
                    item_family_photo: { x: 693, y: 556 },
                    item_motorcycle_key: { x: 374, y: 315 },
                    item_cookie_box: { x: 916, y: 341 },
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
                interact: {}
            },
            // 左殿
            left_hall: {
                id: 'left_hall',
                bg: ResMap.pic_nezha_temple_left_hall,
                nav: {
                    down: null,
                    up: null,
                    left: 'back_hall',
                    right: 'main_hall'
                },
                interact: {
                    item_mural_nezhanaohai: { x: 600, y: 380 },
                }
            },
            // 后殿
            back_hall: {
                id: 'back_hall',
                bg: ResMap.pic_nezha_temple_back_hall,
                nav: {
                    down: null,
                    up: 'main_hall',
                    left: 'right_hall',
                    right: 'left_hall'
                },
                interact: {
                    item_mural_ziwenguitian: { x: 600, y: 380 },
                }
            },
            // 右殿
            right_hall: {
                id: 'right_hall',
                bg: ResMap.pic_nezha_temple_right_hall,
                nav: {
                    down: null,
                    up: null,
                    left: 'main_hall',
                    right: 'back_hall'
                },
                interact: {
                    item_mural_lianhuatuosheng: { x: 600, y: 380 },
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
                bg: ResMap.pic_broken_nezha_temple_hall, // 背景图
                nav: {
                    up: null,
                    left: 'left_hall',
                    right: 'right_hall',
                    down: 'back_hall'
                },
                interact: {}
            },
            // 左殿
            left_hall: {
                id: 'left_hall',
                bg: ResMap.pic_broken_nezha_temple_left_hall,
                nav: {
                    down: null,
                    up: null,
                    left: 'back_hall',
                    right: 'main_hall'
                },
                interact: {
                    item_mural_jianzaoshenmiao: { x: 600, y: 380 },
                }
            },
            // 后殿
            back_hall: {
                id: 'back_hall',
                bg: ResMap.pic_broken_nezha_temple_back_hall,
                nav: {
                    down: null,
                    up: 'main_hall',
                    left: 'right_hall',
                    right: 'left_hall'
                },
                interact: {
                    item_mural_ziwenguitian: { x: 600, y: 380 },
                }
            },
            // 右殿
            right_hall: {
                id: 'right_hall',
                bg: ResMap.pic_broken_nezha_temple_right_hall,
                nav: {
                    down: null,
                    up: null,
                    left: 'main_hall',
                    right: 'back_hall'
                },
                interact: {
                    item_mural_lianhuatuosheng: { x: 600, y: 380 },
                }
            },
        },
    },

    // 龙王庙
    dragon_temple: {
        defaultViewId: 'main_hall',
        views: {

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
                nav: {},
                interact: {
                    item_motorcycle_key: { x: 800, y: 320 },
                    item_cookie_box: { x: 500, y: 300 },

                }
            }
        }
    },
};