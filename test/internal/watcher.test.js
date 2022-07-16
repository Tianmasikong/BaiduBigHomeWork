import assert from 'assert'
class Watcher{
    constructor(vm,expr,cb) {
        this.vm=vm;
        this.expr=expr;
        this.cb=cb
    }
    getVal(vm,expr){
        expr=expr.split('.');
        return expr.reduce((prev,next)=>{
            return prev[next];
        },vm.$data)
    }
    get(){
        return this.getVal(this.vm, this.expr);
    }
}
describe('watcher.js',function (){
    describe('#constructor()',function (){
        it('should construct correctly',function (){
            let t=new Watcher('1','2','3')
            assert.equal(t.vm,'1');
            assert.equal(t.expr,'2');
            assert.equal(t.cb,'3');
        });
    });
    describe('#get()',function (){
        it('should get the real arg',function (){
            let vm={}
            vm.$data={
                message:'abcd'
            }
            let t=new Watcher(vm,'message','3')
            assert.equal(t.get(),'abcd');
        });
    });
});
