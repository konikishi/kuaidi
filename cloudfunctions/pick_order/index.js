// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = async (event, context) => {
  return await db.collection('order')
    .where({
      rider_id: event.user_id
    })
    .orderBy('order_time','desc')
    .skip(event.skip)
    .limit(5)
    .get()
}