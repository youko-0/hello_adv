// 工具类
console.log('[LOAD] utils');

const Utils = {

    // 系统时间
    formatSystemTimeStr: function (fullYear = 0) {
        var now = new Date();
        if (fullYear) {
            // 修改年份
            now.setFullYear(fullYear);
        }
        var year = now.getFullYear();
        // 月份 + 1
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        // 换行
        var timeStr = `${hours}:${minutes}
        ${year}/${month}/${day}`;
        return timeStr
    },

    // 格式化时间戳为相对时间
    formatRelativeTime: function (timestamp, fullYear = 0) {
        if (!timestamp) return "";

        // 如果是数字且长度只有 10 位，说明是秒，需要乘 1000
        if (typeof timestamp === 'number' && timestamp.toString().length === 10) {
            timestamp = timestamp * 1000;
        }

        var date = new Date(timestamp);
        var now = new Date();
        if (fullYear) {
            // 修改年份
            now.setFullYear(fullYear);
        }

        var diff = now.getTime() - date.getTime();

        function pad(n) { return n < 10 ? '0' + n : n; }
        var timeStr = pad(date.getHours()) + ":" + pad(date.getMinutes());

        // 1小时内
        if (diff >= 0 && diff < 3600000) {
            // 如果是刚刚（1分钟内），显示“刚刚”
            if (diff < 60000) return "刚刚";
            return Math.floor(diff / 60000) + "分钟前";
        }

        // 今天
        if (date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()) {
            return "今天 " + timeStr;
        }

        // 昨天
        var yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.getFullYear() === yesterday.getFullYear() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getDate() === yesterday.getDate()) {
            return "昨天 " + timeStr;
        }

        // 今年
        if (date.getFullYear() === now.getFullYear()) {
            return pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + " " + timeStr;
        }

        // 跨年
        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
    },

    /**
     * 限制文本长度
     * 规则：超过 limit 个字，保留 (limit-1) 个字并加上 ".."
     * @param {string} str - 原始字符串
     * @param {number} limit - 最大限制字数 (默认 4)
     */
    truncateText: function (str, limit = 4) {
        if (!str) return ""; // 防止传空报错

        // 如果长度超过限制
        if (str.length > limit) {
            // 截取前 limit - 1 个字符，拼接省略号
            return str.substring(0, limit - 1) + "..";
        }

        // 没超过限制，直接返回
        return str;
    },

    // 估算字符宽度
    measureCharWidth: function (char, fontSize) {
        var code = char.charCodeAt(0);
        // 1. 汉字和全角字符 (Unicode > 255)
        if (code > 255) {
            return fontSize;
        }
        // 2. 空格 (空格通常比普通字母窄)
        if (char === ' ') {
            return fontSize * 0.35;
        }
        // 3. 大写字母 (比小写稍微宽一点，约 0.7)
        if (code >= 65 && code <= 90) {
            return fontSize * 0.7;
        }
        // 4. 其他 ASCII (小写字母、数字、半角标点，约 0.55~0.6)
        return fontSize * 0.6;
    },

    // 计算文本宽度
    calcTextWidth: function (text, fontSize) {
        var width = 0;
        for (var i = 0; i < text.length; i++) {
            width += this.measureCharWidth(text[i], fontSize);
        }
        return width;
    },

    // 计算文本高度(自动换行)
    calcTextHeight: function (content, fontSize = 28, containerWidth = 580, spacing=1.5) {
        if (!content) return 0;

        const singleLineHeight = fontSize * spacing;

        let paragraphs = content.toString().split('\n');
        let totalLines = 0;

        paragraphs.forEach(para => {
            if (para.length === 0) {
                totalLines += 1; // 空行也算一行
                return;
            }

            let currentLineWidth = 0;
            currentLineWidth += this.calcTextWidth(para, fontSize);

            // 向上取整
            let linesInPara = Math.ceil(currentLineWidth / containerWidth);
            totalLines += Math.max(1, linesInPara);
        });

        console.log(`calcTextHeight: totalLines: ${totalLines}, singleLineHeight: ${singleLineHeight}`);

        // 总行数 * 单行高度
        return totalLines * singleLineHeight;
    },

    // 计算文本宽高
    calcTextSize: function (content, fontSize = 28) {
        let width = this.calcTextWidth(content, fontSize);
        let height = fontSize * 1.5
        return { width: width, height: height };
    },

    /**
     * 辅助函数：将长文本切分为页
     * @param {string} text 完整文本
     * @param {number} fontSize 字号
     * @param {number} maxW 最大宽度
     * @param {number} maxLines 每页最大行数
     * @returns {Array} 页码数组 ['第一页内容...', '第二页内容...']
     */
    paginateText: function (text, fontSize, maxW, maxLines) {
        let pages = [];
        let currentLines = []; // 当前页的所有行
        let currentLine = "";  // 当前正在拼凑的行

        for (let char of text) {
            // 试探性加上这个字
            let testLine = currentLine + char;

            let w = this.calcTextWidth(testLine, fontSize);

            if (w > maxW) {
                // 超宽了，说明 currentLine 已经是这一行的极限
                currentLines.push(currentLine);
                currentLine = char; // 这个字放到下一行开头
            } else {
                currentLine = testLine;
            }

            // 检查行数是否满了
            if (currentLines.length >= maxLines) {
                pages.push(currentLines.join('\n'));
                currentLines = [];
            }
        }

        // 处理剩下的尾巴
        if (currentLine.length > 0) {
            currentLines.push(currentLine);
        }
        if (currentLines.length > 0) {
            pages.push(currentLines.join('\n'));
        }

        return pages;
    }
}
