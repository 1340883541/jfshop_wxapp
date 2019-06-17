const app = getApp();
const Ajax = require('../../utils/request.js');
const WxParse = require('../../wxParse/wxParse.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.fetchData();
    },
    // 获取用户数据,渲染用户商城
    fetchData:function(){
        let _this = this;
        wx.showLoading({
            title: '',
        });
        Ajax.ajaxFunc({
            url:'Api/MemberCenter/about_shop',
            data:{
                openid:app.globalData.openId || wx.getStorageSync('openid')
            },
            success:function(res){
                wx.hideLoading();
                if(res.code == 1){
                    WxParse.wxParse('about', 'html', res.data.content, _this, 0);
                }
            }
        })
    }
})