// pages/login/index.js
const api = require('../../utils/api')
const app = getApp()
let baseObj = {
  data: {
    wxcode:''
  },
  onLoad: function (options) {
    this.getWxCode()
  },
  onShow: function () {

  },
}
let apiObj = {
  getWxCode(){
    wx.login({
      success:res=>{
        this.setData({
          wxcode:res.code
        })
      }
    })
  }
}
let eventObj = {
  wxLogin(result){
    if(result.detail.errMsg == 'getUserInfo:ok'){
        let {wxcode} = this.data,
        {iv,encryptedData,rawData,signature} = result.detail,
        apiParams = {
          code:wxcode,
          encryptedData,
          iv,
          rawData,
          signature,
          relId:app.globalData.userId
        }
        console.log(apiParams,'----------------11111111')
        api.wxLogin(apiParams).then(res=>{
          console.log(res)
          if(res.code == 200){
            wx.setStorageSync('userInfo',res.data)
            /**
             * fail to do 这里先跳进首页进行调试
             */
            wx.switchTab({
              url:"/pages/home/index"
            })
          } else {
            wx.showToast({
              title:res.message,
              icon:'none',
              duration:1000,
              success:()=>{
                this.getWxCode()
              }
            })
          }
        })
        .catch(err=>{
          wx.showToast({
            title:err,
            icon:'none',
            duration:1000,
            success:()=>{
              this.getWxCode()
            }
          })
        })
    }
  },
  noLogin(){
    wx.navigateBack({
      delta:1
    })
  }
}
let pageObj = Object.assign(baseObj,apiObj,eventObj)
Page(pageObj)