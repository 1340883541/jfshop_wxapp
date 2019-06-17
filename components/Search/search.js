// components/Search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    text:{
        type: String,
        value:'搜索'
    },
    textColor:{
        type: String,
        value:'#888'
    },
    iconUrl:{
        type: String,
       // value:'../../images/search-icon.png'
        value:'../../images/search_black.png'
       
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
      onTap:function(){
          var myEventDetail = {
              text: this.properties.text
          }; // detail对象，提供给事件监听函数
          var myEventOption = {} // 触发事件的选项
          this.triggerEvent('myevent', myEventDetail, myEventOption)
      }
  }
})
