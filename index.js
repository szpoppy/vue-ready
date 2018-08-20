(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined"
        ? (module.exports = factory())
        : typeof define === "function" && define.amd
            ? define(factory)
            : (global.VueReady = factory());
})(window, function() {
    "use strict";

    function install(vue, init) {
        // 初始化函数
        if (typeof init == "function") {
            init = { init: init };
        }
        var initFn = init.init;
        // 设定在什么钩子函数中出发
        var hook = init.hook || "mounted";
        // 在钩子函数内部触发  默认之后
        var isIn = !!init.isIn;
        // ready 名称
        var name = init.readyName || "ready";

        // 是否初始化完成
        var isReady = false;
        var readyData;

        // 当 isInit 非， 寄存
        var readyList = [];

        // 运行ready
        function doReady(readys, that) {
            if (readys) {
                readyList.push([readys, that]);
            }
            if (isReady) {
                // 初始化完成后， 释放ready 钩子函数
                while (readyList.length) {
                    var xs = readyList.shift();
                    for (var i = 0; i < xs[0].length; i += 1) {
                        xs[0][i].call(xs[1], readyData);
                    }
                }
            }
        }

        // 初始化完成调用
        function end(data) {
            if (!isReady) {
                // 防止多次加载
                isReady = true;
                readyData = data;
                doReady();
            }
        }

        // 执行初始化函数
        initFn(end, vue);

        var mixinOpt = {};
        mixinOpt[hook] = function() {
            var readys = this.$options[name] || [];
            var _this = this;
            if (isIn) {
                // 当已经初始化后， 这个ready 操作是混入 [hook] 操作的
                doReady(readys, _this);
            } else {
                // 等 [hook] 钩子函数执行完成后，放入ready中
                setTimeout(function() {
                    doReady(readys, _this);
                }, 0);
            }
        };
        vue.mixin(mixinOpt);
        vue.config.optionMergeStrategies[name] = function(pVal, nVal) {
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
