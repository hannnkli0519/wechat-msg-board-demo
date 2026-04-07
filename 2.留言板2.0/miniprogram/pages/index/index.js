Page({
  data: {
    isAuthorized: false,
    userAvatar: '😀',
    tempName: '',
    inputValue: '',
    showEmojiPicker: false,
    messages: [],
    availableAvatars: [
      '😀', '😁', '😎', '😍', '😇', '👋',
      '🐱', '🐶', '🦊', '🐼', '🐻', '🐨'
    ],
    emojis: [
      '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆',
      '😉', '😊', '😋', '😎', '😍', '🥰', '😘', '😗',
      '👍', '👎', '👌', '✌️', '🤟', '🤘', '👊', '✊',
      '🙏', '💪', '🎉', '❤️', '💔', '💯', '🔥', '⭐'
    ]
  },

  onLoad() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloudbase-7gsnbl9n078289bd', // 替换为你的云环境 ID
      traceUser: true
    });
  },

  onShow() {
    // 页面显示时加载消息
    if (this.data.isAuthorized) {
      this.loadMessages();
    }
  },

  // 选择头像
  handleAvatarSelect(e) {
    const avatar = e.currentTarget.dataset.avatar;
    this.setData({ userAvatar: avatar });
  },

  // 输入昵称
  onInputName(e) {
    this.setData({ tempName: e.detail.value });
  },

  // 授权进入留言板
  handleAuthorize() {
    if (!this.data.tempName.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    this.setData({ 
      isAuthorized: true,
      messages: []
    });
    // 加载历史消息
    this.loadMessages();
  },

  // 加载历史消息
  async loadMessages() {
    try {
      wx.showLoading({ title: '加载中...' });

      const res = await wx.cloud.callFunction({
        name: 'getmessages',
        data: {
          limit: 50,
          skip: 0
        }
      });

      if (res.result.success) {
        this.setData({
          messages: res.result.data
        });
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' });
      }
    } catch (err) {
      console.error('加载消息失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  // 切换表情面板
  toggleEmoji() {
    this.setData({ 
      showEmojiPicker: !this.data.showEmojiPicker 
    });
  },

  // 选择表情
  handleEmojiSelect(e) {
    const emoji = e.currentTarget.dataset.emoji;
    this.setData({
      inputValue: this.data.inputValue + emoji,
      showEmojiPicker: false
    });
  },

  // 插入图片
  handleImageInsert() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          inputValue: this.data.inputValue + `[图片]`
        });
      }
    });
  },

  // 输入内容
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息 - 调用 addmessage 云函数
  async handleSend() {
    const { inputValue, userAvatar, tempName } = this.data;
    
    if (!inputValue || !inputValue.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '发送中...' });

      // 调用 addmessage 云函数保存消息
      const res = await wx.cloud.callFunction({
        name: 'addmessage',
        data: {
          avatar: userAvatar,
          name: tempName,
          content: inputValue,
          isOwn: true
        }
      });

      if (res.result.success) {
        // 添加到本地消息列表
        const newMessage = {
          id: res.result.data.id,
          avatar: userAvatar,
          name: tempName,
          content: inputValue,
          time: res.result.data.time,
          isOwn: true
        };

        this.setData({
          messages: [...this.data.messages, newMessage],
          inputValue: ''
        });

        wx.showToast({ title: '发送成功', icon: 'success' });
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' });
      }
    } catch (err) {
      console.error('发送消息失败:', err);
      wx.showToast({ title: '发送失败，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  }
});