const Nav = require('../../utils/navigate.js');
const ajax = require('../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      select: false,
    // 验证手机号参数
      count_time: 60,
      phoneVal: '',
      codeVal: '',
      nameVal:'',
      selLists: [], //前台展示select
      selectList:[], //存后台select
      index: 0,//选择的下拉列表下标
      selectShow: false,//控制下拉列表的显示隐藏，false隐藏、true显示
      supercust:'',
      array:[],
      selectId:0,
      cityLists: [], //前台展示cityLists
      hCityList: [], //存后台hCityList
      city: 0,//选择的下拉列表下标
      cityArea:'',
      //openIder:''
      scene1: '',//推荐人id
      scene2:'',//员工id
      verification:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
  // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    console.log(query)
    //  this.scene = decodeURIComponent(query.scene)
      if (query.scene) {
        let scene = decodeURIComponent(query.scene)
        // let scene = '1_0_14'
        scene = scene.split('_');
        this.setData({
            scene1: scene[0],
            scene2: scene[1],
            selectId: scene[2]
        })
        console.log(this.data.scene1)
        console.log(this.data.scene2)
        console.log(this.data.selectId)
    }
    this.region();
    this.verifyLogin();
  },
  // 验证是否已经可以直接进入商城
  verifyLogin() {
    // 获取可以直接进入首页的状态
    let isLogin = app.globalData.isLogin || wx.getStorageSync('isLogin');
      if (isLogin && isLogin == 1) {
      Nav.nav('reLaunch', '../index/index')
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
          _from:1,
          area_code: _this.cityArea
        },
        success: function (res) {
          //console.log(res)
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
            if(res.code == 5){
                wx.showModal({
                    title: '提示',
                    content: res.msg,
                    confirmText: '去登录',
                    confirmColor: '#a88c5d',
                    success(res) {
                        if (res.confirm) {
                            Nav.nav('redirectTo', '../verifyPhone/verifyPhone')
                        } else if (res.cancel) {
                            // donothing
                        }
                    }
                })
            }else{
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    mask: true,
                })
            }
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
    console.log(this.data.selectId)
    let _this = this;
    if (this.checkNameFn(this.data.nameVal) && this.checkPhoneFn(this.data.phoneVal) && this.checkCodeFn(this.data.codeVal)) {
      // ajax 绑定手机
      ajax.ajaxFunc({
        url: 'api/login/register',
        data: {
          openid: app.globalData.openId || wx.getStorageSync('openid'),
          area_id: _this.data.selectId != 0 ? _this.data.selectId : _this.data.selectList[0].id,
          username: _this.data.nameVal,
          phone: _this.data.phoneVal,
          code: _this.data.codeVal,
          supercustid: _this.data.scene1||0,
          staff: _this.data.scene2 || 0,
          // supercustid: 2,
          area_code: _this.cityArea
        },
        success: function (res) {   
          // 验证手机号
          if (res.code == 1) {
              wx.setStorageSync('isLogin', 1);
              app.globalData.isLogin = 1;
            //   Nav.nav('reLaunch', '../index/index')
              Nav.nav('reLaunch', '../person/person', { first_login: 1 })
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }
      });
    }
  },

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
  // 记录 name 输入的值
  nameInpFn: function (e) {
    this.setData({
      nameVal: e.detail.value
    })
  },
  // 验证手机号
  checkPhoneFn: function (phone) {
    let _this = this;
    // let phoneExp = /^1[345789][0-9]{9}$/g;
    // let phoneA = /^(\+?61|0)4\d{8}$/;
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
    else if (!phoneExp.test(phone)) {
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
  // 验证姓名
  checkNameFn: function (name) {
    if (!name || name == '' || name == null || name == undefined) {
      wx.showToast({
        title: '请输入姓名!',
        icon: 'none'
      })
      return false;
    }
    else {
      return true;
    }
  },
   // 点击服务归属下拉列表
  mySelect(e) {
    let Index = e.detail.value;//获取点击的下拉列表的下标
    this.setData({
      index: Index
    })
    this.data.selectId = this.data.selectList[e.detail.value].id
  },
  // 点击国家下拉列表
  mycity(e) {
    let city = e.detail.value;//获取点击的下拉列表的下标
    this.setData({
      city: city
    })
    this.cityArea = this.hCityList[e.detail.value].area_code
    // console.log(this.cityArea)
  },

  //获取区域，推荐人
  region:function(){
    let _this = this;
    let array = [];
    let cityArr = [];
      // ajax 请求
      ajax.ajaxFunc({
        url: 'api/login/getArea',
        data: {
          supercustid: _this.data.scene1 || 0
        },
        success: function (res) {
          // 回显
          if(res.code==1){
            _this.data.selectList = res.data.list;
            // _this.data.selectId = _this.data.selectId != 0 ? _this.data.selectId : res.data.list[0].id;
            _this.hCityList = res.data.country;
            // console.log(_this.hCityList)
            _this.cityArea = res.data.country[0].area_code
            res.data.list.map((v) => {
              array.push(v.name);
            });
            res.data.country.map((v) => {
              cityArr.push(v.name);
            });
            _this.data.selectList.map((v, i) => {
                if (_this.data.selectId == v.id) {
                    _this.setData({
                        index: i
                    })  
                }
            })
            console.log(_this.data.index)
            _this.setData({
              supercust: res.data.supercust,
              selLists: array,
              cityLists: cityArr

            })
          } 
        }
      });
    },
  // globalData: {
  //   openId: '',
  //   userInfo: {},
  //   searchTxt: '',
  //   cartNum: '',
  //   isLogin: 0
  // },
  // getOpenId: function (code){
  //    let _this = this;
  //   // ajax 请求
  //   ajax.ajaxFunc({
  //     url: 'api/MemberRegister/getOpenId',
  //     data: {
  //       js_code: code,
  //       _from:1,
  //     },
  //     success: function (res) {
  //       if (res.data.status == 1) {
  //         _this.openIder = res.data.openid
  //         console.log(this.openIder)
  //       }
  //       if (res.data.status == 0) {//未绑定手机
  //         _this.openIder = res.data.openid
  //         console.log(this.openIder+'wwww')
  //       }
  //     }
  //   });
  // },

})