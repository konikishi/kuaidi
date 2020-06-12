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
    info:"",  //订单信息
    id:""  //订单id
  },
  //获取信息
  getInfo() {
    var that = this;
    db.collection('order')
    .doc(that.data.id)
    .get({
      success: function(res) {
        // console.log(res.data)
        that.setData({
          info:res.data
        });
      }
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
      id:options.id
    });
    this.getInfo();
  },




})