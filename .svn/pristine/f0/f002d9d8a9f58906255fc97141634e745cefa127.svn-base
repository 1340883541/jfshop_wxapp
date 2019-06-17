// 选择拍照
function uploadImageCamera(param,cb) {
    wx.chooseImage({
        count: param.count || 1,
        sourceType: ['camera'],
        success: function (res) {
            cb && typeof cb === 'function' && cb(res);
        }
    })
} 
// 选择相册中
function uploadImageAlbum(param,cb) {
    wx.chooseImage({
        count: param.count || 9,
        sourceType: ['album'],
        success: function (res) {
            cb && typeof cb === 'function' && cb(res);
        }
    })
}
module.exports = {
    camera: uploadImageCamera,
    album: uploadImageAlbum
}