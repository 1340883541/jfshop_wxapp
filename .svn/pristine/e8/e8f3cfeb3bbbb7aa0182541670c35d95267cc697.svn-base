// 获取全局用户对象数
const app = getApp();
const Nav = require('../../utils/navigate.js');
import WxParse from '../../wxParse/wxParse.js';
const ajax = require('../../utils/request.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailId:1, //详情id
        info:{}, //详情
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            detailId: options.id
        })
        this.getDtail();
    },
    getDtail(){
        var _this = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        ajax.ajaxFunc({
            url: 'api/MemberCenter/myAssetsInfo',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid'),
                id: _this.data.detailId
            },
            success: function (r) {
                // console.log(JSON.stringify(r))
                if (r.code == 1) {
                    _this.setData({
                        info: r.data
                    })
                    WxParse.wxParse('content', 'html', _this.data.info.content, _this, 0);
                }
                wx.hideLoading();
            }
        })
    } 
})