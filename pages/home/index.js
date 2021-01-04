// pages/home/index.js
const api = require('../../utils/api')
import {authorization} from '../../utils/login'
let payCount = 0
let BaseObj = {
  data: {
    Model:[
      1,2,3,4,5
    ],
    ListParams:{
      lat:'',
      lng:'',
      pageNo:1,
      pageSize:20
    },
    gasInfo:{},
    haveNext:true,
    GasList:[],
    showList:false,
    curOil:'',
    curOilGanId:'',
    Price:"",
    falseData:[
      1,2,3
    ],
    isShowModal:false,
    banner:[]
  },
  onLoad: function (options) {
    if(options.tradeNo){
      this.setData({
        noPerform:true
      })
      let {tradeNo} = options
      if(tradeNo != ''){
        return this.goToOrderDetail(tradeNo)        
      }
    } 
    if(options.from == 'wxmp'){
      this.setData({
        noPerform:true
      })
      return authorization()
    }
  },
  onShow: function () {
    if(this.data.noPerform){
      this.setData({
        noPerform:false
      })
    }else{
      this.getAuthorization()
      this.getUserInfo()
      this.getBanner()
    }
   
  },
  onHide(){
    wx.hideLoading()
    this.setData({
      haveNext:true,
      showList:false
    })
  }
}
let ApiObj = {
  getUserInfo(){
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo == '') return
    api.getUserInfo().then(res=>{
      console.log(res)
      if(!checkIsNull(res.data)){
        wx.showModal({
          content:"请完善个人资料，更多优惠等着您！",
          showCancel:false,
          confirmText:"前往",
          confirmColor:"#FF973D",
          success:()=>{
            wx.navigateTo({
              url:"/pages/editor/index"
            })
          }
        })
      }
    })
  },
  getBanner(){  //获取banner
    api.getBanner().then(res=>{
      console.log(res)
      if(res.code == 200){
        this.setData({
          banner:res.data
        })
      }else {
        wx.showToast({
          title:res.msg,
          icon:'none',
          duration:1000
        })
      }
    })
    .catch(err=>{
      wx.showToast({
        title:err,
        icon:'none',
        duration:1000
      })
    })
  }
}
let EventObj = {
  OpenList(){
    let {GasList} = this.data
    
    if(GasList.length == 0){
      this.GetList()
    }
    this.setData({
      showList:!this.data.showList
    })
  },
  //获取油站列表
  GetList(isFirst = false){
    let {ListParams,GasList} = this.data
    api.getGas(ListParams,isFirst).then(res=>{
      if(res.code == 200){
        let {data} = res,
        str = `GasList[${ListParams.pageNo-1}]`
        if(isFirst && !this.data.isShowModal){
          this.getOil(data)
          this.setData({
            isShowModal:true
          })
        }

        if(data.length > 0){
          this.setData({
            [str]:data
          })
        }else{
          this.setData({
            haveNext:false
          })
        }
      }
    })
  },
  //第一次获取地址进行的操作
  getOil(data){
    let len = data.length 
    console.log(data)
    if(data[0].distance < 3000){
      if(len > 1 && (data[0].distance - data[1].distance) < 500){
        wx.showModal({
          content:`当前选择的站点是${data[0].name}`,
          showCancel:false,
          confirmText:"确定",
          confirmColor:"#FF973D"
        })
      }
      //123
      
      this.setOil(data[0])
    }else{
      wx.showModal({
        content:"您附近暂无合作油站",
        showCancel:false,
        confirmText:"确定",
        confirmColor:"#FF973D"
      })
      this.setOil(data[0])
    }
  
  },
  setOil(data){
    console.log(data,'000000000000000')
    this.getGasInfo(data.id)
  },
  scrollTolower(){
    if(this.data.haveNext){
      let {ListParams} = this.data
      this.setData({
        'ListParams.pageNo':ListParams.pageNo+1
      })
      this.GetList()
    }
  },
  /**
   * 查看经纬度授权
   */
  getAuthorization(){
    let str = 'scope.userLocation'
    wx.getSetting({
      success:(res)=>{
        if(res.authSetting[str] == undefined){
          LocationHandler.call(this)
        }else if(res.authSetting[str] == true){
          LocationHandler.call(this)
        }else{
          wx.showModal({
            content:"请求获取您的位置信息以便精确搜索最近的油站",
            confirmText:"前去授权",
            cancelText:"取消授权",
            success:(res)=>{
              if(res.confirm){
                wx.openSetting({
                  success:()=>{
                    this.getAuthorization()
                  }
                })
              }else{
                this.GetList(true)
              }
            }

          })
        }
      }
     
    })
  },
  /**
   * 
   * 获取选择的油站信息
   */
  getGasInfo(e){
    console.log(e)
    let gasid
    e.hasOwnProperty("currentTarget") ? gasid= e.currentTarget.dataset.gasid : gasid = e
    console.log()
    api.gasInfo(gasid).then(res=>{
      console.log(res)
      if(res.code == 200){
        console.log(res.data)
        let curOil = res.data.oils[0],
        curName = res.data.name.replace(/[\r\n]/g,""),
        setObj = {
          gasInfo:res.data,
          showList:false,
          curOil,
          curOilid:curOil.id,
          curGasName:curName
        }
        /**
         * 如果有油枪型号则默认选择第一个油枪
         */
        if(curOil.oilGuns && curOil.oilGuns.length > 0){
          setObj.curOilGanId = curOil.oilGuns[0].id
        }

        this.setData(setObj)
      }
    })
    this.Initialize()
  },
  changeOil(e){ //选择油号
    let {oilid,curoil} = e.currentTarget.dataset
    this.setData({
      curOilid:oilid,
      curOil:curoil,
      curOilGanId:curoil.oilGuns[0].id
    })
    this.Initialize()
  },
  changeOilGan(e){ //选择油枪
    let {oilganid} = e.currentTarget.dataset
    this.setData({
      curOilGanId:oilganid,
    })
    this.Initialize()
  },
  inputPrice(e){  //输入价格事件
    let {value} = e.detail
    if (!/^(\d?)+(\.\d{0,2})?$/.test(value)) { 
      value = value.substring(0, e.detail.value.length - 1);
    }
    this.setData({
      Price:value
    })
    if(this.timer){
      clearTimeout(this.timer)
      this.timer = null
    } 
    if(value == ''){
      return this.setData({
        total:''
      })
    }
    this.getTotal(value)
  },
  Pay(){  
    let {curOil,curOilGanId,Price,gasInfo} = this.data
    if(curOil.length > 0 && curOilGanId.length > 0 && Price > 0){
      return false
    }
    let params = {
      gasId:gasInfo.id,
      oilId:curOil.id,
      gunId:curOilGanId,
      amount:Price
    }
    api.userTrade(params).then(res=>{
      console.log(res)
      if(res.code == 200){
        let {data} = res
        this.wxPay(data)
      }else{ 
        wx.showToast({
          title:`${res.msg}`,
          icon:"none",
          duration:1500
        })
      }
    })
  },
  wxPay(tradeNo){
    api.wxPay(tradeNo).then(res=>{
      let {data} = res
      wx.requestPayment({
        timeStamp:data.timeStamp,
        nonceStr:data.nonceStr,
        package:data.package,
        signType:data.signType,
        paySign:data.paySign,
        success:()=>{
          wx.showLoading({
            title:"支付中,请稍后",
            success:()=>{
              this.checkState(tradeNo)
            }
          })
        }
      })
    })
  },
  checkState(tradeNo){
    api.checkPayState(tradeNo).then(res=>{
      let {data} = res
      if(data.status == 40){
        wx.hideLoading()
        this.goToOrderDetail(data.no)
      }else{
        if((payCount < 10)){
          setTimeout(() => {
            payCount+= 1
            this.checkState(tradeNo)          
          }, 500);
        } else {
          wx.showToast({
            title:`回调失败，订单编号${res.data.no}`,
            icon:'none',
            duration:1000,
            success:()=>{
              payCount = 0
            }
          })
        }
       
      }
    })
  },
  goToOrderDetail(no){
    api.checkDetail(no).then(res=>{
      if(res.code == 200){
        let {data} = res
        wx.navigateTo({
          url:`/pages/orderDetail/index?params=${JSON.stringify(data)}`
        })
      }
    })
  },
  getTotal(val){
    this.timer = setTimeout(() => {
      let {gasInfo,curOil} = this.data
      if(!gasInfo || !curOil) return   //如果没有数据则还没有选择
      let params = {
        gasId:gasInfo.id,
        oilId:curOil.id,
        amount:val
      }
      api.tradeCounter(params).then(res=>{
        console.log(res)
        if(res.code == 200){
          this.setData({
            total:res.data
          })
        }
      })

    }, 500);
  }, 
  Initialize(){
    this.setData({
      Price:'',
      total:''
    })
  },
  toDetail(e){
    let {detail} = e.target.dataset
    let {miniRedirect,redirect} = detail
    try {
      let redirectUrl = miniRedirect + redirect
      wx.navigateTo({
        url:redirectUrl,
        fail:()=>{
          wx.showToast({
            title:"未找到跳转路径",
            icon:"none",
            duration:1000
          })
        }
      })
    } catch (err){
      wx.showToast({
        title:err,
        icon:"none",
        duration:1000
      })
    }
  }
}
/**
 * 获取经纬度操作
 */
function LocationHandler(){
  wx.getLocation({
    type:"wgs84",
    success:(res)=>{
      let latStr = `ListParams.lat`,
      lngStr = `ListParams.lng`
      this.setData({
        [latStr]:res.latitude,
        [lngStr]:res.longitude
      })
      this.GetList(true)
    },
    fail:(res=>{
      wx.showModal({
        content:"取消授权无法精确搜索最近的油站",
        confirmText:"前去授权",
        cancelText:"取消授权",
        success:(res)=>{
          if(res.confirm){
            wx.openSetting({
              success:()=>{
                this.getAuthorization()
              }
            })
          }else{
            this.GetList(true)
          }
        }
      })
    })
  })
}

function checkIsNull(data){
  if(!data) return false

  let checkKeys = ['carLicense','phone']
  return checkKeys.every(item=>{
    return data[item] && data[item].length > 0
  })

}

let PageObj = Object.assign(BaseObj,ApiObj,EventObj)
Page(PageObj)