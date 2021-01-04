const { getUserInfo, wxLogin } = require("../../utils/api")
// pages/qrcode/index.js
const api = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareParam:{},
    userInfo:wx.getStorageSync('userInfo'),
    auth:false
  },

  /**
   * 生命周期函数--监听页面加载fa
   */
  onLoad: function (options) {
    this.getUserInfo()
  },
  /**
   * 生命周期函数--监听页面显示
   */

  async savePic(){
    let {qrcode} = this.data.shareParam
    let _res = await wx.getImageInfo({
      src:qrcode
    })
    if(_res.errMsg !== 'getImageInfo:ok'){
      return this.showToast("图片地址不正确")
    }

    wx.saveImageToPhotosAlbum({
      filePath:_res.path,
      success:()=>{
        this.showToast('保存成功')
      },
      fail:(e)=>{
        console.log(e,'1111111111')
        console.log(this,'2222222')
        if(e.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
          return this.showToast('图片信息不存在')
        }
        this.setData({
          auth:true
        })
      }
    })
  },

  onSetting(e){
    console.log(e)
  },

  onClose(){
    this.setData({
      auth:false
    })
  },

  showToast(msg){
    wx.showToast({
      title:msg,
      icon:"none",
      duration:1000
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let {shareParam,userInfo} = this.data
    let url = `/pages/home/index?userId=${userInfo.userId}`
    console.log(url)
    return {
      title:"使用途油惠折扣加油",
      path:url,
      imageUrl:shareParam.qrcode
    }
  },

  getUserInfo(){
    api.getUserInfo().then(res=>{
      if(res.code == 200){
        this.setData({
          shareParam:res.data
        })
      }
    })
  }
})