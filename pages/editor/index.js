// pages/editor/index.js
const api = require('../../utils/api')
const app = getApp()
let _check = new Check()
let baseObj = {
  data: {
    params:{
      carId:'',
      mobile:'',
      code:'',
    },
    count:0
  },
  onLoad: function (options) {
    let {haveData} = options
    if(haveData){
      let {params} = this.data,
      userInfo = app.globalData.userInfo
      console.log(app.globalData)
      params.mobile = userInfo.phone
      params.carId = userInfo.carLicense
      this.setData({
        params
      })
    }
  },
  onReady: function () {

  },
  onShow: function () {

  },
}
let eventObj = {
  inputHandler(e){
    let {type} = e.currentTarget.dataset,
    setStr = `params.${type}`
    let val = e.detail.value;
    if(val){
      val = (val+'').toUpperCase();
    }
    this.setData({
      [setStr]: val
    })
  },
  getCode(){
    let check = new Check(),
    {count,params} = this.data
    if(count > 0){return} 
    if(check.checkMobile.call(this)){
      console.log('进来了')
      api.sendVerifyCode(params.mobile).then(res=>{
        if(res.code == 200){
          this.countDown()
        }else{
          wx.showToast({
            title:`${res.msg}`,
            icon:"none",
            duration:1500
          })
        }  
      })
    }
  },
  countDown(){
      let count = 61
      let timer = setInterval(()=>{
        count -- 
        if(count <= 0){ 
          clearInterval(timer)
        }
        this.setData({
          count
        })
      },1000)
  },
  submit(){
    let {params} =this.data,
    canSumbit = false,
    result = true
    params.carId.length > 0 && params.mobile.length > 0 && params.code.length > 0 ? canSumbit = true : ''

    if(canSumbit){
      for(var i in _check){
        result = _check[i].call(this)
        if(!result){
          break
        }
      }
    }

    if(result){
      let apiParams = {
        phone:params.mobile,
        carLicense:params.carId,
        verifyCode:params.code
      }
      api.submitUserInfo(apiParams).then(res=>{
        if(res.code == 200){
          wx.showToast({
            title:"修改成功！",
            icon:"none",
            duration:1500,
            success:()=>{
              setTimeout(()=>{
                wx.navigateBack({
                  delta:1
                })
              },1500)
            }
          }) 
        }else{
          wx.showToast({
            title:`${res.msg}`,
            icon:"none",
            duration:1500
          })
        }
      })
    }

  }
}
let apiObj = {}
let PageObj = Object.assign(baseObj,eventObj,apiObj)
Page(PageObj)

function Check(){
  this.checkCartId =function(){
    let reg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
    if(reg.test(this.data.params.carId)){
      return true
    }else{
      wx.showToast({
        title:"车牌号输入有误",
        icon:"none",
        duration:1500
      })
      return false
    }
  }
  this.checkMobile = function(){
    if(this.data.params.mobile.length == 0){
      wx.showToast({
        title:"手机号不能为空",
        icon:"none",
        duration:1500
      })
      return false
    }

    let reg = /^1\d{10}$/
    if(reg.test(this.data.params.mobile)){
      return true
    }else{
      wx.showToast({
        title:"手机号输入有误",
        icon:"none",
        duration:1500
      })
      return false
    }
  }
}