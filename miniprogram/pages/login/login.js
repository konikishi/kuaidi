// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //触发事件，调用登录云函数
  getUserInfo: function (e) {
    var that = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        console.log(res.result.wxContext.OPENID)
        e.detail.userInfo.openid = res.result.wxContext.OPENID
        app.globalData.userInfo = e.detail.userInfo
        that.setData({
          userInfo: e.detail.userInfo
        })
        wx.setStorageSync('userInfo', e.detail.userInfo)
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },

})