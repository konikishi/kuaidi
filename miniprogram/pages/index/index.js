//index.js
var app = getApp()
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var util = require('../../utils/util.js')
var qqmapsdk;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current_location: '',  //当前位置描述
    //orderType: 0,
    price: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  //单价选项
    totalPrice: 0,   //总价
    price_num: 0,   //单价选项下标
    message: [],  //取件码列表
    chooseAddress: "收货地址",
    chooseContact: "",   //联系人
    contentStr: "",   //文本框value
    startTime: "8:00",
    endTime: "21:00"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  onShow: function () { //等用户登录以后再获取位置授权   
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.getAddress()
    }
    this.setData({ //赋值
      current_location: app.globalData.current_location,
    })
  },

  //更改订单类型
  // onClick(event) {
  //   if (event.detail.name == 'a') {
  //     this.setData({
  //       orderType: 0
  //     })
  //   } else {
  //     this.setData({
  //       orderType: 1
  //     })
  //   }
  // },

  
  formSubmit: function (e) {   //提交表单
    var that = this;
    var TIME = util.formatTime(new Date());
    that.setData({
      time: TIME, //当前时间
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (that.data.message.length == 0) {
      wx.showToast({
        title: '请粘贴取件短信',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.chooseAddress == '收货地址') {
      wx.showToast({
        title: '请选择收货信息',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.requestSubscribeMessage({  //请求授权订阅消息
        tmplIds: ['-cl7ZpdlR2l2o9tOO7hwK3HC2joq8LXPBwSnU_A04Qs'],
        success(res) {
          wx.cloud.callFunction({  //提交订单云函数
            name: 'sub_order_1',
            data: {
              // 订单类型: that.data.orderType,
              收货地址: that.data.chooseAddress,
              联系人: that.data.chooseContact,
              取件短信: that.data.message,
              取件个数: that.data.message.length,
              备注: e.detail.value.input,
              送达时间: that.data.startTime + "-" + that.data.endTime,
              价格: that.data.totalPrice,
              下单时间: that.data.time,
              用户id: app.globalData.userInfo.openid,
              城市:app.globalData.district
            },
            success: res => {
              console.log('提交成功 ', res)
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              });
              that.clearValue();
              that.setData({
                message:[]
              });
            }
          })
        }
      });     
    }
  },


  getAddress: function () { //获取用户定位
    var that = this;
    if (that.data.current_location == null || that.data.current_location == '') {
      qqmapsdk = new QQMapWX({ // 实例化API核心类
        key: 'X47BZ-PDRKG-PVVQE-I6DKG-L4QIO-QBFBI'
      });
      qqmapsdk.reverseGeocoder({ // 调用接口
        success: function (res) {
          that.setData({
            current_location: res.result.address
          })
          app.globalData.current_location = res.result.address
          app.globalData.longitude = res.result.location.lng
          app.globalData.latitude = res.result.location.lat
          app.globalData.district = res.result.address_component.district
        },
        fail: function (res) {
          console.log(res);
        },
        complete: function (res) {
          console.log(res);
        }
      });
    }
  },


  onChangeAddress: function (e) { //跳转到手动定位
    wx.navigateTo({
      url: "/pages/position/position"
    })
  },

  //价格选择器
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      price_num: e.detail.value,
    })
    this.changePrice() //改变总价
  },
  //跳转到我的页面
  goMy() {
    wx.navigateTo({
      url: '../my/my',
    })
  },
  //选择收货地址
  chooseAddress() {
    var that = this;
    wx.chooseAddress({
      success(res) {
        console.log(res)
        that.setData({
          chooseAddress: `${res.cityName}${res.countyName}${res.detailInfo}`,
          chooseContact: `${res.userName},${res.telNumber}`
        })
      }
    })
  },

  //粘贴已复制的短信
  pasteValue() {
    var that = this;
    wx.getClipboardData({
      success(res) {
        //console.log(res.data)
        that.setData({
          contentStr: res.data
        })
      }
    })
  },

  //清除文本框
  clearValue() {
    var that = this;
    that.setData({
      contentStr: ""
    })
  },

  //确定粘贴的短信
  addValue() {
    var that = this;
    if (that.data.message.length <= 3) {
      that.setData({
        message: that.data.message.concat({
          data: that.data.contentStr
        })
      });
      that.changePrice(); //改变总价
      that.clearValue();
    } else {
      wx.showToast({
        title: '超过最大取件数',
        icon: 'none',
        duration: 2000
      })
    }
  },
  //获取文本框内的值
  getValue(e) {
    this.setData({
      contentStr: e.detail.value
    })
  },
  //删除确定的短信
  deleteValue(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除此短信',
      success(res) {
        if (res.confirm) {
          var id = e.currentTarget.dataset.id;
          var arr = that.data.message;
          arr.splice(id, 1);
          that.setData({
            message: arr
          });
          that.changePrice(); //改变总价
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  
  changePrice() {   //总价变化
    var that = this;
    var temp = null;
    var i = that.data.message.length; //短信条数
    console.log(i)
    var j = that.data.price[that.data.price_num]; //单价
    switch (i) {
      case 0:
        temp = 0;
        break;
      case 1:
        temp = j;
        break; //1件不打折
      case 2:
        temp = i * j * 0.95;
        break; //2件打95折
      case 3:
        temp = i * j * 0.9;
        break; //3件打9折
      case 4:
        temp = i * j * 0.8;
        break; //4件打8折
    };
    temp = temp.toFixed(1); //js浮点运算有bug，保留一位小数
    that.setData({
      totalPrice: temp
    })
  },

  //时间选择器
  bindTimeChange_start: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindTimeChange_end: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  }
})