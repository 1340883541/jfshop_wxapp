const Ajax = require('../../utils/request.js');
const Nav = require('../../utils/navigate.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowJifRule: false,
    // 用户信息
    integral: '',
    customerLists: [],
    page: 1,
    totalPage: 1,
    isLoadSuc: true,
    // 空页面信息
    emptyTxt: '暂没有客户',
    isRefreshBalance: false,
    imgURl:'',
    idUrl:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.cusList()
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (++this.data.page <= this.data.totalPage) {
      this.cusList(true);
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none'
      });
    }
  },
  // 获取用户信息
  cusList: function (isLoadMore = false) {
    let _this = this;
    wx.showLoading({
      title: '正在加载中...',
    });
    Ajax.ajaxFunc({
      url: 'api/MemberCenter/myShare',
      data: {
        openid: app.globalData.openId || wx.getStorageSync('openid'),
      },
      success: function (res) {
        if (res.code == 1) {
          wx.hideLoading();
          // 是否是加载更多
          if (!isLoadMore) {
            // 总页数
             _this.data.totalPage = res.data.page.totalPages;
            // 分页数据
            _this.setData({
              isLoadSuc: true,
               imgURl: res.data.user_info.applets_code,
              customerLists: res.data.list
            });
            _this.idUrl = res.data.user_info.id
            _this.customerLists =  res.data.list;
          } else {
            let lists = _this.data.customerLists.concat(res.data.subordinate);
            _this.setData({
              customerLists: lists
            })
          }
        }
      }
    })

    Ajax.ajaxFunc({
      url: '',
      data: {
        openid: app.globalData.openId || wx.getStorageSync('openid')
      },
      success: function (res) {

      }
    })

  },
  // 长按下载图片
  previewImg: function (e) {
    var img = this.data.imgURl;  //需要保存图片的路径
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链
      urls: [img] // 需要预览的图片http链接列表
    
    })
  },
  // previewImg: function (e) {
  //   let _this = this,
  //     currImg = e.currentTarget.dataset.src;
  //   wx.previewImage({
  //     current: currImg,
  //     urls: _this.data.imgURl || []
  //   })
  // },
  down_file() {
    let self = this;
  wx.getSetting({
    success(res) {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            self.saveImage();
          }
        });
      } else {
        self.saveImage();
      }
    }
  })
  },
  saveImage(){
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.writePhotosAlbum']) {
    //       wx.authorize({
    //         scope: 'scope.writePhotosAlbum',
    //         success() {
    //           console.log('授权成功')
    //         }
    //       })
    //     }
    //   }
    // })
    wx.downloadFile({
      url: this.data.imgURl,
      success: function (res) {
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              });
            },
            fail(res) {
              wx.showToast({
                title: '保存失败',
                icon: 'success',
                duration: 2000
              });
            }
          });
        }
      }
    });
    console.log(this.data.imgURl)
  },
  // down_file() {
  //   wx.getSetting({
  //     success(res) {
  //       if (!res.authSetting['scope.writePhotosAlbum']) {
  //         wx.authorize({
  //           scope: 'scope.writePhotosAlbum',
  //           success() {
  //             console.log('授权成功')
  //           }
  //         })
  //       }
  //     }
  //   })
  // wx.downloadFile({
  //   url: this.data.imgURl,
  //   success: function (res) {  
  //     //图片保存到本地
  //     wx.saveImageToPhotosAlbum({
  //       filePath: res.tempFilePath,
  //       success: function (data) {
  //       },
  //       fail: function (err) {
  //         if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
  //           console.log("用户一开始拒绝了，我们想再次发起授权")
  //           wx.openSetting({
  //             success(settingdata) {
  //               if (settingdata.authSetting['scope.writePhotosAlbum']) {
  //                 console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
  //               } else {
  //                 console.log('获取权限失败，给出不给权限就无法正常使用的提示')
  //               }
  //             }
  //           })
  //         }
  //       }
  //     })
  //   }
  // })
  // },
})