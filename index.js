/**
 * 2018-10-15 更新多条件触发内容 read不仅可以是函数，而且可以时对象函数，多种触发并存
 */

(function (global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ?
        (module.exports = factory()) :
        typeof window.define === "function" && window.define.amd ?
        window.define(factory) :
        (global.VueReady = factory());
})(window, function () {
    "use strict";

    function install(vue, init) {
        // 初始化函数
        if (typeof init == "function") {
            init = {
                init: init
            };
        }
        var initFn = init.init;
        // 设定在什么钩子函数中出发
        var hook = init.hook || "mounted";
        // 在钩子函数内部触发  默认之后
        var isIn = !!init.isIn;
        // ready 名称
        var name = init.readyName || "ready";

        // 默认的key
        var defKey = "ready";

        // 是否初始化完成
        var isReady = {};
        var readyData = {};

        // 当 isInit 非， 寄存
        var readyList = {};

        function pushReadyByOne(fn, that, key) {
            if (!readyList[key]) {
                readyList[key] = [];
            }
            readyList[key].push([fn, that]);
        }

        function pushReady(readys, that) {
            var rs, i;
            for (var i = 0; i < readys.length; i += 1) {
                rs = readys[i];
                if (typeof rs == 'function') {
                    pushReadyByOne(rs, that, defKey);
                } else {
                    for (var n in rs) {
                        pushReadyByOne(rs[n], that, n);
                    }
                }
            }
        }

        function doReadyByOne(key) {
            var list = readyList[key] || [];
            var xs;
            while (list.length) {
                xs = list.shift();
                xs[0].call(xs[1], readyData[key]);
            }
        }

        // 运行ready
        function doReady(readys, that, key) {
            if (readys) {
                pushReady(readys, that);
            }
            // 初始化完成后， 释放ready 钩子函数
            if (key) {
                doReadyByOne(key);
            } else {
                for (var k in isReady) {
                    doReadyByOne(k);
                }
            }
        }

        // 初始化完成调用
        function end(data, key) {
            if (!key) {
                key = defKey;
            }
            if (!isReady[key]) {
                // 防止多次加载
                isReady[key] = true;
                readyData[key] = data;
                doReady(key);
            }
        }

        // 执行初始化函数
        initFn(end, vue);

        var mixinOpt = {};
        mixinOpt[hook] = function () {
            var readys = this.$options[name] || [];
            var _this = this;
            if (isIn) {
                // 当已经初始化后， 这个ready 操作是混入 [hook] 操作的
                doReady(readys, _this);
            } else {
                // 等 [hook] 钩子函数执行完成后，放入ready中
                setTimeout(function () {
                    doReady(readys, _this);
                }, 0);
            }
        };
        vue.mixin(mixinOpt);
        vue.config.optionMergeStrategies[name] = function (pVal, nVal) {
            var val = pVal instanceof Array ? pVal : pVal ? [pVal] : [];
            if (nVal) {
                val.push(nVal);
            }
            return val;
        };
    }

    return {
        default: install,
        install: install
    };
});