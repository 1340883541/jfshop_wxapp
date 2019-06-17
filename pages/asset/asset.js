// 获取全局用户对象数
const app = getApp();
const Nav = require('../../utils/navigate.js');
const ajax = require('../../utils/request.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        assetList:[], //我的资产列表
        page: 1,
        totalPage: 1,
        scrollTop: 0,
        height: '',
        isconcat:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getAsset();
        wx.getSystemInfo({
            success: (res) => {
                this.setData({
                    height: res.windowHeight
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    //后台获取活动推荐 
    getAsset() {
        var _this = this;
        // console.log(this.data.page)
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        ajax.ajaxFunc({
            url: 'api/MemberCenter/myAssets',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid'),
                now_page: _this.data.page
            },
            success: function (r) {
                // console.log(JSON.stringify(r))
                if (r.code == 1) {
                    if(r.data != ''){
                        if(r.data.list != ''){
                            _this.setData({
                                assetList: _this.data.isconcat == 0 ? r.data.list : _this.data.assetList.concat(r.data.list)
                            })
                        }
                        _this.setData({
                            page: r.data.page.now_page,
                            totalPage: r.data.page.totalPages

                        })
                    }
                    
                }
                wx.hideLoading();
            }
        })

    },
    // 分页
    lower() {
        if (this.data.page < this.data.totalPage) {
            let page = this.data.page + 1;
            this.setData({
                page: page,
                isconcat: 1
            })
            this.getAsset();
        }
        
    },
    opendetail(e){
        var id = e.currentTarget.id;
        // 进入商品详情
        wx.navigateTo({
            url: '../assetDetail/assetDetail?id=' + id
        })
    }



})