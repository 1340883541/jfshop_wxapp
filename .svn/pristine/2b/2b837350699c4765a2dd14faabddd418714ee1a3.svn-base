import ajax from '../../utils/request.js';
import WxParse from '../../wxParse/wxParse.js';
const Nav = require('../../utils/navigate.js');
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      actId:1, //活动id
      actInfo:{}, //活动内容

      // 分享
      isShare: false,
      isCode: false,
      isHidden: 0,
      imageSp: "",
      isScroll: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          actId: options.id
      })
        console.log(wx.getStorageSync('openid'))
      console.log(wx.getStorageSync('isLogin'))
      
      
    //   wx.navigateTo({
    //       url: '../verifyPhone/verifyPhone'
    //   })
      this.getActInfo();
  },
    //后台获取活动推荐 
    getActInfo() {
        // console.log(this.data.actId)
        var _this = this;
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        ajax.ajaxFunc({
            url: 'api/Activity/info',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid'),
                id:_this.data.actId
            },
            success: function (r) {
                // console.log(JSON.stringify(r))
                if (r.code == 1) {
                    wx.getImageInfo({
                        src: r.data.share_img,
                        success(res) {
                            console.log(res.path)
                            _this.setData({
                                imageSp: res.path
                            })
                        }
                    })
                    _this.setData({
                        actInfo: r.data
                    })
                    WxParse.wxParse('about', 'html', _this.data.actInfo.content, _this, 0);
                    //修改页面标题
                    wx.setNavigationBarTitle({
                        title: r.data.title
                    });
                }
                wx.hideLoading();
            }
        })

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        var _this = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
            // console.log(res.target);
            _this.setData({
                isShare: false
            })
        }
        let shareParam = share({
            path: 'pages/active/active',
            data: {
                id: _this.data.actId
            },
            // title: _this.data.info.title,
            success: function () {
                wx.showToast({
                    title: '转发成功',
                })
                _this.setData({
                    isShare: false
                })
            }
        });
        return shareParam;
    },
    // 分享按钮
    switchShare() {
        this.setData({
            isShare: true,
            isHidden: 1
        })
    },
    //关闭分享
    closeShare() {
        this.setData({
            isShare: false,
            isHidden: 0
        })
    },
    shareFrenq(id) {
        this.setData({
            isShare: false,
            isCode: true
        })
        wx.showToast({
            title: '生成中',
            icon: 'loading',
            duration: 2000
        })
        // console.log(this.data.info.share_img)
        // console.log(this.data.imageSp)
    },
    //点击保存分享图
    savePoster() {
        var _this = this;
        const wxSaveImageToPhotosAlbum = wx.saveImageToPhotosAlbum;
        wxSaveImageToPhotosAlbum({
            filePath: _this.data.imageSp,
            success(res) {
                wx.showToast({
                    title: '已保存到相册，可以去朋友圈分享啦！',
                    duration: 1000
                })
                _this.setData({
                    isCode: false,
                    isHidden: 0
                })
            },
            fail(res){
                console.log(res)
            }
        })
    },
    closeCanva() {
        this.setData({
            isCode: false,
            isHidden: 0
        })
    }
})