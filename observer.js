class Observer{
    constructor(data) {
        this.observe(data);
    }
    observe(data){
        //对data数据将原有的属性改成get和set的形式
        if(!data||typeof data!=='object'){
            return;
        }
        // 将数据一一接触 先获取data的key和value
        Object.keys(data).forEach(key=>{
            //劫持
           this.defineReactive(data,key,data[key]);
           this.observe(data[key]);
        });
    }
    //定义响应式
    defineReactive(obj,key,value){
        let that=this;
        let dep=new Dep();
        Object.defineProperty(obj,key,{
          enumerable:true,
          configurable:true,
          get() {
              Dep.target&&dep.addSub(Dep.target)
              return value;
          },
          set(v) {
              if(v!==value){
                  that.observe(v);
                  value=v;
                  dep.notify();//通知所有人数据更新
              }
          },
        });
    }
}
//发布订阅
class Dep{
    constructor() {
        //订阅的数组

        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
    notify(){
        this.subs.forEach(watcher=>watcher.update());
    }
}
