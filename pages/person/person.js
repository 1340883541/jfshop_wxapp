
// 获取全局用户对象数
const app = getApp();
const Nav = require('../../utils/navigate.js');
const Ajax = require('../../utils/request.js');
let requestCount = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        user:{},
        // 是否可以得到
        isGetInfo: true,
        personInfo:{},
        tag:0,

        // 预览二维码
        imgalist: ['https://www.cslpyx.com/weiH5/jrx.jpg', 'https://www.cslpyx.com/weiH5/mmd.jpg'],

        // 欢迎用户弹框
        isHidden: true,
        first_login: 2,
        yg_data:{},

    },
    onPullDownRefresh() {
        this.setData({
            isHidden: true,
        })
        this.showNologinFn(true);
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            first_login: options.first_login ? options.first_login : 2
        })

        // 动态设置当前页面的导航标题
        wx.setNavigationBarTitle({
            title: '个人中心'
        });
        this.showNologinFn(true);
        // 120s 会重新刷新一次
        setTimeout(function () {
            wx.setStorageSync('isRefreshPerson', 1)
        }, 100);
        // 未获取授权的情况下，重新获取
        if (!this.data.isGetInfo) {
            this.showNologinFn(true);
        }
        // 控制页面是否需要重新加载
        let isRefreshPerson = wx.getStorageSync('isRefreshPerson');
        let getOpenidErrPerson = wx.getStorageSync('getOpenidErrPerson');
        if (isRefreshPerson == 1) {
            this.fetchData();
        }
        // 如果openid获取失败
        if (getOpenidErrPerson) {
            let _this = this;
            //再一次请求获取openid
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                        //发起网络请求
                        Ajax.ajaxFunc({
                            url: 'Api/MemberRegister/get_user_openid',
                            data: {
                                js_code: res.code
                            },
                            success: function (r) {
                                if (r.code == 1) {
                                    app.globalData.openId = r.data.openid || wx.getStorageSync('openid');
                                }
                                _this.fetchData();
                                wx.removeStorageSync('getOpenidErrPerson');
                            }
                        })
                    }
                }
            });
        }

        wx.removeStorageSync('isRefreshPerson');
    },
    onShow: function () {
        wx.setStorageSync('searchTxt', '');
        wx.setStorageSync('clsId', '');
        // this.setData({
        //     hiddenmodalput: true,
        // })
    },
    // 是否显示未获取授权
    showNologinFn: function (isOnload = false) {
        if (!wx.getStorageSync('headport')) {
            this.setData({
                isGetInfo: false
            })
        } else {
            // 授权成功
            this.setData({
                isGetInfo: true
            });
            this.fetchData();
        }
    },
    // 获取用户信息，及其订单数量
    fetchData:function(){
        let _this = this;
        wx.showLoading({
            title: '正在加载中...',
        })
        // console.log(app.globalData)
        Ajax.ajaxFunc({
            url: "Api/MemberCenter/member_center",
            data: {
                openid:app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function (res) {
                console.log(res.code + 'code')
                wx.stopPullDownRefresh();
                if (res.code == 1) {
                    if (_this.data.first_login == 1) {
                        _this.setData({
                            isHidden: false,
                            yg_data: wx.getStorageSync('yg_data') ? wx.getStorageSync('yg_data') : {}
                        })
                    }
                    console.log(_this.data.first_login)
                    console.log(_this.data.yg_data)
                    wx.hideLoading();
                    // 初始化信息
                    let user = {},personInfo = {};
                    user.avatarUrl = res.data.head || app.globalData.userInfo.avatarUrl;
                    user.nickName = res.data.nick_name || app.globalData.userInfo.nickName;
                    user.username = res.data.username;
                    personInfo.id = res.data.id;
                    personInfo.integral = res.data.integral;
                    personInfo.phone = res.data.phone;
                    personInfo.phone = personInfo.phone.replace(/(\d{3})\d{6}(\d{2})/, '$1******$2')
                    personInfo.w_pay = res.data.w_pay;
                    personInfo.w_payment = res.data.w_payment;
                    personInfo.w_cancel = res.data.w_cancel;
                    personInfo.vip_title = res.data.vip_title;
                    personInfo.vip_no = res.data.vip_no;
                    _this.setData({
                        user:user,
                        personInfo: personInfo,
                        tag: res.data.tag ? res.data.tag : 0,
                    })
                    console.log(_this.data.tag + 'tag')
                    
                }else if(res.code == 0){
                    _this.ajaxFail(_this.fetchData);
                }else if(res.code==3){
                    wx.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }else if(res.code==4){
                    wx.setStorageSync('openid', ''); 
                    wx.setStorageSync('isLogin', 0);
                    wx.clearStorageSync();
                    app.globalData.isLogin = 0;
                  wx.showToast({
                    title: res.msg,
                    icon: 'none'
                  })
                  Nav.nav('redirectTo', '../verifyPhone/verifyPhone')
                }
            }
        });
    },
    // openid 未读取到，重新加载一次数据
    ajaxFail:function (fn) {
        let _this = this,
            timer;
        ++requestCount;
        if (app.globalData.openId || wx.getStorageSync('openid')) {
            fn && typeof fn === 'function' && fn();
            requestCount = 0;
        } else {
            setTimeout(function () {
                clearTimeout(timer);
                if (requestCount <= 5){
                    fn && typeof fn === 'function' && fn();
                }
                else{
                    wx.showToast({
                        title: '请求失败，请切换页面重试一下！',
                        icon:'none'
                    });
                    wx.setStorageSync('getOpenidErrPerson', true)
                }
            }, 1000);
        }
    },
    // 跳转到积分
    skipJifen(){
        //员工无权限
        if (this.data.tag && this.data.tag == 1) {
            wx.showToast({
                title: '员工无此权限',
                icon: 'none'
            })
        }
        //非员工有权限跳转（tag为未定义或tag为0）
        if (!this.data.tag || this.data.tag == 0) {
            Nav.nav('navigateTo', '../jifList/jifList');
        }
    },
    // 跳转到订单所有的页面
    gotoOrderAll(e){
        let state = e.currentTarget.dataset.state;
        Nav.nav('navigateTo', '../orderAll/orderAll', {state: state});
    },
    // 获取用户信息
    getUserInfo: function (e) {
        var _this = this;
        if (e.detail.errMsg == 'getUserInfo:ok') {
            wx.setStorageSync('headport', e.detail.userInfo.avatarUrl)
            Ajax.ajaxFunc({
                url:'Api/MemberRegister/register',
                data:{
                    openid: app.globalData.openId || wx.getStorageSync('openid'),
                    head: e.detail.userInfo.avatarUrl,
                    nick_name: e.detail.userInfo.nickName
                },
                success(res) {
                    console.log(res)
                    app.globalData.userInfo = e.detail.userInfo;
                    _this.showNologinFn();
                }
            })
        } else {
            // 点击的拒绝
            // 不做处理
        }
    },
    skipAbout(){
        Nav.nav('navigateTo','../about/about')
    },
    skipAsset(){
        //员工无权限
        if (this.data.tag && this.data.tag == 1) {
            wx.showToast({
                title: '员工无此权限',
                icon: 'none'
            })
        }
        //非员工有权限跳转（tag为未定义或tag为0）
        if (!this.data.tag || this.data.tag == 0) {
            Nav.nav('navigateTo', '../asset/asset')
        }
    },
    skipShare() {
      Nav.nav('navigateTo', '../share/share')
    },
    // 退出登录
    skipOutlogin(){
        wx.showModal({
            title: '提示',
            content: '您确认要退出么？',
            confirmColor: '#a88c5d',
            success(res) {
                if (res.confirm) {
                    Ajax.ajaxFunc({
                        url: 'api/MemberCenter/loginOut',
                        data: {
                            openid: app.globalData.openId || wx.getStorageSync('openid')
                        },
                        success(res) {
                            console.log(res.code + 'outlogin')
                            if (res.code == 1) {
                                wx.setStorageSync('openid', '');
                                wx.setStorageSync('isLogin', 0);
                                wx.clearStorageSync();
                                app.globalData.isLogin = 0;
                                Nav.nav('redirectTo', '../verifyPhone/verifyPhone')
                            }
                        }
                    })
                } else if (res.cancel) {
                    //do-nothing
                }
            }
        })
        
    },
    // 进入积分规则
    goJfruleFunc(){
        Nav.nav('navigateTo', '../rule/rule')
    },
    skipEquity(){
        Nav.nav('navigateTo', '../rule/rule')
    },

    // 欢迎用户弹框关闭
    modeConfirm(){
        this.setData({
            isHidden: true,
        })
    }
})