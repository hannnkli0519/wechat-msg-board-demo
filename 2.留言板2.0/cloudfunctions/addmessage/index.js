// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { avatar, name, content, isOwn } = event;

  // 参数验证
  if (!content || !content.trim()) {
    return {
      success: false,
      message: '留言内容不能为空'
    };
  }

  if (!avatar || !name) {
    return {
      success: false,
      message: '用户信息不完整'
    };
  }

  try {
    // 获取当前时间
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { hour12: false }).slice(0, 5);
    const dateString = now.toLocaleDateString('zh-CN');

    // 构建留言数据
    const messageData = {
      avatar: avatar,
      name: name,
      content: content.trim(),
      time: timeString,
      date: dateString,
      timestamp: now.getTime(),
      isOwn: isOwn || false,
      openid: wxContext.OPENID,
      unionid: wxContext.UNIONID || '',
      createTime: db.serverDate(),
      status: 'normal'
    };

    // 保存到云数据库
    const result = await db.collection('messages').add({
      data: messageData
    });

    // 返回成功结果
    return {
      success: true,
      message: '留言保存成功',
      data: {
        id: result._id,
        ...messageData
      }
    };

  } catch (err) {
    console.error('保存留言失败:', err);
    return {
      success: false,
      message: '保存失败，请稍后重试',
      error: err.message
    };
  }
};