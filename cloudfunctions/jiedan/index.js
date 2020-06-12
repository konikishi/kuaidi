// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('order')
    .doc(event.id)
    .update({
      data: {
        order_status:1,
        rider_id:event.rider_id
      },
    })
  } catch(e) {
    console.error(e)
  }
}