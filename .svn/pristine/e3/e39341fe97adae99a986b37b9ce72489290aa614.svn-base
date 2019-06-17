module.exports = Behavior({
    methods:{
        _parent:function(){
            var parentNodes = this.getRelationNodes('../Comment/comment');

            if(parentNodes && parentNodes.length) {
                return parentNodes[0]
            } else {
                return this;
            }
        },
        _siblings:function(name, bigName){
            var siblingNodes = this._parent().getRelationNodes(`../${name}/${bigName}`);
            console.log(siblingNodes)

            if (siblingNodes && siblingNodes.length) {
                return siblingNodes[0];
            } else {
                return this;
            }
        }
    }
})