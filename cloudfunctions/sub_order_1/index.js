// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    return await db.collection('order').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // order_type: event.订单类型,
        address: event.收货地址,
        contact: event.联系人,
        message: event.取件短信,
        num: event.取件个数,
        remarks:event.备注,
        delivery_time: event.送达时间,
        price: event.价格,
        order_time: event.下单时间,
        user_id: event.用户id,
        rider_id: null,
        order_status: 0,
        rate:0,
        assess:null,
        city:event.城市
      }
    }).then(res => {
      console.log(res)
    })
  } catch (e) {
    console.error(e)
  }
}