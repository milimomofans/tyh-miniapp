const api = require('../utils/api')
function authorization(){
    wx.removeStorageSync('userInfo')
    wx.getSetting({
        success:(res)=>{
            if(res.authSetting['scope.userInfo']){
                let loginHandler = new login()
                loginHandler.wxLogin()
            }
        }
    })
}
class login{
    wxLogin(){
        wx.login({
            success:(res)=>{
                let {code} = res
                this.getUserInfo(code)
            }
        })
    }
    getUserInfo(code){
        wx.getUserInfo({
            success:(res)=>{
                let {iv,encryptedData,rawData,signature} = res,
                params = {
                    code:code,
                    encryptedData,
                    iv,
                    rawData,
                    signature                   
                }
                this.apiLogin(params)
            }
        })
    }
    apiLogin(params){
        api.wxLogin(params).then(res=>{
            console.log(res)
            if(res.code == 200){
                wx.setStorageSync('userInfo',res.data)
                if(res.data.employId != 0 && res.data.gasId != 0){ 
                    wx.navigateTo({
                        url:'/pages/serachOrder/index'
                    })
                }else{ 
                    wx.navigateTo({
                        url:'/pages/order/index'
                    })
                }
            }
        })
    }
}
module.exports = {
    authorization
}