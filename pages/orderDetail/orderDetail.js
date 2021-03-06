// pages/orderDetail/orderDetail.js
import ajax from '../../utils/request.js';
const Nav = require('../../utils/navigate.js');
const app = getApp();

// 日期选择器数据
const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []
const seconds = []

for (let i = 1990; i <= date.getFullYear()+10; i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    i < 10 ? months.push('0' + i) : months.push(i)
}

for (let i = 1; i <= 31; i++) {
    i < 10 ? days.push('0' + i) : days.push(i)
}
for (let i = 1; i <= 24; i++) {
    i < 10 ? hours.push('0' + i) : hours.push( i)
}
for (let i = 0; i <= 60; i++) {
    i < 10 ? minutes.push('0' + i) : minutes.push(i)
}
for (let i = 0; i <= 60; i++) {
    i < 10 ? seconds.push('0' + i) : seconds.push(i)
}


Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderId: 0,
        dataJ: {},
        isShowPay: false,       // 支付弹框
        payMoney: 0,            // 支付价格
        userIntegral: '0',//总积分
        isUseIntegral: false,//是否能够用积分

        // 服务详情信息
        clickIndex:'',

        goodsList:[],

        // 服务类订单模板
        temp_conf: [
        ], //上传后台服务信息
        date: '',
        stardate: '',
        enddate: '',
        tempAddrIndex: 0,
        // 日期控制器
        years: years,
        year: date.getFullYear(),
        months: months,
        month: '',
        days: days,
        day: '',
        value: [],
        chooseSize: false,
        animationData: {},
        d_index: '',
        d_tindex: '',
        //时间控制器
        years2: years,
        year2: date.getFullYear(),
        months2: months,
        month2: '',
        days2: days,
        day2: '',
        hour: 1,
        hours: hours,
        minutes: minutes,
        minute: 0,
        seconds: seconds,
        second: 0,
        value2: [],
        chooseSize2: false,
        animationData2: {},
        d_index2: '',
        d_tindex2: '',
        isShowTxtarea:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderId: options.id
        })
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        this.renderFunc();
        // 订单模板
        // 获取当前日期（年月日）
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        var Y = date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //获取当日日期 
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        this.setData({
            month: M,
            day: D,
            month2: M,
            day2: D,
            // date: Y + '-' + M + '-' + D,
            stardate: Y - 1 + '-' + M + '-' + D,
            enddate: Y + 1 + '-' + M + '-' + D,

        })
        this.data.years.map((v, index) => {
            if (v == Y) {
                this.setData({
                    value: [index, this.data.month - 1, this.data.day - 1]
                })
                return;
            }
        })
        this.data.years.map((v, index) => {
            if (v == Y) {
                this.setData({
                    value2: [index, M - 1, D - 1]
                })
                return;
            }
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.renderFunc();
    },

    // 渲染列表
    renderFunc() {
        const _this = this;
        ajax.ajaxFunc({
            url: 'api/order/info',
            data: {
                id: this.data.orderId,
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function (r) {
                // console.log(r);
                if (r.code == 1) {
                    _this.setData({
                        dataJ: r.data,
                        goodsList:r.data.goods.map(v => {
                            if (v.temp_conf && v.temp_conf.length>0){
                                v.temp_conf.map(val => {
                                    if (val.type == 2){
                                        let ret2 = val.option_value.findIndex((v) => {
                                            return v == val.val;
                                        });
                                        val.idx = ret2
                                    }else{
                                        val.idx = 0;
                                    }
                                    if (val.type == 3) {
                                        val.option_value = val.option_value.map((vl, idx) => {
                                            // console.log(vl)
                                            let nVl = {};
                                            nVl.name = vl;
                                            nVl.isChecked = ~val.val.indexOf(vl);
                                            return nVl;
                                        })
                                    }
                                    return val;
                                })
                            }
                            v.txt = '编辑';
                            v.isEdit = false;
                            return v;
                        })
                    })
                    
                }
                wx.hideLoading();
            }
        })
    },

    // 取消 & 删除
    celNdel(e) {
        const _this = this;
        let id = e.currentTarget.dataset.id;
        let oType = e.currentTarget.dataset.type;
        let tleTxt = '';

        if (oType == 1) {
            tleTxt = '确定取消该订单吗？';
        } else {
            tleTxt = '确定删除该订单吗？';
        }

        wx.showModal({
            title: '提示',
            content: tleTxt,
            confirmColor: "#a88c5d",
            success: function (res) {
                if (res.confirm) {
                    // console.log('用户点击确认')
                    ajax.ajaxFunc({
                        url: 'api/order/del',
                        data: {
                            id: id,
                            type: oType,
                            openid: app.globalData.openId || wx.getStorageSync('openid')
                        },
                        success: function (r) {
                            // console.log(r);
                            if (r.code == 1) {
                                if (oType == 1) {
                                    _this.renderFunc();
                                } else {
                                    wx.navigateBack();
                                }
                            }else{
                                wx.showToast({
                                    title: r.msg,
                                    icon:'none'
                                })
                            }
                        }
                    })

                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },
    
    // 去支付
    gotoPay: function(){
        const _this = this;
        let id = this.data.orderId;
        ajax.ajaxFunc({
            url:'api/order/toPay',
            data:{
                id: id,
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success:function(res){
                if (res.code == 1) {
                    _this.setData({
                        isShowPay: true
                    });
                    _this.setData({
                        payMoney: res.data.money,
                        userIntegral: res.data.integral,
                        isUseIntegral: Number(res.data.integral) >= Number(res.data.money) ? true : false
                    });

                }else{
                    wx.showToast({
                        title: res.msg,
                        icon:'none'
                    })
                }
            }
        })
    },

    // 支付成功
    paySucFn:function (e) {
        let _this = this;
        ajax.ajaxFunc({
            url: 'api/order/integralPay',
            data: {
                id: _this.data.orderId,
                money: _this.data.payMoney,
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function (res) {
                if (res.code == 1) {
                    // wx.showToast({
                    //     title: '支付成功'
                    // });
                    Nav.nav('navigateTo', '../paySuc/paySuc', { money: _this.data.payMoney, origin: 'order' })
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none'
                    })
                }
                _this.setData({
                    isShowPay: false
                });
            }
        })
    },

    // 隐藏支付弹框
    hidePayFn: function () {
        this.setData({
            isShowPay: false
        });
    },
    
    // 再来一单
    orderMore(e) {
        let id = e.currentTarget.dataset.id;
        ajax.ajaxFunc({
            url: 'api/order/reCreateOrder',
            data: {
                id: id,
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function (r) {
                console.log(r);
                if (r.code == 1) {
                    wx.showToast({
                        title: r.msg,
                        icon: 'none',
                        duration: 1500
                    });

                    wx.setStorageSync('isRefreshCart', 1);

                    setTimeout(function () {
                        wx.switchTab({
                            url: '/pages/cart/cart'
                        })
                    }, 1000);
                } else if (r.code == 111) {
                    wx.setStorageSync('isRefreshCart', 1);

                    wx.showModal({
                        title: '提示',
                        content: '部分商品库存不足',
                        confirmColor: "#a88c5d",
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                // console.log('用户点击确认')
                                wx.switchTab({
                                    url: '/pages/cart/cart'
                                })
                            }
                        }
                    })
                } else if (r.code == 0) {
                    wx.showToast({
                        title: '商品库存不足',
                        icon: 'none',
                        duration: 1500
                    });
                }
            }
        })
    },

    // 复制文字
    clipTxtFn: function (e) {
        let sn = e.currentTarget.dataset.sn;
        console.log(sn);
        wx.setClipboardData({
            data: sn,
            success: function (res) {
                // console.log(res)
            }
        })
    },

    // 下架商品跳转到详情 失效商品提示
    goDetail(e){
        let id = e.currentTarget.dataset.id;
        let del = e.currentTarget.dataset.delete;
        if(del == 1){
            Nav.nav('navigateTo', '../goodDetail/goodDetail', {id: id});
        }else{
            wx.showToast({
                title: '商品已失效',
                icon: 'none',
                duration: 1500
            });
        }
    },


    // 服务订单模板
    // 服务类信息填写操作
    //日期选择器
    bindDateChange: function (e) {
        // this.setData({
        //     date: e.detail.value
        // })
    },
    bindChange: function (e) {
        const val = e.detail.value
        this.setData({
            year: this.data.years[val[0]],
            month: this.data.months[val[1]],
            day: this.data.days[val[2]]
        })
    },
    chooseSezi: function (e) {
        this.setData({
            d_index: e.currentTarget.dataset.index,
            d_tindex: e.currentTarget.dataset.tindex,
            isShowTxtarea: false,
        })
        // 用that取代this，防止不必要的情况发生
        var that = this;
        // 创建一个动画实例
        var animation = wx.createAnimation({
            // 动画持续时间
            duration: 200,
            // 定义动画效果，当前是匀速
            timingFunction: 'linear'
        })
        // 将该变量赋值给当前动画
        that.animation = animation
        // 先在y轴偏移，然后用step()完成一个动画
        animation.translateY(200).step()
        // 用setData改变当前动画
        that.setData({
            // 通过export()方法导出数据
            animationData: animation.export(),
            // 改变view里面的Wx：if
            chooseSize: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export()
            })
        }, 200)
    },
    hideModal: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData: animation.export(),
            isShowTxtarea: true,
        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData: animation.export(),
                chooseSize: false
            })
        }, 200)
    },
    quedingModal() {
        this.setData({
            month: Number(this.data.month) < 10 ? '0' + Number(this.data.month) : Number(this.data.month),
            day: Number(this.data.day) < 10 ? '0' + Number(this.data.day) : Number(this.data.day)
        })
        this.setData({
            ['goodsList[' + this.data.d_index + '].temp_conf[' + this.data.d_tindex + '].date']: this.data.year + '-' + this.data.month + '-' + this.data.day
        })
        // console.log(this.data.goodsList[this.data.d_index].temp_conf[this.data.d_tindex].date)
        this.data.years.map((v, index) => {
            if (v == this.data.year) {
                this.setData({
                    value: [index, this.data.month - 1, this.data.day - 1]
                })
                return;
            }
        })
        this.hideModal();
    },
    bindChange2: function (e) {
        const val = e.detail.value
        // console.log(e)
        this.setData({
            year2: this.data.years2[val[0]],
            month2: this.data.months2[val[1]],
            day2: this.data.days2[val[2]],
            hour: this.data.hours[val[3]],
            minute: this.data.minutes[val[4]],
            second: this.data.seconds[val[5]],
        })
    },
    chooseSezi2: function (e) {
        this.setData({
            d_index2: e.currentTarget.dataset.index,
            d_tindex2: e.currentTarget.dataset.tindex,
            isShowTxtarea: false,
        })
        // 用that取代this，防止不必要的情况发生
        var that = this;
        // 创建一个动画实例
        var animation = wx.createAnimation({
            // 动画持续时间
            duration: 200,
            // 定义动画效果，当前是匀速
            timingFunction: 'linear'
        })
        // 将该变量赋值给当前动画
        that.animation = animation
        // 先在y轴偏移，然后用step()完成一个动画
        animation.translateY(200).step()
        // 用setData改变当前动画
        that.setData({
            // 通过export()方法导出数据
            animationData2: animation.export(),
            // 改变view里面的Wx：if
            chooseSize2: true
        })
        // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData2: animation.export()
            })
        }, 200)
    },
    hideModal2: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData2: animation.export(),
            isShowTxtarea: true,
        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData2: animation.export(),
                chooseSize2: false
            })
        }, 200)
    },
    quedingModal2() {
        this.setData({
            hour: Number(this.data.hour) < 10 ? '0' + Number(this.data.hour) : Number(this.data.hour),
            minute: Number(this.data.minute) < 10 ? '0' + Number(this.data.minute) : Number(this.data.minute),
            second: Number(this.data.second) < 10 ? '0' + Number(this.data.second) : Number(this.data.second),
        })
        this.setData({
            ['goodsList[' + this.data.d_index2 + '].temp_conf[' + this.data.d_tindex2 + '].dateall']: this.data.year2 + '-' + this.data.month2 + '-' + this.data.day2 + '  ' + this.data.hour + '：' + this.data.minute + '：' + this.data.second
        })
        // console.log(this.data.goodsList[this.data.d_index2].temp_conf[this.data.d_tindex2].dateall)
        this.data.years2.map((v, index) => {
            if (v == this.data.year2) {
                this.setData({
                    value2: [index, this.data.month2 - 1, this.data.day2 - 1, this.data.hour -1, this.data.minute, this.data.second]
                })
                return;
            }
        })
        this.hideModal2();
    },
    // 下拉数据选择器
    bindPickerChange: function (e) {
        // console.log(e)
        // console.log(e.detail.value)
        let index = e.currentTarget.dataset.index,
            tindex = e.currentTarget.dataset.tindex;
        this.setData({
            ['goodsList[' + index + '].temp_conf[' + tindex + '].idx']: e.detail.value
        })
    },
    // 文本框
    bindInputFunc(e) {
        let viewfield = e.currentTarget.dataset.viewfield;
    },
    // 文本域
    bindTextateaFunc(e) {

    },
    //多选
    checkboxChange(e) {
        let index = e.currentTarget.dataset.index,
            tindex = e.currentTarget.dataset.tindex;
    },
    exitButFunc(e){
        // console.log(e.currentTarget.dataset.id)
        let i = e.currentTarget.dataset.index;
        // console.log(this.data.goodsList[i].isEdit)
        // if (this.data.goodsList[i].isEdit) {
        //     this.setData({
        //         ['goodsList[' + i + '].txt']: '编辑',
        //         ['goodsList[' + i + '].isEdit']: false,
        //     })
        // } else {
        //     this.setData({
        //         ['goodsList[' + i + '].txt']: '编辑',
        //         ['goodsList['+i+'].isEdit']:true,
        //     })
        // }
        this.setData({
            ['goodsList[' + i + '].isEdit']: true,
        })
    },
    formSubmit(e){
        // console.log(e)
        let i = e.detail.target.dataset.index;
        // console.log(this.data.goodsList[i].isEdit)
        // if (this.data.goodsList[i].isEdit) {
        //     this.setData({
        //         ['goodsList[' + i + '].isEdit']: false,
        //     })
        // } else {
        //     this.setData({
        //         ['goodsList[' + i + '].isEdit']: true,
        //     })
        // }
        let obj = e.detail.value, uploadList = { jianfu:[]}
        for (let [k, v] of Object.entries(obj)) {
            let keyAr = k.split('__');
            uploadList.jianfu.push({
                id: keyAr[0],
                // goodsubid: keyAr[1],
                // tempid: keyAr[2],
                ismust: keyAr[4],
                [keyAr[3]]: v,
                isvalue: v,
            })
        }
        uploadList.orderId = this.data.orderId;
        let isCanSubmit = uploadList.jianfu.every(v => {
            if (v.ismust == 1 && (v.isvalue && v.isvalue.length > 0)) {
                return true;
            } else {
                if (v.ismust == 0) {
                    return true;
                }
                else {
                    return false;
                }
            }
        })
        // console.log(isCanSubmit)
        if (!isCanSubmit) {
            wx.showToast({
                title: '请填写完带*号的信息内容',
                icon: 'none'
            })
            this.setData({
                ['goodsList[' + i + '].isEdit']: true,
            })
        } else {
            this.setData({
                ['goodsList[' + i + '].isEdit']: false,
                temp_conf: uploadList
            })
            // console.log(this.data.temp_conf)
            this.orderPaySucFn();
        }
    },
    // 保存订单修改模板
    orderPaySucFn: function (e) {
        let _this = this;
        // console.log(this.data.temp_conf.jianfu[0].id)
        ajax.ajaxFunc({
            url: 'api/order/resetOrderTempConf',
            data: {
                order_id: _this.data.orderId,
                order_goods_id: _this.data.temp_conf.jianfu[0].id,
                openid: app.globalData.openId || wx.getStorageSync('openid'),
                conf_value: JSON.stringify(_this.data.temp_conf)
            },
            success: function (res) {
                if(res.code == 1){
                    _this.renderFunc();
                }
            }
        })
    },

    // 订单模板图片预览
    previewImageFunc(e){
        wx.previewImage({
            urls: e.currentTarget.dataset.preimg // 需要预览的图片http链接列表
        })
    }
})