Page({
  data: {
    isAuthorized: false,
    userAvatar: '😀',
    tempName: '',
    inputValue: '',
    showEmojiPicker: false,
    messages: [],
    selectedImage: null, // 当前选中的图片
    scrollToView: '', // 滚动到指定位置
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
        
        // 等待DOM更新后滚动到底部
        setTimeout(() => {
          this.scrollToBottom();
        }, 300);
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

  // 滚动到底部
  scrollToBottom() {
    const messageCount = this.data.messages.length;
    if (messageCount > 0) {
      const lastMessageId = this.data.messages[messageCount - 1].id;
      this.setData({
        scrollToView: `message-${lastMessageId}`
      });
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
  async handleImageInsert() {
    try {
      // 选择图片
      const res = await wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });

      const tempFilePath = res.tempFilePaths[0];

      // 显示上传提示
      wx.showLoading({ title: '上传图片中...' });

      // 上传图片到云存储
      const uploadResult = await wx.cloud.uploadFile({
        cloudPath: `message-images/${Date.now()}-${Math.random().toString(36).slice(-6)}.jpg`,
        filePath: tempFilePath
      });

      // 保存云文件ID
      this.setData({
        selectedImage: uploadResult.fileID
      });

      wx.hideLoading();
      wx.showToast({ title: '图片已选择', icon: 'success' });

    } catch (err) {
      console.error('选择或上传图片失败:', err);
      wx.hideLoading();
      wx.showToast({ title: '图片选择失败', icon: 'none' });
    }
  },

  // 取消选择的图片
  cancelSelectedImage() {
    this.setData({
      selectedImage: null
    });
  },

  // 输入内容
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  // 发送消息 - 调用 addmessage 云函数
  async handleSend() {
    const { inputValue, userAvatar, tempName, selectedImage } = this.data;
    
    // 检查是否有文本或图片
    if ((!inputValue || !inputValue.trim()) && !selectedImage) {
      wx.showToast({ title: '请输入内容或选择图片', icon: 'none' });
      return;
    }

    try {
      wx.showLoading({ title: '发送中...' });

      // 构建消息内容
      let messageContent = inputValue;
      let messageType = 'text';
      let messageImage = null;

      // 如果有图片
      if (selectedImage) {
        messageType = 'image';
        messageImage = selectedImage;
        // 如果同时有文本和图片,都保存
        if (inputValue && inputValue.trim()) {
          messageContent = inputValue;
        } else {
          messageContent = '[图片]';
        }
      }

      // 调用 addmessage 云函数保存消息
      const res = await wx.cloud.callFunction({
        name: 'addmessage',
        data: {
          avatar: userAvatar,
          name: tempName,
          content: messageContent,
          type: messageType,
          image: messageImage,
          isOwn: true
        }
      });

      if (res.result.success) {
        // 添加到本地消息列表
        const newMessage = {
          id: res.result.data.id,
          avatar: userAvatar,
          name: tempName,
          content: messageContent,
          type: messageType,
          image: messageImage,
          time: res.result.data.time,
          isOwn: true
        };

        this.setData({
          messages: [...this.data.messages, newMessage],
          inputValue: '',
          selectedImage: null
        });

        // 等待DOM更新后滚动到底部
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);

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
  },

  // 预览图片
  previewImage(e) {
    const src = e.currentTarget.dataset.src;
    if (src) {
      wx.previewImage({
        urls: [src],
        current: src
      });
    }
  }
});