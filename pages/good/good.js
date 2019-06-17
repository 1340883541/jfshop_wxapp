// pages/good/good.js
import ajax from '../../utils/request.js';
import { share } from '../../utils/navigate.js';
let app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        //   筛选导航数据
        isnav: false, //是否打开筛选下拉框
        good_class:[],//分类
        isclsIndex:'',
        filterData: [
            {
                text: '全部',
                class: 'filter-item-active',
                index: 0,       // 下标
                sortWay:'state_alone',
                typeN: '' 
            },
            {
                text: '积分',
                class: '',
                index: 1,
                sortWay: 'state_nwith',
                typeN: '1,2' // 1 升序 2 降序
            },
            {
                text: '库存',
                class: '',
                index: 2,
                sortWay: 'state_with',
                typeN: '1,2'  // 1 有货 2 缺货
            }
        ],
        backupsNav: [],
        activeIndex: 0,
        searTxt: '搜索',
        page: 1,
        totalPage: 1,
        items: [],
        nType: '',
        noStock:'',
        refresh: true,
        tuijianH: '0',
        listIcon: false,
        hideSearch: false,  // 显示隐藏搜素
        startY: 0,  // 触碰屏幕
        moveY: 0,    // 滑动屏幕
        touchScrollTop: 0,
        isDoubleZ:false, // 是否点了两次积分
        isDoubleJ:false, // 是否点了两次状态
        lastnType:1,  //  记录上一次的nType数据
        lastnoStock:1, // 记录上一次的noStock数据
        fengeH:0, //分隔图高度

        // 下拉刷新
        timer: null, // 保存定时器
        scrollTop: 1 // 设定触发条件的距离
    },
    onPullDownRefresh: function () {
        
    }, 
    // 函数式触发开始下拉刷新。如可以绑定按钮点击事件来触发下拉刷新
    refreshFun() { 
        let _this = this;
        wx.startPullDownRefresh({
            success(errMsg) {
                wx.showLoading({
                    title: '加载中',
                    mask: true
                })
                // console.log('开始下拉刷新', errMsg)
                app.globalData.searchTxt = wx.getStorageSync('searchTxt');
                app.globalData.clsId = wx.getStorageSync('clsId');
                _this.setData({
                    page: 1,

                });
                _this.renderFunc(_this.data.nType, _this.data.noStock);
            },
            complete() {
               // console.log('下拉刷新完毕')
            }
        })
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.goodClsFun();
        const _this = this;
        wx.createSelectorQuery().select('#the-id').boundingClientRect(function (rect) {
            rect.height  // 节点的高度
            _this.setData({
                fengeH: rect.height
            })
        }).exec()

        this.setData({
            // scrollTop: 0,
            hideSearch: false
        })

        if (this.data.refresh) {
            this.setData({
                page: 1
            });
            this.renderFunc(this.data.nType, this.data.noStock);
        } else {
            this.setData({
                refresh: true
            })
        }
        if (app.globalData.cartNum > 0) {
            wx.setTabBarBadge({
                index: 2,
                text: app.globalData.cartNum
            })
        } else {
            wx.removeTabBarBadge({
                index: 2
            })
        }

        wx.showLoading({
            title: '加载中',
            mask: true
        })
    },
    // 监听tabbar切换
    onTabItemTap(item) {
        this.setData({
            isnav:false
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let searVal = wx.getStorageSync('searchTxt');

        if (this.data.refresh) {
            this.setData({
                page: 1
            });
            this.renderFunc(this.data.nType, this.data.noStock);
        } else {
            this.setData({
                refresh: true
            })
        }

        // console.log(searVal)
        if (searVal == '') {
            this.setData({
                searTxt: '搜索'
            })
        } else {
            this.setData({
                searTxt: searVal
            })
        }
    },
    
    // // 分享
    // onShareAppMessage:function(){
    //     let shareParam = share({
    //         path: 'pages/goods/goods',
    //         success: function () {
    //             wx.showToast({
    //                 title: '转发成功',
    //             })
    //         }
    //     });
    //     return shareParam;  
    // },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        
    },

    // 根据筛选条件渲染
    renderFunc(sort,noStock){
        const _this = this;
        // wx.showLoading({
        //     title: '加载中',
        //     mask: true
        // })
        ajax.ajaxFunc({
            url: 'api/goods/index',
            data: {
                now_page: _this.data.page,
                openid: app.globalData.openId || wx.getStorageSync('openid'),
                keyword: wx.getStorageSync('searchTxt'),
                sort: sort,
                no_stock:noStock,
                class_id: wx.getStorageSync('clsId') || ''
            },
            success: function (r) {
                //console.log(r);
                wx.stopPullDownRefresh()
                if (r.code == 1) {
                    _this.setData({
                        page: r.data.page.now_page,
                        totalPage: r.data.page.totalPages

                    })
                    if(_this.data.page == 1){
                        _this.setData({
                            items: r.data.goods
                        })
                    }else{
                        _this.setData({
                            items: _this.data.items.concat(r.data.goods)
                        })
                    }
                }
                // 回显外链跳转过来的分类
                let gsId = wx.getStorageSync('clsId'), gsData = wx.getStorageSync('good_class');
                gsData.map((v, i) => {
                    if (v.id === gsId) {
                        _this.setData({
                            ['filterData[0].text']: v.name,
                            isclsIndex: i
                        })
                    } else if (gsId === ''){
                        _this.setData({
                            ['filterData[0].text']: '全部',
                            isclsIndex: ''
                        })
                    }
                })
                wx.hideLoading();
                // app.globalData.clsId = '';
                // app.globalData.searchTxt = '';
            }
        })
    },

    // 获取分类
    goodClsFun() {
        let _this = this;
        ajax.ajaxFunc({
            url: 'api/index/getCategory',
            data: {
                openid: app.globalData.openId || wx.getStorageSync('openid'),
            },
            success: function (r) {
                if (r.code == 1) {
                    _this.setData({
                        good_class : r.data
                    })
                    wx.setStorageSync('good_class', r.data)
                }
            }
        })
    },

    // 分页
    pageRenderFunc(){
        if(this.data.page < this.data.totalPage){
            let page = this.data.page + 1;
            this.setData({
                page: page
            })
            this.renderFunc(this.data.nType,this.data.noStock);
        }
    },
    //筛选分类-触屏后移动事件显示与否
    opennav() {
        var that = this;
        if (!this.data.isnav) {
            that.setData({
                isnav: (!that.data.isnav)
            });
        } else {
            that.setData({
                isnav: (!that.data.isnav)
            });
        }
    },
    // 筛选分类渲染商品列表
    claListFunc: function (e) {
        console.log(e)
        let clsid = e.currentTarget.dataset.id;
        let clsname = e.currentTarget.dataset.name;
        let clsindex = e.currentTarget.dataset.index;
        app.globalData.clsId = clsid;
        wx.setStorageSync('clsId', clsid)
        // wx.setStorageSync('searchTxt', '')
        this.setData({
            page: 1,
            ['filterData[0].text'] : clsname,
            isclsIndex: clsindex,
            isnav:false,
        })
        this.renderFunc(this.data.nType, this.data.noStock);
    },
    // 修改排序方式
    switchTab: function (e) {
        let data = e.currentTarget.dataset,
            id = e.currentTarget.id,
            _this = this;
        let modifyI = "filterData[" + id + "].class";
        if (data.way == 'state_alone'){
            if (this.data.activeIndex == id){
                if (!this.data.isnav) {
                    this.setData({
                        isnav: (!this.data.isnav)
                    });
                } else {
                    this.setData({
                        isnav: (!this.data.isnav)
                    });
                }
                return;
            }else{
                this.data.filterData.forEach(val => {
                    if (val.sortWay != 'state_alone') {
                        let o = "filterData[" + val.index + "].class";
                        _this.setData({
                            [o]:''
                        })
                    }
                })
                this.data.lastnType = this.data.nType;
                this.data.lastnoStock = this.data.noStock;
                this.setData({
                    page: 1,
                    nType: '',
                    noStock: '',
                    [modifyI]: 'filter-item-active',
                    activeIndex: id
                });
            }
        }
        else if (data.way == 'state_with') {
            this.data.filterData.forEach(val=>{
                if (val.sortWay == 'state_alone'){
                    let o = "filterData[" + val.index + "].class";
                    _this.setData({
                        [o]:''
                    })
                }
            })
            let noStock;
            // 第二次点击，降序排序
            if (this.data.filterData[this.data.activeIndex].sortWay == 'state_alone') {
                noStock = this.data.lastnoStock;
            }else{
                if (this.data.isDoubleZ = !this.data.isDoubleZ){
                    noStock = 2;
                }else{
                    noStock = 1;
                }
            }
            let clsStr = 'filter-item-active' + noStock;
            this.setData({
                page: 1,
                nType: _this.data.nType,
                noStock: noStock,
                [modifyI]: 'filter-item-active ' + clsStr,
                activeIndex: id
            });
        }
        // state_nwith
        else{
            var oriI = [];
            this.data.filterData.forEach(val => {
                if (val.sortWay == 'state_alone' || val.sortWay == 'state_nwith') {
                    oriI.push("filterData[" + val.index + "].class");
                    let o = "filterData[" + val.index + "].class";
                    _this.setData({
                        [o]: ''
                    })
                }
            })

            let nType;
            // 第二次点击，降序排序
            if (this.data.filterData[this.data.activeIndex].sortWay == 'state_alone') {
               // console.log(this.data.lastnType)
                nType = this.data.lastnType;
            }else{
                if (this.data.isDoubleJ = !this.data.isDoubleJ) {
                    nType = 2;
                } else {
                    nType = 1;
                }
            }
            let clsStr = 'filter-item-active' + nType;
            this.setData({
                page: 1,
                noStock: _this.data.noStock,
                nType: nType,
                [modifyI]: 'filter-item-active ' + clsStr,
                activeIndex: id
            });
        }
        //console.log(this.data.nType + '   ---   ' +this.data.noStock)
        this.renderFunc(this.data.nType,this.data.noStock);
    },

    goToDetail: function (e) {
        var id = e.currentTarget.id;
        // 进入商品详情
        wx.navigateTo({
            url: '../goodDetail/goodDetail?id=' + id
        })
    },
    myevent: function(e){
        // 获取自定义组件参数
        var searchText = e.detail.text;
    },
    switchListIcon: function(e){
        let _this = this;
        this.setData({
            listIcon: !_this.data.listIcon
        })
    },
    gotoSearch: function(){
        wx.navigateTo({
            url: '../search/search',
        })
    },

    // 触碰到屏幕
    touchStarFunc(e){
        let startY = e.changedTouches[0].clientY;
        this.data.startY = startY;
    },

    // 滑动屏幕
    touchMoveFunc(e){
        let moveY = e.changedTouches[0].clientY;
        this.data.moveY = moveY;
        let eleH = this.data.fengeH;
        if (this.data.touchScrollTop > eleH){
            if(moveY - this.data.startY < -20){
                this.setData({
                    hideSearch: true
                })
            }

            if(this.data.startY < 20){
                this.setData({
                    hideSearch: false
                })
            }
        }else{
            this.setData({
                hideSearch: false
            })
        }
    },
    topFunc(e){
        this.data.touchScrollTop = e.detail.scrollTop;
        // clearTimeout(this.timer)
        // if (this.data.touchScrollTop < 0){
        //     this.timer = setTimeout(() => {
        //         this.refreshFun()
        //     }, 350)
        // }
    }
})
