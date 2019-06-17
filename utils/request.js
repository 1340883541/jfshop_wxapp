import Md5 from './md5.js';

const config = {
    // url: 'http://192.168.0.235/',
    url: 'http://jftest.jindingtimes.com/',
    // url:'https://jfshop.jindingtimes.com/',
    str: '45fdsjfwr435654gfghfhghgfh5t63df'
}

/**
 * 封装ajax操作
 * par = {
 *      url: ''                     后台接口地址                                                   
 *      data: {}                    传给后台的数据
 *      success: function(res){}    回调函数
 * }
 */
function ajaxFunc(par){
    par.data.sign = createSign();
    wx.request({
        url: config.url + par.url,
        data: par.data,
        header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        responseType: par.responseType || 'text',
        method: 'POST',
        dataType: 'json',
        success: function(res){
            typeof par.success === 'function' ? par.success(res.data) : false;
        },
        fail:function(f){
            wx.hideLoading();
            console.log(f)
            wx.getNetworkType({
                success: function(res) {

                    // wx.showToast({
                    //     title: '当前网络不稳定，请重试。11111',
                    //     icon:'none'
                    // });
                    wx.setStorageSync('isRefreshPerson', 1);
                    wx.setStorageSync('isRefreshCart', 1);
                }
            })
        }
    });
}

// 创建sign
function createSign() {
    let md5_str = '';
    let sign = '';
    //let today = new Date();

    // today.setHours(0);
    // today.setMinutes(0);
    // today.setSeconds(0);
    // today.setMilliseconds(0);
    // today = today.getTime() / 1000;

   // sign = Md5.hexMD5(today + config.str);
  sign = Md5.hexMD5(config.str);


    return sign;
}

module.exports = {
    ajaxFunc,
    config,
    createSign
}