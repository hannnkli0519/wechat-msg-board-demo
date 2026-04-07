# 留言板微信小程序

一个基于微信云开发的实时留言板小程序，支持文本和图片消息发送，提供流畅的聊天式交互体验。

![微信小程序](https://img.shields.io/badge/Platform-WeChat%20Mini%20Program-07c160)
![Cloud Base](https://img.shields.io/badge/Cloud-WX%20Cloud%20Development-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 功能特性

### 核心功能
- **用户授权** - 选择头像和昵称进入留言板
- **文本消息** - 发送文字留言，支持表情符号
- **图片消息** - 从相册或相机选择图片发送
- **图片预览** - 点击聊天中的图片可放大预览
- **实时同步** - 加载历史消息，自动滚动到最新
- **云存储** - 图片自动上传至微信云存储

### 用户体验
- **表情面板** - 内置常用表情，快速插入
- **自动滚动** - 进入页面和发送消息后自动定位到最新消息
- **响应式设计** - 适配不同屏幕尺寸
- **简洁界面** - 类微信聊天界面，操作直观

## 技术栈

- **前端框架**: 微信小程序原生开发
- **后端服务**: 微信云开发 (WeChat Cloud Development)
- **数据库**: 云数据库 (MongoDB)
- **文件存储**: 云存储 (Cloud Storage)
- **云函数**: Node.js 运行时

## 项目结构

```
wechat-msg-board-demo/
├── 2.留言板2.0/
│   ├── cloudfunctions/          # 云函数目录
│   │   ├── addmessage/          # 添加消息云函数
│   │   │   ├── index.js         # 云函数入口
│   │   │   ├── package.json     # 依赖配置
│   │   │   └── config.json      # 权限配置
│   │   └── getmessages/         # 获取消息云函数
│   │       ├── index.js
│   │       ├── package.json
│   │       └── config.json
│   ├── miniprogram/             # 小程序前端
│   │   ├── pages/
│   │   │   └── index/           # 主页（聊天页面）
│   │   │       ├── index.js     # 页面逻辑
│   │   │       ├── index.wxml   # 页面结构
│   │   │       ├── index.wxss   # 页面样式
│   │   │       └── index.json   # 页面配置
│   │   ├── components/          # 自定义组件
│   │   ├── images/              # 静态图片资源
│   │   ├── app.js               # 应用入口
│   │   ├── app.json             # 全局配置
│   │   └── app.wxss             # 全局样式
│   ├── project.config.json      # 项目配置
│   └── README.md                # 项目说明
└── README.md                    # 本文件
```

## 快速开始

### 前置要求

1. **微信开发者工具** - [下载安装](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. **微信公众号平台账号** - [注册](https://mp.weixin.qq.com/)
3. **开通云开发服务** - 在微信开发者工具中开通

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/hannnkli0519/wechat-msg-board-demo.git
cd wechat-msg-board-demo
```

#### 2. 导入项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 项目目录选择 `2.留言板2.0` 文件夹
4. AppID 填写你的小程序 AppID（或使用测试号）
5. 点击"导入"

#### 3. 配置云开发环境

1. 在微信开发者工具顶部点击"云开发"按钮
2. 开通云开发服务（如果未开通）
3. 记录环境 ID

4. 修改 `miniprogram/app.js` 中的环境 ID：

```javascript
wx.cloud.init({
  env: 'your-env-id', // 替换为你的云环境ID
  traceUser: true
});
```

#### 4. 上传云函数

在微信开发者工具中：

1. 展开 `cloudfunctions` 目录
2. 右键点击 `addmessage` 文件夹
3. 选择"上传并部署-云端安装依赖"
4. 对 `getmessages` 重复上述步骤

#### 5. 创建数据库集合

1. 进入云开发控制台
2. 点击"数据库"
3. 创建名为 `messages` 的集合
4. 设置权限为"所有用户可读，仅创建者可写"或根据需求调整

#### 6. 运行项目

点击微信开发者工具的"编译"按钮即可在模拟器中预览

## 使用说明

### 发送文本消息

1. 选择喜欢的头像
2. 输入昵称
3. 点击"进入留言板"
4. 在输入框输入文字
5. 点击发送或按回车

### 发送图片消息

1. 点击输入框左侧的"+"按钮
2. 从相册选择或拍照
3. 等待图片上传完成（会显示预览）
4. 可选：输入 accompanying 文字
5. 点击发送

### 使用表情

1. 点击输入框左侧的表情按钮
2. 选择想要的表情
3. 表情会自动插入到输入框

### 查看图片

- 点击聊天中的任意图片即可全屏预览
- 再次点击关闭预览

## 数据库结构

### messages 集合

| 字段 | 类型 | 说明 |
|------|------|------|
| _id | String | 消息唯一ID（自动生成） |
| avatar | String | 用户头像（emoji） |
| name | String | 用户昵称 |
| content | String | 消息内容 |
| type | String | 消息类型：text/image |
| image | String | 图片云存储ID（仅图片消息） |
| time | String | 时间（HH:mm格式） |
| date | String | 日期 |
| timestamp | Number | 时间戳 |
| isOwn | Boolean | 是否为当前用户 |
| openid | String | 用户OpenID |
| createTime | Date | 创建时间 |
| status | String | 状态：normal/deleted |

## 云函数说明

### addmessage

添加新消息到数据库

**入参：**
```javascript
{
  avatar: String,    // 头像
  name: String,      // 昵称
  content: String,   // 内容
  type: String,      // 类型：text/image
  image: String,     // 图片ID（可选）
  isOwn: Boolean     // 是否为自己的消息
}
```

**返回：**
```javascript
{
  success: Boolean,
  message: String,
  data: {
    id: String,
    // ... 消息完整信息
  }
}
```

### getmessages

获取历史消息列表

**入参：**
```javascript
{
  limit: Number,     // 返回数量限制，默认50
  skip: Number       // 跳过数量，默认0
}
```

**返回：**
```javascript
{
  success: Boolean,
  data: Array,       // 消息列表
  total: Number      // 总数
}
```

## 常见问题

### Q: 图片上传失败？

A: 检查以下几点：
1. 云开发服务是否已开通
2. 云存储权限是否正确设置
3. 网络连接是否正常
4. 查看控制台错误日志

### Q: 消息无法发送？

A: 确保：
1. 云函数已正确上传并部署
2. 云环境ID配置正确
3. 数据库集合 `messages` 已创建
4. 数据库权限设置允许写入

### Q: 真机调试连不上？

A: 尝试：
1. 确保手机和电脑在同一WiFi网络
2. 检查防火墙设置
3. 重启微信开发者工具
4. 尝试使用手机热点

### Q: 如何修改环境ID？

A: 在以下文件中修改：
- `miniprogram/app.js` - 前端初始化
- `miniprogram/pages/index/index.js` - 页面初始化

## 开发计划

- [ ] 消息撤回功能
- [ ] 长按删除消息
- [ ] 下拉刷新加载更多
- [ ] 消息搜索功能
- [ ] 用户登录系统
- [ ] 私信功能
- [ ] 消息通知

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 参考资料

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [云开发最佳实践](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/best-practices.html)

## 联系方式

如有问题或建议，欢迎通过以下方式联系：

- GitHub Issues: [提交问题](https://github.com/hannnkli0519/wechat-msg-board-demo/issues)
- Email: hannnkli0519@gmail.com

---

如果这个项目对你有帮助，请给个 Star 支持一下！
