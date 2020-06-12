// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.user_id,
      page: 'pages/order/order',
      lang: 'zh_CN',
      data: {
        character_string1: {
          value: event._id
        },
        phrase4: {
          value: '已接单'
        },
        amount3: {
          value: event.price
        },
        thing10: {
          value: '订单已被接取，请留意'
        }
      },
      templateId: '-cl7ZpdlR2l2o9tOO7hwK3HC2joq8LXPBwSnU_A04Qs',
      miniprogramState: 'developer'
    })
    return result
  } catch (err) {
    return err
  }
}