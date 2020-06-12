// miniprogram/pages/id/id.js
var app = getApp();
var util = require('../../utils/util.js');
const db = wx.cloud.database();
Page({

  data: {

  },

  onLoad: function(options) {
    this.setData({
      verified: (options.verified == 'true') ? true : false,
      checking: (options.checking == 'true') ? true : false,
      name:options.name,
      id:options.id,
      tel:options.tel,
      reason:options.reason
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function() {
  //   this.check()
  // },
  // check: function() {
  //   db.collection('check')
  //     .where({
  //       _id: app.globalData.userInfo.openid,
  //     })
  //     .get()
  //     .then(res => {
  //       console.log(res)
  //       if (res.data[0].verified) {
  //         //console.log(res.data[0])
  //         this.setData({
  //           name: res.data[0].name,
  //           id: res.data[0].id,
  //           tel: res.data[0].tel
  //         })
  //       } else if (res.data[0].checking) {

  //       } else {
  //         this.setData({
  //           reason: res.data[0].reason
  //         })
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  // },
  goto: function() {    //重新审核
    wx.navigateTo({
      url: '../relName/relName',
    })
  }
})