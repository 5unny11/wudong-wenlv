Page({
  data: { ticket: {} },
  onLoad(e) {
    const token = wx.getStorageSync("token");
    wx.request({
      url: "http://localhost:7001/api/e-tickets/" + e.id,
      header: { Authorization: "Bearer " + token },
      success: r => { if (r.data.code === 0) this.setData({ ticket: r.data.data }); },
    });
  },
  goBack() { wx.navigateBack(); },
});
