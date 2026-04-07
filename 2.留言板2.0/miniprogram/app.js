// app.js
App({
  onLaunch: function () {
    this.globalData = {
      env: "cloud1-xxx", // ← 请替换为实际环境 ID
    };
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
      
      // ===== 添加日志 =====
      console.log('===== 云开发初始化 =====');
      console.log('环境 ID:', this.globalData.env);
      console.log('云开发配置:', wx.cloud?.config);
      console.log('========================');
    }
  },
});