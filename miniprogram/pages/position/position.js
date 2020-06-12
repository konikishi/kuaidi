// pages/position/position.js
var app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    latitude: 0,//地图初次加载时的纬度坐标
    longitude: 0, //地图初次加载时的经度坐标
  },
  onLoad: function () {
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'X47BZ-PDRKG-PVVQE-I6DKG-L4QIO-QBFBI'
    });
    this.moveToLocation();
  },
  //移动选点
  moveToLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        app.globalData.current_location = res.name;
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        console.log(res)
        //app.globalData.district = res.result.address_component.district;
        //选择地点之后返回到原来页面 
        wx.navigateBack ({
          url: "/pages/index/index"
        });   
      },
      fail: function (err) {
        wx.navigateBack ({
          url: "/pages/index/index"
        });
        console.log(err)
      }
    });
  }
});