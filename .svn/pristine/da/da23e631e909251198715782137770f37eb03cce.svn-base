const Nav = require('../../utils/navigate.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        money:0,
        origin:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options)
        this.setData({
            money:options.money
        })
        this.data.origin = options.origin;
    },
    onUnload: function () {
        if (!wx.getStorageSync('isRefreshPerson')){
            wx.setStorageSync('isRefreshPerson', 1);
        }
    },
    finishBtn(){
        if (this.data.origin == 'buy'){
            Nav.nav('redirectTo','../orderAll/orderAll',{state:3})
        }
        else {
            wx.setStorageSync('refreshOrder', 1)
            // Nav.nav('navigateBack',1);
            Nav.nav('redirectTo', '../orderAll/orderAll', { state: 3 })
        }
    }
})