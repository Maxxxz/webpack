

class VueRouter {
    constructor(options){
        // 声明map，把path和component存储起来
        this.routeMap = {};

        // current保存当前hash
        // vue使其保持响应式
        this.app = new Vue({
            data: {
                current: '/'
            }
        })
    }
}