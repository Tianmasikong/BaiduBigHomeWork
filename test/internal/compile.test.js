import assert from 'assert'

function isElementNode(node){
    return node.nodeType===1;
}
function isDirective(name){
    return name.includes('v-');
}
function getVal(vm,expr){
    expr=expr.split('.');
    return expr.reduce((prev,next)=>{
        return prev[next];
    },vm.$data)
}
function getTextVal(vm,expr){
    return expr.replace(/\{\{([^}]+)\}\}/g,(...arguments2)=>{
        return getVal(vm,arguments2[1]);
    })
}
describe('compile.js',function (){
    describe('#isElementNode()',function (){
        it('should return true if the arg is node',function (){
            let t={};
            t.nodeType=1;
            assert.equal(isElementNode(t),true);
        });
        it('should return false if the arg is not node',function (){
            let t={};
            t.nodeType=0;
            assert.equal(isElementNode(t),false);
        });
    });
    describe('#isDirective()',function (){
        it('should return true if the arg is v-',function (){
            assert.equal(isDirective('v-model'),true);
        });
    });
    describe('#getVal()',function (){
        it('should get the real arg',function (){
            let vm={}
            vm.$data={
                message:'abcd'
            }
            assert.equal(getVal(vm,'message'),'abcd');
        });
    });
    describe('#getTextVal()',function (){
        it('should get the real Textarg',function (){
            let vm={}
            vm.$data={
                message:'abcd'
            }
            assert.equal(getTextVal(vm,'{{message}}'),'abcd');
        });
    });
});

