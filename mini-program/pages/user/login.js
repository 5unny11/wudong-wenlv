Page({
  data: { phone: "", password: "" },
  handleLogin() {
    const { phone, password } = this.data;
    if (!phone || !password) { wx.showToast({ title: "请输入手机号和密码", icon: "none" }); return; }
    wx.request({
      url: "http://localhost:7001/api/auth/login",
      method: "POST",
      header: { "Content-Type": "application/json" },
      data: { phone, password },
      success: r => {
        if (r.data.code === 0) {
          wx.setStorageSync("token", r.data.data.token);
          wx.showToast({ title: "登录成功" });
          setTimeout(() => wx.navigateBack(), 1000);
        } else {
          wx.showToast({ title: r.data.message || "登录失败", icon: "none" });
        }
      },
      fail: () => wx.showToast({ title: "网络错误", icon: "none" }),
    });
  },
  goRegister() {
    wx.navigateTo({ url: "/pages/user/register" });
  },
});
