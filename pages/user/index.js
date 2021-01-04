// pages/user/index.js
const api = require('../../utils/api')
const app = getApp()
let baseObj ={
  data: {
    user:{},
    userInfo:{},
    noLogin:false
  },
  onLoad: function (options) {
    this.isLogin()
    
  },
  onShow: function () {
    console.log(this.data.noLogin)
    if(this.data.noLogin){
      this.isLogin()
    }
  }
}
let eventObj = {
  goEditor(){
    let {userInfo} = this.data,
    haveData = false
    if('carLicense' in userInfo && 'phone' in userInfo){
      console.log('进来了')
      haveData =!haveData
      app.globalData.userInfo =userInfo
    }
    wx.navigateTo({
      url:`/pages/editor/index?haveData=${haveData}`
    })
  },
  toQrcode(){
    wx.navigateTo({
      url:`/pages/qrcode/index`
    })
  }
}
let apiObj = {
  isLogin(){
    let user = wx.getStorageSync('userInfo')
    if(user && user != ''){ //如果登录了就会有头像昵称信息
      let haveGasOrder = true
      user.employId == 0 ? haveGasOrder = false : '' 
      this.setData({
        user,
        haveGasOrder,
        noLogin:false
      })
      this.getUserInfo()
    }else{
      this.setData({
        noLogin:true
      })
    }
  },
  //获取用户的车牌号以及手机号
  getUserInfo(){
    api.getUserInfo().then(res=>{
      if(res.code == 200){
        this.setData({
          userInfo:res.data
        })
      }
    })
  },
  goLinkHandler(e){
    let {type} = e.currentTarget.dataset,
    linkUrl,
    {noLogin} = this.data
    if(noLogin){ 
      return wx.navigateTo({
        url:"/pages/login/index"
      })
    }
    console.log(type)
    switch(type){
      case 'historyOrder':
          linkUrl = '/pages/order/index'
          break;
      case 'serachOrder':
          let {user} = this.data
          
          linkUrl = `/pages/serachOrder/index?gasId=${user.gasId}`
          break;    
    }
    wx.navigateTo({
      url:linkUrl
    })
  },
  LoginBtn(){
    wx.navigateTo({
      url:"/pages/login/index"
    })
  }
}
let pageObj = Object.assign(baseObj,eventObj,apiObj)
Page(pageObj)