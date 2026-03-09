// 通用 System 结构

/**
 * 系统构造工厂
 * @param {string} varName - 存入 ac.var 的变量名
 * @param {Function} defaultDataFactory - 返回默认数据的函数（防止引用污染）
 * @param {Object} customMethods - 该系统特有的方法
 */
const createSystem = function (varName, defaultDataFactory, customMethods) {
    // 基础系统对象
    const baseSystem = {
        _cache: null, // 闭包内也是安全的，但在对象属性里更直观
        VAR_NAME: varName,

        /**
         * 获取数据（懒加载核心）
         */
        getData: function () {
            if (this._cache == null) {
                // 1. 读取
                let jsonStr = ac.var[this.VAR_NAME];
                let data = null;

                // 2. 解析
                if (jsonStr && jsonStr.length > 0) {
                    try {
                        data = JSON.parse(jsonStr);
                    } catch (e) {
                        console.error(`【${this.VAR_NAME}】存档损坏:`, e);
                    }
                }

                // 3. 补全默认值（深度合并的简化版，这里假设最外层结构）
                const defaultData = defaultDataFactory();
                if (data == null) {
                    data = defaultData;
                } else {
                    // 防止旧存档缺少新字段，简单的浅层补全
                    // 如果需要深层补全，可以用 Object.assign 或手动判断
                    for (let key in defaultData) {
                        if (data[key] === undefined) {
                            data[key] = defaultData[key];
                        }
                    }
                }

                this._cache = data;
                console.log(`【${this.VAR_NAME}】数据加载完毕`);
            }
            return this._cache;
        },

        /**
         * 保存数据
         */
        save: function () {
            // 防御：没读过就不许存
            if (this._cache == null) return;

            let jsonStr = JSON.stringify(this._cache);
            ac.var[this.VAR_NAME] = jsonStr;
            console.log(`【${this.VAR_NAME}】已保存: ${jsonStr}`);
        },

        /**
         * 强制重置（调试用）
         */
        reset: function () {
            this._cache = defaultDataFactory();
            this.save();
            console.log(`【${this.VAR_NAME}】已重置`);
        }
    };

    // 【关键步骤】将“基础逻辑”和“自定义方法”合并
    // 类似于 Python 的多重继承或 Mixin
    return Object.assign(baseSystem, customMethods);
};