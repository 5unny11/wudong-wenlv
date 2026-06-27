Page({
  data: { route: {}, token: "" },
  onLoad(e) {
    this.setData({ token: wx.getStorageSync("token") });
    wx.request({
      url: "http://localhost:7001/api/routes/" + e.id,
      success: r => { if (r.data.code === 0) this.setData({ route: r.data.data }); },
    });
  },
  goBack() { wx.navigateBack(); },
  handleBook() {
    const { token, route } = this.data;
    if (!token) { wx.navigateTo({ url: "/pages/user/login" }); return; }

    wx.showModal({
      title: "确认预订",
      content: `${route.title}\n¥${route.price}/人，确认预订？`,
      success: res => {
        if (!res.confirm) return;
        wx.request({
          url: "http://localhost:7001/api/travel/orders",
          method: "POST",
          header: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          data: {
            merchantId: 1,
            orderType: "route",
            items: [{ routeId: route.id, quantity: 1, price: Number(route.price) }],
            totalAmount: Number(route.price),
            travelDate: new Date().toISOString().split("T")[0],
          },
          success: r => {
            if (r.data.code === 0) {
              wx.showToast({ title: "预订成功" });
              setTimeout(() => wx.redirectTo({ url: "/pages/travel/orders" }), 1000);
            } else {
              wx.showToast({ title: r.data.message || "预订失败", icon: "none" });
            }
          },
          fail: () => wx.showToast({ title: "网络错误", icon: "none" }),
        });
      },
    });
  },
});
