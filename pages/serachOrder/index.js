// pages/serachOrder/index.js
const api = require('../../utils/api')
const util = require('../../utils/util')
let baseObj = {
  data: {
    gasOrder:[],
    pageParams:{
      pageNo:1,
      pageSize:10,
      startTime:"00:00",
      endTime:"23:59"
    },
    totalParam:{
      tradeTotal:0,
      totalAmount:0
    },
    haveNext:true,
    isSerach:false
  },
  onLoad: function (options) {
    if(options.gasId){
      this.setData({
        gasId:options.gasId
      })
      this.getGasOrder()
    }
    this.setData({
      nowTime:util.formatTime(new Date()).noHour
    })
  },
  onShow: function () {

    // this.setData({
    //  time:util.formatTime(new Date()).noHour,//获取当前系统时间
    // })
  },
  onReachBottom(){
    if(this.data.haveNext){
      let {pageParams} = this.data
      this.setData({
        'pageParams.pageNo':pageParams.pageNo+1
      })
    }
  }
}
let apiObj = {
  getGasOrder(){
    let {pageParams,gasId} = this.data,
    apiParams = {
      pageNo:pageParams.pageNo,
      pageSize:pageParams.pageSize,
      startTime:pageParams.startTime + ':00',
      endTime:pageParams.endTime + ':59'
    }
  
    api.getGasOrder(gasId,apiParams).then(res=>{
      if(res.code == 200){
        let {data} = res.data
        if(data.length == 0){
          this.setData({
            haveNext:false
          })
        }else{
          let setStr = `gasOrder[${this.data.pageParams.pageNo - 1}]`,
          totalParam = {
            tradeTotal:res.data.tradeTotal,
            totalAmount:res.data.totalAmount
          }
          this.setData({
            [setStr]:data,
            totalParam
          })
        }
      }
    })
  }
}
let eventObj = {
  bindTimeChange(e){
    console.log(e)
    let {value} = e.detail,
    {type} = e.currentTarget.dataset,
    str = `pageParams.startTime`
    if(type == 'endTime') str = `pageParams.endTime`
    this.setData({
      [str]:value
    })
  },
  serach(){
    let {pageParams} = this.data
    if(pageParams.startTime && pageParams.endTime){
      this.setData({
        haveNext:true,
        "pageParams.pageNo":1,
        gasOrder:[],
        isSerach:true
      })
      this.getGasOrder()
    }
    
  },
  goDetail(e){
    let {item} = e.currentTarget.dataset
    wx.navigateTo({
      url:`/pages/orderDetail/index?params=${JSON.stringify(item)}`
    })
  },
  cancel(){   
    let pageParams = {
      pageNo:1,
      pageSize:10,
      startTime:"00:00",
      endTime:"23:59"
    }
    this.setData({
      pageParams,
      haveNext:true,
      isSerach:false
    })
    this.getGasOrder()
  }
}
let pageObj = Object.assign(baseObj,apiObj,eventObj)
Page(pageObj)