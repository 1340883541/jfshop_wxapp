const Nav = require('../../utils/navigate.js');
const ajax = require('../../utils/request.js');
const md5 = require('../../utils/md5.js');
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 验证手机号参数
    accountVal: '',
    passVal: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.verifyLogin();
    //this.region();
  },
    onShow: function () {
        this.verifyLogin();
    },
  // 验证是否已经可以直接进入商城
  verifyLogin() {
    // 获取可以直接进入首页的状态
    let isLogin = app.globalData.isLogin || wx.getStorageSync('isLogin');
      console.log(isLogin)
      if (isLogin && isLogin == 1) {
      Nav.nav('reLaunch', '../index/index')
    } else {
    }
  },
  // 记录 input 输入的值    
  phoneInpFn: function (e) {
    this.setData({
      accountVal: e.detail.value
    })
  },
  // 记录 pass 输入的值
  codeInpFn: function (e) {
    this.setData({
      passVal: e.detail.value
    })
  },
  // 验证验证码
  checkCodeFn: function (pass) {
    if (!pass || pass == '' || pass == null || pass == undefined) {
      wx.showToast({
        title: '请输入密码!',
        icon: 'none'
      })
      return false;
    }
    else {
      return true;
    }
  },

  // 验证账号
  checkAccFn: function (account) {
    if (!account || account == '' || account == null || account == undefined) {
      wx.showToast({
        title: '请输入账号!',
        icon: 'none'
      })
      return false;
    }
    else {
      return true;
    }
  },
  // 完成验证
  finishVerifyFn: function () {
    let _this = this;
    if (this.checkAccFn(this.data.accountVal) && this.checkCodeFn(this.data.passVal)) {
      // ajax 绑定手机
      ajax.ajaxFunc({
        url: 'Api/login/staffLogin',
        type:'post',
        data: {
          openid: app.globalData.openId || wx.getStorageSync('openid'),
          username: _this.data.accountVal,
          password: md5.hexMD5(_this.data.passVal),
        },
        success: function (res) {
          // 验证手机号
          if (res.code == 1) {
            wx.setStorageSync('isLogin', 1);
            app.globalData.isLogin = 1;
            Nav.nav('reLaunch', '../index/index')
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

  register: function () {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  bangding:function(){
    Nav.nav('redirectTo', '../verifyPhone/verifyPhone')
  }
})