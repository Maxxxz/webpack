class Compile {
    // el是宿主元素选择器
    // vm是KVue实例
    constructor(el, vm) {
        this.$vm = vm;

        this.$el = document.querySelector(el);

        // 先把模板移动到fragment标签中，更新完成后在追加回来
        this.$fragment = this.node2Fragment(this.$el);
        // 执行编译
        this.compile(this.$fragment);
        // 追加
        this.$el.appendChild(this.$fragment);
    }

    node2Fragment(el) {
        // 移动操作
        const fragment = document.createDocumentFragment();
        let child;
        while ((child = el.firstChild)) {
            console.log('child 000', child);
            // 移动操作
            // appendChild 可以把一个dom节点移动到另外一个dom节点，所以上面的赋值才不会导致死循环
            fragment.appendChild(child);
        }
        return fragment;
    }

    // 递归el，分别处理文本节点和元素节点
    compile(el) {
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach((node) => {
            if (node.nodeType == 1) {
                // 元素节点 <p k-text="abc" @click="onClick"></p>
                console.log('元素节点：' + node.nodeName);
                this.compileElement(node);
            } else if (this.isInter(node)) {
                // 文本节点，且内容是{{xxx}}实行
                console.log('插值文本：' + node.textContent);
                this.compileText(node);
            }

            // 递归子节点
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node);
            }
        });
    }
    // 文本节点，且内容是{{xxx}}实行
    isInter(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    // 编译元素节点
    compileElement(node) {
        // 遍历所有属性
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach((attr) => {
            // 规定：指令以k-xxx="yyy"命名
            const attrName = attr.name; // 属性名称 k-xxx
            const exp = attr.value; // 属性值 yyy，对应的是vue data或者$options.method里的数据
            if (attrName.indexOf('k-') == 0) {
                const dir = attrName.substring(2); // 截取出指令
                // 执行指令解析
                this[dir] && this[dir](node, exp);
            } else if (attrName.indexOf('@') === 0) {
                // 处理@的事件
                const dir = attrName.substring(1); // 截取出指令
                this.eventHandler(node, exp, dir);
            }
        });
    }
    
    compileText(node) {
        const exp = RegExp.$1;
        this.update(node, exp, 'text');
    }

    // 通用update方法
    update(node, exp, dir) {
        // 获取更新函数
        let updator = this[dir + 'Updator'];
        // 初始化，首次页面赋值
        updator && updator(node, this.$vm[exp]);

        // 创建Watcher
        // 创建watcher的时候会触发依赖收集
        new Watcher(this.$vm, exp, function (value) {
            updator && updator(node, value);
        });
    }

    textUpdator(node, value) {
        node.textContent = value;
    }

    text(node, exp) {
        this.update(node, exp, 'text');
    }

    html(node, exp) {
        this.update(node, exp, 'html');
    }
    htmlUpdator(node, value) {
        node.innerHTML = value;
    }

    model(node, exp) {
        // 添加watcher和依赖收集
        this.update(node, exp, 'model');
        node.addEventListener('input', (e) => {
            console.log('input input', e.target.value);
            this.$vm[exp] = e.target.value;
        });
    }

    modelUpdator(node, value) {
        // 更新model绑定对象的值。目前只支持input，所以用value就可以了。
        node.value = value;
    }

    eventHandler(node, exp, dir) {
        const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
        if (fn && dir) {
            node.addEventListener(dir, fn.bind(this.$vm));
        }
    }
}
