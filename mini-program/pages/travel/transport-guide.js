Page({
  data: { guide: {}, token: '' },
  onLoad(e) {
    this.setData({ token: wx.getStorageSync('token') });
    wx.request({
      url: 'http://127.0.0.1:7001/api/transport-guides/' + e.id,
      success: r => { if (r.data.code === 0) this.setData({ guide: r.data.data }); },
    });
  },
  goBack() { wx.navigateBack(); },
});
