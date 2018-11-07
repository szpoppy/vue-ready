# vue-ready  

## 给Vue增加一个ready钩子函数

## vue自带这么多钩子函数，为啥还要个ready？  
vue钩子函数很多，不过这些钩子函数都是在vue本身的生命周期有关，却没有一个走的是项目过程。vue-ready就是为了让项目过程更简单。

## 能做什么？  
* vue-rady 给vue中，增加了一个ready的钩子函数。执行顺序默认是在 mounted 之后。
* 当首次初始化的时候，会调用init初始化函数，当init初始化标识为已经完成后，vue钩子函数 mounted 出发之后才会出发 ready 函数。

## 1.1.0 新增功能
 * 2018-10-15 更新多条件触发内容 read不仅可以是函数，而且可以时对象函数，多种触发并存
## 1.1.1 新增功能
 * 2018-11-07 增加参数寄存器

## 示例
````javascript
// 初始化 钩子函数 ready
import VueReady from "vue-ready"
Vue.use(VueReady, function(end) {
    // 获取用户身份
    ajax.getUserInfo("...", function() {
        // 已经获取到用户身份
        end({userId: '10001'});
    })

    // 1.1.0 新增功能 可以触发多次不一样的
    ajax.getSign("...", function(){
        // 获取风控信息 单独处罚 sign 函数
        end({sign:"kkkkkkk"}, "sing");
    })
})

````

````javascript
// vue中，实际触发
{
    mounted () {
        console.log('先触发')
    },
    // 如果只有一个ready
    ready (data) {
        console.log('ready', '后触发', data.userId)
    },
    // 多个 触发函数 V1.1.0 新增功能
    ready: {
        // 默认ready
        ready () {
            // ...
        },
        // 自定义的 sign， 上面代码中
        sing () {
            // ...
        }
    }
}

````

## 获取安装  
> npm install vue-ready

## API  
````javascript
// 引入vue
import VueReady from "vue-ready"
// 初始化（方式一） 函数为初始化的函数
Vue.use(VueReady, function(end) {
    // 获取用户身份
    // end函数，执行表示我已经初始化完毕了
    // end函数回调时，可以把数据作为第一个参数，之后将作为ready钩子函数的参数
})

// 初始化（方式二） 
Vue.use(VueReady, {
    init (end) {
        // 通上面的 初始化函数
    },
    // 和vue哪个钩子函数关联
    hook: 'mounted',
    // 是否 hook 对应的钩子函数中执行，默认为否，在之后执行
    isIn: false,
    // 钩子函数 ready的名称，可以自定义ready的名称
    readyName : 'ready'
})

// 钩子函数
{
    // vue中的钩子函数
    [readyName] (data) {
        // 能执行到这里，说明已经初始化
        // data的值，就是end函数执行时，传入的第一个参数
    }
}
````