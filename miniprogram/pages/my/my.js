// miniprogram/pages/my/my.js
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false, //是否获取到用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getUserInfo();
  },


  /**
   * 获取用户信息
   */
  getUserInfo: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },

  getUrl: function() {  //根据实名状态跳转相应页面
    db.collection('check')
      .where({
        rider_id: this.data.userInfo.openid,
      })
      .get()
      .then(res => {
        console.log(res)
        if (res.data==""){   //如果未填写实名信息，进入填写页面
          wx.navigateTo({
            url: '../relName/relName',
          })
        }else{  //否则进入信息展示页面
          wx.navigateTo({
            url: `../id/id?verified=${res.data[0].verified}&checking=${res.data[0].checking}&name=${res.data[0].name}&id=${res.data[0].id}&tel=${res.data[0].tel}&reason=${res.data[0].reason}`,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },

  //调用微信地址
  chooseAddress() {
    wx.chooseAddress({
      success(res) {
        console.log(res)
      }
    })
  },
  //授权设置
  authSetting() {
    wx.openSetting({
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },
})