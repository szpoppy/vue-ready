export default function install(vue, init) {
    // 初始化函数
    if(typeof init == "function"){
        init = {init}
    }
    let initFn = init.init;
    // 设定在什么钩子函数中出发
    let hook = init.hook || "mounted";
    // 在钩子函数内部触发  默认之后
    let isIn = !!init.isIn;
    // ready 名称
    let name = init.readyName || "ready";

    // 是否初始化完成
    let isReady = false;
    let readyData;

    // 当 isInit 非， 寄存
    let readyList = []

    // 运行ready
    function doReady(readys, that) {
        if (readys) {
            readyList.push([readys, that])
        }
        if (isReady) {
            // 初始化完成后， 释放ready 钩子函数
            while (readyList.length) {
                let [rdys, me] = readyList.shift()
                rdys.forEach(function (fn) {
                    fn.call(me, readyData)
                })
            }
        }
    }

    // 初始化完成调用
    function end(data) {
        if(!isReady) {
            // 防止多次加载
            isReady = true;
            readyData = data;
            doReady();
        }
    }

    // 执行初始化函数
    initFn(end, vue);

    vue.mixin({
        [hook] () {
            let readys = this.$options[name] || []
            if (isIn) {
                // 当已经初始化后， 这个ready 操作是混入 [hook] 操作的
                doReady(readys, this);
            } else {
                // 等 [hook] 钩子函数执行完成后，放入ready中
                setTimeout(() => doReady(readys, this), 0);
            }
        }

    })
    vue.config.optionMergeStrategies[name] = function (pVal, nVal) {
        let val = pVal instanceof Array ? pVal : pVal ? [pVal] : []
        if (nVal) {
            val.push(nVal)
        }
        return val;
    }
}