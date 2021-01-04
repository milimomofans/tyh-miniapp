  // pages/order/index.js
const api = require('../../utils/api')
let baseObj = {
  data: {
    test:[
      1,2,3,4
    ],
    params:{
      pageNo:1,
      pageSize:8
    },
    haveNext:true,
    orderList:[]
  },
  onLoad: function (options) {
    this.getOrderList()
  },
  onShow: function () {

  },
  onReachBottom(){
    if(this.data.haveNext){
      this.setData({
        'params.pageNo':this.data.params.pageNo+1
      })
      this.getOrderList()
    }
  }
}
let apiObj = {
  getOrderList(){
    let {params} = this.data
    api.getOrderList(params).then(res=>{
      if(res.code == 200){
        if(res.data.data.length > 0){
          let setStr = `orderList[${params.pageNo-1}]`
          this.setData({
            [setStr]:res.data.data
          })
        }else{ 
          this.setData({
            haveNext:false
          })
        }
      }
    })
  }
}
let eventObj = {
  goOrderDetail(e){
    let {item} = e.currentTarget.dataset
    wx.navigateTo({
      url:`/pages/orderDetail/index?params=${JSON.stringify(item)}`
    }) 
  }
}
let PageObj = Object.assign(baseObj,apiObj,eventObj)
Page(PageObj)