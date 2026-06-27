Page({
  data: { phone: '', password: '', confirmPassword: '' },

  onPhoneInput(e) { this.setData({ phone: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onConfirmInput(e) { this.setData({ confirmPassword: e.detail.value }); },

  goBack() { wx.navigateBack(); },

  handleRegister() {
    const { phone, password, confirmPassword } = this.data;
    if (!phone || !password) {
      wx.showToast({ title: '请填写手机号和密码', icon: 'none' });
      return;
    }
    if (password !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '注册中...' });
    wx.request({
      url: 'http://127.0.0.1:7001/api/auth/register',
      method: 'POST',
      header: { 'Content-Type': 'application/json' },
      data: { phone, password },
      success: r => {
        wx.hideLoading();
        if (r.data.code === 0) {
          wx.showToast({ title: '注册成功，请登录' });
          setTimeout(() => wx.navigateBack(), 1000);
        } else {
          wx.showToast({ title: r.data.message || '注册失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '网络错误', icon: 'none' });
      },
    });
  },
});
