Page({
  data: { spot: { tickets: [] }, quantities: {}, totalAmount: 0, token: "" },
  onLoad(e) {
    const id = e.id;
    const token = wx.getStorageSync("token");
    this.setData({ token });
    wx.request({
      url: "http://localhost:7001/api/scenic-spots/" + id,
      success: r => {
        if (r.data.code === 0) {
          const spot = r.data.data;
          this.setData({ spot });
          const qty = {};
          (spot.tickets || []).forEach(t => { qty[t.id] = 0; });
          this.setData({ quantities: qty });
        }
      },
    });
  },
  goBack() { wx.navigateBack(); },
  changeQty(e) {
    const id = e.currentTarget.dataset.id;
    const op = e.currentTarget.dataset.op;
    const qty = { ...this.data.quantities };
    qty[id] = Math.max(0, (qty[id] || 0) + (op === "plus" ? 1 : -1));
    this.setData({ quantities: qty });
    const total = (this.data.spot.tickets || []).reduce((s, t) => s + (qty[t.id] || 0) * Number(t.price), 0);
    this.setData({ totalAmount: total });
  },
  handleBuy() {
    const { token, spot, quantities, totalAmount } = this.data;
    if (!token) { wx.navigateTo({ url: "/pages/user/login" }); return; }
    if (totalAmount <= 0) { wx.showToast({ title: "请选择票种", icon: "none" }); return; }

    // 构造下单数据
    const items = (spot.tickets || [])
      .filter(t => (quantities[t.id] || 0) > 0)
      .map(t => ({
        ticketTypeId: t.id,
        quantity: quantities[t.id],
        price: Number(t.price),
      }));

    wx.showModal({
      title: "确认下单",
      content: `合计金额: ¥${totalAmount}，确认购买？`,
      success: res => {
        if (!res.confirm) return;
        wx.request({
          url: "http://localhost:7001/api/travel/orders",
          method: "POST",
          header: { "Content-Type": "application/json", Authorization: "Bearer " + token },
          data: {
            merchantId: 1,
            orderType: "ticket",
            items: items,
            totalAmount: totalAmount,
            travelDate: new Date().toISOString().split("T")[0],
          },
          success: r => {
            if (r.data.code === 0) {
              wx.showToast({ title: "下单成功" });
              setTimeout(() => wx.redirectTo({ url: "/pages/travel/orders" }), 1000);
            } else {
              wx.showToast({ title: r.data.message || "下单失败", icon: "none" });
            }
          },
          fail: () => wx.showToast({ title: "网络错误", icon: "none" }),
        });
      },
    });
  },
});
