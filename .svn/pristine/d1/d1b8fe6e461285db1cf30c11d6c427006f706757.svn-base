//app.js
import ajax from './utils/request.js';
const Nav = require('./utils/navigate.js');
App({
    onLaunch: function (options) {
        const _this = this;
        // 检测session 是否失效
        wx.checkSession({
            success() {
                // console.log('suc')
                if(!wx.getStorageSync('openid') || !wx.getStorageSync('isLogin')){
                    _this.loginFunc();
                }else{
                    _this.shoppingCart(wx.getStorageSync('openid'));

                }
            },
            fail() {
                // console.log('fail')
                _this.loginFunc();
            }
        });
      wx.getSystemInfo({
        success: function (res) {
        //   console.log(res)
          _this.globalData.windowHeight = res.windowHeight
        //   console.log(_this.globalData.windowHeight)
        },
      })

        this.initNetwork();
    },
    // 登录流程
    loginFunc(){
        let _this = this;
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    console.log(res)
                    //发起网络请求
                    _this.getOpenId(res.code);
                    // 获取用户信息
                    wx.getSetting({
                        withCredentials: false,
                        success: res => {
                            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                            wx.getUserInfo({
                                success: res => {
                                    console.log(res)
                                    if(!wx.getStorageSync('headport')){
                                        wx.setStorageSync('headport', res.userInfo.avatarUrl)
                                        console.log(res.userInfo.avatarUrl)
                                        if (res.userInfo.avatarUrl) {
                                            this.updateHead({head:res.userInfo.avatarUrl, nickname:res.userInfo.nickName})
                                        }
                                    }
                                    // 可以将 res 发送给后台解码出 unionId
                                    _this.globalData.userInfo = res.userInfo;
                                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                    // 所以此处加入 callback 以防止这种情况
                                    if (_this.userInfoReadyCallback) {
                                        _this.userInfoReadyCallback(res)
                                    }

                                },
                                fail(err){
                                    console.log(err)
                                }
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.errMsg,
                    })
                }
            }
        })
    },
    globalData: {
        openId: '',
        userInfo: {},
        searchTxt: '',
        cartNum: '',
        isLogin:0,
        windowHeight:''
    },
    // 获取openid
    getOpenId(code){
        const _this = this;
        ajax.ajaxFunc({
            url: 'Api/MemberRegister/get_user_openid',
            data: {
                js_code: code
            },
            success: function (r) {
                console.log(r)
                if (r.code == 1) {
                    if(r.data && r.data.openid){
                        wx.setStorageSync('openid', r.data.openid);
                        _this.globalData.openId = r.data.openid || wx.getStorageSync('openid');
                        _this.shoppingCart(r.data.openid);
                        // 由于 openid获取 是网络请求，可能会在 Page.onLoad 之后才返回
                        if (_this.openidReadyCallback) {
                            _this.openidReadyCallback(r)
                        }
                    }else{
                        // 由于 openid获取 是网络请求，可能会在 Page.onLoad 之后才返回
                        if (_this.openidReadyCallback) {
                            _this.openidReadyCallback(false)
                        }
                    }
                    // 验证是否登录成功
                    if(r.data && r.data.status){
                        wx.setStorageSync('isLogin', 1);
                        _this.globalData.isLogin = r.data.status || wx.getStorageSync('isLogin');
                        Nav.nav('reLaunch','../index/index')
                        // 由于 是否直接登录 是网络请求，可能会在 Page.onLoad 之后才返回
                        if (_this.isLoginReadyCallback) {
                            _this.isLoginReadyCallback(r.data.status)
                        }
                    }else{
                        wx.setStorageSync('isLogin', 0);
                        // 由于 是否直接登录 是网络请求，可能会在 Page.onLoad 之后才返回
                        if (_this.isLoginReadyCallback) {
                            _this.isLoginReadyCallback(false)
                        }
                    }
                } else {
                    if (wx.getStorageSync('openid') && wx.getStorageSync('isLogin')){
                        _this.globalData.openId = wx.getStorageSync('openid');
                        _this.shoppingCart(wx.getStorageSync('openid'));
                    } else {
                        // 由于 openid获取 是网络请求，可能会在 Page.onLoad 之后才返回
                        if (!wx.getStorageSync('openid') && _this.openidReadyCallback) {
                            _this.openidReadyCallback(false)
                        }
                        // 由于 是否直接登录 是网络请求，可能会在 Page.onLoad 之后才返回
                        if (wx.getStorageSync('isLogin') && _this.isLoginReadyCallback) {
                            _this.isLoginReadyCallback(false)
                        }
                        if (!r.data) {
                            _this.getOpenId(code);
                        }
                    }
                }
            }
        })
    },
    // 更新用户信息
    updateHead({head,nickname}){
        let _this = this;
        wx.setStorageSync('headport', head)
        ajax.ajaxFunc({
            url: 'Api/MemberRegister/register',
            data: {
                openid: _this.globalData.openId || wx.getStorageSync('openid'),
                head: head,
                nick_name: nickname
            },
            success(res) {
            }
        })
    },
    shoppingCart(openId){
        const _this = this;
        if (wx.setTabBarBadge) {
            ajax.ajaxFunc({
                url: 'api/cart/getCartCount',
                data: {
                    openid: openId
                },
                success: function (r) {
                    if(r.code == 1){
                        _this.globalData.cartNum = r.data.count;
                        
                        if(_this.globalData.cartNum > 0){
                            wx.setTabBarBadge({
                                index: 2,
                                text: r.data.count
                            })
                        }else{
                            wx.removeTabBarBadge({
                                index: 2
                            })
                        }
                        
                    }
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    // 监听网络状态
    initNetwork:function(){
        wx.onNetworkStatusChange(function (res) {
            if (!res.isConnected) {
                wx.showToast({
                    title: '你当前处于无网络状态，请切换网络',
                    icon: 'none'
                });
                wx.setStorageSync('isRefreshCart', 1);
                wx.setStorageSync('isRefreshPerson', 1);
            } else {
                if (res.networkType === '2g') {
                    wx.showToast({
                        title: '你当前处于2g网络状态，请切换网络',
                        icon: 'none'
                    });
                    wx.setStorageSync('isRefreshCart', 1);
                    wx.setStorageSync('isRefreshPerson', 1);
                }
                if (res.networkType === '3g') {
                    wx.showToast({
                        title: '你当前处于3g网络状态',
                        icon:'none'
                    });
                    wx.setStorageSync('isRefreshCart', 1);
                    wx.setStorageSync('isRefreshPerson', 1);
                }
                let pages = getCurrentPages();
                let currPages = pages[pages.length - 1];
                currPages.onLoad();
            }
        })
    }
})