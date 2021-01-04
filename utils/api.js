// let baseUrl = 'https://www.gyouzhe.com/'
// let baseUrl = `http://oil.gyouzhe.cn/`
let baseUrl = 'https://api.toyouh.com/'
// let baseUrl = 'http://4dc5s9.natappfree.cc/';
function request({
    url=url,
    method="GET",
    data={},
    contentType = 'application/json',
    showLoadding = true,
    LoginPre
}){
    let userInfo = wx.getStorageSync('userInfo'),
    token =userInfo.token || ''
    if(showLoadding){
      wx.showLoading({
        title: '处理中请稍后...'
      })
    }
    let p = new Promise((resolve,reject)=>{
        wx.request({
          url,
          method,
          header:{
            'content-type':contentType,
            'Accept':"application/json",
            token:token
          },
          data:data,
          success:(res=>{
            console.log(data,'111111111111111111111111111111111')
            let {statusCode} = res
            if(statusCode == 200){
              console.log(res.data.code)
              let {code} = res.data
              if(code == 403){   //因为app.js已经进行过一次登陆,如果还是报错，则为未授权需要跳转到登陆页面授权
                if(LoginPre){
                  return 
                }
                wx.removeStorage({
                  key:'userInfo',
                  success:()=>{
                    wx.navigateTo({
                      url:"/pages/login/index"
                    })
                  }
                })
              }else{
                resolve(res.data)
              }
            }
          }),
          fail:(fail=>{
            // if(isone){
            //   isone = false
            //   wx.showToast({
            //     title:"网络超时啦,请稍后再试",
            //     icon:"none",
            //     duration:2000
            //   })            
            // }
            // setTimeout(()=>{
            //   isone = true
            // },2000)
          }),
          complete:(res=>{
            if(showLoadding){
              wx.hideLoading()
            }
          })
        })
      })
      return p
}



module.exports = {
    //微信登录
    wxLogin(data){
        // let url = baseUrl + 'wx/miniapp/authorize'
        let url = baseUrl + 'wx/miniapp/authorize'
        console.log(data,'22222222222222')
        return request({
            url,
            contentType: 'application/x-www-form-urlencoded',
            data:data,
            method:"POST",      
        })
    },
    getBanner() {
      let url = baseUrl + '/api/banner'
      return request({
        url
      })
    },
    //获取用户的车牌手机号  
    getUserInfo(){
      let userId = wx.getStorageSync('userInfo').userId
      let url = baseUrl+`api/user/${userId}/info`
      return request({
        url,
        contentType:'application/x-www-form-urlencoded'
      })
    },
    //获取加油站列表
    getGas(data,LoginPre){
      let url = baseUrl+`api/gas`
      return request({
        url,
        data,
        contentType:"application/x-www-form-urlencoded",
        LoginPre
      })
    },
    //获取加油站的油号等信息
    gasInfo(gasId){
      let url = baseUrl + `api/gas/${gasId}`
      return request({
        url,
        contentType:"application/x-www-form-urlencoded"
      })
    },
    //用户下单
    userTrade(params){
      let url = baseUrl + `api/trade`
      return request({
        url,
        data:params,
        contentType:"application/x-www-form-urlencoded",
        method:"POST"
      })
    },
    //订单列表获取  订单详情
    getOrderList(params){
      let url = baseUrl + `api/trade`
      return request({
        data:params,
        url
        // contentType:"application/x-www-form-urlencoded"
      })
    },
    //获取广告
    getBanner(){
      let url = baseUrl + `api/banner`
      return request({
        url,
        contentType:"application/x-www-form-urlencoded"
      })
    },
    //获取油站订单
    getGasOrder(gasId,params){
      let url = baseUrl + `api/gas/${gasId}/order`
      return request({
        url,
        contentType:'application/x-www-form-urlencoded',
        data:params
      })
    },
    //发送短信验证码
    sendVerifyCode(phone){
      let url = baseUrl + `api/sms/sendVerifyCode`
      return request({
        url,
        data:{
          phone
        },
        contentType:"application/x-www-form-urlencoded",
        method:"POST"
      })
    },
    submitUserInfo(params){
      let userId = wx.getStorageSync('userInfo').userId
      let url = baseUrl + `api/user/${userId}/info`
      return request({
        url,
        data:params,
        method:"POST",
        contentType:"application/x-www-form-urlencoded"
      })
    },
    //订单计价
    tradeCounter(params){
      let url = baseUrl + `api/trade/counter`
      return request({
        url,
        data:params,
        method:"POST",
        contentType:"application/x-www-form-urlencoded",
        showLoadding:false
      })
    },
    //微信支付
    wxPay(tradeNo){
      let url = baseUrl + `api/trade/${tradeNo}/wx/paysign`
      return request({
        method:'POST',
        url,
        contentType:"application/x-www-form-urlencoded",
        showLoadding:false
      })
    },
    checkPayState(tradeNo){
      let url = baseUrl + `api/trade/${tradeNo}/payinfo`
      return request({
        url,
        contentType:"application/x-www-form-urlencoded",
        showLoadding:false
      })
    },
    //查询订单详情
    checkDetail(no){
      let url = baseUrl + `api/trade/${no}`
      return request({
        url,
        contentType:'application/x-www-form-urlencoded',
        showLoadding:false
      })
    }

}