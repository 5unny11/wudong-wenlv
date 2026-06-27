Page({
  data: { phone: "", password: "", confirmPassword: "" },
  handleRegister() {
    const { phone, password, confirmPassword } = this.data;
    if (!phone || !password) { wx.showToast({ title: "请填写手机号和密码", icon: "none" }); return; }
    if (password !== confirmPassword) { wx.showToast({ title: "两次密码不一致", icon: "none" }); return; }
    wx.request({
      url: "http://localhost:7001/api/auth/register",
      method: "POST",
      header: { "Content-Type": "application/json" },
      data: { phone, password },
      success: r => {
        if (r.data.code === 0) {
          wx.showToast({ title: "注册成功，请登录" });
          setTimeout(() => wx.navigateBack(), 1000);
        } else {
          wx.showToast({ title: r.data.message || "注册失败", icon: "none" });
        }
      },
      fail: () => wx.showToast({ title: "网络错误", icon: "none" }),
    });
  },
});
