// pages/todos_center/todos_center.js
var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeName: 1,
    id: "", //订单id
    order_status: ['未接单', '未完成', '已完成', '已取消'],
    distence: "", //距离
    info: "" //订单信息

  },
  // 获取订单信息
  getInfo() {
    var that = this;
    db.collection('order')
      .doc(this.data.id)
      .get({
        success: function (res) {
          //console.log(res.data)
          that.setData({
            info: res.data
          })
        }
      })
  },
  //改变订单状态
  change() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定接取订单',
      success(res1) {
        if (res1.confirm) { //确认接单
          wx.cloud.callFunction({ //改变订单状态
            name: 'jiedan',
            data: {
              id: that.data.id,
              rider_id: app.globalData.userInfo.openid
            },
            success: res2 => {
              that.data.info.order_status = 1;
              that.setData({
                info: that.data.info
              })
            }
          });
          wx.cloud.callFunction({ //发送订阅消息给用户
            name: 'order_message',
            data: {
              user_id: that.data.info.user_id,
              _id: that.data.info._id,
              price: that.data.info.price,
            },
            success: res3 => {
              console.log("已发送")
            }
          });
        } else if (res1.cancel) { //取消接单
          console.log('用户点击取消')
        }
      }
    });
  },

  // 接单
  jiedan: function () {
    var that = this;
    db.collection('check')
      .where({
        rider_id: app.globalData.userInfo.openid,
      })
      .get({
        success: function (res) {
          console.log("1");  
          //数据不存在或未通过审核
          if(res.data==""||!res.data[0].verified){   
            wx.showToast({
              title: '通过实名认证才能接单',
              icon: 'none',
              duration: 2000
            })
          }else{   //通过审核
            that.change()
          }
        },
        fail: console.error
      })
  },
  //手风琴
  onChange(event) {
    this.setData({
      activeName: event.detail
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      distence: options.distence
    });
    this.getInfo();
  },


})