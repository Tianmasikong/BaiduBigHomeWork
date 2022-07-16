class Compile{
    //编译
    constructor(el,vm) {
        this.el=this.isElementNode(el)?el:document.querySelector(el);
        this.vm=vm;
        if(this.el){
            //获取元素后才能开始编译
            //1.把DOM移入内存 fragment
            let fragment=this.node2fragment(this.el);
            //2.编译：提取想要的元素节点 v-model和文本节点{{}}
            this.compile(fragment)
            //3.将编译好的fragment塞回页面中
            this.el.appendChild(fragment);
        }
    }

    //方法

    //判断是否为node
    isElementNode(node){
        return node.nodeType===1;
    }
    //将div中的内容塞入fragment
    node2fragment(el){
        //划分内存中的空间
        let fragment=document.createDocumentFragment();
        let firstChild;
        while(firstChild = el.firstChild){
            fragment.appendChild(firstChild);
        }
        return fragment;
    }
    //判断指令格式
    isDirective(name){
        return name.includes('v-');
    }


    //编译文本{{}}
    compileText(node){
        let expr=node.textContent;//取文本中的内容
        let reg=/\{\{([^}]+)\}\}/g;
        if(reg.test(expr)){
            //node this.vm.$data text
            CompileUtil['text'](node,this.vm,expr);
        }
    }
    //编译元素<div>
    compileElement(node){
        let attrs=node.attributes;//取出当前节点的属性
        Array.from(attrs).forEach(attr=>{
            //判断属性名是否包含v-
            if(this.isDirective(attr.name)){
                //取到对应的值放到节点的值上
                let expr =attr.value;
                let [,type]=attr.name.split('-');
                //node this.vm.$data expr
                CompileUtil[type](node,this.vm,expr);
            }
        })
    }
    //编译
    compile(fragment){
        //递归
        let childNodes=fragment.childNodes;
        Array.from(childNodes).forEach(node=>{
            if(this.isElementNode(node)){
                //是元素节点,需要递归compile
                this.compileElement(node)
                this.compile(node)
            }else{
                //是文本节点
                this.compileText(node)
            }
        })
    }
}


CompileUtil={
    getVal(vm,expr){//获取实例上对应的数据
        expr=expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next];
        },vm.$data)
    },
    getTextVal(vm,expr){
        return expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
            return this.getVal(vm,arguments[1]);
        })
    },
    text(node,vm,expr){//文本处理
        let updateFn=this.updater['textUpdater'];
        let value=this.getTextVal(vm,expr);
        expr.replace(/\{\{([^}]+)\}\}/g,(...arguments)=>{
            new Watcher(vm,arguments[1],(newValue)=>{
                //如果数据变化了，文本节点需要重新获取以来的数据
                updateFn&&updateFn(node,this.getTextVal(vm,expr));
            });
        })
        updateFn&&updateFn(node,value);
    },
    setVal(vm,expr,value){
        expr=expr.split('.');
        //收敛
        return expr.reduce((prev,next,currentIndex)=>{
            if(currentIndex===expr.length-1){
                return prev[next] = value;
            }
            return prev[next];
        },vm.$data)
    },
    model(node,vm,expr){//输入框处理
        let updateFn=this.updater['modelUpdater'];
        //数据变化了调用watch的callback
        new Watcher(vm,expr,(newValue)=>{
            updateFn&&updateFn(node,this.getVal(vm,expr));
        })
        node.addEventListener('input',(e)=>{
            let newValue=e.target.value;
            this.setVal(vm,expr,newValue)
        })
        updateFn&&updateFn(node,this.getVal(vm,expr));
    },
    updater:{
        //文本更新
        textUpdater(node,value){
            node.textContent=value;
        },
        //输入框更新
        modelUpdater(node,value){
            node.value=value;
        }
    }
}

