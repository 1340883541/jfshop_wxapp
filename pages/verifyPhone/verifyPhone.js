const Nav = require('../../utils/navigate.js');
const ajax = require('../../utils/request.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 验证手机号参数
        count_time: 60,
        phoneVal: '',
        codeVal: '',
        city: 0,//选择的下拉列表下标
        cityArea: '',
        cityLists: [], //前台展示cityLists
        hCityList: [], //存后台hCityList
        verification: '',//验证手机号,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.verifyLogin();
        // this.region();
    },
    onShow:function(){
        this.verifyLogin();
        this.region();
    },
    // 验证是否已经可以直接进入商城
    verifyLogin() {
        // 获取可以直接进入首页的状态
        let isLogin = app.globalData.isLogin || wx.getStorageSync('isLogin');
        if (isLogin && isLogin == 1) {
            Nav.nav('reLaunch','../index/index')
        } else {
        }
    },

    // 倒计时
    starCount() {
        if (this.checkPhoneFn(this.data.phoneVal)) {
            let _this = this;
            _this.setData({
                count_time: _this.data.count_time - 1
            })
            ajax.ajaxFunc({
                url: 'api/MemberRegister/snssend',
                data: {
                    phone: _this.data.phoneVal,
                    openid: app.globalData.openId || wx.getStorageSync('openid'),
                    area_code: _this.cityArea
                },
                success: function (res) {
                    console.log(res)
                    if (res.code == 1) {
                        wx.showToast({
                            title: '验证码发送成功'
                        });
                        _this.setData({
                            count_time: _this.data.count_time - 1
                        })
                        let timer = setInterval(function () {
                            if (_this.data.count_time > 0) {
                                _this.setData({
                                    count_time: _this.data.count_time - 1
                                })
                            } else {
                                clearInterval(timer);
                                _this.setData({
                                    count_time: 60
                                })
                            }
                        }, 1000);
                    } else {
                        wx.showToast({
                            title: res.msg,
                            icon: 'none'
                        })
                        _this.setData({
                            count_time: 60
                        })
                    }
                }
            })
        }
    },
    // 完成验证
    finishVerifyFn: function () {
        let _this = this;
        if (this.checkPhoneFn(this.data.phoneVal) && this.checkCodeFn(this.data.codeVal)) {
            // ajax 绑定手机
            ajax.ajaxFunc({
                url: 'api/MemberRegister/validate_phone',
                data: {
                    openid: app.globalData.openId || wx.getStorageSync('openid'),
                    phone: _this.data.phoneVal,
                    code: _this.data.codeVal,
                    area_code: _this.cityArea
                },
                success: function (res) {
                    // 验证手机号
                    if (res.code == 1) {
                        wx.setStorageSync('isLogin', 1);
                        app.globalData.isLogin = 1;
                        wx.setStorageSync('yg_data', res.data.yg_data);
                        wx.setStorageSync('first_login', res.data.first_login);
                        if (res.data.first_login == 1){
                            Nav.nav('reLaunch', '../person/person', { first_login: res.data.first_login});
                        }else{
                            Nav.nav('reLaunch', '../index/index')
                        }
                    } else {
                        wx.showToast({
                            title: res.msg,
                            icon: 'none'
                        })
                    }
                }
            });
//console.log(_this.data)
        }
    },
    // 用户登录（第一次登录跳个人中心，其他跳首页）
    // userLoginFn(){
    //     ajax.ajaxFunc({
    //         url: 'api/MemberRegister/validate_phone',
    //         data: {
    //             openid: app.globalData.openId || wx.getStorageSync('openid'),
    //             phone: _this.data.phoneVal,
    //             code: _this.data.codeVal,
    //             //area_code: _this.cityArea
    //         },
    //         success: function (res) {
    //             // 验证手机号
    //             if (res.code == 1) {
    //                 // wx.setStorageSync('isLogin', 1);
    //                 // app.globalData.isLogin = 1;
    //                 // Nav.nav('reLaunch','../index/index')
    //             } else {
    //                 wx.showToast({
    //                     title: res.msg,
    //                     icon: 'none'
    //                 })
    //             }
    //         }
    //     });
    // },
    // 记录 input 输入的值
    phoneInpFn: function (e) {
        this.setData({
            phoneVal: e.detail.value
        })
    },
    // 记录 code 输入的值
    codeInpFn: function (e) {
        this.setData({
            codeVal: e.detail.value
        })
    },
    // 验证手机号
    checkPhoneFn: function (phone) {
      let _this = this;
        //let phoneExp = /^1[345789][0-9]{9}$/g;
        //let phoneA = /^(\+?61|0)4\d{8}$/;
      this.hCityList.forEach((item, i) => {
        if (i == _this.data.city) {
          _this.setData({
            verification: item.validate_rules
          })
        }
      })
      let phoneExp = new RegExp(_this.data.verification);
        if (!phone || phone == '' || phone == null || phone == undefined) {
            wx.showToast({
                title: '请输入手机号!',
                icon: 'none'
            })
            return false;
        }
        else if (!phoneExp.test(phone)){
          wx.showToast({
            title: '手机号错误，请校验一下!',
            icon: 'none'
          })
          return false;
        }
        else {
            return true;
        }
    },
    // 验证验证码
    checkCodeFn: function (code) {
        if (!code || code == '' || code == null || code == undefined) {
            wx.showToast({
                title: '请输入验证码!',
                icon: 'none'
            })
            return false;
        }
        else {
            return true;
        }
    },
  // 点击国家下拉列表
  mycity(e) {
   // console.log(e)
    let city = e.detail.value;//获取点击的下拉列表的下标
    this.setData({
      city: city,
    })
    this.cityArea = this.hCityList[e.detail.value].area_code
  },
  //获取区域，推荐人
  region: function () {
    let _this = this;
    let cityArr = [];
    // ajax 请求
    ajax.ajaxFunc({
      url: 'api/login/getArea',
      data: {
        supercustid: 0
      },
      success: function (res) {
        // 回显
        if (res.code == 1) {
          _this.hCityList = res.data.country;
          _this.cityArea = res.data.country[0].area_code;
          res.data.country.map((v) => {
            cityArr.push(v.name);
          });
          _this.setData({
            cityLists: cityArr
          })
        }
      }
    });
  },
  register:function(){
    wx.navigateTo({
      url: '../register/register'
    })
  },
  bangding:function(){
      Nav.nav('redirectTo', '../login/login')
  },
})