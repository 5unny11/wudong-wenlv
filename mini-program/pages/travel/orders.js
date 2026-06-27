Page({
  data: { orders: [], loading: true, token: "" },
  onLoad() {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.showToast({ title: "请先登录", icon: "none" });
      setTimeout(() => wx.navigateTo({ url: "/pages/user/login" }), 1000);
      return;
    }
    this.setData({ token });
    this.loadOrders();
  },
  loadOrders() {
    this.setData({ loading: true });
    wx.request({
      url: "http://127.0.0.1:7001/api/travel/orders",
      header: { Authorization: "Bearer " + this.data.token },
      success: r => {
        if (r.data.code === 0) this.setData({ orders: r.data.data, loading: false });
        else { wx.showToast({ title: "加载失败", icon: "none" }); this.setData({ loading: false }); }
      },
      fail: () => { wx.showToast({ title: "网络错误", icon: "none" }); this.setData({ loading: false }); },
    });
  },
  cancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "取消订单",
      content: "确定取消此订单？",
      success: res => {
        if (!res.confirm) return;
        wx.request({
          url: "http://127.0.0.1:7001/api/travel/orders/" + id + "/cancel",
          method: "POST",
          header: { Authorization: "Bearer " + this.data.token },
          success: r => {
            if (r.data.code === 0) { wx.showToast({ title: "已取消" }); this.loadOrders(); }
            else wx.showToast({ title: r.data.message, icon: "none" });
          },
          fail: () => wx.showToast({ title: "网络错误", icon: "none" }),
        });
      },
    });
  },
  goToETicket(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: "/pages/travel/e-ticket?id=" + id });
  },
  goBack() { wx.navigateBack(); },
});
