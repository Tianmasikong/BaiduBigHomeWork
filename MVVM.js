class MVVM{
    constructor(options) {
        //赋值
        this.$el=options.el;
        this.$data=options.data;
        //编译
        if(this.$el){
            //数据劫持 把对象的所有属性改成get set方法
            let observer=new Observer(this.$data);
            this.proxyData(this.$data);
            //用数据和元素进行编译
            let compile=new Compile(this.$el,this);
        }
    }
    //数据代理
    proxyData(data){
        Object.keys(data).forEach(key=>{
            Object.defineProperty(this,key,{
                get(){
                    return data[key]
                },
                set(v) {
                    data[key]=v
                }
            })
        })
    }

}

