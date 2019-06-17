// pages/search/search.js
import ajax from '../../utils/request.js';
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hot: [],
        last: [],
        searTxt: '搜索商品'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.renderFunc();

        this.setData({
            searTxt: app.globalData.searchTxt || wx.getStorageSync('searchTxt')
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    // 点击搜索
    bindconfirm(e){
        let val = e.detail.value;

        app.globalData.searchTxt = val;
        wx.setStorageSync('searchTxt', val)
        wx.setStorageSync('clsId', '')

        wx.switchTab({
            url: '/pages/good/good'
        })
    },

    // 从后台获取数据进行渲染
    renderFunc() {
        const _this = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        ajax.ajaxFunc({
            url: 'api/goods/searchGoods',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function (r) {
                if (r.code == 1) {
                    _this.setData({
                        hot: r.data.hot_kwd,
                        last: r.data.last_kwd
                    })
                }
                wx.hideLoading();
            }
        })
    },

    // 点击历史搜索或者点击热门搜索
    searchTap(e){
        let oType = e.currentTarget.dataset.type;
        let oIndex = e.currentTarget.dataset.index;

        console.log(oType);
        console.log(oIndex);

        if(oType == 'hot'){
            app.globalData.searchTxt = this.data.hot[oIndex];
            wx.setStorageSync('searchTxt', this.data.hot[oIndex])
            // wx.setStorageSync('clsId', '')

            wx.switchTab({
                url: '/pages/good/good'
            })
        }else{
            app.globalData.searchTxt = this.data.last[oIndex];
            wx.setStorageSync('searchTxt', this.data.last[oIndex])
            // wx.setStorageSync('clsId', '')

            wx.switchTab({
                url: '/pages/good/good'
            })
        }
    },

    // 清空最近搜索
    delFunc(){
        const _this = this;
        wx.showModal({
            title: '提示',
            content: '是否确定清空最近搜索',
            success: function (res) {
                if (res.confirm) {
                    ajax.ajaxFunc({
                        url: 'api/goods/clear_search',
                        data: {
                            openid: app.globalData.openId || wx.getStorageSync('openid')
                        },
                        success: function (r) {
                            if (r.code == 1) {
                                wx.showToast({
                                    title: r.msg,
                                    icon: 'success',
                                    duration: 1500
                                })
                                _this.setData({
                                    last: []
                                })
                            }
                        }
                    })
                }
            }
        })
    }
})