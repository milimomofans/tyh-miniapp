// pages/orderDetail/index.js
const api = require('../../utils/api')
const Qrcode = require('../../utils/weapp-qrcode')
let baseObj = {
  data: {
    banner:''
  },
  onLoad: function (options) {

    if(options.params){
      let query = JSON.parse(options.params)
      let profitAmount = query.totalAmount - query.amount;
      profitAmount = profitAmount.toFixed(2);
      console.log(query);
      // this.createCanvas(query.no)
      this.getBanner()
      this.setData({
        profitAmount: profitAmount,
        params:query
      })
    }

   
    
  },
  onShow: function () {

  },
}
let eventObj = {}
let apiObj = {
  getBanner(){
    api.getBanner().then(res=>{
      console.log(res)
      if(res.code == 200){
        this.setData({
          banner:res.data
        })        
      }
    })
  },
  createCanvas(orderNo){
    let qrcode = new Qrcode('Code',{
      text:`${orderNo}`,
      width:120,
      height:120
    })
  }
}
let PageObj = Object.assign(baseObj,eventObj,apiObj)
Page(PageObj)