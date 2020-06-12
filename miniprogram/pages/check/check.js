// miniprogram/pages/check/check.js
var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: null,
  },

  getInfo() {
    var that = this;
    db.collection('check').where({
      checking: true,
      verified: false
    }).get({
      success: function (res) {
        //console.log(res.data)
        that.setData({
          infoArray: res.data
        });
        wx.pageScrollTo({  //滚动到页面顶部
          scrollTop: 0,
          duration: 300
        })
      },
      fail: console.error
    })
  },

  onChange(event) { //取件码手风琴样式
    this.setData({
      activeName: event.detail
    });
  },

  tongguo(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否通过本次审核',
      success(res) {
        if (res.confirm) {
          console.log(e.target.dataset.id)
          db.collection("check").doc(e.target.dataset.id).update({
            data: {
              verified: true
            },
            success(res1) {
              wx.showToast({
                title: '已通过本次审核',
                icon: 'none',
                duration: 2000
              });
              that.getInfo()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  jujue(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否拒绝本次审核',
      success(res) {
        if (res.confirm) {
          console.log(e.target.dataset.id)
          db.collection('check').doc(e.target.dataset.id).update({
            data: {
              checking: false
            },
            success(res1) {
              wx.showToast({
                title: '已拒绝本次审核',
                icon: 'none',
                duration: 2000
              });
              that.getInfo()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
  },

})