// pages/order/order.js
var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // order_type: ['快递', '商品'],
    order_status: ['未接单', '未完成', '已完成', '已取消'],
    tabs: "a",  //默认显示标签a
    my_order: [],  //我的订单列表
    order_center: [],  //抢单中心列表
    pick_order: [],  //我接的单列表
    skip_1: 0,  
    skip_2: 0,
    skip_3: 0,
    tempArray: []  //临时数组
  },

  //标签点击事件
  onClick(event) {
    // wx.showToast({
    //   title: `点击标签 ${event.detail.name}`,
    //   icon: 'none'
    // })
    this.setData({
      tabs: event.detail.name
    })
  },

  //下拉刷新，将数据初始化
  onPullDownRefresh: function () {
    if (this.data.tabs == "a") {
      this.setData({
        my_order: [],
        skip_1: 0
      });
      this.getMyorder();
    } else if (this.data.tabs == "b") {
      this.setData({
        order_center: [],
        skip_2: 0
      });
      this.orderCenter();
    } else {
      this.setData({
        pick_order: [],
        skip_3: 0
      });
      this.getPickorder();
    }
    wx.stopPullDownRefresh()
  },

  //触底刷新
  onReachBottom: function () {
    if (this.data.tabs == "a") {
      this.data.skip_1 = this.data.skip_1 + 5
      this.getMyorder()
    } else if (this.data.tabs == "b") {
      this.data.skip_2 = this.data.skip_2 + 5
      this.orderCenter()
    } else {
      this.data.skip_3 = this.data.skip_3 + 5
      this.getPickorder()
    }
  },


  getMyorder() { //获取我的订单
    wx.showLoading({
      title: '数据加载中',
    });
    wx.cloud.callFunction({
      name: 'my_order',
      data: {
        user_id: app.globalData.userInfo.openid,
        skip: this.data.skip_1
      },
      success: res => {
        this.setData({
          my_order: this.data.my_order.concat(res.result.data)
        }, res => {
          wx.hideLoading()
        })
      }
    })
  },


  orderCenter() { //获取未接单的订单
    wx.showLoading({
      title: '数据加载中',
    });
    wx.cloud.callFunction({
      name: 'order_center',
      data: {
        skip: this.data.skip_2,
        //city:app.globalData.district
      },
      success: res => {
        //console.log(res)
        this.data.tempArray = res.result.data;
        this.transform(this.data.tempArray);
        wx.hideLoading();
      }
    })
  },


  getPickorder() { //获取我接的单
    wx.showLoading({
      title: '数据加载中',
    });
    wx.cloud.callFunction({
      name: 'pick_order',
      data: {
        user_id: app.globalData.userInfo.openid,
        skip: this.data.skip_3
      },
      success: res => {
        this.setData({
          pick_order: this.data.pick_order.concat(res.result.data)
        }, res => {
          wx.hideLoading()
        })
      }
    })
  },


  async transform(array) { //将数据库中地址转化成坐标后计算距离
    var that = this;
    for (let i in array) { //循环遍历数组 
      let zb = await this.geocoder(array[i], i); //调用转换函数，计算坐标   
      let dis = await this.distance(zb, i); //调用距离计算函数，计算距离
      that.data.tempArray[i].dis = dis; //将距离加入数组
      that.setData({
        order_center: that.data.order_center.concat(that.data.tempArray[i])
      });
    }
  },
  geocoder: function (event, i) { //地址转坐标函数
    return new Promise((resolve, reject) => {
      var that = this;
      wx.request({
        url: `https://apis.map.qq.com/ws/geocoder/v1/`,
        data: {
          address: event.address,
          key: 'X47BZ-PDRKG-PVVQE-I6DKG-L4QIO-QBFBI'
        },
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },
  distance: function (event, i) { //计算两地距离
    return new Promise((resolve, reject) => {
      var that = this;
      wx.request({
        url: 'https://apis.map.qq.com/ws/distance/v1/',
        data: {
          mode: 'walking',
          from: `${app.globalData.latitude},${app.globalData.longitude}`,
          to: `${event.data.result.location.lat},${event.data.result.location.lng}`,
          key: 'X47BZ-PDRKG-PVVQE-I6DKG-L4QIO-QBFBI'
        },
        success: res => {
          var dis = res.data.result.elements[0].distance;
          if (dis <= 1000) {  //改变距离单位
            dis = dis + "m";
          } else if (dis > 1000) {
            dis = (Math.round(dis / 100) / 10).toFixed(1);
            dis = dis + "km";
          };
          resolve(dis)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.orderCenter()
    this.getMyorder()
    this.getPickorder()
  },


})