import { config, createSign } from './request.js';
let i = 0;
let uploadImage = [];
let showImage = [];
// 上传图片，暂没有考虑上传失败的问题。
function upload(param){
    param.data && (param.data.sign = createSign());
    let len = param.filePath.length;
    wx.showLoading({
        title: '正在上传中...',
    })
    let uploadTask = wx.uploadFile({
        url: config.url + param.url,
        filePath: param.filePath[i],
        header: { "Content-Type": "multipart/form-data" },
        name: param.name || 'image',
        formData:param.data,
        // 上传成功
        success: function (res) {
            console.log(res)
            let data = JSON.parse(res.data);
            if(i < len - 1){
                ++i;
                if (data.code == 1) {
                    uploadImage = uploadImage.concat(data.data);
                    showImage = showImage.concat(param.filePath[i - 1]);
                    upload(param);
                }
            }else{
                wx.hideLoading();
                let cRes = {};
                cRes.code = data.code;
                cRes.msg = data.msg;
                cRes.data = uploadImage.concat(data.data);
                cRes.sData = showImage.concat(param.filePath[i]);
                param.success && typeof param.success === 'function' && param.success(cRes)
                // 完成之后，需要初始化。。以方便下一次进入使用。
                uploadImage = [];
                showImage = [];
                i = 0;
            }
        },
        fail:function(res){
            // 如果上传失败了，就直接下一次上传
            ++i;
            upload(param);
        }
    });
    // 监听上传进度。
    // uploadTask.onProgressUpdate((res)=>{
    //     console.log(res);
    // });
}
module.exports = {
    upload
}