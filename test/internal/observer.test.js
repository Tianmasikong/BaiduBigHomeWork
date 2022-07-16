import assert from 'assert'
class Dep{
    constructor() {
        //订阅的数组
        this.subs=[]
    }
    addSub(watcher){
        this.subs.push(watcher);
    }
}
describe('observer.js',function (){
    describe('#addSub()',function (){
        it('should push the sub',function (){
            let t=new Dep()
            let watcher = {}
            t.addSub(watcher)
            assert.equal(t.subs.length,1);
        });
    });
});
