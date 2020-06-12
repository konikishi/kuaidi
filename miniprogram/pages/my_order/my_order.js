// miniprogram/pages/my_order.js
var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeName: 1,
    order_status: ['未接单', '未完成', '已完成', '已取消'],
    info: "", //订单信息
    id: "", //订单id
    rate_value: 0, //评分
    assess_value: "", //评价
    pj: null, //评分显示
    rider_name: null, //取件员姓名
    rider_tel: null //取件员手机号
  },

  onChange(event) { //取件码手风琴样式
    this.setData({
      activeName: event.detail
    });
  },

  getInfo() { // 获取订单信息
    var that = this;
    db.collection('order')
      .doc(that.data.id)
      .get({
        success: function (res) {
          that.setData({ //将获取到的信息赋值给info
            info: res.data
          });
          if (res.data.rate == 0) { //如果用户没有评分，将评分隐藏
            that.setData({
              pj: false
            });
          };
          if (res.data.rider_id != null && res.data.rider_id != "") {
            db.collection('check').where({ //如果订单已接取，获取取件员的姓名和手机号
              rider_id: res.data.rider_id
            }).get({
              success: function (res1) {
                that.setData({
                  rider_name: res1.data[0].name,
                  rider_tel: res1.data[0].tel
                })
              },
              fail: console.error
            })
          }
        }
      })
  },

  confirm() { // 确认收货
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认收货',
      success(res) {
        if (res.confirm) { //改变订单状态为已完成
          db.collection("order").doc(that.data.id).update({
            data: {
              order_status: 2
            },
            success: res => {
              that.data.info.order_status = 2;
              that.setData({
                info: that.data.info
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  cancel() { //取消订单
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success(res) {
        if (res.confirm) { //改变订单状态为已取消
          db.collection("order").doc(that.data.id).update({
            data: {
              order_status: 3
            },
            success: res => {
              that.data.info.order_status = 3;
              that.setData({
                info: that.data.info
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  rateChange(event) { //评分
    this.setData({
      rate_value: event.detail
    });
  },

  assessChange(event) { //动态显示评价内容
    this.setData({
      assess_value: event.detail
    });
  },

  pingjia() { //显示评价
    this.setData({
      pj: true
    });
  },

  tijiao() { //提交评价
    var that = this;
    if (that.data.rate_value == 0) {
      wx.showToast({
        title: '请评分后再提交',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '提交后不可修改',
        content: '是否提交评价',
        success(res) {
          if (res.confirm) {
            db.collection("order").doc(that.data.id).update({
              data: {
                rate: that.data.rate_value,
                assess: that.data.assess_value
              },
              success: res => {
                that.data.info.rate = that.data.rate_value,
                  that.data.info.assess = that.data.assess_value,
                  that.setData({
                    info: that.data.info
                  })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    this.getInfo();
  },

})