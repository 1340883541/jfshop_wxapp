
// components/PayPopup/PayPopup.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        isShowPay:{
            type:Boolean,
            value:false
        },
        // 支付积分金额
        payIntegral:{
            type:String,
            value:'0'
        },
        // 是否可以用积分
        isUseIntegral:{
            type:Boolean,
            value:true
        },
        // 积分金额
        userIntegral:{
            type:String,
            value:''
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        aniData:{},
        //支付按钮遮罩
        ispaysh_zhezhao: false,
        isintopay_zhezhao: false
    },
    /**
     * 组件的方法列表
     */
    methods: {
        // 稍后支付
        waitPayFn:function(){
            this.setData({
                ispaysh_zhezhao:true
            })
            let _this = this;
            setTimeout(function () {
                _this.triggerEvent('hide')
                _this.setData({
                    ispaysh_zhezhao: false
                })
            }, 500)
            
        },
        // 积分支付
        IntePayFn(e){
            this.setData({
                isintopay_zhezhao: true
            })
            let _this = this;
            if (this.data.isUseIntegral){
                this.triggerEvent('paysuc')
                // console.log(e)
                // let id = e.currentTarget.dataset.id;
                // Nav.nav('navigateTo', '../orderDetail/orderDetail', { id: id });
            }
            else{
                wx.showToast({
                    title: '积分不足，支付失败',
                    icon:'none'
                })
                this.setData({
                    isShowPay:false,
                    isintopay_zhezhao: false
                })
            }
        }
    }
})
