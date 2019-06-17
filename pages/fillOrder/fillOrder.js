const Nav = require('../../utils/navigate.js');
const Ajax = require('../../utils/request.js');
const app = getApp();

// 获取当月最大一天
function getCurrentMonthLastDay() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month < 10 ? '0' + month : month
    var day = new Date(year, month, 0)
    // return year + '-' + month + '-' + day.getDate()
    return day.getDate()
}
// 日期选择器数据
// const date = new Date()
// 获取当前日期（年月日）
var timestamp = Date.parse(new Date());
var date = new Date(timestamp);
//获取年份  
var Y = date.getFullYear();
//获取月份  
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//获取当日日期 
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
var H = date.getHours(); //时，
var Ms = date.getMinutes(); //分
var S = date.getSeconds(); //秒

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

for (let i = 1; i <= getCurrentMonthLastDay(); i++) {
    i < 10 ? days.push('0' + i) : days.push(i)
}
for (let i = 0; i <= 23; i++) {
    i < 10 ? hours.push('0' + i) : hours.push(i)
}
for (let i = 0; i <= 59; i++) {
    i < 10 ? minutes.push('0' + i) : minutes.push(i)
}
for (let i = 0; i <= 59; i++) {
    i < 10 ? seconds.push('0' + i) : seconds.push(i)
}

Page({
    /**
     * 页面的初始数据
     */
    data: {

        // 立即结算支付弹框
        isShowPay:false,
        // 判断是否是Android || Ios
        isIos:true,

        // 提交订单的参数
        option:'',

        // 返回的参数
        goods:'',
        totalMoney:0,
        totalPayMoney: 0,
        userIntegral:'',
        

        // 订单id
        orderId: '',
        // 支付的积分金额
        payMoney: 0,
        // 积分
        isUseIntegral: true,

        // 提交订单所需要的接口
        goodsIdStr:'',
        goodsSubIdStr:'',
        goodsNumStr:'',
        cartIdStr:'',

        // 备注
        remark:'',
        //立即结算按钮遮罩
        isbuy_zhezBtn: false, 

        // 服务类订单模板
        temp_conf: [
        ], //上传后台服务信息
        date: '',
        stardate:'',
        enddate:'',
        tempAddrIndex:0,
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
        d_index:'',
        d_tindex:'',
        d_dayNum:'',
        //日期时间控制器
        years2: years,
        year2: date.getFullYear(),
        months2: months,
        month2: '',
        days2: days,
        day2: '',
        hour:0,
        hours: hours,
        minutes: minutes,
        minute:0,
        seconds: seconds,
        second:0,
        value2: [],
        chooseSize2: false,
        animationData2: {},
        d_index2: '',
        d_tindex2: '',
        d_dayNum2:'',
        // 时间控制器
        hour3: 0,
        hours3: hours,
        minutes3: minutes,
        minute3: 0,
        seconds3: seconds,
        second3: 0,
        value3: [],
        chooseSize3: false,
        animationData3: {},
        d_index3: '',
        d_tindex3: '',
        d_dayNum3: '',
        // 
        isShowTxtarea:true,
        // 图片上传
        d_index4: '',
        d_tindex4: '',
        imgidx4: '',
        imgdel4:'',
        imgsNum:'',
        // 服务类订单跳转参数
        // tempid
        // 邮寄方式
        is_server:1, //为2是代表实体类商品，1代表服务类商品
        mail_type:'',
    },
    //生命周期函数--监听页面加载
    onLoad: function (options) {
        
        // 获取设备样式
        let system = wx.getSystemInfoSync();
        if (system.system.toLowerCase().indexOf('ios') > -1){
            this.setData({
                isIos:true
            })
        }else{
            this.setData({
                isIos:false
            })
        }
        // 获取传递的参数
        this.data.option = options;
        this.data.option.openid = app.globalData.openId || wx.getStorageSync('openid');
        this.fetchData();
        // 获取到需要提交的内容
        this.data.cartIdStr = this.data.option.cart_ids;

        // 订单模板
        // 初始化日期
        this.setData({
            month: M,
            day:D,
            month2: M,
            day2: D,
            hour3: H,
            minute3: Ms,
            second3: S,
            // date: Y + '-' + M + '-' + D,
            stardate : Y - 1 + '-' + M + '-' + D,
            enddate : Y + 1 + '-' + M + '-' + D,

        })
        
        this.data.years.map((v,index) => {
            if (v == Y){
                this.setData({
                    value: [index, this.data.month - 1, this.data.day - 1]
                })
                return;
            }
        })
        this.data.years.map((v, index) => {
            if (v == Y) {
                this.setData({
                    value2: [index, this.data.month2 - 1, this.data.day2 - 1]
                })
                return;
            }
        })
        this.setData({
            value3: [H, Ms, S]
        })
    },
    // 获取结算的数据
    fetchData:function(){
        wx.showLoading({
            title: '正在加载中...',
        });
        let _this = this;
        Ajax.ajaxFunc({
            url:'api/order/presentPage',
            data: _this.data.option || wx.getStorageSync('openid'),
            success:function(res){
                wx.hideLoading();
                if (res.code == 1) {
                    let goodsIdStr = '',
                        goodsSubIdStr = '',
                        goodsNumStr = '';
                    res.data.goods.forEach((val) => {
                        goodsIdStr += val.goods_id + ',';
                        goodsSubIdStr += val.goods_sub_id + ',';
                        goodsNumStr += val.goods_number + ',';
                    });
                    _this.data.goodsIdStr = goodsIdStr.substring(0, goodsIdStr.length - 1);
                    _this.data.goodsSubIdStr = goodsSubIdStr.substring(0, goodsSubIdStr.length - 1);
                    _this.data.goodsNumStr = goodsNumStr.substring(0, goodsNumStr.length - 1);
                    _this.setData({
                        totalMoney: res.data.total_goods_money,
                        totalPayMoney: res.data.total_pay_money,
                        goods: res.data.goods.map(v => {
                            temp_id: v.temp_id;
                            v.temp_conf.map(val => {
                                val.idx = 0;
                                // 日期
                                val.date = '';
                                // 日期时间
                                val.dateall = '';
                                // 时间
                                val.time = '';
                                // 文本域
                                val.t_tareaVal = '';
                                // 前台展示上传图片
                                val.t_imgs = [];
                                // 后台上传图片
                                val.t_Upimgs = [];
                                return val;
                            })
                            return v
                        }),
                        userIntegral: res.data.user_info.integral,
                        is_server: res.data.is_server
                    });
                    console.log(_this.data.is_server +'is_server')
                    if (res.data.total_goods_money <= res.data.user_info.integral) {
                        _this.setData({
                            isUseIntegral: true
                        })
                    } else {
                        _this.setData({
                            isUseIntegral: false
                        })
                    }
                }else{
                    wx.showToast({
                        title: res.msg,
                        icon:"none"
                    });
                }
            }
        });
    },
    // 跳转到商品清单页面
    skipInventoryFn:function(){
        let _this = this;
        Nav.nav('navigateTo','../goodsInventory/goodsInventory',{goodsList:JSON.stringify(_this.data.goods)})
    },
    // 立即结算
    sureOrderFn:function(){
        this.setData({
            isbuy_zhezBtn: true
        })
        let _this = this;
        let param = {};
        param.total_money = this.data.totalPayMoney;
        param.total_goods_money = this.data.totalMoney;
        param.goods_ids = this.data.goodsIdStr;
        param.goods_sub_ids = this.data.goodsSubIdStr;
        param.goods_num = this.data.goodsNumStr;
        param.cart_ids = this.data.cartIdStr;
        param.openid = app.globalData.openId || wx.getStorageSync('openid');
        param.remark = this.data.remark;
        param.temp_conf = JSON.stringify(this.data.temp_conf);
        if (this.data.is_server == 2) { param.mail_type = 1 }
        // console.log(this.data.temp_conf.length )
        Ajax.ajaxFunc({
            url:'api/order/createOrder',
            data:param,
            success:function(res){
                // console.log(res);
                if (res.code == 1) {
                    wx.setStorageSync('isRefreshCart', 1);
                    wx.setStorageSync('isRefreshPerson', 1);
                    if (_this.data.temp_conf.length > 0 ){
                        // 服务类商品
                        if (_this.data.temp_conf[0].tempid != 0){
                            // console.log(_this.data.temp_conf[0].tempid)
                            wx.showToast({
                                title: '欢迎您在金鼎管家中心下单，我们的管家将在24小时内与您联系!',
                                icon: 'none',
                                duration:3000,
                                mask:true,
                            });
                            
                            setTimeout(function(){
                                Nav.nav('navigateTo', '../orderAll/orderAll', { state: 2});
                            },3000)
                        }
                    }else{
                        _this.setData({
                            isShowPay: true,
                            payMoney: res.data.money,
                            orderId: res.data.id,
                            isbuy_zhezBtn: false
                        });
                    }
                }else{
                    if(res.code == -1){
                        wx.showModal({
                            title: '提示',
                            content: '您暂没有绑定手机号，不能提交订单。确认要去绑定手机号吗？',
                            confirmColor: "#a88c5d",
                            success: function (e) {
                                if (e.confirm) {
                                    Nav.nav('navigateTo', '../verifyPhone/verifyPhone');
                                }
                            }
                        });
                    }else{
                        wx.showToast({
                            title: res.msg,
                            icon: 'none'
                        });
                    }
                    setTimeout(function () {
                        _this.setData({
                            isbuy_zhezBtn: false
                        })
                    }, 1000)
                }
            }
        })
        setTimeout(function () {
            _this.setData({
                isbuy_zhezBtn: false
            })
        }, 3500)
    },
    // 支付成功
    paySucFn:function(e){
        let _this = this;
        let id = e.currentTarget.id;
        Nav.nav('navigateTo', '../orderDetail/orderDetail', { id: id });
        setTimeout(function(){
            _this.setData({
                isShowPay: false
            });
        },300)
        // Ajax.ajaxFunc({
        //     url: 'api/order/integralPay',
        //     data: {
        //         id: _this.data.orderId,
        //         money: _this.data.payMoney,
        //         openid: app.globalData.openId || wx.getStorageSync('openid')
        //     },
        //     success: function (res) {
        //         if (res.code == 1) {
        //             // wx.showToast({
        //             //     title: '支付成功'
        //             // });
        //             // Nav.nav('redirectTo', '../paySuc/paySuc', { money: _this.data.payMoney, origin: 'buy' })
                    
        //         } else {
        //             wx.showToast({
        //                 title: res.msg,
        //                 icon: 'none'
        //             })
        //             setTimeout(function () {
        //                 Nav.nav('redirectTo', '../orderAll/orderAll', { state: 0 })
        //             }, 400);
        //         }
        //         _this.setData({
        //             isShowPay: false
        //         });
        //     }
        // })
    },
    // 隐藏支付弹框
    hidePayFn: function () {
        this.setData({
            isShowPay: false
        });
        setTimeout(function () {
            Nav.nav('redirectTo', '../orderAll/orderAll', { state: 0 })
        }, 400);
    },
    // 获取订单备注
    getTextareaVal:function(e){
        this.data.remark = e.detail.value;
    },
    // 服务类信息填写操作
    //日期选择器
    // 日期滚动时触发
    bindChange: function (e) {
        const val = e.detail.value
        this.setData({
            year: this.data.years[val[0]],
            month: this.data.months[val[1]],
            day: this.data.days[val[2]]
        })
    },
    
    // 触发日期控制器
    chooseSezi: function (e) {
        this.setData({
            d_index: e.currentTarget.dataset.index,
            d_tindex: e.currentTarget.dataset.tindex,
            d_dayNum: e.currentTarget.dataset.daynum ? e.currentTarget.dataset.daynum : 0,
            isShowTxtarea:false
        })
        var that = this;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData: animation.export(),
            chooseSize: true
        })
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
    quedingModal(){
        this.setData({
            month: Number(this.data.month) < 10 ? '0' + Number(this.data.month) : Number(this.data.month),
            day: Number(this.data.day) < 10 ? '0' + Number(this.data.day) : Number(this.data.day)
        })
        // 限制天数
        let d_dayStamp = Number(this.data.d_dayNum) + Number(D);
        // 当前选择日期的时间戳
        let t_timestamp = Date.parse(this.data.year + '/' + this.data.month + '/' + this.data.day)
        // 限制天后时间戳
        let d_timestamp = Date.parse(Number(Y) + '/' + Number(M) + '/' + d_dayStamp)

        if (Number(t_timestamp) > Number(d_timestamp)){
            this.setData({
                ['goods[' + this.data.d_index + '].temp_conf[' + this.data.d_tindex + '].date']: this.data.year + '-' + this.data.month + '-' + this.data.day
            })
            // console.log(this.data.goods[this.data.d_index].temp_conf[this.data.d_tindex].date)
            this.data.years.map((v, index) => {
                if (v == this.data.year) {
                    this.setData({
                        value: [index, this.data.month - 1, this.data.day - 1]
                    })
                    return;
                }
            })
            this.hideModal();
        }else{
            if (this.data.d_dayNum == 0) {
                wx.showToast({
                    title: '请选择明日后的日期！',
                    icon: 'none'
                })
            } else {
                wx.showToast({
                    title: '请选择' + Number(Y) + '-' + Number(M) + '-' + Number(D)+ '年' + this.data.d_dayNum + '天后的日期！',
                    duration:2000,
                    icon: 'none'
                })
            }
        }
        
    },
    // 时间日期选择器
    bindChange2: function (e) {
        const val = e.detail.value
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
            d_dayNum2: e.currentTarget.dataset.daynum ? e.currentTarget.dataset.daynum : 0,
            isShowTxtarea: false,
        })
        var that = this;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData2: animation.export(),
            chooseSize2: true
        })
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
        // 限制天数
        let d_dayStamp = Number(this.data.d_dayNum2) + Number(D);
        // 当前选择日期的时间戳
        let t_timestamp = Date.parse(this.data.year2 + '/' + this.data.month2 + '/' + this.data.day2)
        // 限制天后时间戳
        let d_timestamp = Date.parse(Number(Y) + '/' + Number(M) + '/' + d_dayStamp)

        if (Number(t_timestamp) > Number(d_timestamp)) {
            this.setData({
                ['goods[' + this.data.d_index2 + '].temp_conf[' + this.data.d_tindex2 + '].dateall']: this.data.year2 + '-' + this.data.month2 + '-' + this.data.day2 + '  ' + this.data.hour + ':' + this.data.minute + ':' + this.data.second
            })
            // console.log(this.data.goods[this.data.d_index2].temp_conf[this.data.d_tindex2].dateall)
            this.data.years2.map((v, index) => {
                if (v == this.data.year2) {
                    this.setData({
                        value2: [index, this.data.month2 - 1, this.data.day2 - 1, this.data.hour, this.data.minute, this.data.second]
                    })
                    return;
                }
            })
            this.hideModal2();
        }else{
            if (this.data.d_dayNum2 == 0){
                wx.showToast({
                    title: '请选择明日后的日期！',
                    icon: 'none'
                })
            }else{
                wx.showToast({
                    title: '请选择' + Number(Y) + '-' + Number(M) + '-' + Number(D) + '年' + this.data.d_dayNum2 + '天后的日期！',
                    duration: 2000,
                    icon: 'none'
                })
            }
            
        }
    },
    // 时间选择器
    bindChange3: function (e) {
        const val = e.detail.value
        this.setData({
            hour3: this.data.hours[val[0]],
            minute3: this.data.minutes[val[1]],
            second3: this.data.seconds[val[2]],
        })
    },
    chooseSezi3: function (e) {
        this.setData({
            d_index3: e.currentTarget.dataset.index,
            d_tindex3: e.currentTarget.dataset.tindex,
            isShowTxtarea: false,
        })
        var that = this;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData3: animation.export(),
            chooseSize3: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData3: animation.export()
            })
        }, 200)
    },
    hideModal3: function (e) {
        var that = this;
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'linear'
        })
        that.animation = animation
        animation.translateY(200).step()
        that.setData({
            animationData3: animation.export(),
            isShowTxtarea: true,

        })
        setTimeout(function () {
            animation.translateY(0).step()
            that.setData({
                animationData3: animation.export(),
                chooseSize3: false
            })
        }, 200)
    },
    quedingModal3() {
        this.setData({
            hour3: Number(this.data.hour3) < 10 ? '0' + Number(this.data.hour3) : Number(this.data.hour3),
            minute3: Number(this.data.minute3) < 10 ? '0' + Number(this.data.minute3) : Number(this.data.minute3),
            second3: Number(this.data.second3) < 10 ? '0' + Number(this.data.second3) : Number(this.data.second3),
        })
        // console.log(this.data.hour3, this.data.minute3, this.data.second3)
        this.setData({
            ['goods[' + this.data.d_index3 + '].temp_conf[' + this.data.d_tindex3 + '].time']: this.data.hour3 + ':' + this.data.minute3 + ':' + this.data.second3
        })
        // console.log(this.data.goods[this.data.d_index3].temp_conf[this.data.d_tindex3].time)
        this.setData({
            value3: [this.data.hour3, this.data.minute3, this.data.second3]
        })
        this.hideModal3();
    },
    // 下拉数据选择器
    bindPickerChange: function (e) {
        let index = e.currentTarget.dataset.index,
            tindex = e.currentTarget.dataset.tindex;
        this.setData({
            ['goods['+index+'].temp_conf['+tindex+'].idx']: e.detail.value
        })
    },
    // 文本框
    bindInputFunc(e){
        let viewfield = e.currentTarget.dataset.viewfield;
    },
    // 文本域
    bindTextateaFunc(e){
        this.setData({
            d_index3: e.currentTarget.dataset.index,
            d_tindex3: e.currentTarget.dataset.tindex,
        })
        this.setData({
            ['goods[' + this.data.d_index3 + '].temp_conf[' + this.data.d_tindex3 + '].t_tareaVal']: e.detail.value
        })
    },
    //多选
    checkboxChange(e) {
        let index = e.currentTarget.dataset.index,
            tindex = e.currentTarget.dataset.tindex;
    },
    // 图片上传
    chooseImgFunc(e){
        let _this = this;
        
        this.setData({
            d_index4: e.currentTarget.dataset.index,
            d_tindex4: e.currentTarget.dataset.tindex,
        })
        this.setData({
            imgsNum: Number(e.currentTarget.dataset.imgsnum) - Number(this.data.goods[this.data.d_index4].temp_conf[this.data.d_tindex4].t_imgs.length)
        })
        wx.chooseImage({
            count: this.data.imgsNum,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths;
                _this.uploadFile(0, tempFilePaths)
                
            }
        })
    },
    // 上传图片
    uploadFile(i, imgarr){
        // console.log(imgarr)
        let _this = this;
        if(i < imgarr.length){
            wx.uploadFile({
                url: Ajax.config.url + 'api/UploadImage/file_upload', //仅为示例，非真实的接口地址
                filePath: imgarr[i],
                name: 'file',
                formData: {
                    'openid' : app.globalData.openId || wx.getStorageSync('openid'),
                    'sign': Ajax.config.createSign
                },
                success(res) {
                    let upImgs = [{
                        showsrc: imgarr[i],
                        uploadsrc: JSON.parse(res.data).data
                    }]
                    _this.setData({
                        ['goods[' + _this.data.d_index4 + '].temp_conf[' + _this.data.d_tindex4 + '].t_imgs']: _this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_imgs.concat(upImgs),
                        ['goods[' + _this.data.d_index4 + '].temp_conf[' + _this.data.d_tindex4 + '].t_Upimgs']: _this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_Upimgs.concat(JSON.parse(res.data).data)

                    })
                    // console.log(_this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_imgs)
                    // console.log(_this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_Upimgs)
                    _this.uploadFile(++i, imgarr)
                }
            })
        }else{
            //do something
        }
        
    },
    // 删除上传图片
    delUpImgFunc(e){
        this.setData({
            d_index4: e.currentTarget.dataset.index,
            d_tindex4: e.currentTarget.dataset.tindex,
            imgidx4: e.currentTarget.dataset.imgidx,
            imgdel4: e.currentTarget.dataset.uploadsrc,
        })
        let _this = this;
        Ajax.ajaxFunc({
            url: 'api/UploadImage/delImg',
            data: {
                img_url: _this.data.imgdel4,
                openid: app.globalData.openId || wx.getStorageSync('openid')
            },
            success: function (res) {
                if (res.code == 1) {
                    //do somethig
                    _this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_imgs.splice(_this.data.imgidx4, 1)
                    _this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_Upimgs.splice(_this.data.imgidx4, 1)
                    
                    _this.setData({
                        ['goods[' + _this.data.d_index4 + '].temp_conf[' + _this.data.d_tindex4 + '].t_imgs']: _this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_imgs,
                        ['goods[' + _this.data.d_index4 + '].temp_conf[' + _this.data.d_tindex4 + '].t_Upimgs']: _this.data.goods[_this.data.d_index4].temp_conf[_this.data.d_tindex4].t_Upimgs,
                    })
                }
            }
        })
        // console.log(this.data.d_index4, this.data.d_tindex4, this.data.goods[this.data.d_index4].temp_conf[this.data.d_tindex4].t_imgs)

    },

    // 立即结算提交
    formSubmit(e) {
        let obj = e.detail.value, _this = this, uploadList = [], upImgArr=[];
        for (let [k, v] of Object.entries(obj)) {
            let keyAr = k.split('__');
                uploadList.push({
                    goods: keyAr[0],
                    goodsubid: keyAr[1],
                    tempid: keyAr[2],
                    ismust: keyAr[4],
                    [keyAr[3]]: keyAr[5] ? keyAr[5] : v,
                    isvalue: keyAr[5] ? keyAr[5] : v,
                })
        }
        // console.log(uploadList);
        let isCanSubmit = uploadList.every(v => {
            if (v.ismust == 1 && (v.isvalue && v.isvalue.length > 0) ) {
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
        } else {
            this.setData({
                temp_conf:uploadList
            })
            this.sureOrderFn();
        }
    },

    // 邮寄
    // 选择邮寄方式
    meailChangeFn(e){
        wx.showToast({
            title: '建设中，敬请期待！',
            icon: 'none'
        })
    }
})