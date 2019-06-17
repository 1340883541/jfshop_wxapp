const Ajax = require('../../utils/request.js');
import WxParse from '../../wxParse/wxParse.js';
const Nav = require('../../utils/navigate.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        username:'',
        //会员编号
        vip_no:'',
        //剩余积分
        integral:'',
        //积分卡等级
        vip_title:'',
        //积分明细
        integral_rule:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function (options) {
        this.ruleData();

    },
    // 
    ruleData: function () {
        let _this = this;
        wx.showLoading({
            title: '正在加载中...',
        });
        Ajax.ajaxFunc({
            url: 'api/MemberCenter/integralRule',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function (res) {
                wx.hideLoading();
                if (res.code == 1) {
                    _this.setData({
                        username: res.data.username,
                        vip_no: res.data.vip_no,
                        integral: res.data.integral,
                        vip_title: res.data.vip_title,
                        integral_rule: res.data.integral_rule,
                    })
                    WxParse.wxParse('about', 'html', _this.data.integral_rule, _this, 0);
                }
            }
        })

    },

})