// 论坛UI

var ForumUI = {
    PAGE: {
        WIDTH: 1200,
        HEIGHT: 608,
        BG: {
            resId: '$183071397',
            width: 32,
            height: 32,
        },
    },
    AVATAR: {
        ICON_01: '$183113921',
        ICON_02: '$183114062',
        ICON_03: '$183113921',
        ICON_04: '$183114062',
    },
    TOPIC: {
        HEIGHT: 48,
        BG_NORMAL: {
            resId: '$183003987',
            width: 32,
            height: 32,
        },
        BG_HIGHLIGHT: {
            resId: '$183071397',
            width: 32,
            height: 32,
        },
    },
    BTN: {

    },

    formatRelativeTime: function (timestamp) {
        if (!timestamp) return "";

        // 如果是数字且长度只有 10 位，说明是秒，需要乘 1000
        if (typeof timestamp === 'number' && timestamp.toString().length === 10) {
            timestamp = timestamp * 1000;
        }

        var date = new Date(timestamp);
        // TODO: now 可以指定时间戳, 注意要转成毫秒
        var now = new Date();

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
}