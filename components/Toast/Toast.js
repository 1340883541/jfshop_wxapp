// components/Toast/Toast.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        relative:{
            type:String,
            value:'center'
        },
        isMask:{
            type:Boolean,
            value:false
        },
        isShowToast:{
            type:Boolean,
            value:false,
            observer:function(nVal){
                if(nVal){
                    var _this = this;
                    setTimeout(function(){
                        _this.setData({
                            isShowToast:false
                        })
                    },1500);
                }
            }
        },
        errTxt:{
            type:String,
            value:''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
