Page({
  data: { phone: '', password: '' },

  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },

  handleLogin() {
    const { phone, password } = this.data;
    if (!phone || !password) {
      wx.showToast({ title: '请输入手机号和密码', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '登录中...' });
    wx.request({
      url: 'http://127.0.0.1:7001/api/auth/login',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { phone, password },
      success: r => {
        wx.hideLoading();
        if (r.data.code === 0) {
          wx.setStorageSync('token', r.data.data.token);
          wx.showToast({ title: '登录成功' });
          setTimeout(() => wx.navigateBack(), 1000);
        } else {
          wx.showToast({ title: r.data.message || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误，请确认后端已启动', icon: 'none' });
      },
    });
  },

  goRegister() {
    wx.navigateTo({ url: '/pages/user/register' });
  },
});
