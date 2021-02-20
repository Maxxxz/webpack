// JavaScript异步与Promise实现
// https://zhuanlan.zhihu.com/p/26815654

// 简单实现Promise
// https://imweb.io/topic/5bbc264b6477d81e668cc930

// 30分钟，带你实现一个符合规范的 Promise
// https://zhuanlan.zhihu.com/p/139496058

// 一步一步实现自己的Promise
// https://zhuanlan.zhihu.com/p/137813682
function custom(fn) {
    this.fn = fn;
    this.state = 'pending';
    this.resFN = [];
    this.rejFN = [];
    this.result = [];
    let self = this;
    function reslove(res) {
        console.log('in reslove', res, self.resFN);
        self.state = 'resolved';
        self.resFN.forEach((fn) => {
            fn(res);
        });
    }

    function reject(rej) {
        self.state = 'rejected';
        self.rejFN.forEach((fn) => {
            fn(rej);
        });
    }
    fn(reslove, reject);
    // console.log('this.then', this.then);
}

custom.prototype.then = function (res, rej) {
    if (this.state === 'pending') {
        this.resFN.push(res);
        this.rejFN.push(rej);
    }
    return new custom((reslove, reject)=>{
        
    })
};
custom.prototype.catch = function (cb) {};

let t = new custom((res) => {
    setTimeout(() => {
        res('custom');
    }, 500);
});
t.then((res) => {
    console.log('then', res);
});
function test() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            rej(123);
            rej(1234);
        }, 500);
    });
}

var tttt = test();
tttt.then(
        (res) => {
            console.log('test then', res);
        },
        (err) => {
            console.log('err 2', err);
            return 'aaa';
        }
    )
    .catch((err) => {
        console.log('test catch', err);
        return 'ttt';
    }).then((res)=>{
        console.log('res 2', res)
    });
