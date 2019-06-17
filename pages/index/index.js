import ajax from '../../utils/request.js';
import {
    share
} from '../../utils/navigate.js';
let app = getApp();
Page({
    data: {
        imgUrls: [], // banner
        searTxt: '搜索',
        swiSear: false,
        searVal: '',
        themeUrls: [], // 爱心专题
        advArr: [], // 广告数据
        goods: [], // 热门商品
        new_goods: [], //发现新品
        good_class: [], //分类
        curIndex: 1,
        dotCount: 1,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 500,
        _indicatorDots: false,
        _autoplay: true,
        _interval: 5000,
        _duration: 500,
        scrollTop: 0,
        animationData: {},
        timer: '', //爱心专题滚动
        count: 0,
        isnav: false, //是否打开nav导航
        isMode: false, //活动弹框控制器
        actInfo: {}, //活动内容
        actId: 1, //活动id
    },
    onPullDownRefresh() {
        this.getData();
        // this.getActivity();
    },
    onLoad: function() {
        // 生命周期函数--监听页面加载
        var res = wx.getSystemInfoSync(),
            screenW = res.windowWidth,
            screenH = res.windowHeight;
        this.setData({
            "windowWidth": screenW + 'px', // 屏幕宽度
            "winHeight": screenH + 'px', //屏幕高度
            "themeW": screenW - 30 + 'px',
            "picHeight": "540rpx", // 图片高度
            "themeH": "400rpx",
            "dotCount": this.data.themeUrls.length
        });
        this.getData();
        this.getActivity();
        this.formSubmit();
        // wx.startPullDownRefresh()
    },
    // 监听tabbar切换
    onTabItemTap(item) {
        this.setData({
            isnav: false
        })
    },
    //用于发送模板消息
    formSubmit: function(e) {
        // console.log('模板发送');
        // ajax.ajaxFunc({
        //     url: 'api/index/getFormId',
        //     data: {
        //         openid: app.globalData.openId || wx.getStorageSync('openid')
        //     },
        //     success: function (r) {
        //         console.log(JSON.stringify(r))
        //     }
        // })
    },
    // 分享
    onShareAppMessage: function() {
        let shareParam = share({
            path: 'pages/index/index',
            title: '金鼎管家中心',
            success: function() {
                wx.showToast({
                    title: '转发成功',
                })
            }
        });
        return shareParam;
    },
    // onShareAppMessage: function (res) {
    //     if (res.from === 'button') {
    //         // 来自页面内转发按钮
    //         console.log(res.target)
    //     }
    //     return {
    //         title: '金鼎管家中心',
    //         path: 'pages/index/index'
    //     }
    // },  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.setStorageSync('searchTxt', '');
        wx.setStorageSync('clsId', '');
        this.setData({
            searTxt: '搜索',
            swiSear: false,
            searVal: ''
        });

        if (wx.getStorageSync('isRefreshPerson') == 1) {
            wx.removeStorageSync('isRefreshPerson');
            this.getData();
        }

        if (app.globalData.cartNum > 0) {
            wx.setTabBarBadge({
                index: 2,
                text: app.globalData.cartNum
            })
        } else {
            wx.removeTabBarBadge({
                index: 2
            })
        }
    },
    // 搜索聚焦时
    focusInputFunc(e) {
        this.setData({
            swiSear: true,
            isnav: false
        })
    },
    // 搜索失焦时
    blurInputFunc(e) {
        let val = e.detail.value;
        if (val != '') {
            this.setData({
                searTxt: val,
                searVal: val,
                swiSear: false
            })
        } else {
            this.setData({
                searTxt: '搜索',
                searVal: '',
                swiSear: false
            })
        }
    },
    // 确认搜索时
    bindconfirm(e) {
        let val = e.detail.value;
        app.globalData.searchTxt = val;
        wx.setStorageSync('searchTxt', val)
        wx.setStorageSync('clsId', '')
        wx.switchTab({
            url: '/pages/good/good'
        })
    },
    // 分类跳转到商品列表
    goToClalist: function(e) {
        // console.log(e)
        let clsid = e.currentTarget.dataset.id;
        app.globalData.clsId = clsid;
        wx.setStorageSync('clsId', clsid)
        wx.setStorageSync('searchTxt', '')
        wx.switchTab({
            url: '/pages/good/good'
        })
    },
    intervalChange: function(e) {
        // 爱心专题的轮播图滑动，修改当前swiper 的index
        let index = e.detail.current + 1;

        this.setData({
            curIndex: index
        })
    },

    animationFunc() {
        const _this = this;
        if (wx.createSelectorQuery) {

            var query = wx.createSelectorQuery(),
                _h = 0,
                advL = (this.data.advArr.length - 2);

            // 广告位的滚动动画对象
            var animation = wx.createAnimation({
                timingFunction: 'ease',
                transformOrigin: '0 50%'
            });

            query.select('.adv-more').boundingClientRect(function(rect) {
                // 设置广告位的滚动
                _h = (rect.height) + 1; // 滚动高度

                clearInterval(_this.data.timer);

                _this.data.timer = setInterval(function() {

                    if (_this.data.count < advL) {
                        // 累加滚动次数
                        _this.data.count++;

                        // 设置动画滚动参数
                        animation.translateY('-' + _this.data.count * _h + 'px').step({
                            duration: 1500
                        });
                    } else {
                        // 滚动次数重置
                        _this.data.count = 0;

                        // 设置动画滚动参数
                        animation.translateY('-' + (advL + 1) * _h + 'px').step({
                            duration: 1500
                        });

                        animation.translateY('0px').step({
                            duration: 0
                        });
                    }


                    _this.setData({
                        animationData: animation.export()
                    })

                }, 3000)

            }).exec();
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },

    // 从后台获取数据渲染
    getData() {
        const _this = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        ajax.ajaxFunc({
            url: 'api/index/index',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function(r) {
                wx.hideLoading();
                wx.stopPullDownRefresh();
                if (r.code == 1) {
                    _this.setData({
                        imgUrls: r.data.banner,
                        advArr: r.data.bulletin.concat(r.data.bulletin[0]),
                        themeUrls: r.data.love,
                        dotCount: r.data.love.length,
                        goods: r.data.goods,
                        new_goods: r.data.new_goods,
                        good_class: r.data.class
                    })
                    if (_this.data.advArr.length > 1) {
                        _this.animationFunc();
                    }
                }

            }
        })
    },
    //后台获取活动推荐 
    getActivity() {
        var _this = this;
        ajax.ajaxFunc({
            url: 'api/Activity/index',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function(r) {
                // console.log(JSON.stringify(r))
                if (r.code == 1) {
                    if (r.data != '') {
                        _this.setData({
                            actInfo: r.data,
                            actId: r.data.id
                        })
                        setTimeout(function() {
                            _this.setData({
                                isMode: true
                            })
                        }, 500)
                    }
                }
                wx.hideLoading();
            }
        })

    },
    // 跳转到外链
    gotoWeb: function(e) {
        let typ = e.currentTarget.dataset.type,
            url = e.currentTarget.dataset.url,
            goodsId = e.currentTarget.dataset.goodid;
        console.log(typ, url)
        if (typ != 0) {
            // 跳转到商品
            if (typ == 1) {
                wx.navigateTo({
                    url: '../goodDetail/goodDetail?id=' + goodsId
                })
            }
            // 跳转到自定义
            else if (typ == 2) {
                wx.navigateTo({
                    url: '../webpage/webpage?url=' + url
                })
            }
        }
    },
    // 跳转到商品详情
    goToDetail: function(e) {
        var id = e.currentTarget.dataset.id;
        // 进入商品详情
        wx.navigateTo({
            url: '../goodDetail/goodDetail?id=' + id
        })
    },
    //跳转到商品列表
    gotoGoodsList() {
        wx.switchTab({
            url: '/pages/good/good'
        })
    },
    //跳转到公告列表
    gotoNotice() {
        wx.navigateTo({
            url: '../noticeList/noticeList',
        })
    },
    // 跳转到爱心专题详情
    gotoLheartDel(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../lheartDetail/lheartDetail?id=' + id,
        })
    },
    // 跳转到爱心专题列表
    gotoLheart() {
        wx.navigateTo({
            url: '../lheartList/lheartList',
        })
    },
    //分类导航-触屏后移动事件显示与否
    opennav() {
        var that = this;
        if (!this.data.isnav) {
            that.setData({
                isnav: (!that.data.isnav)
            });
        } else {
            that.setData({
                isnav: (!that.data.isnav)
            });
        }
        
    },
    //关闭活动弹框
    closeModeFunc() {
        this.setData({
            isMode: false
        })
    },
    // 打开活动详情
    openDetail() {
        var that = this;
        // 进入活动详情
        wx.navigateTo({
            url: '../active/active?id=' + that.data.actId
        })
        this.setData({
            isMode: false
        })
    }
})