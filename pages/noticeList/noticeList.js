// pages/noticeList/noticeList.js
const Nav = require('../../utils/navigate.js');
import ajax from '../../utils/request.js';
let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        items: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.renderFunc();
    },

    // /**
    //  * 用户点击右上角分享
    //  */
    // onShareAppMessage: function () {

    // },

    // 从后台获取数据渲染
    renderFunc(){
        let _this = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        ajax.ajaxFunc({
            url: 'api/Bulletin/index',
            data: {
                nowPage: 1,
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function(r){
                if (r.code == 1) {
                    _this.setData({
                        items: r.data.bulletinList || []
                    })
                }
                wx.hideLoading();
            }
        })
    },

    // 跳转到公告详情
    skipNoticeDetail: function(e){
        let id = e.currentTarget.dataset.id;
        Nav.nav('navigateTo','../noticeDetail/noticeDetail', {id: id});
    }
})