// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { limit = 50, skip = 0 } = event;

  try {
    const res = await db.collection('messages')
      .where({
        status: 'normal'
      })
      .orderBy('timestamp', 'asc')
      .skip(skip)
      .limit(limit)
      .get();

    // 格式化返回数据
    const messages = res.data.map(item => ({
      id: item._id,
      avatar: item.avatar,
      name: item.name,
      content: item.content,
      type: item.type || 'text',
      image: item.image || null,
      time: item.time,
      date: item.date,
      timestamp: item.timestamp,
      isOwn: item.isOwn,
      openid: item.openid
    }));

    return {
      success: true,
      data: messages,
      total: res.data.length
    };

  } catch (err) {
    console.error('获取消息失败:', err);
    return {
      success: false,
      message: '获取消息失败',
      error: err.message
    };
  }
};