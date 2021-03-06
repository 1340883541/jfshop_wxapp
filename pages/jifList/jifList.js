const Ajax = require('../../utils/request.js');
const Nav = require('../../utils/navigate.js');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isShowJifRule: false,
        // 用户积分信息
        integral:'',
        integralLists: [],
        page: 1,
        totalPage: 1,
        isLoadSuc:false,
        // 空页面信息
        emptyTxt: '暂没有积分明细',
        isRefreshBalance: false,
        selected: true,
        selected1: false,
        // 充值弹框
        isHidden: true,
        integralA:'',
        moneyA:'',
        moneyLists:[],
        exchange:[],
        // 充值按钮遮罩
        ischongz_zhezhao:false,
        

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        this.fetchData();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (++this.data.page <= this.data.totalPage) {
            this.fetchData(true);
        } else {
            wx.showToast({
                title: '没有更多了',
                icon: 'none'
            });
        }
        
    },
    // 获取用户积分信息
    fetchData:function(isLoadMore = false){
        
        let _this = this;
        wx.showLoading({
            title: '正在加载中...',
        });
        Ajax.ajaxFunc({
            url: 'Api/MemberCenter/my_integral',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid'),
                now_page: _this.data.page,
                type: _this.data.selected ? 1 : _this.data.selected1 ? 2 : ''
            },
            success: function (res) {
                if (res.code == 1) {
                    // console.log(res.data.list)
                    _this.data.exchange = res.data.recharge_ratio
                    wx.hideLoading();
                    // 是否是加载更多
                    if (!isLoadMore) {
                        // 总页数
                        _this.data.totalPage = res.data.page.totalPages;
                        // 分页数据
                        _this.setData({
                            isLoadSuc:true,
                            integralLists: res.data.list,
                            moneyLists: res.data.list,
                            integral:res.data.userinfo.integral
                        });
                    } else {
                        let lists = _this.data.integralLists.concat(res.data.list);
                        _this.setData({
                            integralLists: lists
                        })
                    }
                }
            } 
        })
     
        Ajax.ajaxFunc({
            url:'',
            data:{
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success:function(res){

            }
        })
     
    },

    // 显示积分规则
    showJifRuleFn:function(){
        this.setData({
            isShowJifRule:true
        })
    },
     selected: function (e) {
      this.setData({
         selected1: false,
         selected: true,
         integralLists:[],
         moneyLists:[]
         
      })
       this.fetchData()
      
    },
    selected1: function (e) {
      this.setData({
        selected: false,
        selected1: true,
        integralLists:[],
        moneyLists:[]
      })
      this.fetchData()
    },
  modalinput:function(){
    this.setData({
        isHidden: !this.data.isHidden
    })  
  },
  //取消按钮  
  cancel: function () {
    this.setData({
        isHidden: true,
    });
  },
  //充值-确认  
  confirm: function () {
    let _this = this;
    if (this.checkIntegralFn(this.data.integralA) && this.checkMoneyFn(this.data.moneyA)){
        this.setData({
            ischongz_zhezhao:true
        })
      // ajax 请求
      Ajax.ajaxFunc({
        url: 'api/Pay/recharge',
        data: {
            openid: app.globalData.openId || wx.getStorageSync('openid'),
            integral: _this.data.moneyA,
            money: _this.data.integralA,
        },
        success: function (res) {
            if(res.data){
                  wx.requestPayment({
                      'timeStamp': res.data.timeStamp,
                      'nonceStr': res.data.nonceStr,
                      'package': res.data.package,
                      'signType': res.data.signType,
                      'paySign': res.data.paySign,
                      'success': function (res) { 
                          wx.showToast({
                            title: '充值成功',
                            icon: 'none'
                          })
                          _this.selected1();
                      },
                      'fail': function (res) { 
                          wx.showToast({
                              title: '充值失败',
                              icon: 'none'
                          })
                          _this.selected1();
                      },
                      'complete': function (res) {}
                })
            }
            _this.setData({
                isHidden: true,
            })
            setTimeout(function(){
                _this.setData({
                    ischongz_zhezhao: false
                })
            },2000)
          // if (res.code == 1) {
          // } else {
          //   wx.showToast({
          //     title: res.msg,
          //     icon: 'none'
          //   })
          // }
        },
        fail(res) {
            _this.setData({
                ischongz_zhezhao: false
            })
        }
      });
    }
    setTimeout(function () {
        _this.setData({
            ischongz_zhezhao: false
        })
     }, 2000)
  },
  // 记录 积分 输入的值
  interInpFn: function (e) {
    this.setData({
        integralA: e.detail.value,
      moneyA: (e.detail.value / this.data.exchange[0] * this.data.exchange[1]).toFixed(0)
    })
  },
  // 记录 金额 输入的值
  moneyInpFn: function (e) {
    this.setData({
      moneyA: e.detail.value
    })
  },
  //金额
  checkIntegralFn: function (integralA) {
    if (!integralA || integralA == '' || integralA == null || integralA == undefined) {
      wx.showToast({
        title: '请输入充值金额！',
        icon: 'none'
      })
      return false;
    }
    else {
      return true;
    }
  },
  //积分额 
  checkMoneyFn: function (moneyA) {
    if (!moneyA || moneyA == '' || moneyA == null || moneyA == undefined) {
      wx.showToast({
        title: '请输入充值金额!',
        icon: 'none'
      })
      return false;
    }
    else {
      return true;
    }
  }, 
})