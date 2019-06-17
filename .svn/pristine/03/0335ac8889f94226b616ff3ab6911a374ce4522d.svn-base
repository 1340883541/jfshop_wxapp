// pages/goodsInventory/goodsInventory.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inventoryLists:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let goodsList = JSON.parse(options.goodsList);
        console.log(goodsList)
        this.setData({
            inventoryLists: goodsList
        })
    }
})