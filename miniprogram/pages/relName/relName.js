// miniprogram/pages/relName/relName.js
var app = getApp();
var util = require('../../utils/util.js');
const db = wx.cloud.database();
const _ = db.command;
Page({

  data: {
    idc_face: [],
    idc_back: [],
    nameReg: true,  //控制提醒语句显隐
    idReg: true,
    telReg: true
  },

  onLoad: function() {
    // this.setData({
    //   _id: app.globalData.userInfo.openid
    // })
  },

  Name: function(e) {  //姓名正则
    var value = e.detail.value;
    var nameReg = /^[\u4e00-\u9fa5]{2,6}$/;
    if (!nameReg.test(value) && value != "") { //判断
      this.setData({
        nameReg: false
      })
    } else {
      this.setData({
        nameReg: true
      })
    }
  },
  Id: function(e) {  //身份证号正则
    var value = e.detail.value;
    var idReg =
      /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (!idReg.test(value) && value != "") { //判断
      this.setData({
        idReg: false
      })
    } else {
      this.setData({
        idReg: true
      })
    }
  },
  Tel: function(e) {  //手机号正则
    var value = e.detail.value;
    var telReg = /^(((13|14|15|18|17)\d{9}))$/;
    if (!telReg.test(value) && value != "") { //判断
      this.setData({
        telReg: false
      })
    } else {
      this.setData({
        telReg: true
      })
    }
  },
  submit: function(e) {
    var that = this;
    if (e.detail.value.Name == "" || !this.data.nameReg) {
      wx.showToast({
        title: '请输入正确的姓名',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.Id == "" || !this.data.idReg) {
      wx.showToast({
        title: '请输入正确的身份证号码',
        icon: 'none',
        duration: 2000
      })
    } else if (e.detail.value.Tel == "" || !this.data.telReg) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.idc_face == "") {
      wx.showToast({
        title: '请上传身份证正面照',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.idc_back == "") {
      wx.showToast({
        title: '请上传身份证反面照',
        icon: 'none',
        duration: 2000
      })
    } else {
      db.collection('check').add({
        data: {
          rider_id:app.globalData.userInfo.openid,
          name: e.detail.value.Name,
          id: e.detail.value.Id,
          tel: e.detail.value.Tel,
          idc_face: that.data.idc_face,
          idc_back: that.data.idc_back,
          verified: false, //是否通过审核
          checking: true, //审核状态true:进行中 flase:失败
          reason: "", //审核失败理由
        },
        success: function(res) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          wx.navigateBack({
            delta: 1
          })
          
        }
      })
    }
  },
  // 
  chooseImage_face() {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        //console.log(res)
        wx.cloud.uploadFile({
          //图片存储路径及名称
          cloudPath: `id_image/${app.globalData.userInfo.openid}_face_${util.fTime(new Date())}.png`,  
          //要上传文件资源的路径
          filePath: res.tempFilePaths[0],
          success: res1 => {
            console.log(res1.fileID)
            this.setData({
              idc_face: res1.fileID
            })
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail: err => {
            console.error(err)
            wx.showToast({
              title: '上传失败',
              icon: 'fail',
              duration: 1000
            })
          }
        })
      }
    })
  },
  chooseImage_back() {
    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        wx.cloud.uploadFile({
          //图片存储路径及名称
          cloudPath: `id_image/${app.globalData.userInfo.openid}_back_${util.fTime(new Date())}.png`,
          //要上传文件资源的路径
          filePath: res.tempFilePaths[0],
          success: res1 => {
            console.log(res1.fileID)
            this.setData({
              idc_back: res1.fileID
            })
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail: err => {
            console.error(err)
            wx.showToast({
              title: '上传失败',
              icon: 'fail',
              duration: 1000
            })
          }
        })
      }
    })
  }

})