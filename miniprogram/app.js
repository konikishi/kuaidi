//app.js
App({
  globalData: {
    current_location: "", //用户当前位置描述
    district:"",
    userInfo: null, //用户基本信息
    longitude: 103, //用户坐标
    latitude: 24,
    verified: false, //实名认证
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'wx-xcx-001',
        traceUser: true,
      })
    }


    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) { //判断用户登录状态，未登录则跳转登录页
      this.globalData.userInfo = userInfo
    } else {
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }
  }
})