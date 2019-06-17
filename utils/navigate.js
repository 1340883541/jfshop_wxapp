// 如果 navigateWay 为 navigateBack ,path 参数为 返回页面的层数
const navigate = (navigateWay,path,arg,successCallback,errorCallback) => {
    navigateWay = navigateWay || 'navigateTo';
    let str, pathStr;
    if(!arg){
        pathStr = path;
    }else{
        str = '';
        for (let i in arg) {
            str += i + '=' + arg[i] + '&';
        }
        str = str.substring(0, str.length - 1);
        pathStr = path + '?' + str;
    }
    let param = {}
    param.url = pathStr;
    param.success = function(){
        successCallback && typeof successCallback === 'function' && successCallback();
    }
    param.error = function(){
        errorCallback && typeof errorCallback === 'function' && errorCallback();
    }
    switch(navigateWay){
        // 打开一个新页面
        case 'navigateTo':
            // 当前为第五层的时候，不打开新的页面。
            if(getCurrentPages().length >= 10){
                wx.redirectTo(param);
            }else{
                wx.navigateTo(param);
            }
            break;
        // 关闭页面，打开一个新页面，重定向一个页面
        case 'redirectTo':
            wx.redirectTo(param)
            break;
        // 跳转到 tarBar 的页面，关闭其他所有非 tabBar 页面
        // 小程序  app.json 里面定义的底部跳转页面
        case 'switchTab':
            wx.switchTab(param)
            break;
        case 'reLaunch':
            wx.reLaunch(param)
            break;
        // 返回层数
        case 'navigateBack':
            wx.navigateBack({
                delta:path
            })
            break;
        // 传入的参数错误
        default:
            console.error('跳转页面，您传入的参数有误')
            break;
    }
}
const share = function(param){
    let sharePar = '';
    if(!param.data){
        sharePar = '';
    }else{
        sharePar = "?";
        for(let i in param.data){
            sharePar += i + '=' + param.data[i] + '&';
        }
        sharePar = sharePar.substring(0,sharePar.length - 1);
    }
    return {
        title:param.title || '',
        path: param.path + sharePar,
        success: function (res) {
            param.success && typeof param.success && param.success(res);
        },
        fail: function (res) {
            param.fail && typeof param.fail && param.fail(res);
        }
    }
}
module.exports = {
    nav: navigate,
    share
}